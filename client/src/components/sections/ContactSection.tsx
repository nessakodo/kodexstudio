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
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const [scopeSelections, setScopeSelections] = useState({
    goal: null as string | null,
    size: null as string | null,
    timeline: null as string | null
  });
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is modified
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleScopeSelection = (category: 'goal' | 'size' | 'timeline', value: string) => {
    setScopeSelections(prev => ({
      ...prev,
      [category]: prev[category] === value ? null : value
    }));
  };
  
  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      projectType: '',
      message: ''
    };
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
      isValid = false;
    }
    
    // Project type validation
    if (!formData.projectType) {
      errors.projectType = 'Please select a project type';
      isValid = false;
    }
    
    // Message validation
    if (!formData.message.trim()) {
      errors.message = 'Project details are required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Please provide more details (at least 10 characters)';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setFormStatus('submitting');
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form submitted:', formData);
      setFormStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          projectType: '',
          message: ''
        });
        setFormStatus('idle');
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
    }
  };
  
  const generateScope = () => {
    // Only generate if we have at least one selection
    if (!scopeSelections.goal && !scopeSelections.size && !scopeSelections.timeline) {
      // If no selections, prompt the user to make at least one selection
      alert("Please select at least one option to generate a project scope.");
      return;
    }
    
    // Generate scope text based on user selections
    let scopeText = "I'm interested in discussing ";
    
    // Add project type if selected
    if (formData.projectType) {
      const projectTypeLabel = projectTypes.find(t => t.value === formData.projectType)?.label || formData.projectType;
      scopeText += `a ${projectTypeLabel} project `;
    } else {
      scopeText += "a cybersecurity project ";
    }
    
    // Add goal if selected
    if (scopeSelections.goal) {
      scopeText += `focused on ${scopeSelections.goal}. `;
    } else {
      scopeText += "with your team. ";
    }
    
    // Add size and timeline details
    if (scopeSelections.size) {
      scopeText += `This is a ${scopeSelections.size.toLowerCase()} scale project `;
    }
    
    if (scopeSelections.timeline) {
      if (scopeSelections.timeline === "Urgent") {
        scopeText += `that needs to be completed quickly. The timeline is ${scopeSelections.timeline.toLowerCase()}, so I'd appreciate your prompt attention. `;
      } else if (scopeSelections.timeline === "Standard") {
        scopeText += `with a ${scopeSelections.timeline.toLowerCase()} timeline of 4-6 weeks. `;
      } else {
        scopeText += `with a ${scopeSelections.timeline.toLowerCase()} timeline that can be adjusted to your availability. `;
      }
    }
    
    // Add a closing statement
    scopeText += "I look forward to discussing the details further and receiving a proposal.";
    
    // Update the message in the form
    setFormData(prev => ({ ...prev, message: scopeText }));
  };
  
  return (
    <section className="glass-panel border border-cyber-blue/20 backdrop-blur-xl p-6 my-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyber-blue/10">
        <div className="flex items-center">
          <span className="text-xs text-cyber-blue/70 font-plex mr-1">~/</span>
          <span className="text-xs text-cyber-blue/70 font-plex mr-2">contact —</span>
          <h2 className="text-lg md:text-xl lg:text-2xl text-white font-orbitron tracking-wide">
            Get in Touch
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
          {formStatus === 'success' ? (
            <div className="bg-gradient-to-r from-blue-900/40 to-cyber-blue/20 border border-cyber-blue/30 rounded-lg p-6 text-center animate-fadeIn backdrop-blur-sm">
              <svg className="w-16 h-16 mx-auto text-cyber-blue/80 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h4 className="text-xl font-orbitron text-white mb-2">Message Sent!</h4>
              <p className="text-white/80 mb-4">Thank you for your inquiry. We'll get back to you shortly.</p>
              <button 
                onClick={() => setFormStatus('idle')}
                className="glass-button py-2 px-4 rounded-md mx-auto"
              >
                Send Another Message
              </button>
            </div>
          ) : formStatus === 'error' ? (
            <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-500/30 rounded-lg p-6 text-center animate-fadeIn">
              <svg className="w-16 h-16 mx-auto text-red-500/80 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h4 className="text-xl font-orbitron text-red-400 mb-2">Message Failed!</h4>
              <p className="text-white/80 mb-4">There was a problem sending your message. Please try again.</p>
              <button 
                onClick={() => setFormStatus('idle')}
                className="glass-button py-2 px-4 rounded-md mx-auto"
              >
                Try Again
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm mb-1 text-white/80">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className={`w-full bg-cyber-panel border rounded-md px-4 py-2 focus:outline-none focus:border-cyber-blue/50 ${
                    formErrors.name ? 'border-red-500/50' : 'border-cyber-blue/20'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm mb-1 text-white/80">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className={`w-full bg-cyber-panel border rounded-md px-4 py-2 focus:outline-none focus:border-cyber-blue/50 ${
                    formErrors.email ? 'border-red-500/50' : 'border-cyber-blue/20'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="projectType" className="block text-sm mb-1 text-white/80">Project Type</label>
                <select 
                  id="projectType" 
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleFormChange}
                  className={`w-full bg-cyber-panel border rounded-md px-4 py-2 focus:outline-none focus:border-cyber-blue/50 appearance-none ${
                    formErrors.projectType ? 'border-red-500/50' : 'border-cyber-blue/20'
                  }`}
                >
                  {projectTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {formErrors.projectType && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.projectType}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm mb-1 text-white/80">Project Details</label>
                <textarea 
                  id="message" 
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  rows={4} 
                  className={`w-full bg-cyber-panel border rounded-md px-4 py-2 focus:outline-none focus:border-cyber-blue/50 ${
                    formErrors.message ? 'border-red-500/50' : 'border-cyber-blue/20'
                  }`}
                ></textarea>
                {formErrors.message && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.message}</p>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={formStatus === 'submitting'}
                className={`bg-gradient-to-r from-cyber-accent/30 to-cyber-accent/20 hover:from-cyber-accent/40 hover:to-cyber-accent/30 backdrop-blur-sm px-6 py-2.5 rounded-md text-center w-full sm:w-auto border border-cyber-accent/20 transition-all duration-200 shadow-sm shadow-cyber-accent/10 font-medium tracking-wide ${
                  formStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {formStatus === 'submitting' ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Message'}
              </button>
            </form>
          )}
        </div>
        
        <div>
          <h3 className="font-orbitron text-lg mb-4 text-cyber-highlight tracking-wide">Project Scope Generator</h3>
          <div className="glass-panel border border-cyber-blue/20 p-5 rounded-lg mb-6">
            <p className="text-sm mb-4 text-white/80">Answer a few questions to generate a preliminary project scope and estimate.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-white/80">Primary Goal</label>
                <div className="flex flex-wrap gap-2">
                  {scopeOptions.goals.map(goal => (
                    <button
                      key={goal}
                      className={`px-3 py-1 rounded-md text-xs transition-all duration-200 border ${
                        scopeSelections.goal === goal 
                          ? 'bg-cyber-blue/20 border-cyber-blue/40 text-cyber-highlight' 
                          : 'bg-cyber-panel/50 border-cyber-blue/10 hover:bg-cyber-blue/10 hover:border-cyber-blue/20'
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
                      className={`px-3 py-1 rounded-md text-xs transition-all duration-200 border ${
                        scopeSelections.size === size 
                          ? 'bg-cyber-blue/20 border-cyber-blue/40 text-cyber-highlight' 
                          : 'bg-cyber-panel/50 border-cyber-blue/10 hover:bg-cyber-blue/10 hover:border-cyber-blue/20'
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
                      className={`px-3 py-1 rounded-md text-xs transition-all duration-200 border ${
                        scopeSelections.timeline === timeline 
                          ? 'bg-cyber-blue/20 border-cyber-blue/40 text-cyber-highlight' 
                          : 'bg-cyber-panel/50 border-cyber-blue/10 hover:bg-cyber-blue/10 hover:border-cyber-blue/20'
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
              className="mt-6 bg-gradient-to-r from-cyber-blue/30 to-cyber-blue/20 hover:from-cyber-blue/40 hover:to-cyber-blue/30 backdrop-blur-sm px-5 py-2 rounded-md text-center w-full border border-cyber-blue/20 transition-all duration-200 font-medium tracking-wide"
              onClick={generateScope}
            >
              Generate Scope
            </button>
          </div>
          
          <div>
            <h3 className="font-orbitron text-lg mb-4 text-cyber-highlight tracking-wide">Book a Consultation</h3>
            <a 
              href="https://calendly.com/nessakodo/kodex-studio-information-call"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-cyber-accent/30 to-cyber-accent/20 hover:from-cyber-accent/40 hover:to-cyber-accent/30 backdrop-blur-sm px-5 py-2.5 rounded-md text-center inline-flex items-center justify-center gap-2 w-full border border-cyber-accent/20 transition-all duration-200 shadow-sm shadow-cyber-accent/10 font-medium tracking-wide"
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
