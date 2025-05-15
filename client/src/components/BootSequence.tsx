import { useState, useEffect, useCallback } from 'react';
import { typeSequence } from '@/lib/utils';

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [text, setText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  const bootSystem = useCallback(async () => {
    const bootSequence = [
      "[SYSTEM] Initializing kodex-studio.sh...",
      "Establishing secure connection...",
      "Preparing creative systems interface..."
    ];
    
    await typeSequence(bootSequence, (currentText) => {
      setText(prev => `${prev}${currentText === prev ? '' : currentText}\n`);
    }, 60, 800);
    
    // Short delay before completing
    setTimeout(() => {
      setIsComplete(true);
      onComplete();
    }, 500);
  }, [onComplete]);
  
  useEffect(() => {
    bootSystem();
  }, [bootSystem]);
  
  return (
    <div 
      className={`fixed inset-0 bg-cyber-black z-50 flex items-center justify-center transition-opacity duration-500 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="w-full max-w-lg p-4">
        <div className="animate-flicker whitespace-pre-line font-plex text-terminal-green">
          {text}
        </div>
      </div>
    </div>
  );
}
