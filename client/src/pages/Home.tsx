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
    handleCommandSubmit
  } = useKodexTerminal();
  
  // Function to handle walkthrough progression
  const handleWalkthroughClick = () => {
    const nextStep = walkthrough.step + 1;
    
    if (nextStep < walkthroughSteps.length) {
      // Process next step
      const step = walkthroughSteps[nextStep];
      
      // Update step
      setWalkthrough({
        active: true,
        step: nextStep
      });
      
      // Set the active section based on the command
      if (step.command === "nessa-kodo") setActiveSection("about");
      else if (step.command === "projects") setActiveSection("projects");
      else if (step.command === "services") setActiveSection("services");
      else if (step.command === "writings") setActiveSection("writings");
      else if (step.command === "clients") setActiveSection("clients");
      else if (step.command === "contact") setActiveSection("contact");
    } else {
      // End of walkthrough
      setWalkthrough({
        active: false,
        step: 0
      });
    }
  };
  
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
        return <AboutSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'services':
        return <ServicesSection />;
      case 'writings':
        return <WritingsSection />;
      case 'clients':
        return <ClientsSection />;
      case 'contact':
        return <ContactSection />;
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
      <div className={`container mx-auto px-4 py-8 max-w-6xl min-h-screen flex flex-col transition-opacity duration-500 ${bootComplete ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header / Hero */}
        <header className="pt-8 md:pt-16 text-center mb-12">
          <h1 className="font-orbitron font-bold text-4xl sm:text-5xl md:text-6xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-cyber-purple animate-pulse-glow mb-4">
            KODEX.STUDIO
          </h1>
          <p className="font-space text-lg md:text-xl mb-8">
            The Cyber-Somatic Lab of Nessa Kodo<br />
            <span className="text-sm text-terminal-dim/60">Mindful | Tactical | Technical</span>
          </p>
          <p className="text-terminal-green text-sm md:text-base mb-2">
            Type <span className="font-semibold">`help`</span> to explore — or try <span className="font-semibold">`&gt; walkthrough`</span> to auto-tour the studio.
          </p>
        </header>
        
        {/* Terminal Interface */}
        <Terminal
          input={input}
          onInputChange={setInput}
          history={history}
          onCommandSubmit={handleCommand}
          inputRef={inputRef}
          className="mb-8"
        />
        
        {/* Active Content Section */}
        {renderActiveSection()}
        
        {/* Walkthrough Continue Button */}
        {walkthrough.active && walkthrough.step < walkthroughSteps.length - 1 && (
          <div className="my-4 flex justify-center">
            <button
              onClick={handleWalkthroughClick}
              className="border border-cyber-blue px-4 py-1 rounded-md transition duration-300 hover:bg-cyber-blue/10"
            >
              Continue Tour
            </button>
          </div>
        )}
        
        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-cyber-text/60 py-6">
          <p>&copy; {new Date().getFullYear()} KODEX.STUDIO. All rights reserved.</p>
          <p className="mt-2">Designed and developed by Nessa Kodo</p>
        </footer>
      </div>
    </div>
  );
}
