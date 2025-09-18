import { EquipmentData, Customer } from './equipment';

export interface ProcessingStatus {
  stage: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  message: string;
}

export interface AppState {
  customer: Customer;
  equipmentList: EquipmentData[];
  currentImage: File | null;
  imageQueue: File[];
  currentImageIndex: number;
  processingStatus: ProcessingStatus;
  extractedData: { [key: number]: EquipmentData }; // Store extracted data per image index
  isCustomerValidated: boolean; // Track if customer info has been entered
  unsavedEquipment: EquipmentData | null; // Track unsaved equipment data
  showUnsavedDialog: boolean; // Control unsaved equipment dialog
}
