import { useState, useEffect, useCallback, useRef } from 'react';
import { TerminalHistory } from '@/types';
import { downloadResume } from '@/lib/utils';

// The available commands for tab completion
const AVAILABLE_COMMANDS = [
  'help',
  'walkthrough',
  'whois',
  'projects',
  'services',
  'writings',
  'clients',
  'contact',
  'resume',
  'clear'
];

export function useKodexTerminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalHistory[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Show welcome message when terminal mounts
  useEffect(() => {
    setHistory([
      {
        output: (
          <div className="mb-4">
            <p className="text-terminal-green">Welcome to KODEX STUDIO Terminal</p>
            <p className="text-sm mt-2">Type <span className="text-cyber-blue">help</span> to see available commands or <span className="text-cyber-blue">walkthrough</span> for a guided tour.</p>
          </div>
        )
      }
    ]);
  }, []);

  // Setup event listeners for esc key to close sections
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeSection) {
        setActiveSection(null);
        focusInput();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [activeSection]);
  
  // Focus the input when requested
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle tab completion
  const handleTabComplete = useCallback(() => {
    const partialCommand = input.trim().toLowerCase();
    if (partialCommand) {
      const matches = AVAILABLE_COMMANDS.filter(cmd => 
        cmd.startsWith(partialCommand)
      );
      
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        // If multiple matches, show them as options
        const cmdOutput = (
          <div className="mb-4">
            <p className="text-cyber-blue mb-2 font-medium">Tab completions:</p>
            <div className="flex flex-wrap gap-2">
              {matches.map((match, idx) => (
                <span 
                  key={idx} 
                  className="text-cyber-blue bg-cyber-blue/10 px-2 py-0.5 rounded font-mono text-sm cursor-pointer hover:bg-cyber-blue/20"
                  onClick={() => setInput(match)}
                >
                  {match}
                </span>
              ))}
            </div>
          </div>
        );
        
        setHistory(prev => [
          ...prev,
          {
            output: cmdOutput
          }
        ]);
      }
    }
  }, [input]);
  
  // Handle command submissions
  const handleCommandSubmit = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      handleTabComplete();
      return;
    }
    
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      
      if (!cmd) return;
      
      // Add command to history
      setHistory(prev => [
        ...prev,
        {
          input: cmd,
          output: <></>
        }
      ]);
      
      // Process command
      let cmdOutput;
      
      // Simple command processing
      if (cmd === 'help') {
        cmdOutput = (
          <div className="mb-4">
            <p className="text-cyber-blue mb-2 font-medium">Available commands:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-center">
                <span className="text-cyber-blue bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono text-sm">help</span> 
                <span className="ml-3 text-cyber-text/70">Display available commands</span>
              </div>
              <div className="flex items-center">
                <span className="text-cyber-blue bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono text-sm">walkthrough</span> 
                <span className="ml-3 text-cyber-text/70">Step-by-step guided tour</span>
              </div>
              <div className="flex items-center">
                <span className="text-cyber-blue bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono text-sm">whois</span> 
                <span className="ml-3 text-cyber-text/70">About section + resume</span>
              </div>
              <div className="flex items-center">
                <span className="text-cyber-blue bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono text-sm">projects</span> 
                <span className="ml-3 text-cyber-text/70">Technical portfolio</span>
              </div>
              <div className="flex items-center">
                <span className="text-cyber-blue bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono text-sm">services</span> 
                <span className="ml-3 text-cyber-text/70">Freelance offerings</span>
              </div>
              <div className="flex items-center">
                <span className="text-cyber-blue bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono text-sm">writings</span> 
                <span className="ml-3 text-cyber-text/70">Blog content & thoughts</span>
              </div>
              <div className="flex items-center">
                <span className="text-cyber-blue bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono text-sm">clients</span> 
                <span className="ml-3 text-cyber-text/70">Case studies & testimonials</span>
              </div>
              <div className="flex items-center">
                <span className="text-cyber-blue bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono text-sm">contact</span> 
                <span className="ml-3 text-cyber-text/70">Project form & scheduling</span>
              </div>
              <div className="flex items-center">
                <span className="text-cyber-blue bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono text-sm">resume</span> 
                <span className="ml-3 text-cyber-text/70">Download PDF resume</span>
              </div>
              <div className="flex items-center">
                <span className="text-cyber-blue bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono text-sm">clear</span> 
                <span className="ml-3 text-cyber-text/70">Clear terminal output</span>
              </div>
            </div>
          </div>
        );
      } else if (cmd === 'clear') {
        // Clear history
        setHistory([
          {
            output: (
              <div className="mb-4">
                <p className="text-terminal-green">Terminal cleared. Type help for available commands.</p>
              </div>
            )
          }
        ]);
        
        // Reset input and return early - we've already updated history
        setInput('');
        return;
      } else if (cmd === 'whois') {
        setActiveSection('about');
        cmdOutput = <div className="mb-4">
          <p className="text-cyber-blue">Fetching identity data...</p>
        </div>;
      } else if (cmd === 'projects') {
        setActiveSection('projects');
        cmdOutput = <div className="mb-4">
          <p className="text-cyber-blue">Accessing project repository...</p>
        </div>;
      } else if (cmd === 'services') {
        setActiveSection('services');
        cmdOutput = <div className="mb-4">
          <p className="text-cyber-blue">Loading service offerings...</p>
        </div>;
      } else if (cmd === 'writings') {
        setActiveSection('writings');
        cmdOutput = <div className="mb-4">
          <p className="text-cyber-blue">Loading published articles...</p>
        </div>;
      } else if (cmd === 'clients') {
        setActiveSection('clients');
        cmdOutput = <div className="mb-4">
          <p className="text-cyber-blue">Gathering client testimonials...</p>
        </div>;
      } else if (cmd === 'contact') {
        setActiveSection('contact');
        cmdOutput = <div className="mb-4">
          <p className="text-cyber-blue">Opening communication channels...</p>
        </div>;
      } else if (cmd === 'walkthrough') {
        // Simply show a message - walkthrough will be handled by the parent component
        cmdOutput = (
          <div className="mb-4">
            <p className="text-terminal-green">Starting guided tour. First, let's look at the about section...</p>
            <p className="mt-2">The about section will be displayed automatically.</p>
          </div>
        );
      } else if (cmd === 'resume') {
        // Trigger resume download
        downloadResume();
        
        cmdOutput = (
          <div className="mb-4">
            <p className="text-terminal-green">Downloading Nessa Kodo's resume...</p>
          </div>
        );
      } else {
        // Command not recognized
        cmdOutput = (
          <div className="mb-4 text-error-red">
            Command not recognized: {cmd}
          </div>
        );
      }
      
      // Add command output to history
      setHistory(prev => [
        ...prev,
        {
          output: cmdOutput
        }
      ]);
      
      // Clear input
      setInput('');
    }
  }, [input, handleTabComplete]);
  
  return {
    input,
    setInput,
    history,
    activeSection,
    setActiveSection,
    inputRef,
    focusInput,
    handleCommandSubmit
  };
}
