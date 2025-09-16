'use client';

import React from 'react';
import { Info, AlertCircle, CheckCircle } from 'lucide-react';
import { getEquipmentFeatures, EQUIPMENT_CODES } from '@/lib/master-pma-converter';

interface ValidationHintsProps {
  assetType: string;
}

export function ValidationHints({ assetType }: ValidationHintsProps) {
  if (!assetType) {
    return (
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-800">Required Fields:</p>
            <ul className="mt-1 text-blue-700 space-y-1">
              <li>• Asset Type (COINS code selection)</li>
              <li>• Manufacturer</li>
              <li>• Model</li>
              <li>• Quantity (defaults to 1)</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const features = getEquipmentFeatures(assetType);
  const requiredForMasterPMA = [];

  if (features.hasFilters) {
    requiredForMasterPMA.push('Filter Size', 'Filter Quantity');
  }

  return (
    <div className="space-y-2 mt-2">
      {/* Equipment Features Info */}
      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
        <div className="flex items-start gap-2">
          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-green-800">{EQUIPMENT_CODES[assetType]} - {assetType} Equipment Features:</p>
            <div className="mt-1 text-green-700 space-y-1">
              {features.hasFilters && (
                <div>• <strong>Has Filters:</strong> Requires filter maintenance (Filter Change = Y)</div>
              )}
              {features.needsCoilCleaning && (
                <div>• <strong>Coil Cleaning:</strong> Requires coil maintenance (Coil Clean = Y)</div>
              )}
              {features.hasBelts && (
                <div>• <strong>Has Belts:</strong> Default belt size: {features.beltInfo.size}, Qty: {features.beltInfo.qty}</div>
              )}
              {!features.hasFilters && !features.needsCoilCleaning && !features.hasBelts && (
                <div>• No special maintenance features</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Master PMA Requirements */}
      {requiredForMasterPMA.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-800">Recommended for Master PMA:</p>
              <ul className="mt-1 text-amber-700 space-y-1">
                {requiredForMasterPMA.map((field) => (
                  <li key={field}>• {field}</li>
                ))}
              </ul>
              <p className="mt-2 text-amber-600 text-xs">
                These fields will be populated in the Master PMA export if equipment has filters.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* General Tips */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-700">
            <p className="font-medium">Tips for Better Data Quality:</p>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• Use exact model numbers from nameplates</li>
              <li>• Include complete serial numbers</li>
              <li>• Specify exact voltage (e.g., 208V/3Ph, 460V/3Ph)</li>
              <li>• Include refrigerant type for HVAC equipment</li>
              <li>• Add detailed location descriptions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
