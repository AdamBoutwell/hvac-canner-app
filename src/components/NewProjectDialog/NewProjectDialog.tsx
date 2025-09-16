'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, X, Trash2, Save } from 'lucide-react';

interface NewProjectDialogProps {
  isOpen: boolean;
  projectInfo: {
    projectName?: string;
    lastSaved?: string;
    equipmentCount?: number;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

export function NewProjectDialog({ 
  isOpen, 
  projectInfo, 
  onConfirm, 
  onCancel 
}: NewProjectDialogProps) {
  if (!isOpen) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Start New Project
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800 font-medium">
              ⚠️ This will permanently delete all current project data!
            </p>
          </div>

          <div className="bg-gray-50 rounded-md p-4">
            <h4 className="font-medium text-sm text-gray-900 mb-3">Current Project:</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Project:</span>
                <span className="ml-2 font-medium">{projectInfo.projectName || 'Unnamed Project'}</span>
              </div>
              <div>
                <span className="text-gray-600">Equipment Count:</span>
                <span className="ml-2 font-medium">{projectInfo.equipmentCount || 0} items</span>
              </div>
              <div>
                <span className="text-gray-600">Last Saved:</span>
                <span className="ml-2 font-medium">{formatDate(projectInfo.lastSaved)}</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex items-start gap-2">
              <Save className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Before starting a new project:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Export your current equipment list to Excel if needed</li>
                  <li>• Save any unsaved equipment data</li>
                  <li>• Note: This action cannot be undone</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onConfirm}
              className="flex-1 flex items-center gap-2"
              variant="destructive"
            >
              <Trash2 className="h-4 w-4" />
              Start New Project
            </Button>
            <Button
              onClick={onCancel}
              className="flex-1"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
