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
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
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
        <div className="text-sm font-plex text-cyber-accent/80 ">
          kodex ~$
        </div>
        <div className="text-sm text-cyber-text/40">
          v1.0.2
        </div>
      </div>
      
      {/* Command guide */}
      <div className="bg-gradient-to-r from-cyber-blue/10 to-cyber-blue/5 border border-cyber-blue/20 rounded-lg p-3 mb-4 font-plex text-xs sm:text-sm backdrop-blur-sm">
        <h3 className="text-cyber-highlight font-medium tracking-wide mb-2">⟠ Command Guide:</h3>
        <p className="text-xs sm:text-sm text-cyber-text/80 flex items-center gap-x-2">
          <span className="font-mono bg-cyber-blue/15 text-cyber-blue px-1.5 py-0.5 rounded-md border border-cyber-blue/20">help</span> 
          <span>for all options</span>
        </p>
        
        {/* Desktop-only commands */}
        {isDesktop && (
          <>
            <p className="text-xs sm:text-sm text-cyber-text/80 flex items-center gap-x-2 mt-2">
              <span className="font-mono bg-cyber-blue/15 text-cyber-blue px-1.5 py-0.5 rounded-md border border-cyber-blue/20">Tab</span> 
              <span>for auto-completion</span>
            </p>
            <p className="text-xs sm:text-sm text-cyber-text/80 flex items-center gap-x-2 mt-2">
              <span className="font-mono bg-cyber-blue/15 text-cyber-blue px-1.5 py-0.5 rounded-md border border-cyber-blue/20">Esc</span> 
              <span>to close sections</span>
            </p>
          </>
        )}
        
        {/* Mobile-only tip */}
        {!isDesktop && (
          <p className="text-xs text-cyber-text/80 flex items-center gap-x-2 mt-2">
            <span className="font-mono bg-cyber-blue/15 text-cyber-blue px-1.5 py-0.5 rounded-md border border-cyber-blue/20">walkthrough</span> 
            <span>for guided tour</span>
          </p>
        )}
      </div>
      
      {/* Terminal output - adaptive height with scroll and fade effects */}
      <div className="relative flex-1 min-h-[200px] max-h-[300px] sm:max-h-[400px] overflow-hidden mb-4">
        <div 
          ref={outputRef}
          className="h-full overflow-y-auto font-plex pr-2 pt-4"
        >
          {history.map((entry, index) => (
            <div key={index} className="mb-4 animate-fadeInUp text-xs sm:text-sm">
              {entry.input && (
                <div className="mb-1 font-medium">
                  <span className="text-cyber-accent mr-2">kodex ~$</span>
                  <span className="text-white">{entry.input}</span>
                </div>
              )}
              <div className="pl-0 text-cyber-text/90 text-xs sm:text-sm">
                {entry.output}
              </div>
            </div>
          ))}
        </div>
        
        {/* Top fade overlay - only show when content is scrolled */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-cyber-black/90 to-transparent z-10 opacity-0 transition-opacity duration-200"
          style={{
            opacity: outputRef.current?.scrollTop ? 1 : 0
          }}
        ></div>
      </div>
      
      {/* Mobile command shortcuts */}
      {!isDesktop && (
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
        <span className="text-cyber-accent mr-2 font-plex text-xs sm:text-sm">kodex ~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onCommandSubmit}
          className="bg-transparent flex-grow focus:outline-none text-cyber-text/90 font-plex caret-cyber-accent text-xs sm:text-sm"
          placeholder="Type a command..."
          aria-label="Command input"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
