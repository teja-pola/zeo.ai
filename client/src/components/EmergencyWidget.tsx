import { Button } from '@/components/ui/button';
import React from 'react';

// Import emergency icon from assets folder
import EmergencyIcon from '../assets/Emergency.png';

// Fallback emergency icon path
const emergencyIconPath = EmergencyIcon || '/Emergency.png';

export default function EmergencyWidget() {
  return (
  <div className="fixed bottom-12 right-11 z-[9999]">
      <a
        href="https://telemanas.mohfw.gov.in/home"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-full w-12 h-12 shadow-lg transition-transform duration-200 hover:scale-150 bg-red-500 hover:bg-red-600 text-white"
        aria-label="Open WHO mental health resources"
      >
        <img 
          src={emergencyIconPath} 
          alt="Emergency Icon" 
          className="w-11 h-11"
          onError={(e) => {
            console.error('Emergency icon failed to load:', e);
            const target = e.currentTarget as HTMLImageElement;
            const nextElement = target.nextElementSibling as HTMLElement;
            target.style.display = 'none';
            if (nextElement) nextElement.style.display = 'block';
          }}
        />
        <span className="text-2xl hidden">🚨</span>
      </a>
    </div>
  );
}
