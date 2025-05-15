import { projects } from '@/data/projects';

export default function ProjectsSection() {
  return (
    <section className="glass-panel p-6 my-8">
      <h2 className="font-orbitron text-2xl mb-6 text-cyber-blue">Projects</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div 
            key={project.id}
            className="glass-panel hover:shadow-[0_0_15px_rgba(15,244,198,0.3)] transition-all duration-300 overflow-hidden group"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="font-space text-lg font-medium mb-2">{project.title}</h3>
              <p className="text-sm text-cyber-text/80 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-cyber-panel rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <button className="border-2 border-cyber-blue px-6 py-2 rounded-md transition duration-300 hover:bg-cyber-blue/10 hover:shadow-[0_0_15px_rgba(15,244,198,0.5)]">
          View All Projects
        </button>
      </div>
    </section>
  );
}
