import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-orbitron text-white mb-4 sm:mb-6 tracking-wider">
          Empowering digital autonomy by architecting systems that don't just defend, but advance your possibilities.
        </h1>
        <p className="text-cyber-text/80 text-sm sm:text-base md:text-lg mb-8 sm:mb-10">
          Building secure, resilient systems with zero-trust architecture and privacy-first development.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="default"
            className="bg-cyber-blue hover:bg-cyber-blue/90 text-white font-orbitron tracking-wider"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue border-cyber-blue/20 font-orbitron tracking-wider"
            onClick={() => document.getElementById('writings')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Read Writings
          </Button>
        </div>
      </div>
    </section>
  );
} 