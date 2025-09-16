# Smart Asset Type Detection Feature

## Overview
The HVAC Scanner App now includes intelligent asset type detection that automatically suggests the most likely equipment type based on the extracted manufacturer, model, size, and other data from equipment nameplates.

## How It Works

### 🧠 **Intelligent Pattern Matching**
The system uses a sophisticated pattern matching algorithm that analyzes:

1. **Manufacturer Names**: Recognizes major HVAC manufacturers
2. **Model Numbers**: Identifies common model prefixes and suffixes
3. **Keywords**: Searches for equipment-specific terminology
4. **Size Specifications**: Analyzes capacity indicators (tons, CFM, BTU, etc.)

### 📊 **Confidence Scoring**
Each suggestion comes with a confidence score (0-100%) based on:
- Number of matching patterns
- Specificity of matches
- Manufacturer/model combinations
- Equipment-specific indicators

### 🎯 **Supported Equipment Types**
The detector recognizes 15+ equipment types:

| Equipment Type | Key Indicators |
|----------------|----------------|
| **Air Handler** | "AHU", "air handler", "handling unit", CFM ratings |
| **RTU** | "RTU", "roof", "rooftop", ton/BTU ratings |
| **Packaged Unit** | "packaged", "package unit", ton/BTU ratings |
| **Boiler** | "boiler", "steam", "hot water", HP/MBH ratings |
| **Chiller** | "chiller", "chilled water", "centrifugal", ton ratings |
| **Heat Pump** | "heat pump", HSPF/SEER ratings |
| **Fan Coil** | "fan coil", "FC", CFM ratings |
| **VAV** | "VAV", "variable air volume", CFM ratings |
| **Pump** | "pump", "circulator", GPM/HP ratings |
| **Cooling Tower** | "cooling tower", "evaporative", ton ratings |
| **Unit Heater** | "unit heater", "gas heater", BTU ratings |
| **Fan** | "fan", "blower", "exhaust", CFM ratings |
| **VFD** | "VFD", "variable frequency", HP/kW ratings |
| **Air Compressor** | "air compressor", "compressor", CFM/HP ratings |

## User Experience

### 🔄 **Automatic Detection**
- **Auto-suggestion**: When manufacturer/model data is available, the system automatically suggests the most likely asset type
- **High confidence**: If confidence > 50%, the suggestion is auto-selected
- **Multiple options**: Shows top 3 suggestions with confidence scores

### 🎛️ **Manual Control**
- **Auto-Detect Button**: Manual trigger for asset type detection
- **Clickable Suggestions**: Click any suggestion to select it
- **Override Capability**: Users can always manually select or type custom types

### 💡 **Smart Suggestions Display**
When no asset type is selected, the form shows:
- **Blue suggestion box** with top recommendations
- **Confidence percentages** for each suggestion
- **Clickable options** to auto-fill the asset type
- **Explanations** of why each type was suggested

## Example Detection Results

### Carrier AHU-500 (Air Handler)
- **Manufacturer**: "Carrier" → +30% confidence
- **Model**: "AHU-500" → +40% confidence (AHU = Air Handling Unit)
- **Size**: "500 CFM" → +20% confidence (CFM = Air Handler indicator)
- **Result**: "Air Handler" (90% confidence)

### Trane RTU-150 (RTU)
- **Manufacturer**: "Trane" → +30% confidence
- **Model**: "RTU-150" → +40% confidence (RTU = Roof Top Unit)
- **Size**: "15 Ton" → +20% confidence (Ton = HVAC capacity)
- **Result**: "RTU" (90% confidence)

### Cleaver Brooks CB-100 (Boiler)
- **Manufacturer**: "Cleaver Brooks" → +30% confidence (boiler specialist)
- **Model**: "CB-100" → +20% confidence
- **Size**: "100 HP" → +20% confidence (HP = boiler indicator)
- **Notes**: "Gas fired hot water boiler" → +30% confidence
- **Result**: "Boiler" (100% confidence)

## Technical Implementation

### 📁 **Files Added**
- `src/lib/asset-type-detector.ts` - Core detection logic
- `src/lib/asset-type-detector-demo.ts` - Demo and testing
- Enhanced `EquipmentFormEnhanced.tsx` - UI integration

### 🔧 **Key Functions**
- `detectAssetType()` - Main detection function
- `getAssetTypeSuggestions()` - Get suggestions with explanations
- `validateAssetType()` - Validate suggestions against data

### 🎨 **UI Components**
- **Auto-Detect Button**: Manual trigger button
- **Suggestion Box**: Visual suggestions display
- **Confidence Indicators**: Percentage confidence scores
- **Toast Notifications**: Success/info messages

## Benefits

### ✅ **Improved Data Quality**
- Reduces manual data entry errors
- Ensures consistent asset type naming
- Validates against known equipment patterns

### ⚡ **Faster Data Entry**
- Automatic suggestions reduce typing
- One-click selection of suggestions
- Smart defaults based on equipment data

### 🎯 **Better Master PMA Integration**
- Accurate asset type mapping to COINS codes
- Proper equipment feature detection
- Optimized maintenance requirements

### 🔍 **Enhanced User Experience**
- Intelligent assistance without being intrusive
- Clear confidence indicators
- Easy override capabilities

## Future Enhancements

### 🔮 **Planned Improvements**
- **Machine Learning**: Train on more equipment data
- **Database Integration**: Connect to manufacturer databases
- **Image Recognition**: Analyze equipment photos for type detection
- **Custom Patterns**: Allow users to add custom detection rules
- **Batch Detection**: Process multiple equipment items at once

### 📈 **Expansion Opportunities**
- **More Equipment Types**: Add specialized equipment categories
- **Regional Patterns**: Account for regional naming conventions
- **Historical Learning**: Learn from user corrections
- **API Integration**: Connect to equipment specification databases

## Usage Instructions

1. **Upload Equipment Image**: Use the image upload feature
2. **Extract Data**: Let the OCR extract manufacturer, model, size
3. **View Suggestions**: Asset type suggestions appear automatically
4. **Select Type**: Click suggestion or use Auto-Detect button
5. **Review & Confirm**: Check Master PMA preview for validation
6. **Save Equipment**: Add to equipment list with correct type

The asset type detection feature significantly improves the user experience and data quality, making the HVAC equipment scanning process more efficient and accurate.
