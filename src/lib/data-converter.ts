import { EquipmentData } from '@/types/equipment';
import { ScannerData } from '@/types/master-pma';

/**
 * Converts EquipmentData to ScannerData format for Master PMA conversion
 * @param equipmentData - Equipment data from the scanner app
 * @returns ScannerData format compatible with Master PMA converter
 */
export function convertEquipmentToScannerData(equipmentData: EquipmentData): ScannerData {
  return {
    Qty: equipmentData.qty || 1,
    "Asset Type": equipmentData.assetType || "",
    Manufacturer: equipmentData.manufacturer || "",
    Model: equipmentData.model || "",
    "Serial Number": equipmentData.serialNumber || "",
    Size: equipmentData.size || "",
    "MFG Year": equipmentData.mfgYear || "",
    Voltage: equipmentData.voltage || "",
    Refrigerant: equipmentData.refrigerant || "",
    "Filter Size": equipmentData.filterSize || "",
    "Filter Qty": equipmentData.filterQuantity || "",
    MERV: equipmentData.filterMerv || "",
    Location: equipmentData.location || "",
    Notes: equipmentData.notes || ""
  };
}

/**
 * Converts multiple EquipmentData items to ScannerData format
 * @param equipmentList - Array of equipment data
 * @returns Array of ScannerData format
 */
export function convertMultipleEquipmentToScannerData(equipmentList: EquipmentData[]): ScannerData[] {
  return equipmentList.map(convertEquipmentToScannerData);
}
