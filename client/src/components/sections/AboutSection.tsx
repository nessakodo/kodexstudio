import { downloadResume } from '@/lib/utils';

export default function AboutSection() {
  return (
    <section className="glass-panel border border-cyber-blue/20 backdrop-blur-xl p-6 my-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyber-blue/10">
        <h2 className="text-cyber-blue font-orbitron text-2xl">
          Nessa Kodo
        </h2>
        <div className="text-xs text-cyber-text/40 font-plex">
          CYBERSECURITY SPECIALIST
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="prose prose-invert mb-6">
            <p className="text-white/90 mb-4">
              I'm a cybersecurity-focused creative technologist with a
              mission to build secure, ethical systems that respect digital
              sovereignty.
            </p>
            
            <p className="text-white/80 mb-4">
              With a background spanning both secure systems architecture and
              design, I specialize in blending technical precision with intuitive
              interfaces. My work encompasses application security, vulnerability
              analysis, full-stack development, and mindful tech education.
            </p>
            
            <p className="text-white/80 mb-4">
              As the founder of <span className="text-cyber-blue">KODEX.STUDIO</span>, I help clients and communities build
              safe, elegant, and scalable digital tools that enhance human
              capability while respecting autonomy.
            </p>
            
            <div className="bg-cyber-blue/5 border border-cyber-blue/20 rounded-lg p-4 my-6">
              <h3 className="text-cyber-blue font-plex m-0 mb-3 text-base font-medium">MISSION</h3>
              <p className="text-white/90 m-0 text-sm pl-4 border-l-2 border-cyber-blue/30">
                To create digital systems that prioritize human dignity,
                security, and sovereignty. I believe technology should serve
                as an extension of human capability rather than a
                replacement for human judgment.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-cyber-blue mb-3 font-plex text-sm font-medium">PROFESSIONAL FOCUS</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-3 text-cyber-blue pt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                      <path d="M19 11h-6V5c0-.6-.4-1-1-1s-1 .4-1 1v6H5c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1v-6h6c.6 0 1-.4 1-1s-.4-1-1-1z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/90 m-0">Security Architecture</h4>
                    <p className="text-xs text-white/60 mt-1">
                      Secure-by-design systems & protocols
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 text-cyber-blue pt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                      <path d="M19 11h-6V5c0-.6-.4-1-1-1s-1 .4-1 1v6H5c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1v-6h6c.6 0 1-.4 1-1s-.4-1-1-1z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/90 m-0">Full-Stack Development</h4>
                    <p className="text-xs text-white/60 mt-1">
                      React, Node.js, TypeScript, Python
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 text-cyber-blue pt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                      <path d="M19 11h-6V5c0-.6-.4-1-1-1s-1 .4-1 1v6H5c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1v-6h6c.6 0 1-.4 1-1s-.4-1-1-1z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/90 m-0">Digital Systems Design</h4>
                    <p className="text-xs text-white/60 mt-1">
                      Workflow optimization & knowledge systems
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-cyber-blue mb-3 font-plex text-sm font-medium">CERTIFICATIONS</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-3 text-cyber-blue pt-1">•</div>
                  <div>
                    <h4 className="text-sm font-medium text-white/90 m-0">Software Engineering</h4>
                    <p className="text-xs text-white/60 mt-1">Flatiron School</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 text-cyber-blue pt-1">•</div>
                  <div>
                    <h4 className="text-sm font-medium text-white/90 m-0">Cybersecurity</h4>
                    <p className="text-xs text-white/60 mt-1">UC Davis (in progress)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 text-cyber-blue pt-1">•</div>
                  <div>
                    <h4 className="text-sm font-medium text-white/90 m-0">Security+</h4>
                    <p className="text-xs text-white/60 mt-1">CompTIA (in progress)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-start gap-4 mb-4">
            <div>
              <h3 className="text-cyber-blue mb-3 font-plex text-sm font-medium">CURRENT ROLES</h3>
              <div className="space-y-2 text-sm">
                <p className="text-white/90 font-medium m-0">Business Dev @ PDS Research</p>
                <p className="text-white/60 text-xs m-0">Security infrastructure, drone technology</p>
                
                <p className="text-white/90 font-medium m-0 mt-4">AI Student Association</p>
                <p className="text-white/60 text-xs m-0">Educational collaborations, program funding</p>
                
                <p className="text-white/90 font-medium m-0 mt-4">KODEX.STUDIO</p>
                <p className="text-white/60 text-xs m-0">Founder & Principal Consultant</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="glass-panel border border-cyber-blue/20 rounded-xl p-6 text-center">
            <div className="mx-auto mb-6 flex justify-center">
              <div className="w-32 h-32 rounded-full border-2 border-cyber-blue/30 p-1 flex items-center justify-center">
                <div className="bg-cyber-blue/10 w-full h-full rounded-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-cyber-blue/90" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.42,10.18L12.71,2.3a1,1,0,0,0-1.42,0L3.58,10.19A2,2,0,0,0,3,11.62V20a2,2,0,0,0,1.89,2H19.15A2,2,0,0,0,21,20V11.62A2.07,2.07,0,0,0,20.42,10.18ZM12,17a2,2,0,1,1,2-2A2,2,0,0,1,12,17Z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl text-cyber-blue font-medium font-orbitron mb-1">Nessa Kodo</h3>
            <p className="text-white/60 text-xs font-plex uppercase tracking-wide mb-6">
              CYBERSECURITY SPECIALIST
            </p>
            
            <div className="flex flex-col space-y-4">
              <button 
                onClick={downloadResume}
                className="glass-button w-full py-2.5 px-4 rounded flex items-center justify-center gap-2 text-cyber-blue hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Download Resume
              </button>
              
              <div className="flex justify-center space-x-4 mt-4">
                <a href="https://github.com/nessakodo" target="_blank" rel="noopener noreferrer" className="text-cyber-text/70 hover:text-cyber-blue transition p-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/in/nessakodo" target="_blank" rel="noopener noreferrer" className="text-cyber-text/70 hover:text-cyber-blue transition p-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://twitter.com/nessakodo" target="_blank" rel="noopener noreferrer" className="text-cyber-text/70 hover:text-cyber-blue transition p-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
