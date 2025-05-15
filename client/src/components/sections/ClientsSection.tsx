import { clients, testimonials } from '@/data/clients';

interface ClientsSectionProps {
  onClose?: () => void;
}

export default function ClientsSection({ onClose }: ClientsSectionProps) {
  return (
    <section className="glass-panel border border-cyber-blue/20 backdrop-blur-xl p-6 my-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyber-blue/10">
        <div className="flex items-center">
          <span className="text-xs text-cyber-blue/70 font-plex mr-1">~/</span>
          <span className="text-xs text-cyber-blue/70 font-plex mr-2">clients —</span>
          <h2 className="text-yellow-400 font-orbitron text-xl tracking-wide">
            Clients & Case Studies
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {clients.map(client => (
          <div key={client.id} className="glass-panel border border-cyber-blue/20 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-cyber-blue/5 border border-cyber-blue/20 flex items-center justify-center mr-4">
                <i className={`fas fa-${client.icon} text-cyber-blue/90 text-2xl`}></i>
              </div>
              <div>
                <h3 className="font-orbitron text-lg text-cyber-highlight tracking-wide">{client.name}</h3>
                <p className="text-sm text-cyber-text/70">{client.industry}</p>
              </div>
            </div>
            
            <p className="mb-4 text-sm text-white/80">{client.description}</p>
            
            <div className="mb-4">
              <h4 className="text-cyber-accent/90 text-sm mb-2 font-medium">Key Results:</h4>
              <ul className="text-sm space-y-2">
                {client.results.map((result, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-4 h-4 text-cyber-blue/90 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/80">{result}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="text-right">
              <button className="glass-button py-1.5 px-3 rounded text-sm">
                View Case Study
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div>
        <h3 className="font-orbitron text-lg mb-4 text-cyber-blue/90">Client Testimonials</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="glass-panel border border-cyber-blue/20 p-5 rounded-lg">
              <p className="italic text-sm mb-4 text-white/80">{testimonial.quote}</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-cyber-blue/5 border border-cyber-blue/20 flex items-center justify-center mr-3">
                  <span className="text-cyber-blue/90">{testimonial.initials}</span>
                </div>
                <div>
                  <p className="font-plex text-sm text-white/90">{testimonial.author}</p>
                  <p className="text-xs text-cyber-text/60">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
