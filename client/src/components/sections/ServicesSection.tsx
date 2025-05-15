import { services } from '@/data/services';
import { cn } from '@/lib/utils';

export default function ServicesSection() {
  return (
    <section className="glass-panel p-6 my-8">
      <h2 className="font-orbitron text-2xl mb-6 text-cyber-blue">Services</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map(service => (
          <div 
            key={service.id}
            className={cn(
              "glass-panel hover:shadow-[0_0_15px_rgba(15,244,198,0.3)] transition-all duration-300 p-6 flex flex-col relative overflow-hidden",
              service.highlighted && "border-2 border-cyber-purple shadow-[0_0_15px_rgba(138,43,226,0.3)]"
            )}
          >
            <span 
              className={cn(
                "absolute top-0 right-0 px-4 py-1 font-space text-sm",
                service.highlighted 
                  ? "bg-cyber-purple/20 text-cyber-purple" 
                  : "bg-cyber-blue/20 text-cyber-blue"
              )}
            >
              {service.tier}
            </span>
            <h3 className="font-space text-xl mb-4 mt-4">{service.title}</h3>
            <p className="mb-4 text-sm flex-grow">{service.description}</p>
            <ul className="mb-6 text-sm space-y-2">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <i className="fas fa-check text-terminal-green mt-1 mr-2"></i>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="text-center">
              <span className="block text-2xl font-semibold mb-2">{service.price}</span>
              <button 
                className={cn(
                  "border-2 px-4 py-1 rounded-md transition duration-300 w-full",
                  service.highlighted
                    ? "border-cyber-purple hover:bg-cyber-purple/10 hover:shadow-[0_0_15px_rgba(138,43,226,0.5)]"
                    : "border-cyber-blue hover:bg-cyber-blue/10 hover:shadow-[0_0_15px_rgba(15,244,198,0.5)]"
                )}
              >
                Get Started
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
