import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useIsDesktop } from '@/hooks/useIsDesktop';

interface TerminalProps {
  input: string;
  onInputChange: (value: string) => void;
  history: Array<{
    input?: string;
    output: React.ReactNode;
  }>;
  onCommandSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  className?: string;
}

export default function Terminal({
  input,
  onInputChange,
  history,
  onCommandSubmit,
  inputRef,
  className
}: TerminalProps) {
  const outputRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  
  // Always scroll to bottom when history changes or input changes
  useEffect(() => {
    if (outputRef.current) {
      // Use a small timeout to ensure content is rendered before scrolling
      setTimeout(() => {
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [history, input]);
  
  return (
    <div 
      className={cn("glass-panel border border-cyber-blue/20 bg-cyber-black/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 md:p-6 overflow-hidden flex flex-col animate-fadeInUp delay-500", className)}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal header */}
      <div className="flex justify-between items-center mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-cyber-blue/10">
        <div className="flex items-center space-x-2">
          <span className="bg-red-500 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"></span>
          <span className="bg-yellow-500 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"></span>
          <span className="bg-green-500 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"></span>
        </div>
        <div className="text-xs sm:text-sm font-plex text-cyber-accent/80 font-medium">
          kodex ~$
        </div>
        <div className="text-[10px] sm:text-xs text-cyber-text/40">
          v1.0.2
        </div>
      </div>
      
      {/* Command guide */}
      <div className="bg-gradient-to-r from-cyber-blue/10 to-cyber-blue/5 border border-cyber-blue/20 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 font-plex text-xs sm:text-sm backdrop-blur-sm">
        <h3 className="text-cyber-highlight font-medium tracking-wide mb-1.5 sm:mb-2">⟠ Command Guide:</h3>
        <p className="text-[10px] sm:text-xs text-cyber-text/80 flex items-center gap-x-2">
          <span className="font-mono bg-cyber-blue/15 text-cyber-blue px-1.5 py-0.5 rounded-md border border-cyber-blue/20">help</span> 
          <span>for all options</span>
        </p>
        
        {/* Desktop-only commands */}
        {isDesktop && (
          <>
            <p className="text-[10px] sm:text-xs text-cyber-text/80 flex items-center gap-x-2 mt-1.5 sm:mt-2">
              <span className="font-mono bg-cyber-blue/15 text-cyber-blue px-1.5 py-0.5 rounded-md border border-cyber-blue/20">Tab</span> 
              <span>for auto-completion</span>
            </p>
            <p className="text-[10px] sm:text-xs text-cyber-text/80 flex items-center gap-x-2 mt-1.5 sm:mt-2">
              <span className="font-mono bg-cyber-blue/15 text-cyber-blue px-1.5 py-0.5 rounded-md border border-cyber-blue/20">Esc</span> 
              <span>to close sections</span>
            </p>
          </>
        )}
        
        {/* Mobile-only tip */}
        {!isDesktop && (
          <p className="text-[10px] sm:text-xs text-cyber-text/80 flex items-center gap-x-2 mt-1.5 sm:mt-2">
            <span className="font-mono bg-cyber-blue/15 text-cyber-blue px-1.5 py-0.5 rounded-md border border-cyber-blue/20">walkthrough</span> 
            <span>for guided tour</span>
          </p>
        )}
      </div>
      
      {/* Terminal output - adaptive height with scroll */}
      <div 
        ref={outputRef}
        className="h-[250px] sm:h-[300px] md:h-[350px] overflow-y-auto font-plex"
      >
        {history.map((entry, index) => (
          <div key={index} className="mb-3 sm:mb-4 animate-fadeInUp text-[10px] sm:text-xs md:text-sm">
            {entry.input && (
              <div className="mb-1 font-medium">
                <span className="text-cyber-accent mr-2">kodex ~$</span>
                <span className="text-white">{entry.input}</span>
              </div>
            )}
            <div className="pl-0 text-cyber-text/90">
              {entry.output}
            </div>
          </div>
        ))}
      </div>
      
      {/* Mobile command shortcuts */}
      {!isDesktop && (
        <div className="mb-2 sm:mb-3 flex flex-wrap gap-1.5 sm:gap-2">
          <button 
            onClick={() => {
              onInputChange("help");
              onCommandSubmit({ key: 'Enter', preventDefault: () => {} } as React.KeyboardEvent<HTMLInputElement>);
            }}
            className="glass-button py-0.5 sm:py-1 px-1.5 sm:px-2 text-[10px] sm:text-xs rounded"
          >
            help
          </button>
          <button 
            onClick={() => {
              onInputChange("walkthrough");
              onCommandSubmit({ key: 'Enter', preventDefault: () => {} } as React.KeyboardEvent<HTMLInputElement>);
            }}
            className="glass-button py-0.5 sm:py-1 px-1.5 sm:px-2 text-[10px] sm:text-xs rounded"
          >
            walkthrough
          </button>
          <button 
            onClick={() => {
              onInputChange("whois");
              onCommandSubmit({ key: 'Enter', preventDefault: () => {} } as React.KeyboardEvent<HTMLInputElement>);
            }}
            className="glass-button py-0.5 sm:py-1 px-1.5 sm:px-2 text-[10px] sm:text-xs rounded"
          >
            about
          </button>
          <button 
            onClick={() => {
              onInputChange("contact");
              onCommandSubmit({ key: 'Enter', preventDefault: () => {} } as React.KeyboardEvent<HTMLInputElement>);
            }}
            className="glass-button py-0.5 sm:py-1 px-1.5 sm:px-2 text-[10px] sm:text-xs rounded"
          >
            contact
          </button>
        </div>
      )}
      
      {/* Terminal input */}
      <div className="flex items-center border border-cyber-blue/30 rounded-lg p-2 sm:p-2.5 bg-gradient-to-r from-cyber-blue/10 to-cyber-blue/5 backdrop-blur-sm">
        <span className="text-cyber-accent mr-2 font-plex font-medium text-xs sm:text-sm">kodex ~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onCommandSubmit}
          className="bg-transparent flex-grow focus:outline-none text-cyber-text/90 font-plex caret-cyber-accent text-[10px] sm:text-xs md:text-sm"
          placeholder="Type a command..."
          aria-label="Command input"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
