export interface ManualLink {
  title: string;
  url: string;
  description: string;
  source: string;
}

export interface EquipmentData {
  qty?: number;
  assetType?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  size?: string;
  mfgYear?: string;
  location?: string;
  notes?: string;
  filterSize?: string;
  filterType?: string;
  filterMerv?: string;
  filterQuantity?: string;
  voltage?: string;
  refrigerant?: string;
  maintenanceInterval?: string;
  manualLinks?: ManualLink[];
}

export interface Customer {
  name: string;
  location: string;
}
