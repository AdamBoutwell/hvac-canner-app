'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, User, MapPin } from 'lucide-react';

interface CustomerValidationProps {
  customer: { name: string; location: string };
  onCustomerSet: (customer: { name: string; location: string }) => void;
}

export function CustomerValidation({ customer, onCustomerSet }: CustomerValidationProps) {
  const [formData, setFormData] = useState({
    name: customer.name || '',
    location: customer.location || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.location.trim()) {
      onCustomerSet({
        name: formData.name.trim(),
        location: formData.location.trim()
      });
    }
  };

  const isFormValid = formData.name.trim().length > 0 && formData.location.trim().length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Start New Project
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Please enter customer information to begin equipment scanning
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Customer Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter customer name"
                className="w-full"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                Location *
              </label>
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter project location"
                className="w-full"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Project Information Required</p>
                  <p className="mt-1">
                    Customer name and location are required before you can start scanning equipment. 
                    This helps organize your equipment data and exports.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid}
            >
              Start Equipment Scanning
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
