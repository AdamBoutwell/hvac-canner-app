import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { EquipmentData, Customer } from '@/types/equipment';

export async function POST(request: NextRequest) {
  try {
    const { equipmentList, customer } = await request.json() as {
      equipmentList: EquipmentData[];
      customer: Customer;
    };

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    
    // Add metadata
    workbook.creator = 'HVAC Equipment Scanner';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    // Create main worksheet
    const worksheet = workbook.addWorksheet('Equipment List', {
      properties: { tabColor: { argb: 'FF1E90FF' } }
    });

    // Set column headers and widths
    worksheet.columns = [
      { header: 'Qty', key: 'qty', width: 10 },
      { header: 'Asset Type', key: 'assetType', width: 20 },
      { header: 'Manufacturer', key: 'manufacturer', width: 20 },
      { header: 'Model', key: 'model', width: 25 },
      { header: 'Serial Number', key: 'serialNumber', width: 20 },
      { header: 'Size', key: 'size', width: 15 },
      { header: 'MFG Year', key: 'mfgYear', width: 12 },
      { header: 'Voltage', key: 'voltage', width: 15 },
      { header: 'Refrigerant', key: 'refrigerant', width: 15 },
      { header: 'Filter Size', key: 'filterSize', width: 20 },
      { header: 'Filter Qty', key: 'filterQuantity', width: 15 },
      { header: 'MERV', key: 'filterMerv', width: 12 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Notes', key: 'notes', width: 30 },
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Add customer info at the top
    if (customer.name || customer.location) {
      worksheet.insertRow(1, ['Customer Information']);
      worksheet.mergeCells('A1:N1'); // Updated to span all 14 columns
      worksheet.getCell('A1').font = { bold: true, size: 14 };
      worksheet.getCell('A1').alignment = { horizontal: 'center' };
      
      if (customer.name) {
        worksheet.insertRow(2, ['Customer:', customer.name]);
        worksheet.getCell('A2').font = { bold: true };
      }
      
      if (customer.location) {
        worksheet.insertRow(3, ['Location:', customer.location]);
        worksheet.getCell('A3').font = { bold: true };
      }
      
      // Add empty row for spacing
      worksheet.insertRow(4, []);
      
      // Adjust header row position
      const headerRowIndex = customer.name && customer.location ? 5 : 
                            customer.name || customer.location ? 4 : 1;
      worksheet.getRow(headerRowIndex).font = { bold: true };
      worksheet.getRow(headerRowIndex).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
    }

    // Add equipment data
    equipmentList.forEach((equipment) => {
      worksheet.addRow({
        qty: equipment.qty || 1,
        assetType: equipment.assetType || '',
        manufacturer: equipment.manufacturer || '',
        model: equipment.model || '',
        serialNumber: equipment.serialNumber || '',
        size: equipment.size || '',
        mfgYear: equipment.mfgYear || '',
        voltage: equipment.voltage || '',
        refrigerant: equipment.refrigerant || '',
        filterSize: equipment.filterSize || '',
        filterQuantity: equipment.filterQuantity || '',
        filterMerv: equipment.filterMerv || '',
        location: equipment.location || '',
        notes: equipment.notes || '',
      });
    });

    // Add borders to all cells with data
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Create summary worksheet
    const summarySheet = workbook.addWorksheet('Summary', {
      properties: { tabColor: { argb: 'FF00FF00' } }
    });

    summarySheet.columns = [
      { header: 'Asset Type', key: 'assetType', width: 25 },
      { header: 'Count', key: 'count', width: 15 },
      { header: 'Total Quantity', key: 'totalQty', width: 15 },
    ];

    // Calculate summary data
    const summary = new Map<string, { count: number; totalQty: number }>();
    equipmentList.forEach((equipment) => {
      const type = equipment.assetType || 'Unknown';
      const existing = summary.get(type) || { count: 0, totalQty: 0 };
      existing.count += 1;
      existing.totalQty += equipment.qty || 1;
      summary.set(type, existing);
    });

    // Add summary data
    summary.forEach((value, key) => {
      summarySheet.addRow({
        assetType: key,
        count: value.count,
        totalQty: value.totalQty,
      });
    });

    // Style summary sheet header
    summarySheet.getRow(1).font = { bold: true };
    summarySheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF90EE90' }
    };

    // Generate buffer with proper Excel format
    const buffer = await workbook.xlsx.writeBuffer({
      useStyles: true,
      useSharedStrings: true
    });

    // Return the Excel file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="HVAC_Equipment_List.xlsx"',
        'Content-Length': buffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Excel generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Excel file' },
      { status: 500 }
    );
  }
}
