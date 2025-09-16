import { ScannerData } from '@/types/master-pma';
import { convertToMasterPMA, convertMultipleToMasterPMA, generateTSV } from './master-pma-converter';

// Sample scanner data for testing
export const sampleScannerData: ScannerData[] = [
  {
    Qty: 2,
    "Asset Type": "Air Handler",
    Manufacturer: "Carrier",
    Model: "AHU-500",
    "Serial Number": "CAH500-001",
    Size: "500 CFM",
    "MFG Year": "2020",
    Voltage: "208V/3Ph",
    Refrigerant: "R-410A",
    "Filter Size": "20x25x2",
    "Filter Qty": "4",
    MERV: "8",
    Location: "Building A - Floor 1",
    Notes: "Main air handler unit"
  },
  {
    Qty: 1,
    "Asset Type": "RTU",
    Manufacturer: "Trane",
    Model: "RTU-150",
    "Serial Number": "TRT150-002",
    Size: "15 Ton",
    "MFG Year": "2019",
    Voltage: "460V/3Ph",
    Refrigerant: "R-410A",
    "Filter Size": "16x20x2",
    "Filter Qty": "2",
    MERV: "8",
    Location: "Building B - Roof",
    Notes: "Roof top unit for office space"
  },
  {
    Qty: 1,
    "Asset Type": "Boiler",
    Manufacturer: "Cleaver Brooks",
    Model: "CB-100",
    "Serial Number": "CB100-003",
    Size: "100 HP",
    "MFG Year": "2021",
    Voltage: "480V/3Ph",
    Refrigerant: "N/A",
    "Filter Size": "",
    "Filter Qty": "",
    MERV: "",
    Location: "Building A - Basement",
    Notes: "Gas fired hot water boiler"
  },
  {
    Qty: 3,
    "Asset Type": "VAV",
    Manufacturer: "Price Industries",
    Model: "VAV-100",
    "Serial Number": "PIV100-004",
    Size: "100 CFM",
    "MFG Year": "2020",
    Voltage: "24V",
    Refrigerant: "N/A",
    "Filter Size": "12x12x1",
    "Filter Qty": "1",
    MERV: "6",
    Location: "Building A - Floor 2",
    Notes: "Variable air volume boxes"
  },
  {
    Qty: 1,
    "Asset Type": "Unknown Equipment",
    Manufacturer: "Custom MFG",
    Model: "CUSTOM-001",
    "Serial Number": "CST001-005",
    Size: "Custom Size",
    "MFG Year": "2022",
    Voltage: "120V",
    Refrigerant: "N/A",
    "Filter Size": "",
    "Filter Qty": "",
    MERV: "",
    Location: "Building C - Utility Room",
    Notes: "Custom equipment - unknown type"
  }
];

/**
 * Demo function to test the Master PMA converter
 */
export function runMasterPMADemo(): void {
  console.log('=== Master PMA Converter Demo ===\n');
  
  // Convert single item
  console.log('1. Single Item Conversion:');
  console.log('Input:', JSON.stringify(sampleScannerData[0], null, 2));
  console.log('Output:', JSON.stringify(convertToMasterPMA(sampleScannerData[0]), null, 2));
  console.log('\n');
  
  // Convert multiple items
  console.log('2. Multiple Items Conversion:');
  const masterPMAData = convertMultipleToMasterPMA(sampleScannerData);
  console.log('Converted', sampleScannerData.length, 'items to Master PMA format');
  console.log('\n');
  
  // Generate TSV
  console.log('3. TSV Output (ready for Excel):');
  const tsvOutput = generateTSV(masterPMAData, true);
  console.log(tsvOutput);
  console.log('\n');
  
  // Show equipment features
  console.log('4. Equipment Features Analysis:');
  sampleScannerData.forEach((item, index) => {
    const converted = convertToMasterPMA(item);
    console.log(`Item ${index + 1} (${item["Asset Type"]}):`);
    console.log(`  - Filter Change: ${converted["FILTER CHANGE"]}`);
    console.log(`  - Coil Clean: ${converted["COIL CLEAN"]}`);
    console.log(`  - Belt Size: ${converted["Belt Size"] || 'N/A'}`);
    console.log(`  - Belt Qty: ${converted["Belt QTY per Unit"] || 'N/A'}`);
    console.log(`  - COINS Code: ${converted["Asset Type & Description (COINS)"]}`);
    console.log('');
  });
}

// Uncomment the line below to run the demo in the browser console
// runMasterPMADemo();
