'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Save, Trash2, X } from 'lucide-react';
import { EquipmentData } from '@/types/equipment';

interface UnsavedEquipmentDialogProps {
  equipment: EquipmentData;
  isOpen: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export function UnsavedEquipmentDialog({ 
  equipment, 
  isOpen, 
  onSave, 
  onDiscard, 
  onCancel 
}: UnsavedEquipmentDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Unsaved Equipment
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <p className="text-sm text-amber-800">
              You have unsaved equipment data. What would you like to do with it before proceeding?
            </p>
          </div>

          <div className="bg-gray-50 rounded-md p-4">
            <h4 className="font-medium text-sm text-gray-900 mb-2">Equipment Details:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-medium">{equipment.assetType || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-gray-600">Manufacturer:</span>
                <span className="ml-2 font-medium">{equipment.manufacturer || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-gray-600">Model:</span>
                <span className="ml-2 font-medium">{equipment.model || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-gray-600">Quantity:</span>
                <span className="ml-2 font-medium">{equipment.qty || 1}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onSave}
              className="flex-1 flex items-center gap-2"
              variant="default"
            >
              <Save className="h-4 w-4" />
              Save to Equipment List
            </Button>
            <Button
              onClick={onDiscard}
              className="flex-1 flex items-center gap-2"
              variant="destructive"
            >
              <Trash2 className="h-4 w-4" />
              Discard Changes
            </Button>
          </div>

          <div className="text-center">
            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
