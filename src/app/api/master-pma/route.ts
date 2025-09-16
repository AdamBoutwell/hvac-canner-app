import { NextRequest, NextResponse } from 'next/server';
import { ScannerData } from '@/types/master-pma';
import { convertMultipleToMasterPMA, generateExcelBuffer, generateExcelFilename, validateScannerData } from '@/lib/master-pma-converter';

export async function POST(request: NextRequest) {
  try {
    const { scannerDataList, customerName, locationName } = await request.json() as {
      scannerDataList: ScannerData[];
      customerName?: string;
      locationName?: string;
    };

    // Validate input data
    if (!Array.isArray(scannerDataList)) {
      return NextResponse.json(
        { error: 'Invalid input: scannerDataList must be an array' },
        { status: 400 }
      );
    }

    // Validate each item in the array
    for (let i = 0; i < scannerDataList.length; i++) {
      if (!validateScannerData(scannerDataList[i])) {
        return NextResponse.json(
          { error: `Invalid scanner data at index ${i}: missing required fields` },
          { status: 400 }
        );
      }
    }

    // Convert to Master PMA format
    const masterPMAData = convertMultipleToMasterPMA(scannerDataList);

    // Generate Excel buffer
    const excelBuffer = await generateExcelBuffer(
      masterPMAData, 
      customerName || 'Customer', 
      locationName || 'Location'
    );

    // Generate filename
    const filename = generateExcelFilename(
      customerName || 'Customer', 
      locationName || 'Location'
    );

    // Return the Excel file
    return new NextResponse(excelBuffer as unknown as ArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Master PMA conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert data to Master PMA format' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve available equipment types and features
export async function GET() {
  try {
    const { getAvailableEquipmentTypes, EQUIPMENT_CODES, EQUIPMENT_FEATURES } = await import('@/lib/master-pma-converter');
    
    const equipmentTypes = getAvailableEquipmentTypes();
    
    return NextResponse.json({
      equipmentTypes,
      equipmentCodes: EQUIPMENT_CODES,
      equipmentFeatures: EQUIPMENT_FEATURES,
    });

  } catch (error) {
    console.error('Error retrieving equipment data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve equipment data' },
      { status: 500 }
    );
  }
}
