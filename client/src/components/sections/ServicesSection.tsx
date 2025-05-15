import { services } from '@/data/services';
import { cn } from '@/lib/utils';

interface ServicesSectionProps {
  onClose?: () => void;
}

export default function ServicesSection({ onClose }: ServicesSectionProps) {
  return (
    <section className="glass-panel border border-cyber-blue/20 backdrop-blur-xl p-6 my-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyber-blue/10">
        <div className="flex items-center">
          <span className="text-xs text-cyber-blue/70 font-plex mr-1">~/</span>
          <span className="text-xs text-cyber-blue/70 font-plex mr-2">services —</span>
          <h2 className="text-white font-orbitron text-xl tracking-wide">
            Service Offerings
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map(service => (
          <div 
            key={service.id}
            className={cn(
              "glass-panel border border-cyber-blue/20 transition-all duration-300 p-6 flex flex-col relative overflow-hidden rounded-lg",
              service.highlighted && "border-cyber-blue/40 bg-cyber-blue/5"
            )}
          >
            <span 
              className={cn(
                "absolute top-0 right-0 px-4 py-1 font-plex text-xs",
                service.highlighted 
                  ? "bg-cyber-blue/20 text-cyber-blue" 
                  : "bg-cyber-blue/10 text-cyber-blue/80"
              )}
            >
              {service.tier}
            </span>
            <h3 className="font-orbitron text-lg mb-4 mt-4 text-cyber-blue">{service.title}</h3>
            <p className="mb-4 text-sm text-white/80 flex-grow">{service.description}</p>
            <ul className="mb-6 text-sm space-y-2.5">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-4 h-4 text-cyber-blue mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/70">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="text-center mt-auto">
              <a 
                href={service.contactLink}
                onClick={(e) => {
                  if (service.contactLink === '#contact' && onClose) {
                    e.preventDefault();
                    onClose();
                    setTimeout(() => {
                      const contactButton = document.querySelector('button[data-section="contact"]') as HTMLButtonElement;
                      if (contactButton) contactButton.click();
                    }, 100);
                  }
                }}
                className="glass-button px-5 py-2.5 rounded text-center inline-flex items-center justify-center gap-2 w-full"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                {service.tier === 'Starter' ? 'Choose Starter Plan' : 
                  service.tier === 'Pro' ? 'Select Pro Plan' : 
                  service.tier === 'Premium' ? 'Request Premium Package' : 
                  'Discuss Your Project'}
              </a>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 p-5 border border-cyber-blue/20 rounded-lg bg-cyber-blue/5">
        <h3 className="text-lg font-orbitron text-cyber-blue mb-3">Custom Solutions</h3>
        <p className="text-white/80 mb-4">
          Need a tailored security solution? I work closely with clients to develop custom cybersecurity strategies that address your specific challenges and requirements.
        </p>
        <div className="text-right">
          <a 
            href="#contact" 
            onClick={(e) => {
              e.preventDefault();
              if (onClose) {
                onClose();
                setTimeout(() => {
                  const contactButton = document.querySelector('button[data-section="contact"]') as HTMLButtonElement;
                  if (contactButton) {
                    contactButton.click();
                    
                    // Wait for contact form to load and then prefill message
                    setTimeout(() => {
                      const messageField = document.querySelector('#message') as HTMLTextAreaElement;
                      if (messageField) {
                        messageField.value = "I'm interested in discussing a custom security solution for my organization.";
                        // Trigger change event to update form state
                        const event = new Event('input', { bubbles: true });
                        messageField.dispatchEvent(event);
                      }
                    }, 300);
                  }
                }, 100);
              }
            }}
            className="glass-button px-5 py-2 rounded text-center inline-flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Discuss Your Project
          </a>
        </div>
      </div>
    </section>
  );
}
