'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import { AppState } from '@/types/state';
import { saveProjectData, loadProjectData, loadApiKey } from '@/lib/data-persistence';
import { toast } from 'sonner';

interface AppContextType extends AppState {
  setState: Dispatch<SetStateAction<AppState>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    customer: { name: '', location: '' },
    equipmentList: [],
    currentImage: null,
    imageQueue: [],
    currentImageIndex: 0,
    apiKey: '',
    processingStatus: { stage: 'idle', progress: 0, message: '' },
    extractedData: {}, // Store extracted data per image index
    isCustomerValidated: false, // Customer must be validated before starting
    unsavedEquipment: null, // Track unsaved equipment data
    showUnsavedDialog: false, // Control unsaved equipment dialog
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    console.log('AppContext: Loading saved data from localStorage...');
    
    // Load API key
    const savedApiKey = loadApiKey();
    if (savedApiKey) {
      console.log('AppContext: API key loaded from localStorage');
      setState(prev => ({ ...prev, apiKey: savedApiKey }));
    }

    // Load project data
    const savedProjectData = loadProjectData();
    if (savedProjectData) {
      console.log('AppContext: Project data loaded from localStorage, updating state...');
      setState(prev => ({ ...prev, ...savedProjectData }));
      // Show recovery notification
      setTimeout(() => {
        toast.success(`Project data recovered: ${savedProjectData.customer?.name} - ${savedProjectData.customer?.location}`);
      }, 1000);
    } else {
      console.log('AppContext: No saved project data found');
    }
  }, []);

  // Save API key to localStorage whenever it changes
  useEffect(() => {
    if (state.apiKey) {
      localStorage.setItem('hvac-scanner-api-key', state.apiKey);
    } else {
      localStorage.removeItem('hvac-scanner-api-key');
    }
  }, [state.apiKey]);

  // Save project data to localStorage whenever it changes
  useEffect(() => {
    // Only save if customer is validated (project has started)
    if (state.isCustomerValidated) {
      console.log('AppContext: Saving project data to localStorage...', {
        customer: state.customer,
        equipmentCount: state.equipmentList.length,
        isCustomerValidated: state.isCustomerValidated
      });
      saveProjectData(state);
    }
  }, [state.customer, state.equipmentList, state.isCustomerValidated]);

  return <AppContext.Provider value={{ ...state, setState }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
