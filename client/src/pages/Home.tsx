import { useState, useEffect, useCallback } from 'react';
import BootSequence from '@/components/BootSequence';
import MatrixRain from '@/components/MatrixRain';
import Terminal from '@/components/Terminal';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ServicesSection from '@/components/sections/ServicesSection';
import WritingsSection from '@/components/sections/WritingsSection';
import ClientsSection from '@/components/sections/ClientsSection';
import ContactSection from '@/components/sections/ContactSection';
import { useKodexTerminal } from '@/hooks/useKodexTerminal';
import { downloadResume } from '@/lib/utils';
import { Article } from '@/types';
import { hasNotionCredentials } from '@/services/notionService';

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);
  const [walkthrough, setWalkthrough] = useState({ active: false, step: 0 });
  
  // Define walkthrough steps
  const walkthroughSteps = [
    {
      message: "Welcome to the guided tour of KODEX.STUDIO. Let's start by exploring who Nessa Kodo is...",
      command: "nessa-kodo"
    },
    {
      message: "Next, let's look at some of the key projects in the portfolio...",
      command: "projects"
    },
    {
      message: "Now for the services offered to clients...",
      command: "services"
    },
    {
      message: "Finally, here's how to get in touch for project inquiries...",
      command: "contact"
    }
  ];
  
  // Start the walkthrough
  const startWalkthroughTour = () => {
    // Set walkthrough as active and start at step 0
    setWalkthrough({
      active: true,
      step: 0
    });
    
    // Add initial welcome message with instructions
    addToHistory({
      output: (
        <div className="mb-3">
          <p className="text-cyan-400 mb-1">Starting guided tour of KODEX.STUDIO</p>
          <p className="text-cyan-300/80 text-sm mb-1">Press <span className="bg-cyber-blue/20 px-2 py-0.5 rounded">SPACE</span> to continue to each step</p>
          <p className="text-white/60 text-sm">Tour will auto-continue in 8 seconds if no key is pressed</p>
        </div>
      )
    });
    
    // Set the active section to about (first step)
    setActiveSection("about");
  };
  
  // Use the terminal hook
  const {
    input,
    setInput,
    history,
    activeSection,
    setActiveSection,
    inputRef,
    focusInput,
    handleCommandSubmit,
    addToHistory
  } = useKodexTerminal();
  
  // Function to close active section and return to terminal
  const handleCloseSection = () => {
    setActiveSection(null);
  };
  
  // Function to handle walkthrough progression
  const handleWalkthroughClick = useCallback(() => {
    const nextStep = walkthrough.step + 1;
    
    if (nextStep < walkthroughSteps.length) {
      // Process next step
      const step = walkthroughSteps[nextStep];
      
      // Update step
      setWalkthrough({
        active: true,
        step: nextStep
      });
      
      // Close current section first
      setActiveSection(null);
      
      // Short delay to ensure the section closes before opening the next one
      setTimeout(() => {
        // Set the active section based on the command
        if (step.command === "nessa-kodo") setActiveSection("about");
        else if (step.command === "projects") setActiveSection("projects");
        else if (step.command === "services") setActiveSection("services");
        else if (step.command === "writings") setActiveSection("writings");
        else if (step.command === "clients") setActiveSection("clients");
        else if (step.command === "contact") setActiveSection("contact");
        
        // Set the input value to match the command
        setInput(step.command);
        
        // Add to history with the appropriate command
        addToHistory({ 
          input: step.command,
          output: <div className="mb-2 text-sm text-cyber-blue/80">{step.message}</div>
        });
        
        // Focus the input for the next command
        setTimeout(focusInput, 300);
      }, 300);
    } else {
      // End of walkthrough
      setWalkthrough({
        active: false,
        step: 0
      });
      
      // Add final message to history
      addToHistory({
        output: <div className="text-cyan-400 mb-2">Walkthrough complete! You can now explore on your own.</div>
      });
      
      // Focus input
      focusInput();
    }
  }, [walkthrough.step, walkthroughSteps, setActiveSection, setInput, addToHistory, focusInput]);
  
  // Effect to handle space key presses for walkthrough progression
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // If space is pressed and walkthrough is active, continue to next step
      if (e.code === 'Space' && walkthrough.active) {
        e.preventDefault(); // Prevent page scrolling
        handleWalkthroughClick();
      }
      
      // If escape is pressed during walkthrough, exit walkthrough
      if (e.key === 'Escape' && walkthrough.active) {
        setWalkthrough({
          active: false,
          step: 0
        });
        
        // Close any open section
        setActiveSection(null);
        
        // Add exit message to history
        addToHistory({
          output: <div className="text-yellow-400 mb-2">Walkthrough ended. Type 'help' to see available commands.</div>
        });
        
        // Focus input
        focusInput();
      }
    };
    
    // Auto-continue timer for walkthrough
    let autoContinueTimer: ReturnType<typeof setTimeout> | null = null;
    
    if (walkthrough.active) {
      // Set a timer to auto-continue after 8 seconds if no key is pressed
      autoContinueTimer = setTimeout(() => {
        handleWalkthroughClick();
      }, 8000);
    }
    
    // Add event listener
    window.addEventListener('keydown', handleKeyPress);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (autoContinueTimer) {
        clearTimeout(autoContinueTimer);
      }
    };
  }, [walkthrough.active, walkthrough.step, handleWalkthroughClick, setActiveSection, addToHistory, focusInput]);
  
  // Add a command handler for walkthrough - use a regular function to avoid dependency issues
  function handleCommand(e: React.KeyboardEvent<HTMLInputElement>) {
    // First, call the terminal's default command handler
    handleCommandSubmit(e);
    
    // If the command was "walkthrough", start the tour
    if (e.key === 'Enter' && input.trim().toLowerCase() === 'walkthrough') {
      startWalkthroughTour();
    }
  }
  
  // When the boot is complete, focus the terminal
  useEffect(() => {
    if (bootComplete) {
      focusInput();
    }
  }, [bootComplete, focusInput]);
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'about':
        return <AboutSection onClose={handleCloseSection} />;
      case 'projects':
        return <ProjectsSection onClose={handleCloseSection} />;
      case 'services':
        return <ServicesSection onClose={handleCloseSection} />;
      case 'writings':
        return <WritingsSection onClose={handleCloseSection} />;
      case 'clients':
        return <ClientsSection onClose={handleCloseSection} />;
      case 'contact':
        return <ContactSection onClose={handleCloseSection} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-cyber-black text-cyber-text overflow-x-hidden min-h-screen">
      {/* Matrix Rain Background */}
      <MatrixRain />
      
      {/* Boot Sequence (visible until complete) */}
      <BootSequence onComplete={() => setBootComplete(true)} />
      
      {/* Main Container (hidden until boot complete) */}
      <div className={`container mx-auto px-4 py-6 max-w-6xl min-h-screen flex flex-col transition-opacity duration-500 ${bootComplete ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header / Hero */}
        <header className="pt-6 md:pt-10 text-center mb-8">
          <h1 className="font-orbitron font-bold text-4xl sm:text-5xl md:text-6xl tracking-wider mb-4 animate-fadeInUp">
            <span className="bg-gradient-to-r from-white/90 via-cyber-blue to-blue-400 bg-clip-text text-transparent drop-shadow-sm">KODEX STUDIO</span>
          </h1>
          <p className="font-space text-lg md:text-xl mb-4 text-white/80 animate-fadeInUp delay-100">
            Cybersecurity & Creative Systems Design
          </p>
          <p className="text-cyber-blue text-sm md:text-base mb-10 font-plex animate-fadeInUp delay-200">
            &gt; Mindful | Tactical | Technical
          </p>
          
          {/* Removed security, ethical design, and digital sovereignty buttons as requested */}
          
          {/* Subtitle without border as a cohesive subtitle, removing the glass panel */}
          <div className="max-w-2xl mx-auto text-center animate-fadeInUp delay-400">
            <p className="text-white/80 text-sm mb-1">
              Secure systems for the post-noise internet. Cybersecurity, development, and mindful tech consulting.
            </p>
            <p className="text-cyber-accent font-plex text-xs italic">
              "Technology that respects your autonomy and enhances your capability."
            </p>
          </div>
          
          {/* Removed "Type help to explore" as the command guide is self-explanatory */}
        </header>
        
        {/* Terminal Interface */}
        <Terminal
          input={input}
          onInputChange={setInput}
          history={history}
          onCommandSubmit={handleCommand}
          inputRef={inputRef}
          className="mb-6"
        />
        
        {/* Active Content Section */}
        {renderActiveSection()}
        
        {/* Walkthrough Continue Button - removed harsh border */}
        {walkthrough.active && walkthrough.step < walkthroughSteps.length - 1 && (
          <div className="my-4 flex justify-center">
            <button
              onClick={handleWalkthroughClick}
              className="bg-cyber-accent/10 text-cyber-accent px-5 py-1.5 rounded-md transition-all duration-300 hover:bg-cyber-accent/20"
            >
              Continue Tour (press space)
            </button>
          </div>
        )}
        
        {/* Footer - improved spacing and removed period */}
        <footer className="mt-4 pt-4 pb-3 border-t border-cyber-blue/10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="flex items-center text-xs font-plex">
                <span className="text-cyber-blue/80 mr-2">kodex ~$</span>
                <span className="text-cyber-blue-softer/70">System ready for commands</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-white/40 text-xs mr-4 font-orbitron">&copy; {new Date().getFullYear()} KODEX STUDIO</span>
              <div className="flex space-x-5">
                <a href="https://github.com/nessakodo" target="_blank" rel="noopener noreferrer" 
                   className="text-cyber-text/70 hover:text-cyber-blue transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/in/nessakodo" target="_blank" rel="noopener noreferrer" 
                   className="text-cyber-text/70 hover:text-cyber-blue transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://twitter.com/nessakodo" target="_blank" rel="noopener noreferrer" 
                   className="text-cyber-text/70 hover:text-cyber-blue transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
