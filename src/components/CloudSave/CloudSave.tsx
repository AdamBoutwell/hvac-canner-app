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
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

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

  const handleAdminPanelClick = () => {
    if (!isAuthenticated) {
      setShowPasswordPrompt(true);
      return;
    }
    setShowAdminPanel(!showAdminPanel);
  };

  const handlePasswordSubmit = () => {
    if (adminPassword === 'admin123') {
      setIsAuthenticated(true);
      setShowPasswordPrompt(false);
      setShowAdminPanel(true);
      toast.success('Admin access granted');
    } else {
      toast.error('Invalid password');
      setAdminPassword('');
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
              onClick={handleAdminPanelClick}
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
                    <div key={project.id} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1" onClick={() => setSelectedProject(project)}>
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

      {/* Password Prompt Dialog */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-center">Admin Access Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Enter Admin Password</label>
                <Input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter password"
                  className="mt-1"
                  onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handlePasswordSubmit}
                  className="flex-1"
                  disabled={!adminPassword.trim()}
                >
                  Access Admin Panel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordPrompt(false);
                    setAdminPassword('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{selectedProject.projectName}</CardTitle>
              <Button
                variant="outline"
                onClick={() => setSelectedProject(null)}
              >
                Close
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {selectedProject.customer?.name || 'N/A'}</div>
                  <div><strong>Location:</strong> {selectedProject.customer?.location || 'N/A'}</div>
                  <div><strong>Contact:</strong> {selectedProject.customer?.contact || 'N/A'}</div>
                  <div><strong>Phone:</strong> {selectedProject.customer?.phone || 'N/A'}</div>
                  <div><strong>Email:</strong> {selectedProject.customer?.email || 'N/A'}</div>
                </div>
              </div>

              {/* Equipment List */}
              <div>
                <h4 className="font-semibold mb-2">Equipment List ({selectedProject.totalEquipment || 0} items)</h4>
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Qty</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Manufacturer</th>
                        <th className="text-left p-2">Model</th>
                        <th className="text-left p-2">Serial</th>
                        <th className="text-left p-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProject.equipmentList?.map((equipment: any, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{equipment.qty || 1}</td>
                          <td className="p-2">{equipment.assetType || 'N/A'}</td>
                          <td className="p-2">{equipment.manufacturer || 'N/A'}</td>
                          <td className="p-2">{equipment.model || 'N/A'}</td>
                          <td className="p-2">{equipment.serialNumber || 'N/A'}</td>
                          <td className="p-2 text-xs max-w-xs truncate">{equipment.notes || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Photos */}
              {selectedProject.photoUrls && selectedProject.photoUrls.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Photos ({selectedProject.photoCount || 0})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedProject.photoUrls.map((url: string, index: number) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Project photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
