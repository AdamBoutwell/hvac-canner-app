'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EquipmentData } from '@/types/equipment';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { ExternalLink, Search, BookOpen, Info, CheckCircle, XCircle, Settings } from 'lucide-react';
import { getAvailableEquipmentTypes, getEquipmentFeatures, convertToMasterPMA, EQUIPMENT_CODES } from '@/lib/master-pma-converter';
import { convertEquipmentToScannerData } from '@/lib/data-converter';
import { ValidationHints } from './ValidationHints';
import { getAssetTypeSuggestions } from '@/lib/asset-type-detector';
import { DuplicateDetectionDialog } from '@/components/DuplicateDetectionDialog/DuplicateDetectionDialog';
import { checkForDuplicates, DuplicateCheckResult } from '@/lib/duplicate-detection';

interface EquipmentFormEnhancedProps {
  data: EquipmentData | null;
  onSave: (data: EquipmentData) => void;
}

export default function EquipmentFormEnhanced({ data, onSave }: EquipmentFormEnhancedProps) {
  const { setState, equipmentList } = useAppContext();
  const [formData, setFormData] = useState<EquipmentData>({
    qty: 1,
    assetType: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    size: '',
    mfgYear: '',
    location: '',
    notes: '',
    filterSize: '',
    filterType: '',
    filterMerv: '',
    filterQuantity: '',
    voltage: '',
    refrigerant: '',
    maintenanceInterval: '',
    manualLinks: [],
  });
  const [isSearchingManuals, setIsSearchingManuals] = useState(false);
  const [showMasterPMAPreview, setShowMasterPMAPreview] = useState(false);
  const [assetTypeSuggestions, setAssetTypeSuggestions] = useState<Array<{
    type: string;
    confidence: number;
    explanation: string;
  }>>([]);
  const [currentAssetTypeConfidence, setCurrentAssetTypeConfidence] = useState<number>(0);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateCheckResult, setDuplicateCheckResult] = useState<DuplicateCheckResult | null>(null);

  const availableEquipmentTypes = getAvailableEquipmentTypes();

  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
    }
  }, [data]);

  // Detect asset type when manufacturer, model, or size changes
  useEffect(() => {
    if (formData.manufacturer || formData.model || formData.size) {
      const suggestions = getAssetTypeSuggestions(formData);
      setAssetTypeSuggestions(suggestions);
      
      // Track confidence of currently selected asset type
      if (formData.assetType) {
        const currentSuggestion = suggestions.find(s => s.type === formData.assetType);
        setCurrentAssetTypeConfidence(currentSuggestion ? currentSuggestion.confidence : 0);
      } else {
        setCurrentAssetTypeConfidence(0);
      }
      
      // Auto-suggest the highest confidence type if none is selected
      if (!formData.assetType && suggestions.length > 0 && suggestions[0].confidence > 0.5) {
        setFormData(prev => ({ ...prev, assetType: suggestions[0].type }));
        setCurrentAssetTypeConfidence(suggestions[0].confidence);
      }
    } else {
      setAssetTypeSuggestions([]);
      setCurrentAssetTypeConfidence(0);
    }
  }, [formData.manufacturer, formData.model, formData.size, formData.assetType]);

  // Track unsaved equipment data
  useEffect(() => {
    const hasData = formData.manufacturer || formData.model || formData.assetType || 
                   formData.serialNumber || formData.size || formData.notes;
    
    if (hasData) {
      setState(prev => ({ ...prev, unsavedEquipment: formData }));
    } else {
      setState(prev => ({ ...prev, unsavedEquipment: null }));
    }
  }, [formData, setState]);

  const handleInputChange = (field: keyof EquipmentData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearchManuals = async () => {
    if (!formData.manufacturer || !formData.model) {
      toast.error('Please enter manufacturer and model to search for manuals.');
      return;
    }

    setIsSearchingManuals(true);
    toast.info('Searching for equipment manuals...');

    try {
      const response = await fetch('/api/search-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manufacturer: formData.manufacturer,
          model: formData.model,
          serialNumber: formData.serialNumber,
        }),
      });

      if (!response.ok) throw new Error('Manual search failed');

      const result = await response.json();
      
      setFormData(prev => ({
        ...prev,
        manualLinks: result.manualLinks || [],
      }));

      if (result.manualLinks && result.manualLinks.length > 0) {
        toast.success(`Found ${result.manualLinks.length} manual(s) for ${formData.manufacturer} ${formData.model}`);
      } else {
        toast.warning('No manuals found. Try different search terms or check manufacturer website.');
      }
    } catch (error) {
      console.error('Manual search error:', error);
      toast.error('Failed to search for manuals. Please try again.');
    } finally {
      setIsSearchingManuals(false);
    }
  };

  const handleSave = () => {
    if (!formData.manufacturer || !formData.model || !formData.assetType) {
      toast.error('Please fill in Asset Type, Manufacturer, and Model fields.');
      return;
    }

    const newEquipment = { ...formData };
    
    // Check for duplicates
    const duplicateResult = checkForDuplicates(newEquipment, equipmentList);
    
    if (duplicateResult.isDuplicate) {
      setDuplicateCheckResult(duplicateResult);
      setShowDuplicateDialog(true);
      return;
    }

    // No duplicates found, proceed with saving
    saveEquipment(newEquipment);
  };

  const saveEquipment = (equipment: EquipmentData) => {
    setState(prev => ({
      ...prev,
      equipmentList: [...prev.equipmentList, equipment],
      unsavedEquipment: null, // Clear any unsaved equipment
    }));

    onSave(equipment);
    toast.success('Equipment added to list!');

    // Reset form
    setFormData({
      qty: 1,
      assetType: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      size: '',
      mfgYear: '',
      location: '',
      notes: '',
      filterSize: '',
      filterType: '',
      filterMerv: '',
      filterQuantity: '',
      voltage: '',
      refrigerant: '',
      maintenanceInterval: '',
      manualLinks: [],
    });
    setShowMasterPMAPreview(false);
  };

  const handleConfirmDuplicate = () => {
    if (duplicateCheckResult) {
      const newEquipment = { ...formData };
      saveEquipment(newEquipment);
      toast.success('Duplicate equipment added to list!');
    }
    setShowDuplicateDialog(false);
    setDuplicateCheckResult(null);
  };

  const handleCancelDuplicate = () => {
    setShowDuplicateDialog(false);
    setDuplicateCheckResult(null);
  };

  const getEquipmentFeaturesDisplay = () => {
    if (!formData.assetType) return null;
    
    const features = getEquipmentFeatures(formData.assetType);
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {features.hasFilters && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            <CheckCircle className="h-3 w-3" />
            Has Filters
          </span>
        )}
        {features.needsCoilCleaning && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            <CheckCircle className="h-3 w-3" />
            Coil Cleaning
          </span>
        )}
        {features.hasBelts && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            <CheckCircle className="h-3 w-3" />
            Has Belts
          </span>
        )}
        {!features.hasFilters && !features.needsCoilCleaning && !features.hasBelts && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            <XCircle className="h-3 w-3" />
            No Special Features
          </span>
        )}
      </div>
    );
  };

  const getMasterPMAPreview = () => {
    if (!formData.assetType || !formData.manufacturer || !formData.model) {
      return null;
    }

    try {
      const scannerData = convertEquipmentToScannerData(formData);
      const masterPMAData = convertToMasterPMA(scannerData);
      
      return (
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Master PMA Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium">COINS Code:</span>
                <div className="text-gray-600 break-words">{masterPMAData["Asset Type & Description (COINS)"]}</div>
                <div className="text-green-600 text-xs mt-1">✓ Already selected in Asset Type</div>
              </div>
              <div>
                <span className="font-medium">Filter Change:</span>
                <span className={`ml-1 ${masterPMAData["FILTER CHANGE"] === 'Y' ? 'text-green-600' : 'text-gray-500'}`}>
                  {masterPMAData["FILTER CHANGE"]}
                </span>
              </div>
              <div>
                <span className="font-medium">Coil Clean:</span>
                <span className={`ml-1 ${masterPMAData["COIL CLEAN"] === 'Y' ? 'text-green-600' : 'text-gray-500'}`}>
                  {masterPMAData["COIL CLEAN"]}
                </span>
              </div>
              <div>
                <span className="font-medium">Belt Size:</span>
                <span className="ml-1 text-gray-600">{masterPMAData["Belt Size"] || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    } catch {
      return (
        <Card className="mt-4">
          <CardContent className="pt-4">
            <div className="text-sm text-gray-500">
              Complete required fields to see Master PMA preview
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Equipment Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Basic Equipment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Quantity *</label>
              <Input
                type="number"
                value={formData.qty || ''}
                onChange={(e) => handleInputChange('qty', parseInt(e.target.value) || 1)}
                min="1"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Asset Type *</label>
              <select
                value={formData.assetType || ''}
                onChange={(e) => handleInputChange('assetType', e.target.value)}
                className={`w-full mt-1 p-2 border rounded-md bg-white ${
                  formData.assetType && currentAssetTypeConfidence < 0.7 
                    ? 'bg-yellow-50 border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500' 
                    : ''
                }`}
              >
                <option value="">Select Equipment Type (COINS Code)</option>
                {availableEquipmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {EQUIPMENT_CODES[type]} - {type}
                  </option>
                ))}
                <option value="Other">Other (Custom)</option>
              </select>
              {(formData.manufacturer || formData.model) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const suggestions = getAssetTypeSuggestions(formData);
                    if (suggestions.length > 0) {
                      setFormData(prev => ({ ...prev, assetType: suggestions[0].type }));
                      setCurrentAssetTypeConfidence(suggestions[0].confidence);
                      toast.success(`Detected: ${suggestions[0].type} (${Math.round(suggestions[0].confidence * 100)}% confidence)`);
                    } else {
                      toast.info('No asset type could be detected from the current data');
                    }
                  }}
                  className="mt-2 text-xs"
                >
                  Auto-Detect
                </Button>
              )}
              {formData.assetType === 'Other' && (
                <Input
                  placeholder="Enter custom equipment type"
                  className="mt-2"
                  onChange={(e) => handleInputChange('assetType', e.target.value)}
                />
              )}
              {getEquipmentFeaturesDisplay()}
              
              {/* Confidence Indicator */}
              {formData.assetType && currentAssetTypeConfidence < 0.7 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm text-yellow-800">
                      Low confidence detection ({Math.round(currentAssetTypeConfidence * 100)}%) - Please verify this equipment type is correct
                    </span>
                  </div>
                </div>
              )}
              
              {/* Asset Type Suggestions */}
              {assetTypeSuggestions.length > 0 && !formData.assetType && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-800 mb-2">Suggested Asset Types:</p>
                      <div className="space-y-2">
                        {assetTypeSuggestions.slice(0, 3).map((suggestion, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <button
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, assetType: suggestion.type }));
                                  setCurrentAssetTypeConfidence(suggestion.confidence);
                                }}
                                className="text-blue-700 hover:text-blue-900 font-medium underline"
                              >
                                {EQUIPMENT_CODES[suggestion.type]} - {suggestion.type}
                              </button>
                              <span className="ml-2 text-blue-600">
                                ({Math.round(suggestion.confidence * 100)}% confidence)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        Click on a suggestion to auto-fill the asset type
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Manufacturer *</label>
              <Input
                value={formData.manufacturer || ''}
                onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                placeholder="e.g., Carrier, Trane, York"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Model *</label>
              <Input
                value={formData.model || ''}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="Model number"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Serial Number</label>
              <Input
                value={formData.serialNumber || ''}
                onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                placeholder="Serial number"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Size</label>
              <Input
                value={formData.size || ''}
                onChange={(e) => handleInputChange('size', e.target.value)}
                placeholder="e.g., 5 ton, 24000 BTU, 500 CFM"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Manufacturing Year</label>
              <Input
                value={formData.mfgYear || ''}
                onChange={(e) => handleInputChange('mfgYear', e.target.value)}
                placeholder="e.g., 2020"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Rooftop, Basement, Floor 1"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Hints */}
      <ValidationHints 
        assetType={formData.assetType || ''} 
      />

      {/* Electrical & Refrigerant Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Electrical & Refrigerant Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Voltage</label>
              <Input
                value={formData.voltage || ''}
                onChange={(e) => handleInputChange('voltage', e.target.value)}
                placeholder="e.g., 208V/3Ph, 460V/3Ph"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Refrigerant</label>
              <Input
                value={formData.refrigerant || ''}
                onChange={(e) => handleInputChange('refrigerant', e.target.value)}
                placeholder="e.g., R-410A, R-407C, N/A"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Information */}
      {formData.assetType && ['Air Handler', 'RTU', 'Packaged Unit', 'Fan Coil', 'VAV'].includes(formData.assetType) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="h-4 w-4" />
              Filter Information
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Required for {formData.assetType}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Filter Size</label>
                <Input
                  value={formData.filterSize || ''}
                  onChange={(e) => handleInputChange('filterSize', e.target.value)}
                  placeholder="e.g., 16x20x2"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Filter Type</label>
                <Input
                  value={formData.filterType || ''}
                  onChange={(e) => handleInputChange('filterType', e.target.value)}
                  placeholder="e.g., Pleated, Fiberglass"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">MERV Rating</label>
                <Input
                  value={formData.filterMerv || ''}
                  onChange={(e) => handleInputChange('filterMerv', e.target.value)}
                  placeholder="e.g., MERV 8"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Filter Quantity</label>
                <Input
                  value={formData.filterQuantity || ''}
                  onChange={(e) => handleInputChange('filterQuantity', e.target.value)}
                  placeholder="e.g., 2, 4"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Maintenance Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Maintenance Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Maintenance Interval</label>
            <Input
              value={formData.maintenanceInterval || ''}
              onChange={(e) => handleInputChange('maintenanceInterval', e.target.value)}
              placeholder="e.g., Every 3 months, Annually"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Notes</label>
            <textarea
              className="w-full p-2 border rounded-md resize-none mt-1"
              rows={3}
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes, specifications, and maintenance information"
            />
          </div>
        </CardContent>
      </Card>

      {/* Master PMA Preview */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMasterPMAPreview(!showMasterPMAPreview)}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          {showMasterPMAPreview ? 'Hide' : 'Show'} Master PMA Preview
        </Button>
      </div>

      {showMasterPMAPreview && getMasterPMAPreview()}

      {/* Manual Search Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Equipment Manuals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">
              Search for equipment documentation and manuals
            </p>
            <Button
              onClick={handleSearchManuals}
              disabled={isSearchingManuals || !formData.manufacturer || !formData.model}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              {isSearchingManuals ? 'Searching...' : 'Search Manuals'}
            </Button>
          </div>

          {formData.manualLinks && formData.manualLinks.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-2">
                Found {formData.manualLinks.length} manual(s) for {formData.manufacturer} {formData.model}:
              </p>
              {formData.manualLinks.map((link, index) => (
                <div key={index} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{link.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{link.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Source: {link.source}</p>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 p-1 text-blue-600 hover:text-blue-800"
                      title="Open manual in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              Enter manufacturer and model above, then click &quot;Search Manuals&quot; to find equipment documentation.
            </p>
          )}
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg">
        Add Equipment to List
      </Button>

      {/* Duplicate Detection Dialog */}
      {duplicateCheckResult && (
        <DuplicateDetectionDialog
          isOpen={showDuplicateDialog}
          newEquipment={formData}
          existingEquipment={duplicateCheckResult.existingEquipment!}
          onConfirmDuplicate={handleConfirmDuplicate}
          onCancel={handleCancelDuplicate}
        />
      )}
    </div>
  );
}
