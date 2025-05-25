import { useState } from 'react';
import { projects } from '@/data/projects';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Search, ExternalLink, Github, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';

interface ProjectsSectionProps {
  onClose?: () => void;
}

const ITEMS_PER_PAGE = 3;

export default function ProjectsSection({ onClose }: ProjectsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  // Get all unique tags
  const tags = ['all', ...Array.from(new Set(projects.flatMap(p => p.tags || [])))];

  // Filtered projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === 'all' || (project.tags && project.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="glass-panel border border-cyber-blue/20 backdrop-blur-xl p-4 sm:p-6 my-4 sm:my-8 animate-fadeIn overflow-y-auto" aria-label="Projects">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyber-blue/10 sticky top-0 bg-cyber-dark/95 backdrop-blur-sm z-10">
        <div className="flex items-center w-full md:w-auto">
          <span className="text-xs text-cyber-blue/70 font-plex mr-1">~/</span>
          <span className="text-xs text-cyber-blue/70 font-plex mr-2">projects —</span>
          <h2 className="text-white font-orbitron text-lg sm:text-xl tracking-wider">
            Featured Projects
          </h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue p-1.5 rounded-md transition-colors"
            aria-label="Close projects section"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sticky top-[60px] bg-cyber-dark/95 backdrop-blur-sm z-10 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-blue/50 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search projects by name or description..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-10 bg-cyber-blue/10 border-cyber-blue/20 text-cyber-text text-sm sm:text-base"
            aria-label="Search projects"
          />
        </div>
        <Select value={selectedTag} onValueChange={value => { setSelectedTag(value); setCurrentPage(1); }}>
          <SelectTrigger className="bg-cyber-blue/10 border-cyber-blue/20 text-cyber-text hover:bg-cyber-blue/20 text-sm sm:text-base">
            <SelectValue placeholder="Filter by technology" />
          </SelectTrigger>
          <SelectContent className="bg-cyber-blue/10 border-cyber-blue/20">
            {tags.map(tag => (
              <SelectItem key={tag} value={tag} className="text-sm sm:text-base">
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-4">
        {paginatedProjects.length === 0 ? (
          <div className="col-span-full text-center py-8 sm:py-12">
            <p className="text-cyber-text/60 text-sm sm:text-base">No projects found matching your search criteria.</p>
          </div>
        ) : (
          paginatedProjects.map(project => (
            <Card 
              key={project.id}
              className="group flex flex-col h-full glass-panel border border-cyber-blue/20 hover:border-cyber-blue/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,149,255,0.3)]"
            >
              {project.imageUrl && (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img 
                    src={project.imageUrl} 
                    alt={`${project.title} project screenshot`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                </div>
              )}
              
              <div className="flex flex-col flex-grow p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.tags && project.tags.map((tag: string) => (
                    <Badge 
                      key={tag}
                      variant="outline" 
                      className="bg-cyber-accent/5 text-cyber-text/60 border-cyber-accent/20 text-xs px-2 py-0.5"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h3 className="font-orbitron text-base sm:text-lg text-cyber-highlight tracking-wide leading-tight group-hover:text-cyber-blue transition-colors">
                  {project.title}
                </h3>

                <p className="text-sm text-cyber-text/80 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4">
                  <Button
                    variant="outline"
                    className="w-full bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue border-cyber-blue/20 text-sm"
                    onClick={() => setSelectedProject(project)}
                  >
                    View Details
                  </Button>
                  {project.links?.github && (
                    <Button
                      variant="outline"
                      className="w-full bg-cyber-accent/10 hover:bg-cyber-accent/20 text-cyber-accent border-cyber-accent/20 text-sm"
                      onClick={() => window.open(project.links.github, '_blank')}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8 pb-4 sticky bottom-0 bg-cyber-dark/95 backdrop-blur-sm z-10">
          <Button
            variant="outline"
            className="bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue border-cyber-blue/20 text-sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                className={`${
                  currentPage === page 
                    ? 'bg-cyber-blue text-white' 
                    : 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/20'
                } hover:bg-cyber-blue/20 text-sm`}
                onClick={() => setCurrentPage(page)}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            className="bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue border-cyber-blue/20 text-sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next
          </Button>
        </div>
      )}

      {/* Project Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-screen-xl w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] bg-cyber-dark/95 border border-cyber-blue/20 backdrop-blur-xl p-4 sm:p-6 md:px-10 lg:px-16 rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] flex flex-col">
          <DialogHeader className="space-y-4 mb-6 flex-shrink-0">
            <DialogTitle className="font-orbitron text-xl sm:text-2xl text-cyber-highlight tracking-wider">
              {selectedProject?.title}
            </DialogTitle>
            <div className="flex flex-wrap items-center gap-2">
              {selectedProject?.tags && selectedProject.tags.map((tag: string) => (
                <Badge 
                  key={tag}
                  variant="outline" 
                  className="bg-cyber-accent/5 text-cyber-text/60 border-cyber-accent/20 text-sm"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2 min-h-0">
            <div className="prose prose-invert prose-headings:text-cyber-highlight prose-a:text-cyber-blue prose-strong:text-cyber-accent prose-p:text-cyber-text/80 prose-li:text-cyber-text/80 w-full space-y-6 sm:space-y-8">
              {selectedProject?.content ? (
                <>
                  <div>
                    <h3 className="text-lg sm:text-xl font-orbitron mb-3 sm:mb-4 tracking-wider">Overview</h3>
                    <p className="text-sm sm:text-base">{selectedProject.content.overview}</p>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-orbitron mb-3 sm:mb-4 tracking-wider">Technical Details</h3>
                    <p className="text-sm sm:text-base">{selectedProject.content.technicalDetails}</p>
                  </div>
                  {selectedProject.content.securityFeatures && selectedProject.content.securityFeatures.length > 0 && (
                    <div>
                      <h3 className="text-lg sm:text-xl font-orbitron mb-3 sm:mb-4 tracking-wider">Security Features</h3>
                      <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base">
                        {selectedProject.content.securityFeatures.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedProject.content.challenges && selectedProject.content.challenges.length > 0 && (
                    <div>
                      <h3 className="text-lg sm:text-xl font-orbitron mb-3 sm:mb-4 tracking-wider">Challenges & Solutions</h3>
                      <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base">
                        {selectedProject.content.challenges.map((challenge, idx) => (
                          <li key={idx}>{challenge}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg sm:text-xl font-orbitron mb-3 sm:mb-4 tracking-wider">Impact</h3>
                    <p className="text-sm sm:text-base">{selectedProject.content.impact}</p>
                  </div>
                </>
              ) : (
                <p className="text-cyber-text/60 text-sm sm:text-base">No additional details available for this project.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 pt-6 border-t border-cyber-blue/20 flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {selectedProject?.links?.github && (
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-cyber-accent/10 hover:bg-cyber-accent/20 text-cyber-accent border-cyber-accent/20 text-sm"
                  onClick={() => window.open(selectedProject.links.github, '_blank')}
                >
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub
                </Button>
              )}
              {selectedProject?.links?.demo && (
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-cyber-accent/10 hover:bg-cyber-accent/20 text-cyber-accent border-cyber-accent/20 text-sm"
                  onClick={() => window.open(selectedProject.links.demo, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </Button>
              )}
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue border-cyber-blue/20 text-sm"
              onClick={() => setSelectedProject(null)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
