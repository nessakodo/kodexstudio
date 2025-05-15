import { useState } from 'react';

interface ContactSectionProps {
  onClose?: () => void;
}

const projectTypes = [
  { value: "", label: "Select a service..." },
  { value: "security-audit", label: "Security Audit" },
  { value: "secure-development", label: "Secure Development" },
  { value: "enterprise-security", label: "Enterprise Security" },
  { value: "custom", label: "Custom Project" }
];

const scopeOptions = {
  goals: ["Security Audit", "Penetration Testing", "Secure Development"],
  sizes: ["Small", "Medium", "Enterprise"],
  timelines: ["Urgent", "Standard", "Flexible"]
};

export default function ContactSection({ onClose }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  });
  
  const [scopeSelections, setScopeSelections] = useState({
    goal: null as string | null,
    size: null as string | null,
    timeline: null as string | null
  });
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleScopeSelection = (category: 'goal' | 'size' | 'timeline', value: string) => {
    setScopeSelections(prev => ({
      ...prev,
      [category]: prev[category] === value ? null : value
    }));
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // In a real app, this would send the data to the server
  };
  
  const generateScope = () => {
    console.log('Generating scope with:', scopeSelections);
    // In a real app, this would generate a project scope
  };
  
  return (
    <section className="glass-panel border border-cyber-blue/20 backdrop-blur-xl p-6 my-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyber-blue/10">
        <div className="flex items-center">
          <span className="text-xs text-cyber-accent/80 font-plex mr-1">~/</span>
          <span className="text-xs text-cyber-accent/80 font-plex mr-2">contact —</span>
          <h2 className="text-cyber-highlight font-orbitron text-xl tracking-wide">
            Contact
          </h2>
        </div>
        
        {onClose && (
          <button 
            onClick={onClose}
            className="bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue p-1 rounded-md transition-colors"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-orbitron text-lg mb-4 text-cyber-blue/90">Project Inquiry</h3>
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm mb-1 text-white/80">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full bg-cyber-panel border border-cyber-blue/20 rounded-md px-4 py-2 focus:outline-none focus:border-cyber-blue/50"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm mb-1 text-white/80">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full bg-cyber-panel border border-cyber-blue/20 rounded-md px-4 py-2 focus:outline-none focus:border-cyber-blue/50"
              />
            </div>
            
            <div>
              <label htmlFor="projectType" className="block text-sm mb-1 text-white/80">Project Type</label>
              <select 
                id="projectType" 
                name="projectType"
                value={formData.projectType}
                onChange={handleFormChange}
                className="w-full bg-cyber-panel border border-cyber-blue/20 rounded-md px-4 py-2 focus:outline-none focus:border-cyber-blue/50 appearance-none"
              >
                {projectTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm mb-1 text-white/80">Project Details</label>
              <textarea 
                id="message" 
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                rows={4} 
                className="w-full bg-cyber-panel border border-cyber-blue/20 rounded-md px-4 py-2 focus:outline-none focus:border-cyber-blue/50"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="glass-button px-6 py-2.5 rounded text-center w-full sm:w-auto"
            >
              Send Message
            </button>
          </form>
        </div>
        
        <div>
          <h3 className="font-orbitron text-lg mb-4 text-cyber-blue/90">Project Scope Generator</h3>
          <div className="glass-panel border border-cyber-blue/20 p-5 rounded-lg mb-6">
            <p className="text-sm mb-4 text-white/80">Answer a few questions to generate a preliminary project scope and estimate.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-white/80">Primary Goal</label>
                <div className="flex flex-wrap gap-2">
                  {scopeOptions.goals.map(goal => (
                    <button
                      key={goal}
                      className={`px-3 py-1 rounded-md text-xs transition-colors glass-button ${
                        scopeSelections.goal === goal 
                          ? 'bg-cyber-blue/20 border-cyber-blue/30' 
                          : ''
                      }`}
                      onClick={() => handleScopeSelection('goal', goal)}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1 text-white/80">Project Size</label>
                <div className="flex flex-wrap gap-2">
                  {scopeOptions.sizes.map(size => (
                    <button
                      key={size}
                      className={`px-3 py-1 rounded-md text-xs transition-colors glass-button ${
                        scopeSelections.size === size 
                          ? 'bg-cyber-blue/20 border-cyber-blue/30' 
                          : ''
                      }`}
                      onClick={() => handleScopeSelection('size', size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1 text-white/80">Timeline</label>
                <div className="flex flex-wrap gap-2">
                  {scopeOptions.timelines.map(timeline => (
                    <button
                      key={timeline}
                      className={`px-3 py-1 rounded-md text-xs transition-colors glass-button ${
                        scopeSelections.timeline === timeline 
                          ? 'bg-cyber-blue/20 border-cyber-blue/30' 
                          : ''
                      }`}
                      onClick={() => handleScopeSelection('timeline', timeline)}
                    >
                      {timeline}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button 
              className="mt-6 glass-button px-5 py-2 rounded text-center w-full"
              onClick={generateScope}
            >
              Generate Scope
            </button>
          </div>
          
          <div>
            <h3 className="font-orbitron text-lg mb-4 text-cyber-blue/90">Book a Consultation</h3>
            <a 
              href="https://calendly.com/nessakodo/custom-security-inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button px-5 py-2.5 rounded text-center inline-flex items-center justify-center gap-2 w-full bg-cyber-blue/5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Schedule a Call
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
