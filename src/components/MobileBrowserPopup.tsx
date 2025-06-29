
import React, { useState } from 'react';
import { X, ArrowLeft, RotateCcw, Globe } from 'lucide-react';

interface MobileBrowserPopupProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

const MobileBrowserPopup = ({ isOpen, onClose, url, title }: MobileBrowserPopupProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Mobile Browser Container */}
      <div className="relative z-10 w-[375px] h-[600px] bg-gray-900 rounded-xl shadow-2xl border border-cyan-500/30 overflow-hidden animate-scale-in">
        {/* Browser Header */}
        <div className="h-12 bg-gray-800 border-b border-cyan-500/20 flex items-center px-3 gap-2">
          {/* Browser Controls */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          
          {/* Address Bar */}
          <div className="flex-1 mx-3 bg-gray-700 rounded-md px-3 py-1 flex items-center gap-2">
            <Globe className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-300 truncate font-mono">
              {new URL(url).hostname}
            </span>
          </div>
          
          {/* Actions */}
          <div className="flex gap-1">
            <button
              onClick={handleRefresh}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Refresh"
            >
              <RotateCcw className="w-3 h-3 text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Close"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Browser Content */}
        <div className="relative h-[calc(100%-48px)] bg-white">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-cyan-400 text-sm font-mono">Loading {title}...</p>
              </div>
            </div>
          )}
          
          {/* Iframe */}
          <iframe
            key={iframeKey}
            src={url}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            title={title}
          />
        </div>

        {/* Tech Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/20 via-cyan-400/40 to-cyan-500/20">
          <div className="h-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default MobileBrowserPopup;
