import { downloadResume } from '@/lib/utils';

export default function AboutSection() {
  return (
    <section className="glass-panel p-6 my-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <img 
            src="https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600" 
            alt="Nessa Kodo Portrait" 
            className="rounded-lg w-full h-auto shadow-lg object-cover"
          />
        </div>
        <div className="md:col-span-2">
          <h2 className="font-orbitron text-2xl mb-4 text-cyber-blue">Nessa Kodo</h2>
          <p className="mb-4">Cybersecurity specialist and creative technologist with over 6 years of experience securing digital environments while crafting intuitive interfaces.</p>
          <p className="mb-6">Specializing in penetration testing, secure UI/UX design, and building resilient systems with a somatic approach to technology.</p>
          
          <div className="mb-6">
            <h3 className="font-space text-lg mb-2 text-terminal-green">Core Skills</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full border border-cyber-blue/30 text-sm">Penetration Testing</span>
              <span className="px-3 py-1 rounded-full border border-cyber-blue/30 text-sm">Secure UI Design</span>
              <span className="px-3 py-1 rounded-full border border-cyber-blue/30 text-sm">Full-Stack Development</span>
              <span className="px-3 py-1 rounded-full border border-cyber-blue/30 text-sm">Security Auditing</span>
              <span className="px-3 py-1 rounded-full border border-cyber-blue/30 text-sm">System Architecture</span>
            </div>
          </div>
          
          <button 
            onClick={downloadResume}
            className="border-2 border-cyber-blue px-6 py-2 rounded-md transition duration-300 hover:bg-cyber-blue/10 hover:shadow-[0_0_15px_rgba(15,244,198,0.5)] focus:outline-none focus:ring-2 focus:ring-cyber-blue/50 focus:ring-offset-2 focus:ring-offset-cyber-black"
          >
            <i className="fas fa-download mr-2"></i> Download Resume
          </button>
        </div>
      </div>
    </section>
  );
}
