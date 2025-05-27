import { useState, useEffect, useCallback, useRef } from 'react';
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
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { downloadResume } from '@/lib/utils';
import { Article } from '@/types';

/**
 * The main entry point of the application, rendering the terminal interface, header/hero, and footer.
 * Handles the walkthrough feature, which guides the user through the available commands and sections.
 * @returns {JSX.Element}
 */
export default function Home() {
  // Define state
  const [bootComplete, setBootComplete] = useState(false);
  const [walkthrough, setWalkthrough] = useState({ active: false, step: 0 });
  
  // Use hooks
  const isDesktop = useIsDesktop();
  const {
    input,
    setInput,
    history,
    activeSection,
    setActiveSection,
    inputRef,
    focusInput,
    handleCommandSubmit,
    addToHistory,
    setHistory
  } = useKodexTerminal();
  
  // Ref to store the initial timeout ID
  const initialWalkthroughTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs for mutually dependent functions
  const triggerFirstWalkthroughStepRef = useRef<(() => void) | null>(null);
  const handleWalkthroughClickRef = useRef<(() => void) | null>(null);

  // Define walkthrough steps
  const walkthroughSteps = [
    {
      message: "Welcome to KODEX.STUDIO—the portfolio of Nessa Kodo, where DevSecOps, security, and creative technology intersect.",
      command: "nessa-kodo"
    },
    {
      message: "Start with the vision. Meet Nessa Kodo—DevSecOps engineer, security strategist, and creative technologist.",
      command: "whois"
    },
    {
      message: "Explore published insights on secure development, cloud, and digital resilience.",
      command: "writings"
    },
    {
      message: "See flagship projects showcasing robust DevSecOps, adversarial resilience, and innovation.",
      command: "projects"
    },
    {
      message: "Review services: DevSecOps implementation, cloud security, security audits, and technical consulting.",
      command: "services"
    },
    {
      message: "Ready to collaborate? Reach out for strategic partnerships or project inquiries.",
      command: "contact"
    }
  ];
  
  // Define helper functions and handlers (using useCallback where appropriate)

  // Function to handle walkthrough completion
  const handleWalkthroughComplete = useCallback(() => {
    // Clear input and set to 'help'
    setInput('help'); // Set input to help
    
    // Add completion message to history
    addToHistory({
      output: (
        <div className={'text-terminal-green'}>
          <p>Walkthrough complete!</p>
          <p className={'mt-2'}>Type <span className={'text-cyber-blue'}>help</span> to see available commands.</p>
        </div>
      )
    });
    
    // Deactivate walkthrough state
    setWalkthrough({
      active: false,
      step: 0
    });
    
    // Focus the input field
    focusInput();
    
  }, [setInput, addToHistory, setWalkthrough, focusInput]);
  
  // Function to close active section and return to terminal
  const handleCloseSection = useCallback(() => {
    setActiveSection(null);
  }, [setActiveSection]);

  // Function to trigger the first step of the walkthrough (called by timeout or interaction)
  const triggerFirstWalkthroughStep = useCallback(() => {
    // Clear the initial timeout if it exists (safety)
    if (initialWalkthroughTimeoutRef.current) {
      clearTimeout(initialWalkthroughTimeoutRef.current);
      initialWalkthroughTimeoutRef.current = null;
    }

    setWalkthrough({ active: true, step: 0 });
    const firstStep = walkthroughSteps[0];
    
    // Set the active section for the first step
    setActiveSection(firstStep.command === "nessa-kodo" || firstStep.command === "whois" ? "about" : null); // Assuming first step is about/whois
    setInput(firstStep.command);
    
    // Add the output for the first step to history
     addToHistory({
      input: firstStep.command,
      output: (
        <div className="mb-2">
          <div className="text-sm text-cyber-blue/80 mb-2">{firstStep.message}</div>
          {/* Continue button visible especially for mobile */}
              <div className="mt-2">
                <button 
                  onClick={() => handleWalkthroughClickRef.current?.()}
                  className="glass-button px-4 py-1.5 text-xs rounded text-center items-center justify-center"
                >
                  Continue Tour →
                </button>
              </div>
        </div>
      )
    });
    focusInput();
  }, [walkthroughSteps, setActiveSection, setInput, addToHistory, focusInput]);
  
  // Function to handle walkthrough progression (called by continue button or space)
  const handleWalkthroughClick = useCallback(() => {
    // Clear the initial timeout if it exists (in case button is clicked before timeout)
    if (initialWalkthroughTimeoutRef.current) {
      clearTimeout(initialWalkthroughTimeoutRef.current);
      initialWalkthroughTimeoutRef.current = null;
    }
    
    // If walkthrough is not active, trigger the first step
    if (!walkthrough.active) {
      triggerFirstWalkthroughStepRef.current?.();
      return; // Stop here, the first step is triggered
    }
    
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
        if (step.command === "nessa-kodo" || step.command === "whois") setActiveSection("about");
        else if (step.command === "projects") setActiveSection("projects");
        else if (step.command === "services") setActiveSection("services");
        else if (step.command === "writings") setActiveSection("writings");
        else if (step.command === "clients") setActiveSection("clients");
        else if (step.command === "contact") setActiveSection("contact");
        
        // Set the input value to match the command
        setInput(step.command);
        
        // Add to history with the appropriate command and continue button for mobile
        addToHistory({ 
          input: step.command,
          output: (
            <div className="mb-2">
              <div className="text-sm text-cyber-blue/80 mb-2">{step.message}</div>
              
              {/* Continue button visible especially for mobile */}
              <div className="mt-2">
                <button 
                  onClick={() => handleWalkthroughClickRef.current?.()}
                  className="glass-button px-4 py-1.5 text-xs rounded text-center items-center justify-center"
                >
                  Continue Tour →
                </button>
              </div>
            </div>
          )
        });
        
        // Focus the input for the next command
        setTimeout(focusInput, 300);
      }, 300);
    } else {
      // Walkthrough is complete, show completion message and set input to help
      handleWalkthroughComplete();
    }
  }, [walkthrough.active, walkthrough.step, walkthroughSteps, setActiveSection, setInput, addToHistory, focusInput, handleWalkthroughComplete]);
  
  // Start the walkthrough (called by 'walkthrough' command)
  const startWalkthroughTour = useCallback(() => {
    // Add initial welcome message with instructions
    addToHistory({
      output: (
        <div className="mb-3">
          <p className="text-cyan-400 mb-1">Starting guided tour of KODEX.STUDIO</p>
          {/* <p className="text-cyan-300/80 text-sm mb-1">
            {isDesktop ? (
              <>Press <span className="bg-cyber-blue/20 px-2 py-0.5 rounded">SPACE</span> to continue to each step</>
            ) : (
              <>Tap anywhere on screen to continue</>
            )}
          </p> */}
          <p className="text-white/60 text-sm">Tour will start in 5 seconds or press Space/click Continue Tour</p>
          <div className="mt-3">
            <button 
              onClick={() => handleWalkthroughClickRef.current?.()}
              className="glass-button px-4 py-1.5 text-xs rounded text-center items-center justify-center"
            >
              Continue Tour →
            </button>
          </div>
        </div>
      )
    });
    
    // Set a timeout to trigger the first step after 5 seconds
    initialWalkthroughTimeoutRef.current = setTimeout(() => {
      triggerFirstWalkthroughStepRef.current?.();
    }, 5000);
    
  }, [addToHistory]); // Removed triggerFirstWalkthroughStep and handleWalkthroughClick from dependencies

  // Update refs whenever the functions change
  useEffect(() => {
    triggerFirstWalkthroughStepRef.current = triggerFirstWalkthroughStep;
    handleWalkthroughClickRef.current = handleWalkthroughClick;
  }, [triggerFirstWalkthroughStep, handleWalkthroughClick]);

  // Effect to handle escape key to close sections
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeSection) {
        handleCloseSection();
        focusInput();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [activeSection, handleCloseSection, focusInput]);
  
  // Effect to handle space key presses for walkthrough progression
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // If space is pressed and walkthrough is active or starting
      if (e.code === 'Space' && (walkthrough.active || initialWalkthroughTimeoutRef.current)) {
        e.preventDefault(); // Prevent page scrolling
        
        // Clear the initial timeout if it exists
        if (initialWalkthroughTimeoutRef.current) {
          clearTimeout(initialWalkthroughTimeoutRef.current);
          initialWalkthroughTimeoutRef.current = null;
        }
        
        // If walkthrough is not active, trigger the first step
        if (!walkthrough.active) {
          triggerFirstWalkthroughStepRef.current?.();
        } else if (walkthrough.step < walkthroughSteps.length - 1) { // If walkthrough is active and not at the last step
           handleWalkthroughClickRef.current?.();
        } else if (walkthrough.step === walkthroughSteps.length - 1) { // If at the last step, trigger completion
           handleWalkthroughComplete();
        }
      }
      
      // If escape is pressed during walkthrough, exit walkthrough
      if (e.key === 'Escape' && walkthrough.active) {
        // Clear the initial timeout if it exists
        if (initialWalkthroughTimeoutRef.current) {
          clearTimeout(initialWalkthroughTimeoutRef.current);
          initialWalkthroughTimeoutRef.current = null;
        }
        
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
    
    // Add event listener
    window.addEventListener('keydown', handleKeyPress);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      // Clear the initial timeout on cleanup
      if (initialWalkthroughTimeoutRef.current) {
        clearTimeout(initialWalkthroughTimeoutRef.current);
      }
    };
  }, [walkthrough.active, walkthrough.step, walkthroughSteps.length, setActiveSection, addToHistory, focusInput, handleWalkthroughComplete, triggerFirstWalkthroughStepRef, handleWalkthroughClickRef]); // Updated dependencies
  
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
    } else {
      // Clear initial walkthrough timeout if boot is not complete yet and user hasn't interacted
       if (initialWalkthroughTimeoutRef.current) {
          clearTimeout(initialWalkthroughTimeoutRef.current);
          initialWalkthroughTimeoutRef.current = null;
        }
    }
  }, [bootComplete, focusInput]);
  
  // Effect to clear timeout if component unmounts
  useEffect(() => {
    return () => {
       if (initialWalkthroughTimeoutRef.current) {
          clearTimeout(initialWalkthroughTimeoutRef.current);
          initialWalkthroughTimeoutRef.current = null;
        }
    };
  }, []);

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
          <h1 className="font-orbitron font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider mb-4 animate-fadeInUp">
            <span className="bg-gradient-to-r from-white/90 via-cyber-blue to-blue-400 bg-clip-text text-transparent drop-shadow-sm">KODEX STUDIO</span>
          </h1>
          <p className="font-space text-base sm:text-lg md:text-xl mb-4 text-white/80 animate-fadeInUp delay-100">
            Security-Focused Software Engineering & DevSecOps
          </p>
          <p className="text-cyber-blue text-xs sm:text-sm md:text-base mb-5 font-plex animate-fadeInUp delay-200">
            &gt; Secure | Resilient | Ethical
          </p>
          
          {/* Subtitle without border as a cohesive subtitle */}
          <div className="max-w-2xl mx-auto text-center animate-fadeInUp delay-400">
            <p className="text-white/80 text-xs sm:text-sm mb-1">
              Protecting your edge. Powering your future.
            </p>
            {/* <p className="text-cyber-accent font-plex text-[10px] sm:text-xs italic">
              Engineering systems that protect your digital sovereignty while enhancing your capabilities.
            </p> */}
          </div>
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
        
        {/* Walkthrough Continue Button */}
        {walkthrough.active && walkthrough.step < walkthroughSteps.length - 1 && (
          <div className="my-4 flex justify-center">
            <button
              onClick={() => handleWalkthroughClickRef.current?.()}
              className="bg-cyber-accent/10 text-cyber-accent px-4 sm:px-5 py-1.5 text-xs sm:text-sm rounded-md transition-all duration-300 hover:bg-cyber-accent/20"
            >
              {isDesktop ? "Continue Tour (press space)" : "Continue Tour"}
            </button>
          </div>
        )}
        
        {/* Footer */}
        <footer className="mt-4 pt-4 pb-3 border-t border-cyber-blue/10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="flex items-center text-[10px] sm:text-xs font-plex">
                <span className="text-cyber-blue/80 mr-2">kodex ~$</span>
                <span className="text-cyber-blue-softer/70">System ready for commands</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-white/40 text-[10px] sm:text-xs mr-4 font-orbitron">&copy; {new Date().getFullYear()} KODEX STUDIO</span>
              <div className="flex space-x-4 sm:space-x-5">
                <a href="https://github.com/nessakodo" target="_blank" rel="noopener noreferrer" 
                   className="text-cyber-text/70 hover:text-cyber-blue transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/nessamadison" target="_blank" rel="noopener noreferrer" 
                   className="text-cyber-text/70 hover:text-cyber-blue transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://x.com/nessakodo" target="_blank" rel="noopener noreferrer" 
                   className="text-cyber-text/70 hover:text-cyber-blue transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.242 2.25h.002Z"/>
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
