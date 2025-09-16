'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EquipmentData } from '@/types/equipment';
import { convertMultipleEquipmentToScannerData } from '@/lib/data-converter';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface MasterPMAExportProps {
  equipmentList: EquipmentData[];
  disabled?: boolean;
}

export function MasterPMAExport({ equipmentList, disabled = false }: MasterPMAExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { customer } = useAppContext();

  const handleExportToMasterPMA = async () => {
    if (equipmentList.length === 0) {
      toast.error('No equipment data to export');
      return;
    }

    setIsExporting(true);
    
    try {
      // Convert EquipmentData to ScannerData format
      const scannerDataList = convertMultipleEquipmentToScannerData(equipmentList);

      // Call the Master PMA API endpoint with customer information
      const response = await fetch('/api/master-pma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scannerDataList,
          customerName: customer.name,
          locationName: customer.location
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }

      // Get the Excel file blob
      const excelBlob = await response.blob();

      // Extract filename from response headers or generate default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'Master_PMA_Estimate.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create and download the file
      const url = window.URL.createObjectURL(excelBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Successfully exported ${equipmentList.length} equipment items to Master PMA Excel format`);
      
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (equipmentList.length === 0) {
      toast.error('No equipment data to copy');
      return;
    }

    try {
      // Convert EquipmentData to ScannerData format
      const scannerDataList = convertMultipleEquipmentToScannerData(equipmentList);

      // Call the Master PMA API endpoint
      const response = await fetch('/api/master-pma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scannerDataList,
          customerName: customer.name,
          locationName: customer.location
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Conversion failed');
      }

      // Get the Excel file blob
      const excelBlob = await response.blob();

      // Convert Excel blob to text for clipboard (this will show the raw data)
      const textData = await excelBlob.text();
      
      // Copy to clipboard
      await navigator.clipboard.writeText(textData);
      toast.success('Master PMA data copied to clipboard! Note: Excel format data copied as text.');

    } catch (error) {
      console.error('Copy error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to copy data');
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Master PMA Export</h3>
          <p className="text-sm text-muted-foreground">
            Export equipment data in Master PMA Estimate Excel format with customer-specific filename
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={handleExportToMasterPMA}
            disabled={disabled || isExporting || equipmentList.length === 0}
            className="flex-1"
          >
            {isExporting ? 'Exporting...' : 'Download Excel File'}
          </Button>
          
          <Button
            onClick={handleCopyToClipboard}
            disabled={disabled || isExporting || equipmentList.length === 0}
            variant="outline"
            className="flex-1"
          >
            Copy to Clipboard
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>
            <strong>Equipment Count:</strong> {equipmentList.length} items
          </p>
          <p>
            <strong>Format:</strong> Excel (.xlsx) with formatted headers and styling
          </p>
          <p>
            <strong>Filename:</strong> {customer.name && customer.location ? `${customer.name}_${customer.location}_Master_PMA_Estimate.xlsx` : 'Customer_Location_Master_PMA_Estimate.xlsx'}
          </p>
        </div>
      </div>
    </Card>
  );
}
