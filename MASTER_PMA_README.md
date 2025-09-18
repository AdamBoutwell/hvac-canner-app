# Master PMA Estimate Format Converter

This document describes the dynamic HVAC equipment data format converter that transforms scanner output to Master PMA Estimate format for direct Excel integration.

## Overview

The Master PMA converter takes HVAC equipment data from the scanner app and converts it to the standardized Master PMA Estimate format used for maintenance planning and cost estimation. The converter handles dynamic input values and applies intelligent mapping based on equipment types.

## Features

- **Dynamic Input Handling**: Accepts any equipment data matching the input structure
- **Intelligent Equipment Mapping**: Maps asset types to COINS codes automatically
- **Conditional Logic**: Applies equipment-specific features (filters, coil cleaning, belts)
- **Excel Integration**: Outputs tab-separated values (TSV) ready for direct Excel paste
- **Fallback Handling**: Uses default mapping for unknown equipment types

## Input Structure

The converter accepts data in this format:

```javascript
{
  "Qty": Number,
  "Asset Type": String,        // "Boiler", "RTU", "Air Handler", etc.
  "Manufacturer": String,      // Any manufacturer
  "Model": String,            // Any model number  
  "Serial Number": String,    // Any serial
  "Size": String,             // Any size specification
  "MFG Year": String,         // Any year
  "Voltage": String,          // Voltage specs
  "Refrigerant": String,      // Refrigerant type
  "Filter Size": String,      // Filter dimensions
  "Filter Qty": String,       // Filter quantities
  "MERV": String,             // MERV ratings
  "Location": String,         // Equipment location
  "Notes": String             // Additional notes
}
```

## Output Structure

The converter generates data in Master PMA format:

```javascript
{
  "QTY": Number,
  "Asset Type & Description (COINS)": String,  // Mapped equipment code
  "MFG": String,
  "MODEL": String,
  "SN": String,
  "SIZE": String,
  "MFG Year": String,
  "CUST ID": String,          // Always empty for now
  "LOCATION": String,
  "FILTER CHANGE": String,    // "Y" or "N" based on equipment type
  "COIL CLEAN": String,       // "Y" or "N" based on equipment type
  "Belt Size": String,        // Default belt size if applicable
  "Belt QTY per Unit": String, // Default belt quantity if applicable
  "Filter Size": String,      // Only if equipment has filters
  "Filter QTY per Unit": String // Only if equipment has filters
}
```

## Equipment Type Mapping

The converter includes mappings for common HVAC equipment types:

| Asset Type | COINS Code |
|------------|------------|
| Boiler | 50-BLR-02 - Boiler- Hot Water (Gas) |
| Air Handler | 10-AHU-01 - AHU (with Chilled Water) |
| RTU | 00-PKG-01a - Packaged AC (Cooling Only) |
| Packaged Unit | 00-PKG-01a - Packaged AC (Cooling Only) |
| Chiller | 30-CHLR-40 - Chiller- WC (Centrifugal) |
| Cooling Tower | 35-COOL-TWR-01 - Cooling Tower |
| Heat Pump | 00-PKG-03a - Packaged Heat Pump-AC (All) |
| Fan Coil | 10-AHU-05 - Fan-Coil |
| VAV | 14-VAV-01 - VAV |
| Pump | 60-PUMP-01 - Pump |
| Unit Heater | 55-UH-02 - Unit Heater (Gas) |
| Fan | 60-FAN-01 - Fan- Major (Larger Stand Alone) |
| Air Compressor | 75-ACOMP-01 - Air Compressor |
| VFD | 70-CTRLS-10 - Variable Frequency-Speed Drive (VFD) |
| Controls | 70-CTRLS-01 - Controls |
| Unknown | 99-OTH-001 - Other-Major |

## Equipment Features Logic

The converter applies conditional logic based on equipment characteristics:

### Equipment with Filters
- **Types**: Air Handler, RTU, Packaged Unit, Fan Coil, VAV
- **Action**: Sets `FILTER CHANGE = "Y"` and populates filter fields

### Equipment Requiring Coil Cleaning
- **Types**: Air Handler, RTU, Packaged Unit, Heat Pump, Fan Coil, Chiller, Cooling Tower
- **Action**: Sets `COIL CLEAN = "Y"`

### Equipment with Belts
- **Types**: Air Handler, RTU, Packaged Unit, Fan, Pump, Cooling Tower
- **Action**: Populates belt fields with default specifications

## Usage

### In the Web Application

1. Navigate to the main scanner page
2. Upload and process equipment images
3. Review and edit extracted data
4. In the Equipment List section, use the "Master PMA Export" card
5. Click either:
   - **Download TSV File**: Downloads a `.tsv` file for Excel import
   - **Copy to Clipboard**: Copies TSV data for direct Excel paste

### Programmatic Usage

```typescript
import { convertToMasterPMA, generateTSV } from '@/lib/master-pma-converter';

// Convert single item
const scannerData = {
  Qty: 2,
  "Asset Type": "Air Handler",
  Manufacturer: "Carrier",
  // ... other fields
};

const masterPMAData = convertToMasterPMA(scannerData);

// Generate TSV for Excel
const tsvString = generateTSV([masterPMAData], true);
```

### API Endpoint

**POST** `/api/master-pma`

Request body:
```json
{
  "scannerDataList": [
    {
      "Qty": 2,
      "Asset Type": "Air Handler",
      // ... other fields
    }
  ]
}
```

Response: TSV file ready for Excel import

## Excel Integration

1. **Direct Paste**: Copy TSV data from clipboard and paste directly into Excel
2. **File Import**: Download TSV file and import into Excel using "Text to Columns" feature
3. **Starting Row**: Paste data starting at the appropriate row in your Master PMA Estimate form

## Demo Data

The converter includes sample data for testing:

```typescript
import { sampleScannerData, runMasterPMADemo } from '@/lib/master-pma-demo';

// Run demo in browser console
runMasterPMADemo();
```

## Error Handling

- **Invalid Data**: Returns 400 error with specific validation messages
- **Unknown Equipment**: Uses default mapping (99-OTH-001)
- **Missing Fields**: Handles gracefully with empty strings
- **API Errors**: Returns 500 error with descriptive messages

## File Structure

```
src/
├── types/
│   └── master-pma.ts          # Type definitions
├── lib/
│   ├── master-pma-converter.ts # Core conversion logic
│   ├── data-converter.ts      # Data format conversion
│   └── master-pma-demo.ts     # Demo and testing
├── components/
│   └── MasterPMAExport/       # UI component
└── app/api/master-pma/
    └── route.ts               # API endpoint
```

## Dependencies

- Next.js API routes
- TypeScript for type safety
- React components for UI integration
- No external dependencies for core conversion logic

## Future Enhancements

- Customer ID integration
- Custom equipment type mappings
- Batch processing optimization
- Excel template integration
- Data validation improvements

