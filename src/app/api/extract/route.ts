import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    console.log('Extraction API called, processing image with enhanced analysis...');

    let extractedData = {
      qty: 1,
      assetType: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      size: '',
      mfgYear: '',
      location: '', // User-defined field - not filled by AI
      custId: '', // User-defined field - not filled by AI
      notes: '',
      filterSize: '',
      filterType: '',
      filterMerv: '',
      voltage: '',
      refrigerant: '',
      maintenanceInterval: ''
    };

    // Get API key from Firebase secrets
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
    console.log('API Key available:', apiKey ? 'Yes' : 'No');
    console.log('API Key length:', apiKey ? apiKey.length : 0);
    
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Try different model versions in order of preference
        const modelOptions = [
          "gemini-2.5-flash",
          "gemini-2.5-pro",
          "gemini-2.5-flash-lite",
          "gemini-1.5-pro",
          "gemini-1.5-flash", 
          "gemini-pro"
        ];
        
        let model;
        let lastError;
        
        for (const modelName of modelOptions) {
          try {
            model = genAI.getGenerativeModel({ model: modelName });
            console.log(`Using Gemini model: ${modelName}`);
            break;
          } catch (modelError) {
            console.log(`Model ${modelName} not available, trying next...`);
            lastError = modelError;
          }
        }
        
        if (!model) {
          throw lastError || new Error('No Gemini models available');
        }

        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        
        const prompt = `Analyze this HVAC equipment nameplate image and extract information into specific fields. Look carefully for:

1. BASIC INFORMATION:
   - Manufacturer name (e.g., TRANE, Carrier, York)
   - Model number (e.g., 4TWR5042N1000AA)
   - Serial number (e.g., 24243MR4KF)
   - Manufacturing date/year (e.g., MFR DATE: 6/2024)

2. EQUIPMENT SPECIFICATIONS:
   - Equipment type (Air Handler, Condenser, Heat Pump, Furnace, Chiller, Packaged Unit, etc.)
   - Capacity/size (tons, BTU, kW, HP)
   - Voltage specifications (e.g., VOLTS: 208-230)
   - Refrigerant type and charge amounts (e.g., HFC: 410A, 10LBS 05 OZ)

3. ELECTRICAL SPECIFICATIONS:
   - Minimum circuit ampacity (e.g., MINIMUM CIRCUIT AMPACITY: 24.0 AMPS)
   - Overcurrent protective device (e.g., OVERCURRENT PROTECTIVE DEVICE: 40)
   - Compressor motor specs (e.g., COMPR. MOT.: 16.7 RLA)
   - Outdoor motor specs (e.g., O.D. MOT.: 2.80 FLA)

4. FILTER & MAINTENANCE:
   - Filter specifications if visible
   - Maintenance requirements
   - Service intervals

Return ONLY a JSON object with these exact fields. Extract specific values, not descriptions:
{
  "assetType": "specific equipment type",
  "manufacturer": "manufacturer name",
  "model": "model number",
  "serialNumber": "serial number", 
  "size": "capacity with units (e.g., '5 ton', '24000 BTU')",
  "mfgYear": "manufacturing year",
  "voltage": "nominal voltage (e.g., '208-230V', '460V')",
  "refrigerant": "refrigerant type (e.g., 'R-410A', 'R-407C')",
  "filterSize": "filter dimensions if visible",
  "filterType": "filter type if visible", 
  "filterMerv": "MERV rating if visible",
  "filterQuantity": "number of filters needed if visible",
  "maintenanceInterval": "service interval if mentioned",
  "notes": "any additional specifications not captured above (include electrical specs, certifications like UL US LISTED, AHRI CERTIFIED)"
}

NOTE: Do NOT extract location or customer ID - these are user-defined fields that should remain empty.

Be precise and extract actual values from the nameplate. If a field is not visible, use empty string "". Pay special attention to TRANE XR series equipment which are typically packaged heat pumps.`;

        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg"
            }
          }
        ]).catch(async (apiError) => {
          console.error('Gemini API error:', apiError);
          throw apiError;
        });

        const response = await result.response;
        const text = response.text();
        
        console.log('Gemini enhanced response:', text);
        
        if (!text || text.trim().length === 0) {
          throw new Error('Empty response from Gemini API');
        }

        // Try to extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
          
          // Post-process the data to extract specific values from notes if needed
          const processedData = processExtractedData(parsed);
          
          extractedData = {
            ...extractedData,
            ...processedData
          };
          } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            console.log('Raw text response:', text);
            throw new Error('Failed to parse Gemini API response as JSON');
          }
        } else {
          console.log('No JSON found in response:', text);
          throw new Error('No valid JSON found in Gemini API response');
        }
      } catch (geminiError) {
        console.error('Gemini API error:', geminiError);
        
        // Check if it's a service overload error
        if (geminiError && typeof geminiError === 'object' && 'status' in geminiError && geminiError.status === 503) {
          console.log('Gemini API overloaded - using basic extraction fallback');
        }
        
        extractedData = await performBasicExtraction(image);
      }
    } else {
      extractedData = await performBasicExtraction(image);
    }

    console.log('Returning enhanced extracted data:', extractedData);
    return NextResponse.json(extractedData);

  } catch (error) {
    console.error('Extraction error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    
    // Return basic extraction data instead of 500 error
    const fallbackData = {
      qty: 1,
      assetType: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      size: '',
      mfgYear: '',
      location: '',
      voltage: '',
      refrigerant: '',
      filterSize: '',
      filterType: '',
      filterMerv: '',
      filterQuantity: '',
      maintenanceInterval: '',
      notes: 'Extraction failed - please manually enter equipment data'
    };
    
    return NextResponse.json(fallbackData);
  }
}

function processExtractedData(data: Record<string, unknown>) {
  // Extract specific values from notes if they weren't properly parsed
  const processed = { ...data };
  
  // Extract voltage from notes if not in voltage field
  if (!processed.voltage && processed.notes && typeof processed.notes === 'string') {
    const voltageMatch = processed.notes.match(/(\d{3,4})\s*V/i);
    if (voltageMatch) {
      processed.voltage = voltageMatch[1] + 'V';
    }
  }
  
  // Extract refrigerant from notes if not in refrigerant field
  if (!processed.refrigerant && processed.notes && typeof processed.notes === 'string') {
    const refrigerantMatch = processed.notes.match(/R-?(\d{3}[A-Z]?)/i);
    if (refrigerantMatch) {
      processed.refrigerant = 'R-' + refrigerantMatch[1];
    }
  }
  
  // Extract capacity/size from notes if not in size field
  if (!processed.size && processed.notes && typeof processed.notes === 'string') {
    const sizeMatch = processed.notes.match(/(\d+(?:\.\d+)?)\s*(?:ton|btu|kw|hp)/i);
    if (sizeMatch) {
      processed.size = sizeMatch[0];
    }
  }
  
  // Extract year from notes if not in mfgYear field
  if (!processed.mfgYear && processed.notes && typeof processed.notes === 'string') {
    const yearMatch = processed.notes.match(/(\d{4})/);
    if (yearMatch) {
      processed.mfgYear = yearMatch[1];
    }
  }
  
  // Determine asset type from model/manufacturer if not specified      
  if (!processed.assetType) {
    const modelLower = String(processed.model || '').toLowerCase();
    const manufacturerLower = String(processed.manufacturer || '').toLowerCase();
    
    if (modelLower.includes('ra') || modelLower.includes('handler')) {
      processed.assetType = 'Air Handler';
    } else if (modelLower.includes('cond') || modelLower.includes('condenser')) {
      processed.assetType = 'Condenser';
    } else if (modelLower.includes('heat') || modelLower.includes('pump')) {
      processed.assetType = 'Heat Pump';
    } else if (modelLower.includes('furnace')) {
      processed.assetType = 'Furnace';
    } else if (modelLower.includes('chiller')) {
      processed.assetType = 'Chiller';
    } else {
      processed.assetType = 'HVAC Unit';
    }
  }
  
  // Add filter recommendations based on equipment type
  if (String(processed.assetType || '').toLowerCase().includes('air handler')) {
    if (!processed.filterSize) {
      processed.filterSize = '16x20x1" or 20x20x1"';
    }
    if (!processed.filterQuantity) {
      processed.filterQuantity = '2 filters (typical for air handlers)';
    }
    if (!processed.filterMerv) {
      processed.filterMerv = 'MERV 8-11';
    }
    if (!processed.maintenanceInterval) {
      processed.maintenanceInterval = 'Every 1-3 months';
    }
  } else if (String(processed.assetType || '').toLowerCase().includes('condenser')) {
    if (!processed.filterQuantity) {
      processed.filterQuantity = 'No filters (outdoor unit)';
    }
  } else if (String(processed.assetType || '').toLowerCase().includes('heat pump')) {
    if (!processed.filterSize) {
      processed.filterSize = '16x20x1" or 20x20x1"';
    }
    if (!processed.filterQuantity) {
      processed.filterQuantity = '2-4 filters (depends on indoor unit)';
    }
  } else if (String(processed.assetType || '').toLowerCase().includes('furnace')) {
    if (!processed.filterSize) {
      processed.filterSize = '16x20x1" or 20x20x1"';
    }
    if (!processed.filterQuantity) {
      processed.filterQuantity = '1-2 filters (typical for furnaces)';
    }
  }
  
  return processed;
}

async function performBasicExtraction(_image: string) {
  try {
    console.log('Performing basic extraction as fallback...');
    
    // For now, return a basic extraction without OCR to avoid module issues
    // This can be enhanced later with a proper OCR solution
    const extractedData = {
      qty: 1,
      assetType: 'HVAC Equipment',
      manufacturer: '',
      model: '',
      serialNumber: '',
      size: '',
      mfgYear: '',
      location: '',
      custId: '',
      voltage: '',
      refrigerant: '',
      filterSize: '',
      filterType: '',
      filterMerv: '',
      filterQuantity: '',
      maintenanceInterval: '',
      notes: 'Manual data entry required - OCR temporarily unavailable. Please enter equipment details manually.'
    };
    
    console.log('Basic extraction completed - manual entry required');
    return extractedData;
    
  } catch (error) {
    console.error('Basic extraction failed:', error);
    
    // Return minimal data if extraction fails
    return {
      qty: 1,
      assetType: 'HVAC Equipment',
      manufacturer: '',
      model: '',
      serialNumber: '',
      size: '',
      mfgYear: '',
      location: '',
      voltage: '',
      refrigerant: '',
      filterSize: '',
      filterType: '',
      filterMerv: '',
      filterQuantity: '',
      maintenanceInterval: '',
      notes: 'Extraction failed - please manually enter equipment data'
    };
  }
}