'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EquipmentData } from '@/types/equipment';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { ExternalLink, Search, BookOpen } from 'lucide-react';

interface EquipmentFormProps {
  data: EquipmentData | null;
  onSave: (data: EquipmentData) => void;
}

export default function EquipmentForm({ data, onSave }: EquipmentFormProps) {
  const { setState } = useAppContext();
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

  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
    }
  }, [data]);

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
    if (!formData.manufacturer || !formData.model) {
      toast.error('Please fill in at least Manufacturer and Model fields.');
      return;
    }

    const newEquipment = { ...formData };
    setState(prev => ({
      ...prev,
      equipmentList: [...prev.equipmentList, newEquipment],
    }));

    onSave(newEquipment);
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
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Quantity</label>
          <Input
            type="number"
            value={formData.qty || ''}
            onChange={(e) => handleInputChange('qty', parseInt(e.target.value) || 1)}
            min="1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Asset Type</label>
          <Input
            value={formData.assetType || ''}
            onChange={(e) => handleInputChange('assetType', e.target.value)}
            placeholder="e.g., Air Handler, Condenser"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Manufacturer</label>
          <Input
            value={formData.manufacturer || ''}
            onChange={(e) => handleInputChange('manufacturer', e.target.value)}
            placeholder="e.g., Carrier, Trane"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Model</label>
          <Input
            value={formData.model || ''}
            onChange={(e) => handleInputChange('model', e.target.value)}
            placeholder="Model number"
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
          />
        </div>
        <div>
          <label className="text-sm font-medium">Size</label>
          <Input
            value={formData.size || ''}
            onChange={(e) => handleInputChange('size', e.target.value)}
            placeholder="e.g., 5 ton, 24000 BTU"
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
          />
        </div>
        <div>
          <label className="text-sm font-medium">Location</label>
          <Input
            value={formData.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., Rooftop, Basement"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Voltage</label>
          <Input
            value={formData.voltage || ''}
            onChange={(e) => handleInputChange('voltage', e.target.value)}
            placeholder="e.g., 208V, 240V"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Refrigerant</label>
          <Input
            value={formData.refrigerant || ''}
            onChange={(e) => handleInputChange('refrigerant', e.target.value)}
            placeholder="e.g., R-410A, R-407C"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium">Filter Size</label>
          <Input
            value={formData.filterSize || ''}
            onChange={(e) => handleInputChange('filterSize', e.target.value)}
            placeholder="e.g., 16x20x1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Filter Type</label>
          <Input
            value={formData.filterType || ''}
            onChange={(e) => handleInputChange('filterType', e.target.value)}
            placeholder="e.g., Pleated, Fiberglass"
          />
        </div>
        <div>
          <label className="text-sm font-medium">MERV Rating</label>
          <Input
            value={formData.filterMerv || ''}
            onChange={(e) => handleInputChange('filterMerv', e.target.value)}
            placeholder="e.g., MERV 8, MERV 11"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Filter Quantity</label>
          <Input
            value={formData.filterQuantity || ''}
            onChange={(e) => handleInputChange('filterQuantity', e.target.value)}
            placeholder="e.g., 2 filters, 4 filters"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Maintenance Interval</label>
        <Input
          value={formData.maintenanceInterval || ''}
          onChange={(e) => handleInputChange('maintenanceInterval', e.target.value)}
          placeholder="e.g., Every 3 months, Annually"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Notes</label>
        <textarea
          className="w-full p-2 border rounded-md resize-none"
          rows={3}
          value={formData.notes || ''}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Additional notes, specifications, and maintenance information"
        />
      </div>

      {/* Manual Search Section */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Equipment Manuals
          </h3>
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
      </div>

      <Button onClick={handleSave} className="w-full">
        Add Equipment to List
      </Button>
    </div>
  );
}
