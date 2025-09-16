import { EquipmentData } from '@/types/equipment';

// Equipment type detection patterns based on manufacturer, model, and other data
interface EquipmentPattern {
  assetType: string;
  patterns: {
    manufacturer?: string[];
    model?: string[];
    keywords?: string[];
    size?: string[];
  };
  confidence: number; // 0-1 scale
}

const EQUIPMENT_PATTERNS: EquipmentPattern[] = [
  // Air Handlers
  {
    assetType: "AHU (with Chilled Water)",
    patterns: {
      manufacturer: ["carrier", "trane", "york", "daikin", "mitsubishi", "lennox"],
      model: ["ahu", "air handler", "handling unit"],
      keywords: ["air handler", "ahu", "handling unit", "air handling", "chilled water"],
      size: ["cfm", "cubic feet per minute"]
    },
    confidence: 0.9
  },
  {
    assetType: "Air Handler",
    patterns: {
      manufacturer: ["carrier", "trane", "york", "daikin", "mitsubishi", "lennox"],
      model: ["ahu", "air handler", "handling unit"],
      keywords: ["air handler", "ahu", "handling unit", "air handling"],
      size: ["cfm", "cubic feet per minute"]
    },
    confidence: 0.8
  },
  
  // RTUs (Roof Top Units)
  {
    assetType: "Packaged AC (Cooling Only)",
    patterns: {
      manufacturer: ["carrier", "trane", "york", "daikin", "lennox", "rheem"],
      model: ["rtu", "roof", "packaged", "rooftop", "ac"],
      keywords: ["roof top unit", "rtu", "rooftop", "packaged unit", "roof mounted", "cooling only"],
      size: ["ton", "btu", "btuh"]
    },
    confidence: 0.9
  },
  {
    assetType: "RTU",
    patterns: {
      manufacturer: ["carrier", "trane", "york", "daikin", "lennox", "rheem"],
      model: ["rtu", "roof", "packaged", "rooftop"],
      keywords: ["roof top unit", "rtu", "rooftop", "packaged unit", "roof mounted"],
      size: ["ton", "btu", "btuh"]
    },
    confidence: 0.8
  },
  
  // Packaged Units
  {
    assetType: "Packaged Unit",
    patterns: {
      manufacturer: ["carrier", "trane", "york", "daikin", "lennox", "rheem"],
      model: ["packaged", "package", "unit"],
      keywords: ["packaged unit", "package unit", "unitary"],
      size: ["ton", "btu", "btuh"]
    },
    confidence: 0.85
  },
  
  // Boilers
  {
    assetType: "Boiler- Hot Water (Gas)",
    patterns: {
      manufacturer: ["cleaver brooks", "burnham", "weil mclain", "bryan", "laars"],
      model: ["boiler", "steam", "hot water", "gas"],
      keywords: ["boiler", "steam", "hot water", "hydronic", "gas fired"],
      size: ["btu", "btuh", "mbh", "hp", "horsepower"]
    },
    confidence: 0.9
  },
  {
    assetType: "Boiler- Hot Water (Electric)",
    patterns: {
      manufacturer: ["cleaver brooks", "burnham", "weil mclain", "bryan", "laars"],
      model: ["boiler", "electric", "hot water"],
      keywords: ["boiler", "electric", "hot water", "hydronic", "electric fired"],
      size: ["btu", "btuh", "mbh", "hp", "horsepower", "kw"]
    },
    confidence: 0.9
  },
  {
    assetType: "Boiler",
    patterns: {
      manufacturer: ["cleaver brooks", "burnham", "weil mclain", "bryan", "laars"],
      model: ["boiler", "steam", "hot water"],
      keywords: ["boiler", "steam", "hot water", "hydronic"],
      size: ["btu", "btuh", "mbh", "hp", "horsepower"]
    },
    confidence: 0.8
  },
  
  // Chillers
  {
    assetType: "Chiller- WC (Centrifugal)",
    patterns: {
      manufacturer: ["carrier", "trane", "york", "daikin", "mitsubishi", "lennox"],
      model: ["chiller", "chill", "cooling", "centrifugal"],
      keywords: ["chiller", "chilled water", "centrifugal", "water cooled"],
      size: ["ton", "btu", "btuh", "kw"]
    },
    confidence: 0.9
  },
  {
    assetType: "Chiller- AC Packaged",
    patterns: {
      manufacturer: ["carrier", "trane", "york", "daikin", "mitsubishi", "lennox"],
      model: ["chiller", "chill", "cooling", "packaged"],
      keywords: ["chiller", "chilled water", "packaged", "air cooled"],
      size: ["ton", "btu", "btuh", "kw"]
    },
    confidence: 0.9
  },
  {
    assetType: "Chiller",
    patterns: {
      manufacturer: ["carrier", "trane", "york", "daikin", "mitsubishi", "lennox"],
      model: ["chiller", "chill", "cooling"],
      keywords: ["chiller", "chilled water", "centrifugal", "screw"],
      size: ["ton", "btu", "btuh", "kw"]
    },
    confidence: 0.8
  },
  
  // Heat Pumps
  {
    assetType: "Packaged Heat Pump-AC (All)",
    patterns: {
      manufacturer: ["carrier", "trane", "york", "daikin", "mitsubishi", "lennox"],
      model: ["heat pump", "hspf", "seer", "packaged"],
      keywords: ["heat pump", "hspf", "seer", "heating and cooling", "packaged"],
      size: ["ton", "btu", "btuh"]
    },
    confidence: 0.9
  },
  {
    assetType: "Heat Pump",
    patterns: {
      manufacturer: ["carrier", "trane", "york", "daikin", "mitsubishi", "lennox"],
      model: ["heat pump", "hspf", "seer"],
      keywords: ["heat pump", "hspf", "seer", "heating and cooling"],
      size: ["ton", "btu", "btuh"]
    },
    confidence: 0.8
  },
  
  // Fan Coils
  {
    assetType: "Fan-Coil",
    patterns: {
      manufacturer: ["carrier", "trane", "york", "daikin", "mitsubishi"],
      model: ["fan coil", "fc", "coil"],
      keywords: ["fan coil", "fan-coil", "fc", "coil unit"],
      size: ["cfm", "btu", "btuh"]
    },
    confidence: 0.9
  },
  {
    assetType: "Fan Coil",
    patterns: {
      manufacturer: ["carrier", "trane", "york", "daikin", "mitsubishi"],
      model: ["fan coil", "fc", "coil"],
      keywords: ["fan coil", "fan-coil", "fc", "coil unit"],
      size: ["cfm", "btu", "btuh"]
    },
    confidence: 0.8
  },
  
  // VAV Boxes
  {
    assetType: "VAV",
    patterns: {
      manufacturer: ["price", "titus", "barcol air", "krueger", "nailor"],
      model: ["vav", "variable air volume"],
      keywords: ["vav", "variable air volume", "volume box"],
      size: ["cfm", "cubic feet per minute"]
    },
    confidence: 0.9
  },
  {
    assetType: "VAV- Fan Powered",
    patterns: {
      manufacturer: ["price", "titus", "barcol air", "krueger", "nailor"],
      model: ["vav", "variable air volume", "fan powered"],
      keywords: ["vav", "variable air volume", "volume box", "fan powered"],
      size: ["cfm", "cubic feet per minute"]
    },
    confidence: 0.9
  },
  
  // Pumps
  {
    assetType: "Pump",
    patterns: {
      manufacturer: ["grundfos", "armstrong", "bell & gossett", "taco", "wilson"],
      model: ["pump", "circulator", "centrifugal"],
      keywords: ["pump", "circulator", "centrifugal", "water pump"],
      size: ["gpm", "gallons per minute", "hp", "horsepower"]
    },
    confidence: 0.9
  },
  {
    assetType: "Pump (Sewage and Sump)",
    patterns: {
      manufacturer: ["grundfos", "armstrong", "bell & gossett", "taco", "wilson"],
      model: ["pump", "sewage", "sump"],
      keywords: ["pump", "sewage", "sump", "wastewater"],
      size: ["gpm", "gallons per minute", "hp", "horsepower"]
    },
    confidence: 0.9
  },
  
  // Cooling Towers
  {
    assetType: "Cooling Tower",
    patterns: {
      manufacturer: ["baltimore aircoil", "evapco", "bac", "marley"],
      model: ["cooling tower", "tower", "evaporative"],
      keywords: ["cooling tower", "evaporative", "tower", "condenser"],
      size: ["ton", "btu", "btuh", "gpm"]
    },
    confidence: 0.9
  },
  
  // Unit Heaters
  {
    assetType: "Unit Heater (Gas)",
    patterns: {
      manufacturer: ["reznor", "modine", "berkeley", "sterling", "york"],
      model: ["unit heater", "heater", "gas heater"],
      keywords: ["unit heater", "gas heater", "reznor", "modine", "gas fired"],
      size: ["btu", "btuh", "mbh"]
    },
    confidence: 0.9
  },
  {
    assetType: "Unit Heater (Electric)",
    patterns: {
      manufacturer: ["reznor", "modine", "berkeley", "sterling", "york"],
      model: ["unit heater", "heater", "electric heater"],
      keywords: ["unit heater", "electric heater", "electric fired"],
      size: ["btu", "btuh", "mbh", "kw"]
    },
    confidence: 0.9
  },
  {
    assetType: "Unit Heater",
    patterns: {
      manufacturer: ["reznor", "modine", "berkeley", "sterling", "york"],
      model: ["unit heater", "heater", "gas heater"],
      keywords: ["unit heater", "gas heater", "reznor", "modine"],
      size: ["btu", "btuh", "mbh"]
    },
    confidence: 0.8
  },
  
  // Fans
  {
    assetType: "Fan- Major (Larger Stand Alone)",
    patterns: {
      manufacturer: ["greenheck", "loren cook", "twin city fan", "howden"],
      model: ["fan", "blower", "exhaust", "major"],
      keywords: ["fan", "blower", "exhaust fan", "supply fan", "major fan"],
      size: ["cfm", "cubic feet per minute", "rpm"]
    },
    confidence: 0.9
  },
  {
    assetType: "Fan- Minor (Other)",
    patterns: {
      manufacturer: ["greenheck", "loren cook", "twin city fan", "howden"],
      model: ["fan", "blower", "exhaust", "minor"],
      keywords: ["fan", "blower", "exhaust fan", "supply fan", "minor fan"],
      size: ["cfm", "cubic feet per minute", "rpm"]
    },
    confidence: 0.9
  },
  {
    assetType: "Fan",
    patterns: {
      manufacturer: ["greenheck", "loren cook", "twin city fan", "howden"],
      model: ["fan", "blower", "exhaust"],
      keywords: ["fan", "blower", "exhaust fan", "supply fan"],
      size: ["cfm", "cubic feet per minute", "rpm"]
    },
    confidence: 0.75
  },
  
  // VFDs
  {
    assetType: "Variable Frequency-Speed Drive (VFD)",
    patterns: {
      manufacturer: ["abb", "schneider", "siemens", "danfoss", "yaskawa"],
      model: ["vfd", "variable frequency", "inverter", "drive"],
      keywords: ["vfd", "variable frequency drive", "inverter", "drive"],
      size: ["hp", "horsepower", "kw", "kilowatt"]
    },
    confidence: 0.9
  },
  {
    assetType: "VFD",
    patterns: {
      manufacturer: ["abb", "schneider", "siemens", "danfoss", "yaskawa"],
      model: ["vfd", "variable frequency", "inverter", "drive"],
      keywords: ["vfd", "variable frequency drive", "inverter", "drive"],
      size: ["hp", "horsepower", "kw", "kilowatt"]
    },
    confidence: 0.8
  },
  
  // Air Compressors
  {
    assetType: "Air Compressor",
    patterns: {
      manufacturer: ["ingersoll rand", "atlas copco", "kaeser", "quincy"],
      model: ["compressor", "air compressor"],
      keywords: ["air compressor", "compressor", "pneumatic"],
      size: ["cfm", "cubic feet per minute", "hp", "horsepower"]
    },
    confidence: 0.9
  },
  {
    assetType: "Air Compressed (Dryer)",
    patterns: {
      manufacturer: ["ingersoll rand", "atlas copco", "kaeser", "quincy"],
      model: ["dryer", "air dryer", "compressed air dryer"],
      keywords: ["air dryer", "compressed air dryer", "dryer"],
      size: ["cfm", "cubic feet per minute", "hp", "horsepower"]
    },
    confidence: 0.9
  },

  // Controls
  {
    assetType: "Controls",
    patterns: {
      manufacturer: ["honeywell", "johnson controls", "siemens", "schneider"],
      model: ["controls", "controller", "thermostat", "dcc"],
      keywords: ["controls", "controller", "thermostat", "dcc", "building automation"],
      size: ["points", "inputs", "outputs"]
    },
    confidence: 0.8
  },

  // Domestic Hot Water
  {
    assetType: "Domestic Hot Water Heater (Tank)",
    patterns: {
      manufacturer: ["rheem", "a.o. smith", "bradford white", "ruud"],
      model: ["water heater", "dhw", "tank"],
      keywords: ["water heater", "domestic hot water", "dhw", "tank"],
      size: ["gallons", "btu", "btuh"]
    },
    confidence: 0.9
  },
  {
    assetType: "Domestic Hot Water Heater (Tankless)",
    patterns: {
      manufacturer: ["rheem", "a.o. smith", "bradford white", "ruud"],
      model: ["water heater", "dhw", "tankless"],
      keywords: ["water heater", "domestic hot water", "dhw", "tankless"],
      size: ["gallons", "btu", "btuh"]
    },
    confidence: 0.9
  },

  // Electrical Equipment
  {
    assetType: "Electrical- Generator",
    patterns: {
      manufacturer: ["caterpillar", "kohler", "generac", "cummins"],
      model: ["generator", "gen", "genset"],
      keywords: ["generator", "genset", "backup power", "emergency power"],
      size: ["kw", "kilowatt", "hp", "horsepower"]
    },
    confidence: 0.9
  },
  {
    assetType: "Electrical- Distribution Panel",
    patterns: {
      manufacturer: ["square d", "siemens", "eaton", "schneider"],
      model: ["panel", "distribution", "electrical panel"],
      keywords: ["panel", "distribution panel", "electrical panel", "breaker panel"],
      size: ["amps", "amperes", "volts"]
    },
    confidence: 0.8
  },

  // Refrigeration
  {
    assetType: "Refrigerator or Freezer",
    patterns: {
      manufacturer: ["true", "hobart", "traulsen", "beverage air"],
      model: ["refrigerator", "freezer", "walk-in"],
      keywords: ["refrigerator", "freezer", "walk-in", "cold storage"],
      size: ["cubic feet", "cu ft", "gallons"]
    },
    confidence: 0.9
  },
  {
    assetType: "Ice Machine",
    patterns: {
      manufacturer: ["hoshizaki", "manitowoc", "scotsman", "ice-o-matic"],
      model: ["ice machine", "ice maker", "ice"],
      keywords: ["ice machine", "ice maker", "ice", "ice production"],
      size: ["lbs", "pounds", "kg", "kilograms"]
    },
    confidence: 0.9
  }
];

/**
 * Detects the most likely asset type based on extracted equipment data
 * @param equipmentData - The extracted equipment data
 * @returns Object with suggested asset type and confidence score
 */
export function detectAssetType(equipmentData: EquipmentData): {
  suggestedType: string | null;
  confidence: number;
  alternatives: Array<{ type: string; confidence: number }>;
} {
  if (!equipmentData) {
    return { suggestedType: null, confidence: 0, alternatives: [] };
  }

  const manufacturer = (equipmentData.manufacturer || '').toLowerCase();
  const model = (equipmentData.model || '').toLowerCase();
  const size = (equipmentData.size || '').toLowerCase();
  const notes = (equipmentData.notes || '').toLowerCase();
  const allText = `${manufacturer} ${model} ${size} ${notes}`.toLowerCase();

  const scores: Array<{ type: string; confidence: number }> = [];

  EQUIPMENT_PATTERNS.forEach(pattern => {
    let score = 0;
    let matches = 0;

    // Check manufacturer patterns
    if (pattern.patterns.manufacturer) {
      const manufacturerMatch = pattern.patterns.manufacturer.some(p => 
        manufacturer.includes(p)
      );
      if (manufacturerMatch) {
        score += 0.3;
        matches++;
      }
    }

    // Check model patterns
    if (pattern.patterns.model) {
      const modelMatch = pattern.patterns.model.some(p => 
        model.includes(p)
      );
      if (modelMatch) {
        score += 0.4;
        matches++;
      }
    }

    // Check keyword patterns in all text
    if (pattern.patterns.keywords) {
      const keywordMatch = pattern.patterns.keywords.some(p => 
        allText.includes(p)
      );
      if (keywordMatch) {
        score += 0.3;
        matches++;
      }
    }

    // Check size patterns
    if (pattern.patterns.size) {
      const sizeMatch = pattern.patterns.size.some(p => 
        size.includes(p)
      );
      if (sizeMatch) {
        score += 0.2;
        matches++;
      }
    }

    // Apply base confidence and require at least one match
    if (matches > 0) {
      const finalScore = score * pattern.confidence;
      scores.push({ type: pattern.assetType, confidence: finalScore });
    }
  });

  // Sort by confidence score
  scores.sort((a, b) => b.confidence - a.confidence);

  // Return results
  const suggestedType = scores.length > 0 && scores[0].confidence > 0.3 
    ? scores[0].type 
    : null;

  return {
    suggestedType,
    confidence: scores.length > 0 ? scores[0].confidence : 0,
    alternatives: scores.slice(1, 4) // Top 3 alternatives
  };
}

/**
 * Gets equipment type suggestions with explanations
 * @param equipmentData - The extracted equipment data
 * @returns Array of suggestions with explanations
 */
export function getAssetTypeSuggestions(equipmentData: EquipmentData): Array<{
  type: string;
  confidence: number;
  explanation: string;
}> {
  const detection = detectAssetType(equipmentData);
  const suggestions = [];

  if (detection.suggestedType) {
    suggestions.push({
      type: detection.suggestedType,
      confidence: detection.confidence,
      explanation: `Based on manufacturer "${equipmentData.manufacturer}" and model "${equipmentData.model}"`
    });
  }

  // Add alternatives
  detection.alternatives.forEach(alt => {
    suggestions.push({
      type: alt.type,
      confidence: alt.confidence,
      explanation: `Alternative match with ${Math.round(alt.confidence * 100)}% confidence`
    });
  });

  return suggestions;
}

/**
 * Checks if the detected asset type makes sense with the extracted data
 * @param equipmentData - The extracted equipment data
 * @param suggestedType - The suggested asset type
 * @returns Validation result with warnings
 */
export function validateAssetType(equipmentData: EquipmentData, suggestedType: string): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  // Check for conflicting indicators
  const hasCoolingKeywords = ['cooling', 'ac', 'air conditioning', 'chilled'].some(keyword =>
    `${equipmentData.model} ${equipmentData.notes}`.toLowerCase().includes(keyword)
  );

  const hasHeatingKeywords = ['heating', 'boiler', 'steam', 'hot water'].some(keyword =>
    `${equipmentData.model} ${equipmentData.notes}`.toLowerCase().includes(keyword)
  );

  if (suggestedType === 'Boiler' && hasCoolingKeywords) {
    warnings.push('Equipment has cooling keywords but was detected as boiler');
  }

  if (suggestedType === 'Chiller' && hasHeatingKeywords) {
    warnings.push('Equipment has heating keywords but was detected as chiller');
  }

  return {
    isValid: warnings.length === 0,
    warnings
  };
}
