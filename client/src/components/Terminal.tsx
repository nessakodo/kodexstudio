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
  
  // Scroll to bottom when history changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);
  
  return (
    <div 
      className={cn("glass-panel p-4 sm:p-6 overflow-hidden flex flex-col", className)}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal output */}
      <div 
        ref={outputRef}
        className="flex-grow overflow-y-auto mb-4 min-h-[300px] md:min-h-[400px] max-h-[60vh]"
      >
        {history.map((entry, index) => (
          <div key={index} className="mb-2">
            {entry.input && (
              <div className="mb-1">
                <span className="text-terminal-green mr-2">{'>'}</span>
                <span>{entry.input}</span>
              </div>
            )}
            {entry.output}
          </div>
        ))}
      </div>
      
      {/* Terminal input */}
      <div className="flex items-center border-t border-cyber-text/10 pt-4">
        <span className="text-terminal-green mr-2">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onCommandSubmit}
          className="bg-transparent flex-grow focus:outline-none text-cyber-text"
          aria-label="Command input"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
