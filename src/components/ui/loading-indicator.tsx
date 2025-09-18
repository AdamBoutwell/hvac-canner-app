'use client';

import React from 'react';
import { ProcessingStatus } from '@/types/state';

interface LoadingIndicatorProps {
  status: ProcessingStatus;
  className?: string;
}

export function LoadingIndicator({ status, className = '' }: LoadingIndicatorProps) {
  const { stage, progress, message } = status;

  // Don't show anything if idle
  if (stage === 'idle') {
    return null;
  }

  const getStageIcon = () => {
    switch (stage) {
      case 'uploading':
        return (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        );
      case 'processing':
        return (
          <div className="relative">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-6 w-6 border border-green-400 opacity-20"></div>
          </div>
        );
      case 'complete':
        return (
          <div className="rounded-full h-6 w-6 bg-green-500 flex items-center justify-center">
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="rounded-full h-6 w-6 bg-red-500 flex items-center justify-center">
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStageColor = () => {
    switch (stage) {
      case 'uploading':
        return 'border-blue-500 bg-blue-50';
      case 'processing':
        return 'border-green-500 bg-green-50';
      case 'complete':
        return 'border-green-500 bg-green-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getProgressColor = () => {
    switch (stage) {
      case 'uploading':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-green-500';
      case 'complete':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getStageColor()} ${className}`}>
      <div className="flex items-center space-x-3">
        {getStageIcon()}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 capitalize">
              {stage === 'uploading' && 'Uploading Image'}
              {stage === 'processing' && 'Analyzing Nameplate'}
              {stage === 'complete' && 'Extraction Complete'}
              {stage === 'error' && 'Extraction Failed'}
            </span>
            <span className="text-sm text-gray-500">{progress}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ease-out ${getProgressColor()}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Status Message */}
          <p className="text-sm text-gray-600">{message}</p>
          
          {/* Additional visual elements for processing stage */}
          {stage === 'processing' && (
            <div className="mt-3 flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-xs text-green-600 font-medium">
                AI is extracting equipment data...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Overlay component for image processing
interface ImageProcessingOverlayProps {
  isProcessing: boolean;
  status: ProcessingStatus;
}

export function ImageProcessingOverlay({ isProcessing, status }: ImageProcessingOverlayProps) {
  if (!isProcessing) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="relative mx-auto mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-blue-400 opacity-20"></div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {status.stage === 'uploading' && 'Uploading Image'}
            {status.stage === 'processing' && 'Analyzing Nameplate'}
            {status.stage === 'complete' && 'Extraction Complete'}
            {status.stage === 'error' && 'Extraction Failed'}
          </h3>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className="h-2 rounded-full transition-all duration-500 ease-out bg-blue-500"
              style={{ width: `${status.progress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{status.message}</p>
          
          {status.stage === 'processing' && (
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

