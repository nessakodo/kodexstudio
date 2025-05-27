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
  }, []);

  // Add autoscroll effect
  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

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
    <section ref={sectionRef} className="glass-panel border border-cyber-blue/20 backdrop-blur-xl p-4 sm:p-6 my-4 sm:my-8 animate-fadeIn overflow-y-auto">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyber-blue/10 sticky top-0 ">
        <div className="flex items-center w-full md:w-auto pointer-events-none">
          <span className="text-[10px] sm:text-xs text-cyber-blue/70 font-plex mr-1">~/</span>
          <span className="text-[10px] sm:text-xs text-cyber-blue/70 font-plex mr-2">writings —</span>
          <h2 className="text-white font-orbitron text-base sm:text-lg tracking-wider">
            Articles & Blog Posts
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sticky top-[60px]  py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-blue/50 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search articles by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-cyber-blue/10 border-cyber-blue/20 text-cyber-text text-sm sm:text-base focus:ring-0 focus:border-cyber-blue/40"
            aria-label="Search articles"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="bg-cyber-blue/10 border-cyber-blue/20 text-cyber-text hover:bg-cyber-blue/20 text-sm sm:text-base focus:ring-0 focus:border-cyber-blue/40">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent className="bg-cyber-blue/10 border-cyber-blue/20">
            <SelectItem value="all" className="text-sm sm:text-base">All Categories</SelectItem>
            {categories.filter(category => category !== 'all').map(category => (
              <SelectItem key={category} value={category} className="text-sm sm:text-base">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-4">
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
        <DialogContent className="max-w-screen-xl w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] bg-cyber-dark/95 border border-cyber-blue/20 backdrop-blur-xl p-4 sm:p-6 md:px-10 lg:px-16 rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[85vh] flex flex-col">
          <DialogHeader className="space-y-4 mb-4 flex-shrink-0">
            <DialogTitle className="font-orbitron text-xl sm:text-2xl text-cyber-highlight tracking-wider">
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

          <div className="flex-1 overflow-y-auto pr-2 min-h-0">
            <div className="prose prose-invert prose-headings:text-cyber-highlight prose-a:text-cyber-blue prose-strong:text-cyber-accent prose-p:text-cyber-text/80 prose-li:text-cyber-text/80 w-full">
              {selectedArticle?.content ? (
                <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
              ) : (
                <p className="text-cyber-text/60 text-sm sm:text-base">No content available for this article.</p>
              )}
            </div>
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
