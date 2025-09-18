'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import EquipmentFormEnhanced from "@/components/EquipmentForm/EquipmentFormEnhanced";
import { EquipmentData } from "@/types/equipment";
import DataTable from "@/components/DataTable/DataTable";
import { useAppContext } from "@/contexts/AppContext";
import { saveAs } from 'file-saver';
import { toast } from "sonner";
import { MasterPMAExport } from "@/components/MasterPMAExport/MasterPMAExport";
import { CustomerValidation } from "@/components/CustomerValidation/CustomerValidation";
import { UnsavedEquipmentDialog } from "@/components/UnsavedEquipmentDialog/UnsavedEquipmentDialog";
import { NewProjectDialog } from "@/components/NewProjectDialog/NewProjectDialog";
import CloudSave from "@/components/CloudSave/CloudSave";
import { getProjectInfo, clearProjectData, saveProjectData } from "@/lib/data-persistence";
import { LoadingIndicator, ImageProcessingOverlay } from "@/components/ui/loading-indicator";

export default function Home() {
  const { setState, ...appState } = useAppContext();
  const [showNewProjectDialog, setShowNewProjectDialog] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      if (selectedFiles.length > 0) {
        // Check if customer is validated
        if (!appState.isCustomerValidated) {
          toast.error('Please enter customer information before uploading images');
          return;
        }

        // Check if there's unsaved equipment data
        if (appState.unsavedEquipment) {
          setState(prev => ({ ...prev, showUnsavedDialog: true }));
          return;
        }

        // Store all files in the queue
        setState((prev) => ({ 
          ...prev, 
          imageQueue: selectedFiles,
          currentImageIndex: 0,
          currentImage: selectedFiles[0],
          processingStatus: { stage: 'uploading', progress: 5, message: `Starting processing of ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}...` }
        }));

        // Process the first image
        await processCurrentImage(selectedFiles[0], 0, selectedFiles.length);
      }
    }
  };

  const processCurrentImage = async (file: File, index: number, total: number) => {
    // Initial upload stage
    setState((prev) => ({ 
      ...prev, 
      currentImage: file,
      processingStatus: { stage: 'uploading', progress: 10, message: `Preparing image ${index + 1} of ${total}...` }
    }));

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async () => {
      const base64Image = reader.result as string;
      
      try {
        // Update to processing stage
        setState((prev) => ({ 
          ...prev, 
          processingStatus: { stage: 'processing', progress: 25, message: `Analyzing nameplate data from image ${index + 1}...` }
        }));

        toast.info(`Extracting data from nameplate ${index + 1} of ${total}...`);
        
        // Simulate progress during API call
        const progressInterval = setInterval(() => {
          setState((prev) => {
            if (prev.processingStatus.stage === 'processing' && prev.processingStatus.progress < 90) {
              return {
                ...prev,
                processingStatus: {
                  ...prev.processingStatus,
                  progress: Math.min(prev.processingStatus.progress + 10, 90),
                  message: `AI is extracting equipment specifications from image ${index + 1}...`
                }
              };
            }
            return prev;
          });
        }, 1000);

        const response = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image }),
        });

        clearInterval(progressInterval);

        if (!response.ok) throw new Error('Extraction failed');

        // Update to near completion
        setState((prev) => ({ 
          ...prev, 
          processingStatus: { stage: 'processing', progress: 95, message: `Finalizing extraction for image ${index + 1}...` }
        }));

        const data: EquipmentData = await response.json();
        
        // Complete the process
        setState((prev) => ({ 
          ...prev, 
          extractedData: { ...prev.extractedData, [index]: data },
          processingStatus: { stage: 'complete', progress: 100, message: `Extraction complete! Image ${index + 1} of ${total}` }
        }));
        
        toast.success(`Extraction complete! Image ${index + 1} of ${total}`);
        
        // Reset to idle after a short delay
        setTimeout(() => {
          setState((prev) => ({ 
            ...prev, 
            processingStatus: { stage: 'idle', progress: 0, message: '' }
          }));
        }, 2000);
        
      } catch (error) {
        console.error(error);
        setState((prev) => ({ 
          ...prev, 
          processingStatus: { stage: 'error', progress: 0, message: `Extraction failed for image ${index + 1}. Please try again.` }
        }));
        toast.error(`Extraction failed for image ${index + 1}. Please try again.`);
        
        // Reset to idle after error
        setTimeout(() => {
          setState((prev) => ({ 
            ...prev, 
            processingStatus: { stage: 'idle', progress: 0, message: '' }
          }));
        }, 3000);
      }
    };
  };

  const handleNextImage = () => {
    if (appState.currentImageIndex < appState.imageQueue.length - 1) {
      // Check if there's unsaved equipment data
      if (appState.unsavedEquipment) {
        setState(prev => ({ ...prev, showUnsavedDialog: true }));
        return;
      }

      const nextIndex = appState.currentImageIndex + 1;
      setState((prev) => ({ ...prev, currentImageIndex: nextIndex }));
      
      // Only process if we don't have data for this image yet
      if (!appState.extractedData[nextIndex]) {
        processCurrentImage(appState.imageQueue[nextIndex], nextIndex, appState.imageQueue.length);
      }
    }
  };

  const handlePreviousImage = () => {
    if (appState.currentImageIndex > 0) {
      // Check if there's unsaved equipment data
      if (appState.unsavedEquipment) {
        setState(prev => ({ ...prev, showUnsavedDialog: true }));
        return;
      }

      const prevIndex = appState.currentImageIndex - 1;
      setState((prev) => ({ ...prev, currentImageIndex: prevIndex }));
      
      // Only process if we don't have data for this image yet
      if (!appState.extractedData[prevIndex]) {
        processCurrentImage(appState.imageQueue[prevIndex], prevIndex, appState.imageQueue.length);
      }
    }
  };

  const handleExport = async () => {
    toast.info("Generating Excel file...");
    const response = await fetch('/api/excel/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        equipmentList: appState.equipmentList,
        customer: appState.customer,
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      saveAs(blob, "HVAC_Equipment_List.xlsx");
      toast.success("Excel file generated successfully!");
    } else {
      toast.error("Failed to generate Excel file.");
    }
  };

  const equipmentColumns = [
    'Qty', 'Asset Type', 'Manufacturer', 'Model', 'Serial Number', 'Size', 'MFG Year', 'Voltage', 'Refrigerant', 'Filter Size', 'Filter Qty', 'MERV', 'Manuals'
  ];

  // Customer validation handler
  const handleCustomerSet = (customer: { name: string; location: string }) => {
    setState(prev => ({
      ...prev,
      customer,
      isCustomerValidated: true
    }));
    setLastSaved(new Date().toLocaleTimeString());
    toast.success(`Project started for ${customer.name} at ${customer.location}`);
  };

  // Update last saved time when equipment list changes
  React.useEffect(() => {
    if (appState.isCustomerValidated && appState.equipmentList.length > 0) {
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [appState.equipmentList, appState.isCustomerValidated]);

  // Unsaved equipment dialog handlers
  const handleSaveUnsavedEquipment = () => {
    if (appState.unsavedEquipment) {
      setState(prev => ({
        ...prev,
        equipmentList: [...prev.equipmentList, appState.unsavedEquipment!],
        unsavedEquipment: null,
        showUnsavedDialog: false
      }));
      toast.success('Equipment saved to list');
    }
  };

  const handleDiscardUnsavedEquipment = () => {
    setState(prev => ({
      ...prev,
      unsavedEquipment: null,
      showUnsavedDialog: false
    }));
    toast.info('Unsaved equipment discarded');
  };

  const handleCancelUnsavedDialog = () => {
    setState(prev => ({
      ...prev,
      showUnsavedDialog: false
    }));
  };

  // New Project handlers
  const handleNewProjectClick = () => {
    setShowNewProjectDialog(true);
  };

  const handleConfirmNewProject = () => {
    // Clear all project data
    clearProjectData();
    
    // Reset app state
    setState({
      customer: { name: '', location: '' },
      equipmentList: [],
      currentImage: null,
      imageQueue: [],
      currentImageIndex: 0,
      apiKey: '', // No longer needed
      processingStatus: { stage: 'idle', progress: 0, message: '' },
      extractedData: {},
      isCustomerValidated: false,
      unsavedEquipment: null,
      showUnsavedDialog: false,
    });

    setShowNewProjectDialog(false);
    toast.success('New project started');
  };

  const handleCancelNewProject = () => {
    setShowNewProjectDialog(false);
  };

  // Debug function to check localStorage
  const handleDebugStorage = () => {
    const projectData = localStorage.getItem('hvac-scanner-project-data');
    
    console.log('=== DEBUG: localStorage Contents ===');
    console.log('Project Data:', projectData ? JSON.parse(projectData) : 'None');
    console.log('API Key: Server-side (secure) - Not stored in browser');
    console.log('Current App State:', {
      customer: appState.customer,
      equipmentList: appState.equipmentList,
      isCustomerValidated: appState.isCustomerValidated
    });
    console.log('=====================================');
    
    toast.info('Check console for localStorage debug info');
  };

  // Manual save function
  const handleManualSave = () => {
    if (appState.isCustomerValidated) {
      saveProjectData(appState);
      setLastSaved(new Date().toLocaleTimeString());
      toast.success('Project data saved manually');
    } else {
      toast.error('Please enter customer information first');
    }
  };

  // Check if customer validation is required
  if (!appState.isCustomerValidated) {
    return (
      <CustomerValidation
        customer={appState.customer}
        onCustomerSet={handleCustomerSet}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Unsaved Equipment Dialog */}
      {appState.unsavedEquipment && (
        <UnsavedEquipmentDialog
          equipment={appState.unsavedEquipment}
          isOpen={appState.showUnsavedDialog}
          onSave={handleSaveUnsavedEquipment}
          onDiscard={handleDiscardUnsavedEquipment}
          onCancel={handleCancelUnsavedDialog}
        />
      )}

      {/* New Project Dialog */}
      <NewProjectDialog
        isOpen={showNewProjectDialog}
        projectInfo={getProjectInfo()}
        onConfirm={handleConfirmNewProject}
        onCancel={handleCancelNewProject}
      />
      <header className="p-4 border-b">
        <div className="flex justify-between items-start">
          <div>
            <div>
              <h1 className="text-2xl font-bold">HVAC Equipment Scanner</h1>
              {appState.isCustomerValidated && (
                <div className="text-sm text-gray-600 mt-1">
                  <span className="text-green-600">●</span> Project: {appState.customer.name} - {appState.customer.location}
                  {appState.equipmentList.length > 0 && (
                    <span className="ml-2">({appState.equipmentList.length} equipment items)</span>
                  )}
                  {lastSaved && (
                    <span className="ml-2 text-blue-600">• Last saved: {lastSaved}</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 space-y-2 sm:space-y-0">
              <Input 
                placeholder="Customer Name" 
                className="max-w-xs" 
                value={appState.customer.name}
                onChange={(e) => setState(prev => ({ 
                  ...prev, 
                  customer: { ...prev.customer, name: e.target.value } 
                }))}
              />
              <Input 
                placeholder="Location" 
                className="max-w-xs" 
                value={appState.customer.location}
                onChange={(e) => setState(prev => ({ 
                  ...prev, 
                  customer: { ...prev.customer, location: e.target.value } 
                }))}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-600">
              <span className="text-green-600">✓ AI Processing Ready</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSave}
              className="text-green-600 hover:text-green-800 border-green-300 hover:border-green-500"
            >
              Save Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDebugStorage}
              className="text-blue-600 hover:text-blue-800 border-blue-300 hover:border-blue-500"
            >
              Debug Storage
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewProjectClick}
              className="text-red-600 hover:text-red-800 border-red-300 hover:border-red-500"
            >
              New Project
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 grid md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Image Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload onFileChange={handleFileChange} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                Image Preview
                {appState.imageQueue.length > 0 && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({appState.currentImageIndex + 1} of {appState.imageQueue.length})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appState.currentImage && (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(appState.currentImage)} alt="Preview" className="max-w-full h-auto rounded-lg" />
                  <ImageProcessingOverlay 
                    isProcessing={appState.processingStatus.stage === 'uploading' || appState.processingStatus.stage === 'processing'} 
                    status={appState.processingStatus} 
                  />
                </div>
              )}
              
              {/* Loading Indicator */}
              <div className="mt-4">
                <LoadingIndicator status={appState.processingStatus} />
              </div>
              
              {appState.imageQueue.length > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <Button 
                    variant="outline" 
                    onClick={handlePreviousImage}
                    disabled={appState.currentImageIndex === 0}
                  >
                    ← Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    {appState.currentImageIndex + 1} of {appState.imageQueue.length}
                  </span>
                  <Button 
                    variant="outline" 
                    onClick={handleNextImage}
                    disabled={appState.currentImageIndex === appState.imageQueue.length - 1}
                  >
                    Next →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Extracted Data</CardTitle>
            </CardHeader>
            <CardContent>
              <EquipmentFormEnhanced 
                key={appState.currentImageIndex} // Force re-render when switching images
                data={appState.extractedData[appState.currentImageIndex] || null} 
                onSave={(data) => console.log(data)} 
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="p-4 border-t">
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-bold">Equipment List</h2>
          <div>
            <DataTable columns={equipmentColumns} data={appState.equipmentList} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex space-x-2">
              <Button onClick={handleExport}>Export to Excel</Button>
              <Button variant="secondary">Export to CSV</Button>
            </div>
            <MasterPMAExport 
              equipmentList={appState.equipmentList} 
              disabled={appState.equipmentList.length === 0}
            />
          </div>
          
          {/* Cloud Save Section */}
          <div className="mt-6">
            <CloudSave 
              equipmentList={appState.equipmentList}
              customer={appState.customer}
              photos={appState.imageQueue.map((file, index) => ({
                id: `photo_${index}`,
                name: file.name,
                data: '', // Will be converted to base64 when saving
                equipmentId: appState.extractedData[index]?.id,
                file: file // Pass the actual File object
              }))}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}