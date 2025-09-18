'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { FolderOpen, Eye, Download, Calendar, User, MapPin, Package, Camera } from 'lucide-react';

interface Project {
  id: string;
  projectName: string;
  customer: {
    name: string;
    location: string;
    contact?: string;
    phone?: string;
    email?: string;
  };
  equipmentList: any[];
  photoUrls?: string[];
  photoCount?: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  totalEquipment: number;
  totalQuantity: number;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const loadProjects = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredProjects = projects.filter(project =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportProjectToExcel = async (project: Project) => {
    try {
      const response = await fetch('/api/excel/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipmentList: project.equipmentList,
          customer: project.customer
        }),
      });

      if (!response.ok) throw new Error('Failed to generate Excel');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.projectName}_Equipment_List.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Excel file downloaded');
    } catch (error) {
      console.error('Error exporting project:', error);
      toast.error('Failed to export project');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">HVAC Project Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage and view all saved HVAC equipment projects</p>
        </header>

        {/* Search and Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Project Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Search projects by name, customer, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={loadProjects}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-900">{projects.length}</div>
                <div className="text-blue-600">Total Projects</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-900">
                  {projects.reduce((sum, p) => sum + p.totalEquipment, 0)}
                </div>
                <div className="text-green-600">Equipment Items</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="font-semibold text-purple-900">
                  {projects.reduce((sum, p) => sum + (p.photoCount || 0), 0)}
                </div>
                <div className="text-purple-600">Photos</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="font-semibold text-orange-900">
                  {projects.reduce((sum, p) => sum + p.totalQuantity, 0)}
                </div>
                <div className="text-orange-600">Total Quantity</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        <div className="grid gap-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {project.projectName}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{project.customer.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{project.customer.location || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>{project.totalEquipment} equipment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        <span>{project.photoCount || 0} photos</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>Created: {formatDate(project.createdAt)}</span>
                      <span>•</span>
                      <span>Updated: {formatDate(project.updatedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProject(project)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportProjectToExcel(project)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Excel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredProjects.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No projects found' : 'No projects yet'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Projects will appear here once they are saved from the main application'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>

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
                    <div><strong>Name:</strong> {selectedProject.customer.name}</div>
                    <div><strong>Location:</strong> {selectedProject.customer.location}</div>
                    <div><strong>Contact:</strong> {selectedProject.customer.contact || 'N/A'}</div>
                    <div><strong>Phone:</strong> {selectedProject.customer.phone || 'N/A'}</div>
                    <div><strong>Email:</strong> {selectedProject.customer.email || 'N/A'}</div>
                  </div>
                </div>

                {/* Equipment List */}
                <div>
                  <h4 className="font-semibold mb-2">Equipment List ({selectedProject.totalEquipment} items)</h4>
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Qty</th>
                          <th className="text-left p-2">Type</th>
                          <th className="text-left p-2">Manufacturer</th>
                          <th className="text-left p-2">Model</th>
                          <th className="text-left p-2">Serial</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProject.equipmentList.map((equipment, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{equipment.qty || 1}</td>
                            <td className="p-2">{equipment.assetType || 'N/A'}</td>
                            <td className="p-2">{equipment.manufacturer || 'N/A'}</td>
                            <td className="p-2">{equipment.model || 'N/A'}</td>
                            <td className="p-2">{equipment.serialNumber || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Photos */}
                {selectedProject.photoUrls && selectedProject.photoUrls.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Photos ({selectedProject.photoCount})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedProject.photoUrls.map((url, index) => (
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
    </div>
  );
}
