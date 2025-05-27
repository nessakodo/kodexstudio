import { showcase, testimonials } from '@/data/showcase';
import { Showcase, Testimonial } from '@/types';

interface ShowcaseSectionProps {
  onClose?: () => void;
}

export default function ShowcaseSection({ onClose }: ShowcaseSectionProps) {
  return (
    <section className="glass-panel border border-cyber-blue/20 backdrop-blur-xl p-6 my-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyber-blue/10">
        <div className="flex items-center">
          <span className="text-xs text-cyber-blue/70 font-plex mr-1">~/</span>
          <span className="text-xs text-cyber-blue/70 font-plex mr-2">showcase —</span>
          <h2 className="text-lg md:text-xl lg:text-2xl text-white font-orbitron tracking-wide">
            Community Impact
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
        {showcase.map((project: Showcase) => (
          <div key={project.id} className="glass-panel border border-cyber-blue/20 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-cyber-blue/10 flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-cyber-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {project.icon === 'lock' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
              </div>
              <div>
                <h3 className="text-xl text-white font-orbitron">{project.name}</h3>
                <p className="text-sm text-cyber-blue/70">{project.industry}</p>
              </div>
            </div>

            <p className="text-white/80 mb-4">{project.description}</p>

            <div className="space-y-2 mb-6">
              {project.results.map((result, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-3 text-cyber-blue pt-1">•</div>
                  <p className="text-sm text-white/70">{result}</p>
                </div>
              ))}
            </div>

            <a 
              href={project.caseStudyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button w-full py-2.5 px-4 rounded flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Case Study
            </a>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h3 className="text-xl text-white font-orbitron mb-6">Endorsements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial: Testimonial) => (
            <div key={testimonial.id} className="glass-panel border border-cyber-blue/20 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-cyber-blue/10 flex items-center justify-center mr-4">
                  <span className="text-cyber-blue font-medium">{testimonial.initials}</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">{testimonial.author}</h4>
                  <p className="text-sm text-cyber-blue/70">{testimonial.position}</p>
                </div>
              </div>
              <p className="text-white/80 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 