import { clients, testimonials } from '@/data/clients';

export default function ClientsSection() {
  return (
    <section className="glass-panel p-6 my-8">
      <h2 className="font-orbitron text-2xl mb-6 text-cyber-blue">Clients & Case Studies</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {clients.map(client => (
          <div key={client.id} className="glass-panel p-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-cyber-panel flex items-center justify-center mr-4">
                <i className={`fas fa-${client.icon} text-cyber-blue text-2xl`}></i>
              </div>
              <div>
                <h3 className="font-space text-lg">{client.name}</h3>
                <p className="text-sm text-cyber-text/70">{client.industry}</p>
              </div>
            </div>
            
            <p className="mb-4 text-sm">{client.description}</p>
            
            <div className="mb-4">
              <h4 className="text-terminal-green text-sm mb-2">Key Results:</h4>
              <ul className="text-sm space-y-1">
                {client.results.map((result, index) => (
                  <li key={index} className="flex items-start">
                    <i className="fas fa-check text-terminal-green mt-1 mr-2"></i>
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="text-right">
              <button className="text-xs border border-cyber-blue px-3 py-1 rounded transition hover:bg-cyber-blue/10">
                View Case Study
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div>
        <h3 className="font-space text-lg mb-4 text-terminal-green">Client Testimonials</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="glass-panel p-4">
              <p className="italic text-sm mb-3">{testimonial.quote}</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-cyber-panel flex items-center justify-center mr-3">
                  <span className="text-cyber-blue">{testimonial.initials}</span>
                </div>
                <div>
                  <p className="font-space text-sm">{testimonial.author}</p>
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
