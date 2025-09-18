import { AppState } from '@/types/state';
import { EquipmentData } from '@/types/equipment';

const STORAGE_KEYS = {
  PROJECT_DATA: 'hvac-scanner-project-data'
};

export interface PersistentProjectData {
  customer: { name: string; location: string };
  equipmentList: EquipmentData[];
  isCustomerValidated: boolean;
  lastSaved: string;
  projectName: string;
}

/**
 * Save project data to localStorage
 */
export function saveProjectData(data: Partial<AppState>): void {
  try {
    const projectData: PersistentProjectData = {
      customer: data.customer || { name: '', location: '' },
      equipmentList: data.equipmentList || [],
      isCustomerValidated: data.isCustomerValidated || false,
      lastSaved: new Date().toISOString(),
      projectName: `${data.customer?.name || 'Unnamed'} - ${data.customer?.location || 'Unknown Location'}`
    };

    localStorage.setItem(STORAGE_KEYS.PROJECT_DATA, JSON.stringify(projectData));
    console.log('Project data saved to localStorage:', {
      customer: projectData.customer,
      equipmentCount: projectData.equipmentList.length,
      isCustomerValidated: projectData.isCustomerValidated,
      lastSaved: projectData.lastSaved
    });
  } catch (error) {
    console.error('Failed to save project data:', error);
  }
}

/**
 * Load project data from localStorage
 */
export function loadProjectData(): Partial<AppState> | null {
  try {
    const savedData = localStorage.getItem(STORAGE_KEYS.PROJECT_DATA);
    if (!savedData) {
      console.log('No saved project data found in localStorage');
      return null;
    }

    const projectData: PersistentProjectData = JSON.parse(savedData);
    console.log('Project data loaded from localStorage:', {
      customer: projectData.customer,
      equipmentCount: projectData.equipmentList.length,
      isCustomerValidated: projectData.isCustomerValidated,
      lastSaved: projectData.lastSaved
    });
    
    return {
      customer: projectData.customer,
      equipmentList: projectData.equipmentList,
      isCustomerValidated: projectData.isCustomerValidated,
      unsavedEquipment: null,
      showUnsavedDialog: false
    };
  } catch (error) {
    console.error('Failed to load project data:', error);
    return null;
  }
}

/**
 * Clear all project data from localStorage
 */
export function clearProjectData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROJECT_DATA);
    console.log('Project data cleared from localStorage');
  } catch (error) {
    console.error('Failed to clear project data:', error);
  }
}

/**
 * Get project info without loading full data
 */
export function getProjectInfo(): { 
  hasProject: boolean; 
  projectName?: string; 
  lastSaved?: string;
  equipmentCount?: number;
} {
  try {
    const savedData = localStorage.getItem(STORAGE_KEYS.PROJECT_DATA);
    if (!savedData) return { hasProject: false };

    const projectData: PersistentProjectData = JSON.parse(savedData);
    
    return {
      hasProject: true,
      projectName: projectData.projectName,
      lastSaved: projectData.lastSaved,
      equipmentCount: projectData.equipmentList.length
    };
  } catch (error) {
    console.error('Failed to get project info:', error);
    return { hasProject: false };
  }
}

