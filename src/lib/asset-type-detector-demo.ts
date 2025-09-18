import { EquipmentData } from '@/types/equipment';
import { detectAssetType, getAssetTypeSuggestions } from './asset-type-detector';

// Demo data based on your screenshot
export const demoEquipmentData: EquipmentData[] = [
  {
    manufacturer: "Carrier",
    model: "AHU-500",
    size: "500 CFM",
    assetType: "",
    qty: 1,
    serialNumber: "CAH500-001",
    mfgYear: "2020",
    voltage: "208V/3Ph",
    refrigerant: "R-410A",
    filterSize: "20x25x2",
    filterQuantity: "4",
    filterMerv: "MERV 8",
    location: "Building A - Floor 1",
    notes: "Main air handler unit"
  },
  {
    manufacturer: "Trane",
    model: "RTU-150",
    size: "15 Ton",
    assetType: "",
    qty: 1,
    serialNumber: "TRT150-002",
    mfgYear: "2019",
    voltage: "460V/3Ph",
    refrigerant: "R-410A",
    filterSize: "16x20x2",
    filterQuantity: "2",
    filterMerv: "MERV 8",
    location: "Building B - Roof",
    notes: "Roof top unit for office space"
  },
  {
    manufacturer: "Cleaver Brooks",
    model: "CB-100",
    size: "100 HP",
    assetType: "",
    qty: 1,
    serialNumber: "CB100-003",
    mfgYear: "2021",
    voltage: "480V/3Ph",
    refrigerant: "N/A",
    filterSize: "",
    filterQuantity: "",
    filterMerv: "",
    location: "Building A - Basement",
    notes: "Gas fired hot water boiler"
  }
];

/**
 * Demo function to test asset type detection
 */
export function runAssetTypeDetectionDemo(): void {
  console.log('=== Asset Type Detection Demo ===\n');
  
  demoEquipmentData.forEach((equipment, index) => {
    console.log(`Equipment ${index + 1}:`);
    console.log(`Manufacturer: ${equipment.manufacturer}`);
    console.log(`Model: ${equipment.model}`);
    console.log(`Size: ${equipment.size}`);
    console.log('');
    
    const detection = detectAssetType(equipment);
    console.log(`Detected Type: ${detection.suggestedType || 'None'}`);
    console.log(`Confidence: ${Math.round(detection.confidence * 100)}%`);
    
    if (detection.alternatives.length > 0) {
      console.log('Alternatives:');
      detection.alternatives.forEach(alt => {
        console.log(`  - ${alt.type}: ${Math.round(alt.confidence * 100)}%`);
      });
    }
    
    const suggestions = getAssetTypeSuggestions(equipment);
    if (suggestions.length > 0) {
      console.log('Suggestions with explanations:');
      suggestions.forEach(suggestion => {
        console.log(`  - ${suggestion.type}: ${Math.round(suggestion.confidence * 100)}% (${suggestion.explanation})`);
      });
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
  });
}

// Uncomment to run demo in browser console
// runAssetTypeDetectionDemo();

