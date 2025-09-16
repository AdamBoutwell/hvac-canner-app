'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EquipmentData } from '@/types/equipment';
import { EQUIPMENT_CODES } from '@/lib/master-pma-converter';

interface DataTableProps {
  columns: string[];
  data: EquipmentData[];
}

export default function DataTable({ columns, data }: DataTableProps) {
  const getFieldValue = (item: EquipmentData, column: string): string => {
    switch (column) {
      case 'Qty':
        return item.qty?.toString() || '1';
      case 'Asset Type':
        return item.assetType ? `${EQUIPMENT_CODES[item.assetType] || item.assetType} - ${item.assetType}` : '';
      case 'Manufacturer':
        return item.manufacturer || '';
      case 'Model':
        return item.model || '';
      case 'Serial Number':
        return item.serialNumber || '';
      case 'Size':
        return item.size || '';
      case 'MFG Year':
        return item.mfgYear || '';
      case 'Voltage':
        return item.voltage || '';
      case 'Refrigerant':
        return item.refrigerant || '';
      case 'Filter Size':
        return item.filterSize || '';
      case 'Filter Qty':
        return item.filterQuantity || '';
      case 'Filter Type':
        return item.filterType || '';
      case 'MERV':
        return item.filterMerv || '';
      case 'Maintenance Interval':
        return item.maintenanceInterval || '';
      case 'Location':
        return item.location || '';
      case 'Notes':
        return item.notes || '';
      default:
        return '';
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No equipment added yet. Upload and scan nameplate images to get started.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column} className="font-medium">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column}>
                  {getFieldValue(item, column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
