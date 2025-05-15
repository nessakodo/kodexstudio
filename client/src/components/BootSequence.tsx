import { useState, useEffect, useCallback } from 'react';
import { typeSequence } from '@/lib/utils';

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [text, setText] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const bootSystem = useCallback(async () => {
    const bootSequence = [
      "> Initializing kodex-studio.sh...",
      "> Cultivating encrypted workspace...",
      "> Preparing glass modules...",
      "> Loading cyber-somatic terminal..."
    ];
    
    // Type each line with a delay
    for (let i = 0; i < bootSequence.length; i++) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setText(prev => [...prev, bootSequence[i]]);
          setProgress((i + 1) / bootSequence.length * 100);
          resolve();
        }, i === 0 ? 300 : 800);
      });
    }
    
    // Short delay before completing
    setTimeout(() => {
      setIsComplete(true);
      onComplete();
    }, 1200);
  }, [onComplete]);
  
  useEffect(() => {
    bootSystem();
  }, [bootSystem]);
  
  return (
    <div 
      className={`fixed inset-0 bg-cyber-black z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <h1 className="font-orbitron font-bold text-5xl md:text-6xl tracking-wider text-cyber-blue animate-pulse-glow mb-16">
        KODEX.STUDIO_
      </h1>
      
      <div className="w-full max-w-2xl border border-cyber-blue/20 rounded-xl overflow-hidden bg-cyber-black/80 backdrop-blur-md">
        <div className="p-8 font-plex text-lg">
          {text.map((line, index) => (
            <div key={index} className="mb-3 text-cyber-blue whitespace-pre-line">{line}</div>
          ))}
        </div>
        
        <div className="px-8 pb-8">
          <div className="h-1.5 w-full bg-cyber-black/60 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyber-blue loading-bar rounded-full"
              style={{width: `${progress}%`}}
            ></div>
          </div>
        </div>
      </div>
      
      <p className="text-gray-500 mt-16 text-center text-sm max-w-lg px-4">
        "Technology cultivated with intention — respecting your autonomy, enhancing your capability."
      </p>
    </div>
  );
}
