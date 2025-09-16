'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
}

export default function ImageUpload({ onFileChange, multiple = true }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            {multiple 
              ? "Drag and drop multiple nameplate images here, or"
              : "Drag and drop your nameplate image here, or"
            }
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            className="mt-2"
          >
            {multiple ? "Browse Multiple Files" : "Browse Files"}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          PNG, JPG, GIF up to 10MB {multiple && "each"}
        </p>
        {multiple && (
          <p className="text-xs text-blue-600 mt-1">
            You can select multiple images to process them one by one
          </p>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={onFileChange}
        className="hidden"
      />
    </div>
  );
}
