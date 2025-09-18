import { EquipmentData } from '@/types/equipment';

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicateType: 'exact' | 'model' | 'none';
  existingEquipment: EquipmentData | null;
}

/**
 * Checks for duplicate equipment based on model number and serial number
 * @param newEquipment - The equipment being added
 * @param existingEquipmentList - List of existing equipment
 * @returns Duplicate check result with type and existing equipment if found
 */
export function checkForDuplicates(
  newEquipment: EquipmentData,
  existingEquipmentList: EquipmentData[]
): DuplicateCheckResult {
  // First check for exact duplicates (same model AND serial number)
  const exactDuplicate = existingEquipmentList.find(existing => 
    existing.model?.toLowerCase().trim() === newEquipment.model?.toLowerCase().trim() &&
    existing.serialNumber?.toLowerCase().trim() === newEquipment.serialNumber?.toLowerCase().trim() &&
    existing.model && existing.serialNumber && newEquipment.model && newEquipment.serialNumber
  );

  if (exactDuplicate) {
    return {
      isDuplicate: true,
      duplicateType: 'exact',
      existingEquipment: exactDuplicate
    };
  }

  // Then check for model-only duplicates (same model, different or missing serial number)
  const modelDuplicate = existingEquipmentList.find(existing => 
    existing.model?.toLowerCase().trim() === newEquipment.model?.toLowerCase().trim() &&
    existing.model && newEquipment.model
  );

  if (modelDuplicate) {
    return {
      isDuplicate: true,
      duplicateType: 'model',
      existingEquipment: modelDuplicate
    };
  }

  return {
    isDuplicate: false,
    duplicateType: 'none',
    existingEquipment: null
  };
}

/**
 * Sanitizes equipment data for comparison by trimming whitespace and converting to lowercase
 * @param equipment - Equipment data to sanitize
 * @returns Sanitized equipment data
 */
export function sanitizeEquipmentForComparison(equipment: EquipmentData): EquipmentData {
  return {
    ...equipment,
    model: equipment.model?.toLowerCase().trim() || '',
    serialNumber: equipment.serialNumber?.toLowerCase().trim() || '',
    manufacturer: equipment.manufacturer?.toLowerCase().trim() || '',
    assetType: equipment.assetType?.toLowerCase().trim() || '',
    location: equipment.location?.toLowerCase().trim() || ''
  };
}

/**
 * Gets a user-friendly description of the duplicate type
 * @param duplicateType - The type of duplicate detected
 * @returns Human-readable description
 */
export function getDuplicateDescription(duplicateType: 'exact' | 'model' | 'none'): string {
  switch (duplicateType) {
    case 'exact':
      return 'Exact duplicate (same model and serial number)';
    case 'model':
      return 'Same model number (different serial number)';
    case 'none':
      return 'No duplicates found';
    default:
      return 'Unknown duplicate type';
  }
}

