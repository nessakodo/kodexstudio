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

// Define terminal text colors and styles
const TERMINAL_STYLES = {
  green: 'text-terminal-green',
  blue: 'text-cyber-blue',
  error: 'text-error-red',
  text: 'text-[10px] sm:text-xs md:text-sm',
  accent: 'text-cyber-accent',
  highlight: 'text-cyber-highlight'
};

export function useKodexTerminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalHistory[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Function to directly navigate to contact section from any part of the app
  const navigateToContact = useCallback(() => {
    // First close any open section
    setActiveSection(null);
    // Then open contact section after a short delay
    setTimeout(() => {
      setActiveSection('contact');
    }, 100);
  }, [setActiveSection]);
  
  // Show welcome message when terminal mounts
  useEffect(() => {
    setHistory([
      {
        output: (
          <div className={TERMINAL_STYLES.green}>
            <p>Welcome to KODEX STUDIO Terminal</p>
            <p className={`${TERMINAL_STYLES.text} mt-2`}>
              Type <span className={TERMINAL_STYLES.blue}>help</span> to see available commands or <span className={TERMINAL_STYLES.blue}>walkthrough</span> for a guided tour.
            </p>
          </div>
        )
      }
    ]);
  }, []);

  // Setup event listeners for esc key to close sections
  // Auto-scroll to section when activated
  useEffect(() => {
    if (activeSection) {
      // Short delay to allow component to render fully
      setTimeout(() => {
        const sectionElement = document.querySelector('section');
        if (sectionElement) {
          // Get section header (first child with border-b)
          const sectionHeader = sectionElement.querySelector('div[class*="border-b"]');
          
          // Calculate offset to ensure we see the section title at the top
          const navbarHeight = 0; // No fixed navbar in this site
          const offset = sectionHeader ? -20 : -40; // Negative value moves view slightly up

          // Scroll to the section with proper positioning
          window.scrollTo({
            top: sectionElement.offsetTop + offset,
            behavior: 'smooth'
          });
        }
      }, 150);
    }
  }, [activeSection]);

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

  // Helper function to handle setting input and focusing (defined after focusInput)
  const setInputAndFocus = useCallback((cmd: string) => {
    setInput(cmd);
    focusInput();
  }, [setInput, focusInput]);

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
          <div className={TERMINAL_STYLES.green}>
            <p className={`${TERMINAL_STYLES.blue} mb-2 font-medium`}>Available commands:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-center">
                <button 
                  onClick={() => setInputAndFocus('help')}
                  className={`${TERMINAL_STYLES.blue} bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono ${TERMINAL_STYLES.text} cursor-pointer hover:bg-cyber-blue/20`}
                >help</button> 
                <span className={`ml-3 ${TERMINAL_STYLES.text} text-cyber-text/70`}>Display available commands</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setInputAndFocus('walkthrough')}
                  className={`${TERMINAL_STYLES.blue} bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono ${TERMINAL_STYLES.text} cursor-pointer hover:bg-cyber-blue/20`}
                >walkthrough</button> 
                <span className={`ml-3 ${TERMINAL_STYLES.text} text-cyber-text/70`}>Step-by-step guided tour</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setInputAndFocus('whois')}
                  className={`${TERMINAL_STYLES.blue} bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono ${TERMINAL_STYLES.text} cursor-pointer hover:bg-cyber-blue/20`}
                >whois</button> 
                <span className={`ml-3 ${TERMINAL_STYLES.text} text-cyber-text/70`}>About section + resume</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setInputAndFocus('projects')}
                  className={`${TERMINAL_STYLES.blue} bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono ${TERMINAL_STYLES.text} cursor-pointer hover:bg-cyber-blue/20`}
                >projects</button> 
                <span className={`ml-3 ${TERMINAL_STYLES.text} text-cyber-text/70`}>Technical portfolio</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setInputAndFocus('services')}
                  className={`${TERMINAL_STYLES.blue} bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono ${TERMINAL_STYLES.text} cursor-pointer hover:bg-cyber-blue/20`}
                >services</button> 
                <span className={`ml-3 ${TERMINAL_STYLES.text} text-cyber-text/70`}>Freelance offerings</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setInputAndFocus('writings')}
                  className={`${TERMINAL_STYLES.blue} bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono ${TERMINAL_STYLES.text} cursor-pointer hover:bg-cyber-blue/20`}
                >writings</button> 
                <span className={`ml-3 ${TERMINAL_STYLES.text} text-cyber-text/70`}>Blog content & thoughts</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setInputAndFocus('clients')}
                  className={`${TERMINAL_STYLES.blue} bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono ${TERMINAL_STYLES.text} cursor-pointer hover:bg-cyber-blue/20`}
                >clients</button> 
                <span className={`ml-3 ${TERMINAL_STYLES.text} text-cyber-text/70`}>Case studies & testimonials</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setInputAndFocus('contact')}
                  className={`${TERMINAL_STYLES.blue} bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono ${TERMINAL_STYLES.text} cursor-pointer hover:bg-cyber-blue/20`}
                >contact</button> 
                <span className={`ml-3 ${TERMINAL_STYLES.text} text-cyber-text/70`}>Project form & scheduling</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setInputAndFocus('resume')}
                  className={`${TERMINAL_STYLES.blue} bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono ${TERMINAL_STYLES.text} cursor-pointer hover:bg-cyber-blue/20`}
                >resume</button> 
                <span className={`ml-3 ${TERMINAL_STYLES.text} text-cyber-text/70`}>Download PDF resume</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setInputAndFocus('clear')}
                  className={`${TERMINAL_STYLES.blue} bg-cyber-blue/10 px-1.5 py-0.5 rounded font-mono ${TERMINAL_STYLES.text} cursor-pointer hover:bg-cyber-blue/20`}
                >clear</button> 
                <span className={`ml-3 ${TERMINAL_STYLES.text} text-cyber-text/70`}>Clear terminal output</span>
              </div>
            </div>
          </div>
        );
      } else if (cmd === 'clear') {
        cmdOutput = (
          <div className={TERMINAL_STYLES.green}>
            <p>Terminal cleared. Type help for available commands.</p>
          </div>
        );
        setHistory([
          {
            output: cmdOutput
          }
        ]);
        return;
      } else if (cmd === 'whois') {
        setActiveSection('about');
        cmdOutput = (
          <div className={TERMINAL_STYLES.green}>
            <p className={TERMINAL_STYLES.blue}>Fetching identity data...</p>
          </div>
        );
      } else if (cmd === 'projects') {
        setActiveSection('projects');
        cmdOutput = (
          <div className={TERMINAL_STYLES.green}>
            <p className={TERMINAL_STYLES.blue}>Accessing project repository...</p>
          </div>
        );
      } else if (cmd === 'services') {
        setActiveSection('services');
        cmdOutput = (
          <div className={TERMINAL_STYLES.green}>
            <p className={TERMINAL_STYLES.blue}>Loading service offerings...</p>
          </div>
        );
      } else if (cmd === 'writings') {
        setActiveSection('writings');
        cmdOutput = (
          <div className={TERMINAL_STYLES.green}>
            <p className={TERMINAL_STYLES.blue}>Loading published articles...</p>
          </div>
        );
      } else if (cmd === 'clients') {
        setActiveSection('clients');
        cmdOutput = (
          <div className={TERMINAL_STYLES.green}>
            <p className={TERMINAL_STYLES.blue}>Gathering client testimonials...</p>
          </div>
        );
      } else if (cmd === 'contact') {
        setActiveSection('contact');
        cmdOutput = (
          <div className={TERMINAL_STYLES.green}>
            <p className={TERMINAL_STYLES.blue}>Opening communication channels...</p>
          </div>
        );
      } else if (cmd === 'walkthrough') {
        cmdOutput = (
          <div className={'text-yellow-400'}>
            <p>Walkthrough sequence initiated...</p>
            {/* <p className={`${TERMINAL_STYLES.text}`}>The about section will be displayed automatically.</p> */}
          </div>
        );
      } else if (cmd === 'resume') {
        downloadResume();
        cmdOutput = (
          <div className={'text-yellow-400'}>
            <p>Downloading Nessa Kodo's resume...</p>
          </div>
        );
      } else {
        cmdOutput = (
          <div className={`${TERMINAL_STYLES.error} ${TERMINAL_STYLES.text}`}>
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
  }, [input, handleTabComplete, setInputAndFocus, navigateToContact, downloadResume, setActiveSection, setHistory]);
  
  // Helper function to add entries to terminal history
  const addToHistory = useCallback((entry: TerminalHistory) => {
    setHistory(prev => [...prev, entry]);
  }, [setHistory]);
  
  return {
    input,
    setInput,
    history,
    setHistory,
    activeSection,
    setActiveSection,
    inputRef,
    focusInput,
    handleCommandSubmit,
    addToHistory,
    navigateToContact,
    setInputAndFocus
  };
}
