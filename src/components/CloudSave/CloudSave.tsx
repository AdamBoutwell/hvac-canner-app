'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { EquipmentData, Customer } from '@/types/equipment';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { Cloud, Save, FolderOpen, Eye } from 'lucide-react';

interface CloudSaveProps {
  equipmentList: EquipmentData[];
  customer: Customer;
  photos: Array<{
    id: string;
    name: string;
    data: string;
    equipmentId?: string;
    file?: File;
  }>;
}

export default function CloudSave({ equipmentList, customer, photos }: CloudSaveProps) {
  const { state } = useAppContext();
  const [projectName, setProjectName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  const handleSaveToCloud = async () => {
    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    if (equipmentList.length === 0) {
      toast.error('No equipment to save');
      return;
    }

    setIsSaving(true);
    toast.info('Saving project to cloud storage...');

    try {
      // Convert photos to base64
      const photosWithData = await Promise.all(
        photos.map(async (photo) => {
          if (photo.data) {
            return photo; // Already has base64 data
          }
          
          // Convert file to base64 if it's a File object
          if (photo.file) {
            return new Promise<typeof photo>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => {
                resolve({
                  id: photo.id,
                  name: photo.name,
                  data: reader.result as string,
                  equipmentId: photo.equipmentId
                });
              };
              reader.readAsDataURL(photo.file);
            });
          }
          
          return photo;
        })
      );

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName: projectName.trim(),
          customer,
          equipmentList,
          photos: photosWithData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save project');
      }

      const result = await response.json();
      
      toast.success(result.message);
      setProjectName(''); // Clear the project name after successful save
      
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project to cloud storage');
    } finally {
      setIsSaving(false);
    }
  };

  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const response = await fetch('/api/projects?adminKey=admin123');
      if (!response.ok) throw new Error('Failed to load projects');
      
      const result = await response.json();
      setProjects(result.projects || []);
      toast.success(`Loaded ${result.projects?.length || 0} projects`);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Save to Cloud Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            Save Project to Cloud Storage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Project Name *</label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., Office Building HVAC Survey, Warehouse Equipment Audit"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              This will create a folder with all equipment data and photos
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Equipment Items:</span>
              <span className="ml-2 text-blue-600">{equipmentList.length}</span>
            </div>
            <div>
              <span className="font-medium">Photos:</span>
              <span className="ml-2 text-green-600">{photos.length}</span>
            </div>
            <div>
              <span className="font-medium">Customer:</span>
              <span className="ml-2 text-gray-600">{customer.name || 'Not specified'}</span>
            </div>
            <div>
              <span className="font-medium">Location:</span>
              <span className="ml-2 text-gray-600">{customer.location || 'Not specified'}</span>
            </div>
          </div>

          <Button 
            onClick={handleSaveToCloud}
            disabled={isSaving || !projectName.trim() || equipmentList.length === 0}
            className="w-full"
            size="lg"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving to Cloud...' : 'Save Project to Cloud'}
          </Button>
        </CardContent>
      </Card>

      {/* Admin Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Admin Panel - View Saved Projects
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className="ml-auto"
            >
              {showAdminPanel ? 'Hide' : 'Show'} Admin Panel
            </Button>
          </CardTitle>
        </CardHeader>
        
        {showAdminPanel && (
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={loadProjects}
                disabled={isLoadingProjects}
                variant="outline"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isLoadingProjects ? 'Loading...' : 'Load All Projects'}
              </Button>
            </div>

            {projects.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Saved Projects ({projects.length})</h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {projects.map((project) => (
                    <div key={project.id} className="p-3 border rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{project.projectName}</h5>
                          <p className="text-xs text-gray-600 mt-1">
                            Customer: {project.customer?.name || 'N/A'} | 
                            Location: {project.customer?.location || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Equipment: {project.totalEquipment || 0} items | 
                            Photos: {project.photoCount || 0} | 
                            Created: {formatDate(project.createdAt)}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400 ml-2">
                          ID: {project.id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
