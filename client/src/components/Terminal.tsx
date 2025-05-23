import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
      className={cn("glass-panel border border-cyber-blue/20 bg-cyber-black/80 backdrop-blur-xl rounded-xl p-4 sm:p-6 overflow-hidden flex flex-col animate-fadeInUp delay-500", className)}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-cyber-blue/10">
        <div className="flex items-center space-x-2">
          <span className="bg-red-500 w-3 h-3 rounded-full"></span>
          <span className="bg-yellow-500 w-3 h-3 rounded-full"></span>
          <span className="bg-green-500 w-3 h-3 rounded-full"></span>
        </div>
        <div className="text-sm font-plex text-cyber-accent/80 font-medium">
          kodex ~$
        </div>
        <div className="text-xs text-cyber-text/40">
          v1.0.2
        </div>
      </div>
      
      {/* Command guide */}
      <div className="bg-gradient-to-r from-cyber-blue/10 to-cyber-blue/5 border border-cyber-blue/20 rounded-lg p-3 mb-4 font-plex text-sm backdrop-blur-sm">
        <h3 className="text-cyber-highlight font-medium tracking-wide mb-2">⟠ Command Guide:</h3>
        <p className="text-xs text-cyber-text/80 flex items-center gap-x-2">
          <span className="font-mono bg-cyber-blue/15 text-cyber-blue px-1.5 py-0.5 rounded-md border border-cyber-blue/20">help</span> 
          <span>for all options</span>
        </p>
        
        {/* Desktop-only commands */}
        {window.innerWidth > 768 && (
          <>
            <p className="text-xs text-cyber-text/80 flex items-center gap-x-2 mt-1">
              <span className="font-mono bg-cyber-blue/15 text-cyber-blue px-1.5 py-0.5 rounded-md border border-cyber-blue/20">Tab</span> 
              <span>for auto-completion</span>
            </p>
            <p className="text-xs text-cyber-text/80 flex items-center gap-x-2 mt-1">
              <span className="font-mono bg-cyber-blue/15 text-cyber-blue px-1.5 py-0.5 rounded-md border border-cyber-blue/20">Esc</span> 
              <span>to close sections</span>
            </p>
          </>
        )}
        
        {/* Mobile-only tip */}
        {window.innerWidth <= 768 && (
          <p className="text-xs text-cyber-text/80 flex items-center gap-x-2 mt-1">
            <span className="font-mono bg-cyber-blue/15 text-cyber-blue px-1.5 py-0.5 rounded-md border border-cyber-blue/20">walkthrough</span> 
            <span>for guided tour</span>
          </p>
        )}
      </div>
      
      {/* Terminal output - adaptive height with scroll */}
      <div 
        ref={outputRef}
        className="h-[300px] md:h-[350px] overflow-y-auto mb-4 font-plex"
      >
        {history.map((entry, index) => (
          <div key={index} className="mb-4">
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
      {window.innerWidth <= 768 && (
        <div className="mb-3 flex flex-wrap gap-2">
          <button 
            onClick={() => {
              onInputChange("help");
              onCommandSubmit({ key: 'Enter', preventDefault: () => {} } as React.KeyboardEvent<HTMLInputElement>);
            }}
            className="glass-button py-1 px-2 text-xs rounded"
          >
            help
          </button>
          <button 
            onClick={() => {
              onInputChange("walkthrough");
              onCommandSubmit({ key: 'Enter', preventDefault: () => {} } as React.KeyboardEvent<HTMLInputElement>);
            }}
            className="glass-button py-1 px-2 text-xs rounded"
          >
            walkthrough
          </button>
          <button 
            onClick={() => {
              onInputChange("whois");
              onCommandSubmit({ key: 'Enter', preventDefault: () => {} } as React.KeyboardEvent<HTMLInputElement>);
            }}
            className="glass-button py-1 px-2 text-xs rounded"
          >
            about
          </button>
          <button 
            onClick={() => {
              onInputChange("contact");
              onCommandSubmit({ key: 'Enter', preventDefault: () => {} } as React.KeyboardEvent<HTMLInputElement>);
            }}
            className="glass-button py-1 px-2 text-xs rounded"
          >
            contact
          </button>
        </div>
      )}
      
      {/* Terminal input */}
      <div className="flex items-center border border-cyber-blue/30 rounded-lg p-2.5 bg-gradient-to-r from-cyber-blue/10 to-cyber-blue/5 backdrop-blur-sm">
        <span className="text-cyber-accent mr-2 font-plex font-medium">kodex ~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onCommandSubmit}
          className="bg-transparent flex-grow focus:outline-none text-cyber-text/90 font-plex caret-cyber-accent"
          placeholder="Type a command..."
          aria-label="Command input"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
