import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [text, setText] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [bootPhase, setBootPhase] = useState<'pre' | 'loading' | 'security' | 'final'>('pre');
  const [showContinueButton, setShowContinueButton] = useState(false);
  
  // Use refs to prevent stale closures
  const hasStartedRef = useRef(false);
  const isMobile = useIsMobile();
  
  // Completely rewritten boot process to fix duplication
  useEffect(() => {
    // Prevent running twice
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    
    // Define boot sequence
    const bootMessages = [
      { text: "> System check: [OK]", phase: 'pre', progress: 15 },
      { text: "> INITIALIZING KODEX OS v3.6.2", phase: 'pre', progress: 30 },
      { text: "> Loading UI components...", phase: 'pre', progress: 45 },
      { text: "> Constructing glassmorphic interface...", phase: 'pre', progress: 60 },
      { text: "> SECURITY PROTOCOL ENGAGED", phase: 'security', progress: 80 },
      { text: "> KODEX STUDIO READY", phase: 'final', progress: 100 }
    ];
    
    // Start with a clean slate
    setText([]);
    setProgress(0);
    setBootPhase('pre');
    
    // Render each message sequentially with precise timing
    let currentIndex = 0;
    const processNextMessage = () => {
      if (currentIndex < bootMessages.length) {
        const message = bootMessages[currentIndex];
        
        // Update displayed messages with the exact set we want to show
        setText(bootMessages.slice(0, currentIndex + 1).map(m => m.text));
        setProgress(message.progress);
        setBootPhase(message.phase as any);
        
        currentIndex++;
        
        // Schedule next message
        setTimeout(processNextMessage, 500);
      } else {
        // All messages processed
        if (isMobile) {
          // On mobile, show a continue button instead of auto-proceeding
          setShowContinueButton(true);
        } else {
          // On desktop, finish boot sequence automatically
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(() => {
              onComplete();
            }, 500);
          }, 600);
        }
      }
    };
    
    // Start the sequence
    setTimeout(processNextMessage, 300);
    
    // Cleanup function (not really needed since we prevent double execution)
    return () => {
      hasStartedRef.current = false;
    };
  }, [onComplete]);
  
  // Auto-scroll to bottom whenever text is updated
  useEffect(() => {
    const terminalOutput = document.getElementById('terminal-output');
    if (terminalOutput) {
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  }, [text]);
  
  return (
    <div 
      className={`fixed inset-0 bg-cyber-black z-50 flex flex-col items-center justify-center transition-opacity duration-500 boot-active ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-cyber-black"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(15,180,244,0.05)_0%,rgba(15,180,244,0)_60%)]"></div>
        </div>
      </div>
      
      <div className="max-w-3xl w-full px-4 z-10">
        <h1 className="font-orbitron font-bold text-4xl md:text-6xl tracking-wide mb-12 md:mb-16 text-center relative animate-fadeIn">
          <span className="bg-gradient-to-r from-white/90 via-cyber-blue to-blue-400 bg-clip-text text-transparent drop-shadow-sm">KODEX STUDIO</span>
        </h1>
        
        <div className="w-full border border-cyber-blue/20 rounded-xl overflow-hidden bg-black/50 backdrop-blur-xl shadow-[0_0_25px_rgba(15,180,244,0.1)]">
          <div className="border-b border-cyber-blue/20 bg-cyber-blue/5 px-4 py-2 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500/80 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="font-plex text-xs text-cyber-blue/70">
              {bootPhase === 'pre' && 'System Initialization'}
              {bootPhase === 'loading' && 'Loading Kodex Core'}
              {bootPhase === 'security' && 'Security Protocol'}
              {bootPhase === 'final' && 'Boot Complete'}
            </div>
            <div className="font-plex text-xs text-cyber-blue/40">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
          
          <div id="terminal-output" className="p-6 font-plex text-sm md:text-base max-h-[35vh] overflow-y-auto">
            {text.map((line, index) => (
              <div key={index} className={`mb-2 ${
                line.startsWith('$') ? 'text-white/90' : 
                line.startsWith('>') ? (
                  line.includes('ERROR') || line.includes('FAILED') ? 'text-red-400' :
                  line.includes('SECURITY') ? 'text-white' :
                  line.includes('READY') || line.includes('COMPLETE') ? 'text-cyber-blue' :
                  line.includes('INITIALIZING') ? 'text-cyber-blue' :
                  'text-cyber-blue/80'
                ) : 'text-white/60'
              }`}>
                {line}
              </div>
            ))}
            {bootPhase === 'final' && (
              <div className="text-cyber-blue mt-2 animate-pulse">_</div>
            )}
          </div>
          
          <div className="px-6 py-4 border-t border-cyber-blue/10 bg-cyber-blue/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-yellow-400/90 font-plex font-medium">System Boot</span>
              <span className="text-xs text-white/80 font-plex">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full bg-black/60 rounded-sm overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500/90 to-blue-500/80 loading-bar transition-all duration-500 ease-out"
                style={{width: `${progress}%`}}
              ></div>
            </div>
            
            <div className="mt-4 grid grid-cols-4 gap-2">
              <div className={`h-1 rounded-none ${bootPhase === 'pre' || bootPhase === 'loading' || bootPhase === 'security' || bootPhase === 'final' ? 'bg-cyan-500/90' : 'bg-cyber-blue/20'}`}></div>
              <div className={`h-1 rounded-none ${bootPhase === 'loading' || bootPhase === 'security' || bootPhase === 'final' ? 'bg-cyan-500/90' : 'bg-cyber-blue/20'}`}></div>
              <div className={`h-1 rounded-none ${bootPhase === 'security' || bootPhase === 'final' ? 'bg-cyan-500/90' : 'bg-cyber-blue/20'}`}></div>
              <div className={`h-1 rounded-none ${bootPhase === 'final' ? 'bg-cyan-500/90' : 'bg-cyber-blue/20'}`}></div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-white/40 mt-8 text-center text-xs md:text-sm max-w-md px-4 font-plex relative z-10">
        "Technology cultivated with intention — respecting your autonomy, enhancing your capability."
      </p>
      
      {/* Continue button for mobile devices */}
      {/* {showContinueButton && (
        <button 
          onClick={() => {
            setIsComplete(true);
            setTimeout(() => onComplete(), 500);
          }}
          className="mt-6 glass-button py-2 px-6 rounded text-center text-white border border-cyber-blue/30 
                    bg-cyber-blue/10 hover:bg-cyber-blue/20 transition-all duration-300 animate-fadeIn
                    shadow-glow-sm"
        >
          Continue to Kodex Studio →
        </button>
      )} */}
    </div>
  );
}
