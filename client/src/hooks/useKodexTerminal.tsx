import { useState, useEffect, useCallback, useRef } from 'react';
import { TerminalHistory } from '@/types';

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
            <p className="text-terminal-green">Welcome to KODEX.STUDIO Terminal</p>
            <p className="text-sm mt-2">Type <span className="text-cyber-blue">help</span> to see available commands or <span className="text-cyber-blue">walkthrough</span> for a guided tour.</p>
          </div>
        )
      }
    ]);
  }, []);
  
  // Focus the input when requested
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Handle command submissions
  const handleCommandSubmit = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
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
            <p className="text-terminal-green mb-2">Available commands:</p>
            <ul className="space-y-1">
              <li><span className="text-cyber-blue">help</span> <span className="ml-4 text-cyber-text/70">Show list of available commands</span></li>
              <li><span className="text-cyber-blue">walkthrough</span> <span className="ml-4 text-cyber-text/70">Step-by-step guided tour</span></li>
              <li><span className="text-cyber-blue">nessa-kodo</span> <span className="ml-4 text-cyber-text/70">About section + downloadable resume</span></li>
              <li><span className="text-cyber-blue">projects</span> <span className="ml-4 text-cyber-text/70">Interactive portfolio</span></li>
              <li><span className="text-cyber-blue">services</span> <span className="ml-4 text-cyber-text/70">Freelance offerings with tiers</span></li>
              <li><span className="text-cyber-blue">writings</span> <span className="ml-4 text-cyber-text/70">Auto-pulled blog content</span></li>
              <li><span className="text-cyber-blue">clients</span> <span className="ml-4 text-cyber-text/70">Case studies & testimonials</span></li>
              <li><span className="text-cyber-blue">contact</span> <span className="ml-4 text-cyber-text/70">Project form + scope generator</span></li>
              <li><span className="text-cyber-blue">resume</span> <span className="ml-4 text-cyber-text/70">Trigger resume download</span></li>
              <li><span className="text-cyber-blue">clear</span> <span className="ml-4 text-cyber-text/70">Clear terminal output</span></li>
            </ul>
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
      } else if (cmd === 'nessa-kodo') {
        setActiveSection('about');
        cmdOutput = <div className="mb-4">Loading about section...</div>;
      } else if (cmd === 'projects') {
        setActiveSection('projects');
        cmdOutput = <div className="mb-4">Loading projects section...</div>;
      } else if (cmd === 'services') {
        setActiveSection('services');
        cmdOutput = <div className="mb-4">Loading services section...</div>;
      } else if (cmd === 'writings') {
        setActiveSection('writings');
        cmdOutput = <div className="mb-4">Loading writings section...</div>;
      } else if (cmd === 'clients') {
        setActiveSection('clients');
        cmdOutput = <div className="mb-4">Loading clients section...</div>;
      } else if (cmd === 'contact') {
        setActiveSection('contact');
        cmdOutput = <div className="mb-4">Loading contact section...</div>;
      } else if (cmd === 'walkthrough') {
        // Hide current section first
        setActiveSection(null);
        
        // Simple walkthrough
        cmdOutput = (
          <div className="mb-4">
            <p className="text-terminal-green">Starting guided tour. First, let's look at the about section...</p>
            <p className="mt-2">Type <span className="text-cyber-blue">nessa-kodo</span> or click the walkthrough button.</p>
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
  }, [input]);
  
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
