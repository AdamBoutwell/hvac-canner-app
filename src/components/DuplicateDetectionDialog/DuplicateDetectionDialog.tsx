'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EquipmentData } from '@/types/equipment';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface DuplicateDetectionDialogProps {
  isOpen: boolean;
  newEquipment: EquipmentData;
  existingEquipment: EquipmentData;
  onConfirmDuplicate: () => void;
  onCancel: () => void;
}

export function DuplicateDetectionDialog({
  isOpen,
  newEquipment,
  existingEquipment,
  onConfirmDuplicate,
  onCancel
}: DuplicateDetectionDialogProps) {
  if (!isOpen) return null;

  const getDuplicateType = () => {
    if (newEquipment.model === existingEquipment.model && 
        newEquipment.serialNumber === existingEquipment.serialNumber) {
      return 'exact';
    } else if (newEquipment.model === existingEquipment.model) {
      return 'model';
    }
    return 'none';
  };

  const duplicateType = getDuplicateType();

  const renderComparison = () => {
    const fields = [
      { label: 'Model', new: newEquipment.model, existing: existingEquipment.model },
      { label: 'Serial Number', new: newEquipment.serialNumber, existing: existingEquipment.serialNumber },
      { label: 'Manufacturer', new: newEquipment.manufacturer, existing: existingEquipment.manufacturer },
      { label: 'Asset Type', new: newEquipment.assetType, existing: existingEquipment.assetType },
      { label: 'Location', new: newEquipment.location, existing: existingEquipment.location }
    ];

    return (
      <div className="space-y-3">
        {fields.map((field) => {
          const isMatch = field.new === field.existing;
          return (
            <div key={field.label} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                {isMatch ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="font-medium text-sm">{field.label}:</span>
              </div>
              <div className="text-right text-sm">
                <div className="text-gray-600">New: {field.new || 'N/A'}</div>
                <div className="text-gray-500">Existing: {field.existing || 'N/A'}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            Duplicate Equipment Detected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-orange-800 mb-2">
                  {duplicateType === 'exact' 
                    ? 'Exact Duplicate Found' 
                    : 'Similar Equipment Found'}
                </h3>
                <p className="text-sm text-orange-700">
                  {duplicateType === 'exact' 
                    ? 'This equipment has the same model number and serial number as an existing item.'
                    : 'This equipment has the same model number as an existing item.'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Equipment Comparison:</h4>
            {renderComparison()}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">What would you like to do?</h4>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• <strong>Add Duplicate:</strong> Add this equipment anyway (useful for multiple units of the same model)</p>
              <p>• <strong>Cancel:</strong> Don&apos;t add this equipment and return to editing</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onConfirmDuplicate}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              Add Duplicate Equipment
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              Cancel & Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
