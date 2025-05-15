import { useState } from 'react';

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

export default function ContactSection() {
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
    <section className="glass-panel p-6 my-8">
      <h2 className="font-orbitron text-2xl mb-6 text-cyber-blue">Contact</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-space text-lg mb-4 text-terminal-green">Project Inquiry</h3>
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm mb-1">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full bg-cyber-dark border border-cyber-text/20 rounded-md px-4 py-2 focus:outline-none focus:border-cyber-blue"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm mb-1">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full bg-cyber-dark border border-cyber-text/20 rounded-md px-4 py-2 focus:outline-none focus:border-cyber-blue"
              />
            </div>
            
            <div>
              <label htmlFor="projectType" className="block text-sm mb-1">Project Type</label>
              <select 
                id="projectType" 
                name="projectType"
                value={formData.projectType}
                onChange={handleFormChange}
                className="w-full bg-cyber-dark border border-cyber-text/20 rounded-md px-4 py-2 focus:outline-none focus:border-cyber-blue appearance-none"
              >
                {projectTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm mb-1">Project Details</label>
              <textarea 
                id="message" 
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                rows={4} 
                className="w-full bg-cyber-dark border border-cyber-text/20 rounded-md px-4 py-2 focus:outline-none focus:border-cyber-blue"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="border-2 border-cyber-blue px-6 py-2 rounded-md transition duration-300 hover:bg-cyber-blue/10 hover:shadow-[0_0_15px_rgba(15,244,198,0.5)] w-full sm:w-auto"
            >
              Send Message
            </button>
          </form>
        </div>
        
        <div>
          <h3 className="font-space text-lg mb-4 text-terminal-green">Project Scope Generator</h3>
          <div className="glass-panel p-4 mb-6">
            <p className="text-sm mb-4">Answer a few questions to generate a preliminary project scope and estimate.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Primary Goal</label>
                <div className="flex flex-wrap gap-2">
                  {scopeOptions.goals.map(goal => (
                    <button
                      key={goal}
                      className={`px-3 py-1 border ${
                        scopeSelections.goal === goal 
                          ? 'border-cyber-blue bg-cyber-blue/10' 
                          : 'border-cyber-blue/50'
                      } rounded-full text-xs hover:bg-cyber-blue/10 transition-colors`}
                      onClick={() => handleScopeSelection('goal', goal)}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Project Size</label>
                <div className="flex flex-wrap gap-2">
                  {scopeOptions.sizes.map(size => (
                    <button
                      key={size}
                      className={`px-3 py-1 border ${
                        scopeSelections.size === size 
                          ? 'border-cyber-blue bg-cyber-blue/10' 
                          : 'border-cyber-blue/50'
                      } rounded-full text-xs hover:bg-cyber-blue/10 transition-colors`}
                      onClick={() => handleScopeSelection('size', size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Timeline</label>
                <div className="flex flex-wrap gap-2">
                  {scopeOptions.timelines.map(timeline => (
                    <button
                      key={timeline}
                      className={`px-3 py-1 border ${
                        scopeSelections.timeline === timeline 
                          ? 'border-cyber-blue bg-cyber-blue/10' 
                          : 'border-cyber-blue/50'
                      } rounded-full text-xs hover:bg-cyber-blue/10 transition-colors`}
                      onClick={() => handleScopeSelection('timeline', timeline)}
                    >
                      {timeline}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button 
              className="mt-6 border-2 border-cyber-blue px-4 py-1 rounded-md transition duration-300 hover:bg-cyber-blue/10 hover:shadow-[0_0_15px_rgba(15,244,198,0.5)] w-full"
              onClick={generateScope}
            >
              Generate Scope
            </button>
          </div>
          
          <div>
            <h3 className="font-space text-lg mb-4 text-terminal-green">Book a Consultation</h3>
            <button className="border-2 border-cyber-purple px-6 py-2 rounded-md transition duration-300 hover:bg-cyber-purple/10 hover:shadow-[0_0_15px_rgba(138,43,226,0.5)] w-full">
              <i className="far fa-calendar-alt mr-2"></i> Schedule a Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
