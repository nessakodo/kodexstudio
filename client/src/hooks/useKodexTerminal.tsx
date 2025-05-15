import { useState, useEffect, useCallback, useRef } from 'react';
import { TerminalHistory, TerminalCommand, WalkthroughStep } from '@/types';
import { sleep } from '@/lib/utils';

export function useKodexTerminal(
  commands: TerminalCommand[],
  walkthroughSteps: WalkthroughStep[]
) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalHistory[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [walkthrough, setWalkthrough] = useState({
    active: false,
    step: 0
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const commandsMap = useRef<Map<string, TerminalCommand>>(new Map());
  
  // Initialize commands map
  useEffect(() => {
    const map = new Map<string, TerminalCommand>();
    commands.forEach(cmd => map.set(cmd.name, cmd));
    commandsMap.current = map;
    
    // Initial welcome message
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
  }, [commands]);
  
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const hideAllSections = useCallback(() => {
    setActiveSection(null);
  }, []);
  
  const executeCommand = useCallback((commandName: string) => {
    const command = commandsMap.current.get(commandName);
    
    if (command) {
      // Execute the command action
      command.action();
      
      // Add the command output to history
      setHistory((prev) => [
        ...prev,
        {
          input: commandName,
          output: (
            <div className="mb-4">
              <div>Executing command: {commandName}</div>
            </div>
          )
        }
      ]);
      
      return true;
    }
    
    setHistory((prev) => [
      ...prev,
      {
        input: commandName,
        output: (
          <div className="mb-4 text-error-red">
            Command not recognized: {commandName}
          </div>
        )
      }
    ]);
    
    return false;
  }, []);
  
  const clearHistory = useCallback(() => {
    setHistory([
      {
        output: (
          <div className="mb-4">
            <p className="text-terminal-green">Terminal cleared. Type help for available commands.</p>
          </div>
        )
      }
    ]);
  }, []);
  
  const handleCommandSubmit = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const commandName = input.trim().toLowerCase();
      
      if (commandName) {
        // Add command to history
        setHistory((prev) => [
          ...prev,
          {
            input: commandName,
            output: <></>
          }
        ]);
        
        // Execute the command
        executeCommand(commandName);
        
        // Clear input
        setInput('');
      }
    }
  }, [input, executeCommand]);
  
  const startWalkthrough = useCallback(async () => {
    hideAllSections();
    
    setHistory((prev) => [
      ...prev,
      {
        output: (
          <div className="mb-4 text-terminal-green">
            Starting guided tour...
          </div>
        )
      }
    ]);
    
    setWalkthrough({
      active: true,
      step: 0
    });
    
    // Start first step with a delay
    await sleep(500);
    
    if (walkthroughSteps.length > 0) {
      const firstStep = walkthroughSteps[0];
      
      setHistory((prev) => [
        ...prev,
        {
          output: (
            <div className="mb-2 text-terminal-green">
              {firstStep.message}
            </div>
          )
        }
      ]);
      
      // Execute the first command
      executeCommand(firstStep.command);
    }
  }, [executeCommand, hideAllSections, walkthroughSteps]);
  
  const advanceWalkthrough = useCallback(async () => {
    if (!walkthrough.active) return;
    
    const nextStep = walkthrough.step + 1;
    
    if (nextStep < walkthroughSteps.length) {
      const step = walkthroughSteps[nextStep];
      
      setHistory((prev) => [
        ...prev,
        {
          output: (
            <div className="mb-2 text-terminal-green">
              {step.message}
            </div>
          )
        }
      ]);
      
      // Execute the command for this step
      executeCommand(step.command);
      
      // Update step
      setWalkthrough((prev) => ({
        ...prev,
        step: nextStep
      }));
    } else {
      // End of walkthrough
      setHistory((prev) => [
        ...prev,
        {
          output: (
            <div className="mb-4 mt-4 text-terminal-green">
              Tour complete! Feel free to explore more using the terminal commands.
            </div>
          )
        }
      ]);
      
      setWalkthrough({
        active: false,
        step: 0
      });
    }
  }, [walkthrough, walkthroughSteps, executeCommand]);
  
  return {
    input,
    setInput,
    history,
    setHistory,
    activeSection,
    setActiveSection,
    walkthrough,
    inputRef,
    focusInput,
    hideAllSections,
    executeCommand,
    clearHistory,
    handleCommandSubmit,
    startWalkthrough,
    advanceWalkthrough
  };
}
