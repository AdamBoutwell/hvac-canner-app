import { ScannerData, MasterPMAData, EquipmentCodes, EquipmentFeatures } from '@/types/master-pma';
import * as ExcelJS from 'exceljs';

// Complete COINS Equipment Codes from Master PMA Estimate Form
export const EQUIPMENT_CODES: EquipmentCodes = {
  // PACKAGED HVAC EQUIPMENT (00-PKG)
  "Packaged AC (Cooling Only)": "00-PKG-01a - Packaged AC (Cooling Only)",
  "Packaged AC (with Gas Heating)": "00-PKG-01b - Packaged AC (with Gas Heating)",
  "Packaged AC (Other Heating)": "00-PKG-01c - Packaged AC (Other Heating)",
  "Packaged WC (Cooling Only)": "00-PKG-02a - Packaged WC (Cooling Only)",
  "Packaged WC (with Gas Heating)": "00-PKG-02b - Packaged WC (with Gas Heating)",
  "Packaged WC (Other Heating)": "00-PKG-02c - Packaged WC (Other Heating)",
  "Packaged Heat Pump-AC (All)": "00-PKG-03a - Packaged Heat Pump-AC (All)",
  "Packaged Heat Pump-WC (All)": "00-PKG-03b - Packaged Heat Pump-WC (All)",
  "Packaged- Evap Cond (All Styles)": "00-PKG-04 - Packaged- Evap Cond (All Styles)",
  "PTAC": "00-PKG-05 - PTAC",

  // SPLIT SYSTEMS (01-SPLIT)
  "Split DX- AHU (Cooling Only)": "01-SPLIT-AHU-01 - Split DX- AHU (Cooling Only)",
  "Split DX- AHU (with Gas Furnace)": "01-SPLIT-AHU-02 - Split DX- AHU (with Gas Furnace)",
  "Split DX- AHU (Other Heating)": "01-SPLIT-AHU-03 - Split DX- AHU (Other Heating)",
  "Split DX- Cond Unit (AC)": "01-SPLIT-CU-01 - Split DX- Cond Unit (AC)",
  "Split DX- Cond Unit (WC)": "01-SPLIT-CU-02 - Split DX- Cond Unit (WC)",
  "Split DX- Cond Unit (Heat Pump)": "01-SPLIT-CU-03 - Split DX- Cond Unit (Heat Pump)",
  "Split DX- AHU (with Gas Furnace)-Residential": "01-SPLIT-FUR-01 - Split DX- AHU (with Gas Furnace)-Residential",
  "Split DX- AHU (with Oil Furnace)-Residential": "01-SPLIT-FUR-02 - Split DX- AHU (with Oil Furnace)-Residential",

  // COMPUTER ROOM & SPECIALIZED (05-COMP/COND/WSHP)
  "CRAC (Split DX-AC)": "05-COMP-RM-01 - CRAC (Split DX-AC)",
  "CRAC (WC)": "05-COMP-RM-02 - CRAC (WC)",
  "CRAH": "05-COMP-RM-05 - CRAH",
  "Condensers without Compressors and Dry-Coolers": "05-COND-01 - Condensers without Compressors and Dry-Coolers",
  "Water Source Heat Pumps": "05-WSHP-01 - Water Source Heat Pumps",

  // VRF SYSTEMS (07-VRF)
  "VRF- Indoor": "07-VRF-01 - VRF- Indoor",
  "VRF- Outdoor": "07-VRF-05 - VRF- Outdoor",

  // AIR HANDLING UNITS (10-AHU)
  "AHU (with Chilled Water)": "10-AHU-01 - AHU (with Chilled Water)",
  "AHU-Evap Cooling (Swamp Cooler)": "10-AHU-03 - AHU-Evap Cooling (Swamp Cooler)",
  "Fan-Coil": "10-AHU-05 - Fan-Coil",
  "AHU with Energy Recovery (all kinds)": "10-AHU-10 - AHU with Energy Recovery (all kinds)",
  "AHU-Heating and OA Ventilating (no cooling)": "10-AHU-15 - AHU-Heating and OA Ventilating (no cooling)",

  // COILS (12-COIL)
  "Coil- Cooling (DX)": "12-COIL-01 - Coil- Cooling (DX)",
  "Coil- Cooling (Chilled Water)": "12-COIL-02 - Coil- Cooling (Chilled Water)",
  "Coil- Heating (Electric)": "12-COIL-07 - Coil- Heating (Electric)",
  "Coil- Heating (Hot-Water or Steam)": "12-COIL-08 - Coil- Heating (Hot-Water or Steam)",

  // VAV SYSTEMS (14-VAV)
  "VAV": "14-VAV-01 - VAV",
  "VAV- Fan Powered": "14-VAV-FP-01 - VAV- Fan Powered",

  // AIR CLEANING (16-AIR-CLNR)
  "Air Cleaner (Filter- Media)": "16-AIR-CLNR-01 - Air Cleaner (Filter- Media)",
  "Air Cleaner (Filter- Electronic)": "16-AIR-CLNR-20 - Air Cleaner (Filter- Electronic)",
  "Air Cleaner (Other)": "16-AIR-CLNR-30 - Air Cleaner (Other)",

  // HUMIDITY CONTROL (20-DEHUMID/HUMID)
  "Dehumidifier (Residential)": "20-DEHUMID-01 - Dehumidifier (Residential)",
  "Humidifier": "20-HUMID-01 - Humidifier",

  // CHILLERS (30-CHLR)
  "Chiller- Absorber": "30-CHLR-01 - Chiller- Absorber",
  "Chiller- AC Packaged": "30-CHLR-20 - Chiller- AC Packaged",
  "Chiller- AC Split": "30-CHLR-21 - Chiller- AC Split",
  "Chiller- WC (Centrifugal)": "30-CHLR-40 - Chiller- WC (Centrifugal)",
  "Chiller- WC (Other)": "30-CHLR-45 - Chiller- WC (Other)",

  // WATER SYSTEMS (35-COOL/HX/WTRSYS)
  "Cooling Tower": "35-COOL-TWR-01 - Cooling Tower",
  "Heat Exchanger - Plate and Frame": "35-HX-01 - Heat Exchanger - Plate and Frame",
  "Heat Exchanger - Shell and Tube": "35-HX-02 - Heat Exchanger - Shell and Tube",
  "Water Filter": "35-WFLTR-01 - Water Filter",
  "Water System (Chilled Water Loop)": "35-WTRSYS-CHW - Water System (Chilled Water Loop)",
  "Water System (Condenser Water-Closed Loop)": "35-WTRSYS-CNDSR-CLSD - Water System (Condenser Water-Closed Loop)",
  "Water System (Condenser Water-Open Loop)": "35-WTRSYS-CNDSR-OPEN - Water System (Condenser Water-Open Loop)",
  "Water System (Heating Hot-Water Loop)": "35-WTRSYS-HW - Water System (Heating Hot-Water Loop)",
  "Water System (Steam and Condensate Systems)": "35-WTRSYS-STM - Water System (Steam and Condensate Systems)",

  // FIRE PROTECTION (40-CLN/ELIGHT/EXTIN/FAS/FDOOR/FHOOD/FPUMP/SPK/VESDA)
  "Clean Agent Suppression System": "40-CLN-SUPP - Clean Agent Suppression System",
  "Emergency Lights": "40-ELIGHT-01 - Emergency Lights",
  "Fire Extinguisher (All)": "40-EXTIN-01 - Fire Extinguisher (All)",
  "Fire Alarm System": "40-FAS-01 - Fire Alarm System",
  "Fire Doors-All Ratings": "40-FDOOR-01 - Fire Doors-All Ratings",
  "Fire Suppression Hood": "40-FHOOD-01 - Fire Suppression Hood",
  "Fire Pump": "40-FPUMP-01 - Fire Pump",
  "Sprinkler System - Dry": "40-SPK-DRY - Sprinkler System - Dry",
  "Sprinkler System - PreAction": "40-SPK-PRE - Sprinkler System - PreAction",
  "Sprinkler System - Wet": "40-SPK-WET - Sprinkler System - Wet",
  "Vesda Smoke Detection System": "40-VESDA-01 - Vesda Smoke Detection System",

  // BOILERS (50-BLR)
  "Boiler- Hot Water (Electric)": "50-BLR-01 - Boiler- Hot Water (Electric)",
  "Boiler- Hot Water (Gas)": "50-BLR-02 - Boiler- Hot Water (Gas)",
  "Boiler- Hot Water (Oil-Dual)": "50-BLR-03 - Boiler- Hot Water (Oil-Dual)",
  "Boiler- Steam (Electric)": "50-BLR-04 - Boiler- Steam (Electric)",
  "Boiler- Steam (Gas)": "50-BLR-05 - Boiler- Steam (Gas)",
  "Boiler- Steam (Oil-Dual)": "50-BLR-06 - Boiler- Steam (Oil-Dual)",

  // UNIT HEATERS & BASEBOARDS (55-UH)
  "Unit Heater (Electric)": "55-UH-01 - Unit Heater (Electric)",
  "Unit Heater (Gas)": "55-UH-02 - Unit Heater (Gas)",
  "Unit Heater (Hot Water)": "55-UH-03 - Unit Heater (Hot Water)",
  "Baseboard (Electric)": "55-UH-20 - Baseboard (Electric)",
  "Baseboard (Hot Water or Steam)": "55-UH-21 - Baseboard (Hot Water or Steam)",

  // DOMESTIC HOT WATER (57-DHW)
  "Domestic Hot Water Heater (Tank)": "57-DHW-01 - Domestic Hot Water Heater (Tank)",
  "Domestic Hot Water Heater (Tankless)": "57-DHW-02 - Domestic Hot Water Heater (Tankless)",
  "Expansion Tank": "57-EX-TANK - Expansion Tank",

  // FANS & PUMPS (60-FAN/PUMP)
  "Fan- Major (Larger Stand Alone)": "60-FAN-01 - Fan- Major (Larger Stand Alone)",
  "Fan- Minor (Other)": "60-FAN-02 - Fan- Minor (Other)",
  "Fan (Vane Axial)": "60-FAN-20 - Fan (Vane Axial)",
  "Pump": "60-PUMP-01 - Pump",
  "Pump (Sewage and Sump)": "60-PUMP-20 - Pump (Sewage and Sump)",

  // PLUMBING (65-PLUM)
  "Backflow Preventer": "65-PLUM-BFP - Backflow Preventer",

  // CONTROLS (70-CTRLS)
  "Controls": "70-CTRLS-01 - Controls",
  "Variable Frequency-Speed Drive (VFD)": "70-CTRLS-10 - Variable Frequency-Speed Drive (VFD)",

  // AIR COMPRESSORS (75-ACOMP)
  "Air Compressor": "75-ACOMP-01 - Air Compressor",
  "Air Compressed (Dryer)": "75-ACOMP-05 - Air Compressed (Dryer)",

  // METERS (77-METER)
  "Meter (Electric)": "77-METER-E-01 - Meter (Electric)",
  "Meter (Natural Gas)": "77-METER-NG-01 - Meter (Natural Gas)",
  "Meter (Water)": "77-METER-W-01 - Meter (Water)",

  // REFRIGERATION (80-REFRIG)
  "Refrigerator or Freezer": "80-REFRIG-01 - Refrigerator or Freezer",
  "Ice Machine": "80-REFRIG-02 - Ice Machine",
  "Refrig- Condenser": "80-REFRIG-10 - Refrig- Condenser",
  "Refrig- Evaporator": "80-REFRIG-12 - Refrig- Evaporator",
  "Refrig- Other": "80-REFRIG-15 - Refrig- Other",
  "Environmental Chamber": "80-REFRIG-20 - Environmental Chamber",
  "Refrigerant Monitors": "80-REFRIG-30 - Refrigerant Monitors",

  // ELECTRICAL (90-ELEC)
  "Electrical- Generator": "90-ELEC-GEN-01 - Electrical- Generator",
  "Electrical- Distribution Panel": "90-ELEC-MISC-01 - Electrical- Distribution Panel",
  "Electrical- Power Distribution Unit": "90-ELEC-MISC-20 - Electrical- Power Distribution Unit",
  "Electric- Rack Distribution Unit": "90-ELEC-MISC-21 - Electric- Rack Distribution Unit",
  "Electric- Uninterruptible Power Supply": "90-ELEC-MISC-22 - Electric- Uninterruptible Power Supply",
  "Electrical- Transformer": "90-ELEC-MISC-23 - Electrical- Transformer",
  "Automatic Transfer Switch (ATS)": "90-ELEC-MISC-24 - Automatic Transfer Switch (ATS)",
  "Paralleling Switch Gear": "90-ELEC-MISC-25 - Paralleling Switch Gear",

  // SOLAR (95-SOLPV)
  "Solar PV (Inverter)": "95-SOLPV-INVERTER - Solar PV (Inverter)",
  "Solar PV Panels (Stationary)": "95-SOLPV-PANEL-01 - Solar PV Panels (Stationary)",

  // OTHER/MISCELLANEOUS (99-OTH)
  "Other-Major": "99-OTH-001 - Other-Major",
  "Other- Minor": "99-OTH-002 - Other- Minor",

  // Legacy mappings for backward compatibility
  "Boiler": "50-BLR-02 - Boiler- Hot Water (Gas)",
  "Air Handler": "10-AHU-01 - AHU (with Chilled Water)",
  "RTU": "00-PKG-01a - Packaged AC (Cooling Only)", 
  "Packaged Unit": "00-PKG-01a - Packaged AC (Cooling Only)",
  "Chiller": "30-CHLR-40 - Chiller- WC (Centrifugal)",
  "Heat Pump": "00-PKG-03a - Packaged Heat Pump-AC (All)",
  "Fan Coil": "10-AHU-05 - Fan-Coil",
  "Unit Heater": "55-UH-02 - Unit Heater (Gas)",
  "Fan": "60-FAN-01 - Fan- Major (Larger Stand Alone)",
  "VFD": "70-CTRLS-10 - Variable Frequency-Speed Drive (VFD)",

  // Fallback for unknown types
  "default": "99-OTH-001 - Other-Major"
};

// Equipment characteristics and features
export const EQUIPMENT_FEATURES: EquipmentFeatures = {
  withFilters: ["Air Handler", "RTU", "Packaged Unit", "Fan Coil", "VAV"],
  withCoilCleaning: ["Air Handler", "RTU", "Packaged Unit", "Heat Pump", "Fan Coil", "Chiller", "Cooling Tower"],
  withBelts: ["Air Handler", "RTU", "Packaged Unit", "Fan", "Pump", "Cooling Tower"],
  
  // Default belt specifications
  beltDefaults: {
    "Air Handler": { size: "A-Belt", qty: "2" },
    "RTU": { size: "B-Belt", qty: "1" },
    "Packaged Unit": { size: "B-Belt", qty: "1" },
    "Fan": { size: "A-Belt", qty: "1" },
    "Pump": { size: "A-Belt", qty: "1" },
    "Cooling Tower": { size: "B-Belt", qty: "2" }
  }
};

/**
 * Converts scanner data to Master PMA format
 * @param scannerData - Input data from HVAC equipment scanner
 * @returns Master PMA formatted data
 */
export function convertToMasterPMA(scannerData: ScannerData): MasterPMAData {
  const assetType = scannerData["Asset Type"];
  const equipmentCode = EQUIPMENT_CODES[assetType] || EQUIPMENT_CODES["default"];
  
  const hasFilters = EQUIPMENT_FEATURES.withFilters.includes(assetType);
  const needsCoilCleaning = EQUIPMENT_FEATURES.withCoilCleaning.includes(assetType);
  const hasBelts = EQUIPMENT_FEATURES.withBelts.includes(assetType);
  
  // Get belt defaults if applicable
  const beltInfo = EQUIPMENT_FEATURES.beltDefaults[assetType] || { size: "", qty: "" };
  
  return {
    "QTY": scannerData.Qty,
    "Asset Type & Description (COINS)": equipmentCode,
    "MFG": scannerData.Manufacturer,
    "MODEL": scannerData.Model,
    "SN": scannerData["Serial Number"],
    "SIZE": scannerData.Size,
    "MFG Year": scannerData["MFG Year"],
    "CUST ID": "",
    "LOCATION": scannerData.Location,
    "FILTER CHANGE": hasFilters ? "Y" : "N",
    "COIL CLEAN": needsCoilCleaning ? "Y" : "N",
    "Belt Size": hasBelts ? beltInfo.size : "",
    "Belt QTY per Unit": hasBelts ? beltInfo.qty : "",
    "Filter Size": hasFilters ? scannerData["Filter Size"] : "",
    "Filter QTY per Unit": hasFilters ? scannerData["Filter Qty"] : ""
  };
}

/**
 * Converts multiple scanner data items to Master PMA format
 * @param scannerDataList - Array of scanner data
 * @returns Array of Master PMA formatted data
 */
export function convertMultipleToMasterPMA(scannerDataList: ScannerData[]): MasterPMAData[] {
  return scannerDataList.map(convertToMasterPMA);
}

/**
 * Generates TSV (Tab-Separated Values) string from Master PMA data
 * @param masterPMAData - Master PMA formatted data array
 * @param includeHeaders - Whether to include column headers (default: true)
 * @returns TSV string ready for Excel paste
 */
export function generateTSV(masterPMAData: MasterPMAData[], includeHeaders: boolean = true): string {
  if (masterPMAData.length === 0) return '';
  
  const headers = [
    'QTY',
    'Asset Type & Description (COINS)',
    'MFG',
    'MODEL',
    'SN',
    'SIZE',
    'MFG Year',
    'CUST ID',
    'LOCATION',
    'FILTER CHANGE',
    'COIL CLEAN',
    'Belt Size',
    'Belt QTY per Unit',
    'Filter Size',
    'Filter QTY per Unit'
  ];
  
  const rows: string[] = [];
  
  // Add headers if requested
  if (includeHeaders) {
    rows.push(headers.join('\t'));
  }
  
  // Add data rows
  masterPMAData.forEach(data => {
    const row = [
      data.QTY.toString(),
      data["Asset Type & Description (COINS)"],
      data.MFG,
      data.MODEL,
      data.SN,
      data.SIZE,
      data["MFG Year"],
      data["CUST ID"],
      data.LOCATION,
      data["FILTER CHANGE"],
      data["COIL CLEAN"],
      data["Belt Size"],
      data["Belt QTY per Unit"],
      data["Filter Size"],
      data["Filter QTY per Unit"]
    ];
    rows.push(row.join('\t'));
  });
  
  return rows.join('\n');
}

/**
 * Utility function to validate scanner data structure
 * @param data - Data to validate
 * @returns True if data structure is valid
 */
export function validateScannerData(data: unknown): data is ScannerData {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  
  const requiredFields = [
    'Qty', 'Asset Type', 'Manufacturer', 'Model', 
    'Serial Number', 'Size', 'MFG Year', 'Voltage',
    'Refrigerant', 'Filter Size', 'Filter Qty', 'MERV',
    'Location', 'Notes'
  ];
  
  return requiredFields.every(field => field in data);
}

/**
 * Gets available equipment types from the mapping
 * @returns Array of available equipment types
 */
export function getAvailableEquipmentTypes(): string[] {
  return Object.keys(EQUIPMENT_CODES).filter(key => key !== 'default');
}

/**
 * Gets equipment features for a specific asset type
 * @param assetType - The asset type to check
 * @returns Object with feature flags
 */
export function getEquipmentFeatures(assetType: string) {
  return {
    hasFilters: EQUIPMENT_FEATURES.withFilters.includes(assetType),
    needsCoilCleaning: EQUIPMENT_FEATURES.withCoilCleaning.includes(assetType),
    hasBelts: EQUIPMENT_FEATURES.withBelts.includes(assetType),
    beltInfo: EQUIPMENT_FEATURES.beltDefaults[assetType] || { size: "", qty: "" }
  };
}

/**
 * Generates Excel file buffer from Master PMA data
 * @param masterPMAData - Master PMA formatted data array
 * @param customerName - Customer name for filename
 * @param locationName - Location name for filename
 * @returns Excel file buffer
 */
export async function generateExcelBuffer(
  masterPMAData: MasterPMAData[], 
  _customerName: string = 'Customer', 
  _locationName: string = 'Location'
): Promise<ArrayBuffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Master PMA Estimate');

  // Define headers
  const headers = [
    'QTY',
    'Asset Type & Description (COINS)',
    'MFG',
    'MODEL',
    'SN',
    'SIZE',
    'MFG Year',
    'CUST ID',
    'LOCATION',
    'FILTER CHANGE',
    'COIL CLEAN',
    'Belt Size',
    'Belt QTY per Unit',
    'Filter Size',
    'Filter QTY per Unit'
  ];

  // Add headers to worksheet
  worksheet.addRow(headers);

  // Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  // Add data rows
  masterPMAData.forEach(data => {
    const row = [
      data.QTY,
      data["Asset Type & Description (COINS)"],
      data.MFG,
      data.MODEL,
      data.SN,
      data.SIZE,
      data["MFG Year"],
      data["CUST ID"],
      data.LOCATION,
      data["FILTER CHANGE"],
      data["COIL CLEAN"],
      data["Belt Size"],
      data["Belt QTY per Unit"],
      data["Filter Size"],
      data["Filter QTY per Unit"]
    ];
    worksheet.addRow(row);
  });

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    column.width = Math.max(column.width || 10, 15);
  });

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as ArrayBuffer;
}

/**
 * Generates Excel filename from customer and location names
 * @param customerName - Customer name
 * @param locationName - Location name
 * @returns Sanitized filename
 */
export function generateExcelFilename(customerName: string, locationName: string): string {
  const sanitizedCustomerName = customerName.replace(/[^a-zA-Z0-9\s-_]/g, '').trim();
  const sanitizedLocationName = locationName.replace(/[^a-zA-Z0-9\s-_]/g, '').trim();
  return `${sanitizedCustomerName}_${sanitizedLocationName}_Master_PMA_Estimate.xlsx`;
}
