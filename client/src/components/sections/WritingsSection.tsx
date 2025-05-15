import { useState } from 'react';
import { articles } from '@/data/writings';

export default function WritingsSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
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
        article.description.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  return (
    <section className="glass-panel p-6 my-8">
      <h2 className="font-orbitron text-2xl mb-6 text-cyber-blue">Writings</h2>
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Search articles..." 
            className="bg-cyber-dark border border-cyber-text/20 rounded-md px-4 py-2 flex-grow focus:outline-none focus:border-cyber-blue"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button 
                key={category}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  activeCategory === category || (category === 'All' && !activeCategory)
                    ? 'bg-cyber-blue/20'
                    : 'bg-cyber-panel hover:bg-cyber-blue/20'
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
              className="glass-panel p-4 hover:shadow-[0_0_15px_rgba(15,244,198,0.3)] transition-all duration-300 cursor-pointer"
            >
              <div className="mb-3 flex justify-between items-start">
                <h3 className="font-space text-lg">{article.title}</h3>
                <span className="text-xs bg-cyber-panel px-2 py-1 rounded-full">
                  {article.category}
                </span>
              </div>
              <p className="text-sm text-cyber-text/80 mb-4">{article.description}</p>
              <div className="flex justify-between items-center text-xs text-cyber-text/60">
                <span>{article.date}</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <button className="border-2 border-cyber-blue px-6 py-2 rounded-md transition duration-300 hover:bg-cyber-blue/10 hover:shadow-[0_0_15px_rgba(15,244,198,0.5)]">
          View All Articles
        </button>
      </div>
    </section>
  );
}
