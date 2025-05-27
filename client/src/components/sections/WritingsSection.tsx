import { useState, useEffect, useRef } from 'react';
import { Article } from '@/types';
import { ContentService } from '@/services/contentService';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ExternalLink, Search, Filter, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';

interface WritingsSectionProps {
  onClose?: () => void;
}

const ITEMS_PER_PAGE = 3;

export default function WritingsSection({ onClose }: WritingsSectionProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Add effect to scroll to the bottom of the section when articles load or filter/pagination changes
  useEffect(() => {
    if (sectionRef.current && !loading) {
      // Use a small timeout to allow content to render before scrolling
      setTimeout(() => {
        if (sectionRef.current) {
          sectionRef.current.scrollTop = sectionRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [articles, loading, currentPage, searchQuery, selectedSource, selectedCategory]); // Depend on data, loading state, and filters

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        
        const contentService = new ContentService([
          { type: 'dev.to', username: 'nessakodo' }
        ]);

        console.log('Fetching articles...');
        const fetchedArticles = await contentService.fetchAllArticles();
        console.log('Fetched articles:', fetchedArticles);
        
        if (fetchedArticles.length === 0) {
          console.warn('No articles were fetched from Dev.to');
        }
        
        setArticles(fetchedArticles);
        setError(null);
      } catch (err) {
        console.error('Error fetching articles:', err);
        if (err instanceof Error) {
          setError(`Failed to fetch articles: ${err.message}`);
        } else {
          setError('Failed to fetch articles. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []); // Empty dependency array to run only on mount

  // Filter articles based on search query and selected filters
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Get unique categories for filters
  const categories = ['all', ...Array.from(new Set(articles.map(article => article.category || '').filter(Boolean)))];

  const renderArticleContent = (article: Article) => {
    if (!article.content) return null;

    return (
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>
    );
  };

  if (loading) {
    return (
      <section className="glass-panel border border-cyber-blue/20 backdrop-blur-xl p-6 my-8 animate-fadeIn">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyber-blue/10">
          <div className="flex items-center">
            <span className="text-xs text-cyber-blue/70 font-plex mr-1">~/</span>
            <span className="text-xs text-cyber-blue/70 font-plex mr-2">writings —</span>
            <h2 className="text-white font-orbitron text-xl tracking-wide">
              Articles & Blog Posts
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
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-blue"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="glass-panel border border-cyber-blue/20 backdrop-blur-xl p-6 my-8 animate-fadeIn">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyber-blue/10">
          <div className="flex items-center">
            <span className="text-xs text-cyber-blue/70 font-plex mr-1">~/</span>
            <span className="text-xs text-cyber-blue/70 font-plex mr-2">writings —</span>
            <h2 className="text-white font-orbitron text-xl tracking-wide">
              Articles & Blog Posts
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
        <div className="text-center py-8">
          <p className="text-cyber-text/60 mb-4">{error}</p>
          <Button
            variant="outline"
            className="bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue border-cyber-blue/20"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="glass-panel border border-cyber-blue/20 backdrop-blur-xl p-6 my-8 animate-fadeIn overflow-y-auto max-h-[85vh]">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyber-blue/10">
        <div className="flex items-center">
          <span className="text-xs text-cyber-blue/70 font-plex mr-1">~/</span>
          <span className="text-xs text-cyber-blue/70 font-plex mr-2">writings —</span>
          <h2 className="text-lg md:text-xl lg:text-2xl text-white font-orbitron tracking-wide">
            Writings & Insights
          </h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue p-1.5 rounded-md transition-colors"
            aria-label="Close writings section"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search articles..."
          className="flex-grow glass-input bg-cyber-blue/10 border border-cyber-blue/20 rounded-md px-4 py-2 text-sm text-white/80 placeholder-white/40 focus:outline-none focus:border-cyber-blue/40 transition-colors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="glass-input bg-cyber-blue/10 border border-cyber-blue/20 rounded-md px-4 py-2 text-sm text-white/80 focus:outline-none focus:border-cyber-blue/40 transition-colors"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedArticles.length === 0 ? (
          <div className="col-span-full text-center py-8 sm:py-12">
            <p className="text-cyber-text/60 text-sm sm:text-base">No articles found matching your search criteria.</p>
          </div>
        ) : (
          paginatedArticles.map(article => (
            <Card 
              key={article.id}
              className="group flex flex-col h-full glass-panel border border-cyber-blue/20 hover:border-cyber-blue/40 transition-all duration-300"
            >
              {article.imageUrl && (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img 
                    src={article.imageUrl} 
                    alt={`${article.title} article cover image`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                </div>
              )}
              
              <div className="flex flex-col flex-grow p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex flex-wrap gap-2">
                  {article.category && (
                    <Badge 
                      variant="outline" 
                      className="bg-cyber-accent/5 text-cyber-text/60 border-cyber-accent/20 text-xs px-2 py-0.5"
                    >
                      {article.category}
                    </Badge>
                  )}
                </div>
                
                <h3 className="font-orbitron text-base sm:text-lg text-cyber-highlight tracking-wide leading-tight group-hover:text-cyber-blue transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-sm text-cyber-text/80 line-clamp-3">
                  {article.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-cyber-text/60">
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                  {article.readTime && <span>{article.readTime}</span>}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4">
                  <Button
                    variant="outline"
                    className="w-full bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue border-cyber-blue/20 text-sm"
                    onClick={() => setSelectedArticle(article)}
                  >
                    Read Article
                  </Button>
                  {article.sourceUrl && (
                    <Button
                      variant="outline"
                      className="w-full bg-cyber-accent/10 hover:bg-cyber-accent/20 text-cyber-accent border-cyber-accent/20 text-sm"
                      onClick={() => window.open(article.sourceUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Dev.to
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
        <div className="flex justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8 pb-4 sticky bottom-0 ">
          <Button
            variant="outline"
            className="bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue border-cyber-blue/20 text-sm focus:ring-0 focus:border-cyber-blue/40"
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
                } hover:bg-cyber-blue/20 text-sm focus:ring-0 focus:border-cyber-blue/40`}
                onClick={() => setCurrentPage(page)}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            className="bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue border-cyber-blue/20 text-sm focus:ring-0 focus:border-cyber-blue/40"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next
          </Button>
        </div>
      )}

      {/* Article Modal */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="glass-panel border border-cyber-blue/20 backdrop-blur-xl p-6 md:p-8 rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-fadeInUp">
          <DialogHeader className="space-y-4 mb-4 flex-shrink-0">
            <DialogTitle className="font-orbitron text-lg md:text-xl text-cyber-highlight tracking-wide">
              {selectedArticle?.title}
            </DialogTitle>
            <div className="flex flex-wrap items-center gap-4">
              {selectedArticle?.category && (
                <Badge 
                  variant="outline" 
                  className="bg-cyber-accent/5 text-cyber-text/60 border-cyber-accent/20 text-sm"
                >
                  {selectedArticle.category}
                </Badge>
              )}
              <div className="flex items-center gap-4 text-sm text-cyber-text/60">
                {selectedArticle?.date && (
                  <span>{new Date(selectedArticle.date).toLocaleDateString()}</span>
                )}
                {selectedArticle?.readTime && (
                  <span>{selectedArticle.readTime}</span>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="text-sm md:text-base text-white/80 space-y-4 leading-relaxed">
            {selectedArticle?.content && (
              <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} className="prose prose-invert max-w-none" />
            )}
            {selectedArticle?.sourceUrl && (
              <p>
                <strong className="text-cyber-blue/90">Source:</strong> <a href={selectedArticle.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-cyber-blue hover:underline">{selectedArticle.sourceUrl}</a>
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4 pt-4 border-t border-cyber-blue/20 flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {selectedArticle?.sourceUrl && (
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-cyber-accent/10 hover:bg-cyber-accent/20 text-cyber-accent border-cyber-accent/20 text-sm"
                  onClick={() => window.open(selectedArticle.sourceUrl, '_blank')}
                >
                  View on Dev.to
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue border-cyber-blue/20 text-sm"
              onClick={() => setSelectedArticle(null)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
