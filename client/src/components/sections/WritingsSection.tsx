import { useState } from 'react';
import { articles } from '@/data/writings';

interface WritingsSectionProps {
  onClose?: () => void;
}

export default function WritingsSection({ onClose }: WritingsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<string | null>(null);
  
  const categories = ['All', 'Security', 'Development', 'UX'];
  
  const filteredArticles = articles.filter(article => {
    // Apply category filter
    if (activeCategory && activeCategory !== 'All') {
      if (article.category !== activeCategory) return false;
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    return true;
  });

  // Get active article details if one is selected
  const currentArticle = activeArticle ? articles.find(a => a.id === activeArticle) : null;
  
  // Source icon mapping
  const getSourceIcon = (source?: string) => {
    switch(source) {
      case 'medium':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
          </svg>
        );
      case 'hashnode':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.84 0h16.32A3.84 3.84 0 0 1 24 3.84v16.32A3.84 3.84 0 0 1 20.16 24H3.84A3.84 3.84 0 0 1 0 20.16V3.84A3.84 3.84 0 0 1 3.84 0Zm.16 8.42v7.16a4.84 4.84 0 0 0 4.84 4.84h6.32a4.84 4.84 0 0 0 4.84-4.84V8.42a4.84 4.84 0 0 0-4.84-4.84H8.84A4.84 4.84 0 0 0 4 8.42Zm5.96 2.12 1.73-1.73a.67.67 0 0 1 .94 0l5.6 5.6a.67.67 0 0 1 0 .94l-1.73 1.74a.67.67 0 0 1-.94 0l-5.6-5.6a.67.67 0 0 1 0-.95Zm4.5-2.13a.67.67 0 0 1 0 .94l-5.6 5.6a.67.67 0 0 1-.94 0l-1.73-1.73a.67.67 0 0 1 0-.95l5.6-5.6a.67.67 0 0 1 .94 0l1.73 1.74Z"/>
          </svg>
        );
      case 'devto':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z"/>
          </svg>
        );
      case 'substack':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
          </svg>
        );
      case 'notion':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm1.775 2.22.093 15.227c0 .418.28.7.746.655l14.196-1.055c.467-.047.56-.327.56-.7V5.636c0-.373-.14-.606-.607-.56l-14.196.98c-.28.047-.793.047-.793.373zm12.14 1.262c.187.14.187.466.047.653l-.701.84c-.094.187-.374.234-.56.094l-2.055-1.587c-.187-.14-.514-.047-.514.14v7.364c0 .188-.188.327-.28.374l-1.775.933c-.187.094-.374.047-.514-.094l-1.535-1.4c-.093-.94.187-.234.28-.094l1.122.84c.093.047.187 0 .187-.94V8.055c0-.233.374-.326.514-.093l4.784 3.826zm-2.335-3.826c.142.142.142.42 0 .56l-10.328 8.614c-.28.233-.747-.09-.514-.37l3.236-3.885c.093-.14.093-.28 0-.374L7.965 8.43c-.093-.14-.093-.327.094-.374L9.32 7.64c.093-.47.28-.047.374.047l2.662 2.1c.187.187.607.096.747-.09l1.535-1.867c.093-.14.374-.047.467.094l1.868 1.54z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        );
    }
  };

  // If viewing an article
  if (activeArticle && currentArticle) {
    return (
      <section className="glass-panel border border-cyber-blue/20 backdrop-blur-xl p-6 my-8 animate-fadeIn">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyber-blue/10">
          <div className="flex items-center">
            <span className="text-xs text-cyber-blue/70 font-plex mr-2">~/</span>
            <span className="text-xs text-cyber-blue/70 font-plex mr-2">writings —</span>
            <button 
              onClick={() => setActiveArticle(null)}
              className="text-xs text-cyber-blue/80 hover:text-cyber-blue font-plex mr-2 flex items-center gap-2 transition-colors glass-button py-1 px-2 rounded-md"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              back
            </button>
            <h2 className="text-yellow-400 font-orbitron text-xl truncate">
              {currentArticle.title}
            </h2>
          </div>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="text-cyber-text/40 hover:text-cyber-blue transition-colors"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        <div className="mb-6">
          {currentArticle.imageUrl && (
            <div className="h-64 overflow-hidden mb-6 rounded-lg relative">
              <img 
                src={currentArticle.imageUrl} 
                alt={currentArticle.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
            </div>
          )}

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="text-xs bg-cyber-blue/10 border border-cyber-blue/30 px-2 py-1 rounded text-cyber-blue/90">
                {currentArticle.category}
              </span>
              <span className="text-xs text-cyber-text/60">
                {currentArticle.date}
              </span>
              <span className="text-xs text-cyber-text/60">
                {currentArticle.readTime}
              </span>
            </div>
            {currentArticle.source && (
              <div className="flex items-center gap-2 text-cyber-text/60">
                <span className="text-xs">{`Source: `}</span>
                <span className="text-cyber-blue/80">{getSourceIcon(currentArticle.source)}</span>
              </div>
            )}
          </div>

          <div className="space-y-4 text-cyber-text/80">
            <p className="text-lg leading-relaxed">{currentArticle.description}</p>
            
            {currentArticle.content ? (
              <div className="mt-6">{currentArticle.content}</div>
            ) : (
              <div className="mt-6 p-5 border border-cyber-blue/20 rounded-lg bg-cyber-blue/5">
                <p className="text-center">
                  This is a preview. Read the full article on the original platform.
                </p>
                <div className="text-center mt-4">
                  <a 
                    href={currentArticle.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button px-5 py-2 rounded text-center inline-flex items-center justify-center gap-2 hover:bg-cyber-blue/10 hover:border-cyber-blue/50"
                    onClick={(e) => {
                      if (!currentArticle.sourceUrl) {
                        e.preventDefault();
                        alert('No external link available for this article.');
                      }
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    Read Full Article
                  </a>
                </div>
              </div>
            )}
          </div>

          {currentArticle.tags && currentArticle.tags.length > 0 && (
            <div className="mt-8 pt-4 border-t border-cyber-blue/10">
              <div className="flex flex-wrap gap-2">
                {currentArticle.tags.map((tag, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-cyber-panel/50 rounded-md text-cyber-text/70">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }
  
  // List of articles (default view)
  return (
    <section className="glass-panel border border-cyber-blue/20 backdrop-blur-xl p-6 my-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyber-blue/10">
        <div className="flex items-center">
          <span className="text-xs text-cyber-blue/70 font-plex mr-1">~/</span>
          <span className="text-xs text-cyber-blue/70 font-plex mr-2">writings —</span>
          <h2 className="text-yellow-400 font-orbitron text-xl tracking-wide">
            Writings & Blog
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
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Search articles..." 
            className="bg-cyber-panel border border-cyber-blue/20 rounded-md px-4 py-2 flex-grow focus:outline-none focus:border-cyber-blue"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button 
                key={category}
                className={`px-3 py-1 rounded-md text-sm transition-colors glass-button ${
                  activeCategory === category || (category === 'All' && !activeCategory)
                    ? 'bg-cyber-blue/20 border-cyber-blue/30' 
                    : ''
                }`}
                onClick={() => setActiveCategory(category === 'All' ? null : category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map(article => (
            <div 
              key={article.id}
              className="glass-panel border border-cyber-blue/20 transition-all duration-300 overflow-hidden rounded-lg group"
            >
              {article.imageUrl && (
                <div className="h-36 overflow-hidden relative">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="text-xs bg-cyber-blue/10 backdrop-blur-md px-2 py-1 rounded-md">
                      {article.category}
                    </span>
                    {article.source && (
                      <span className="bg-black/40 backdrop-blur-md p-1 rounded-md text-cyber-blue/90">
                        {getSourceIcon(article.source)}
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="p-5">
                <h3 className="font-orbitron text-lg text-cyber-highlight mb-2 tracking-wide leading-tight">{article.title}</h3>
                <p className="text-sm text-cyber-text/80 mb-4 line-clamp-2">{article.description}</p>
                
                <div className="flex justify-between items-center text-xs text-cyber-text/60 mb-4">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
                
                {article.tags && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-xs px-1.5 py-0.5 bg-cyber-panel/50 rounded-sm text-cyber-text/70">
                        #{tag}
                      </span>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-sm text-cyber-text/50">
                        +{article.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                <div className="mt-auto text-right">
                  <button 
                    onClick={() => setActiveArticle(article.id)}
                    className="glass-button py-1.5 px-4 rounded-md text-sm transition-all flex items-center gap-1.5 ml-auto hover:bg-cyber-blue/10"
                  >
                    <span>Read More</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Platform sources as subtle indicator instead of a block */}
      <div className="mt-8 flex flex-wrap justify-center gap-6">
        <div className="flex items-center gap-1.5 text-cyber-blue/70 hover:text-cyber-blue transition-colors">
          {getSourceIcon('notion')}
          <span className="text-xs">Notion</span>
        </div>
        <div className="flex items-center gap-1.5 text-cyber-blue/70 hover:text-cyber-blue transition-colors">
          {getSourceIcon('medium')}
          <span className="text-xs">Medium</span>
        </div>
        <div className="flex items-center gap-1.5 text-cyber-blue/70 hover:text-cyber-blue transition-colors">
          {getSourceIcon('hashnode')}
          <span className="text-xs">Hashnode</span>
        </div>
        <div className="flex items-center gap-1.5 text-cyber-blue/70 hover:text-cyber-blue transition-colors">
          {getSourceIcon('devto')}
          <span className="text-xs">Dev.to</span>
        </div>
        <div className="flex items-center gap-1.5 text-cyber-blue/70 hover:text-cyber-blue transition-colors">
          {getSourceIcon('substack')}
          <span className="text-xs">Substack</span>
        </div>
      </div>
    </section>
  );
}
