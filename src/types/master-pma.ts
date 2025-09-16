// Master PMA Estimate format types and interfaces

export interface ScannerData {
  Qty: number;
  "Asset Type": string;
  Manufacturer: string;
  Model: string;
  "Serial Number": string;
  Size: string;
  "MFG Year": string;
  Voltage: string;
  Refrigerant: string;
  "Filter Size": string;
  "Filter Qty": string;
  MERV: string;
  Location: string;
  Notes: string;
}

export interface MasterPMAData {
  QTY: number;
  "Asset Type & Description (COINS)": string;
  MFG: string;
  MODEL: string;
  SN: string;
  SIZE: string;
  "MFG Year": string;
  "CUST ID": string;
  LOCATION: string;
  "FILTER CHANGE": string;
  "COIL CLEAN": string;
  "Belt Size": string;
  "Belt QTY per Unit": string;
  "Filter Size": string;
  "Filter QTY per Unit": string;
}

export interface BeltDefaults {
  size: string;
  qty: string;
}

export interface EquipmentFeatures {
  withFilters: string[];
  withCoilCleaning: string[];
  withBelts: string[];
  beltDefaults: Record<string, BeltDefaults>;
}

export interface EquipmentCodes {
  [key: string]: string;
}
