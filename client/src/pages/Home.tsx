import { useState, useEffect } from 'react';
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
import { WalkthroughStep, TerminalCommand } from '@/types';

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);
  
  // Define walkthrough steps
  const walkthroughSteps: WalkthroughStep[] = [
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
  
  // Define terminal commands
  const commands: TerminalCommand[] = [
    {
      name: "help",
      description: "Show list of available commands",
      action: function() {
        setActiveSection(null);
      }
    },
    {
      name: "walkthrough",
      description: "Step-by-step guided tour",
      action: function() {
        startWalkthrough();
      }
    },
    {
      name: "nessa-kodo",
      description: "About section + downloadable resume",
      action: function() {
        setActiveSection("about");
      }
    },
    {
      name: "projects",
      description: "Interactive portfolio",
      action: function() {
        setActiveSection("projects");
      }
    },
    {
      name: "services",
      description: "Freelance offerings with tiers",
      action: function() {
        setActiveSection("services");
      }
    },
    {
      name: "writings",
      description: "Auto-pulled blog content",
      action: function() {
        setActiveSection("writings");
      }
    },
    {
      name: "clients",
      description: "Case studies & testimonials",
      action: function() {
        setActiveSection("clients");
      }
    },
    {
      name: "contact",
      description: "Project form + scope generator",
      action: function() {
        setActiveSection("contact");
      }
    },
    {
      name: "resume",
      description: "Trigger resume download",
      action: function() {
        downloadResume();
      }
    },
    {
      name: "clear",
      description: "Clear terminal output",
      action: function() {
        clearHistory();
      }
    }
  ];
  
  const {
    input,
    setInput,
    history,
    activeSection,
    setActiveSection,
    walkthrough,
    inputRef,
    focusInput,
    handleCommandSubmit,
    clearHistory,
    startWalkthrough,
    advanceWalkthrough
  } = useKodexTerminal(commands, walkthroughSteps);
  
  // Focus the terminal input when clicking anywhere in the terminal container
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
          onCommandSubmit={handleCommandSubmit}
          inputRef={inputRef}
          className="mb-8"
        />
        
        {/* Active Content Section */}
        {renderActiveSection()}
        
        {/* Walkthrough Continue Button */}
        {walkthrough.active && walkthrough.step < walkthroughSteps.length - 1 && (
          <div className="my-4 flex justify-center">
            <button
              onClick={advanceWalkthrough}
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
