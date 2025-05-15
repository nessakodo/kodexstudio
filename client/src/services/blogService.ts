import Parser from 'rss-parser';
import { Article } from '@/types';
import { articles as localArticles } from '@/data/writings';

// Initialize the RSS parser
const parser = new Parser();

// Function to fetch RSS feeds from various sources
export async function fetchRssFeeds(url: string): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(url);
    
    return feed.items.map((item, index) => {
      // Extract the date in a consistent format
      const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
      const dateStr = pubDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      // Calculate estimated read time (assuming 200 words per minute)
      const content = item.content || item.contentSnippet || '';
      const wordCount = content.split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));
      
      // Determine category from content or tags
      let category = 'Uncategorized';
      if (item.categories && item.categories.length > 0) {
        // Find a category that matches our main categories
        const mainCategories = ['Security', 'Development', 'UX'];
        const foundCategory = item.categories.find(cat => 
          mainCategories.includes(cat) || 
          mainCategories.some(mainCat => cat.toLowerCase().includes(mainCat.toLowerCase()))
        );
        
        if (foundCategory) {
          // Map to one of our main categories
          if (foundCategory.toLowerCase().includes('security')) {
            category = 'Security';
          } else if (foundCategory.toLowerCase().includes('dev')) {
            category = 'Development';
          } else if (foundCategory.toLowerCase().includes('ux') || 
                     foundCategory.toLowerCase().includes('ui') || 
                     foundCategory.toLowerCase().includes('design')) {
            category = 'UX';
          }
        } else {
          category = item.categories[0];
        }
      }
      
      // Determine source type from URL
      let source: 'medium' | 'hashnode' | 'devto' | 'substack' | undefined;
      if (url.includes('medium.com')) {
        source = 'medium';
      } else if (url.includes('hashnode.com')) {
        source = 'hashnode'; 
      } else if (url.includes('dev.to')) {
        source = 'devto';
      } else if (url.includes('substack.com')) {
        source = 'substack';
      }
      
      // Extract tags from categories or create from content
      const tags = item.categories || createTagsFromContent(content);
      
      return {
        id: `rss-${source}-${index}-${Date.now()}`,
        title: item.title || 'Untitled',
        description: item.contentSnippet || 'No description available',
        date: dateStr,
        readTime: `${readTime} min read`,
        category,
        source,
        sourceUrl: item.link || url,
        tags,
        content: item.content
      };
    });
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return [];
  }
}

// Helper function to extract potential tags from content
function createTagsFromContent(content: string): string[] {
  const commonTechTerms = [
    'javascript', 'typescript', 'react', 'node', 'security', 'api',
    'cybersecurity', 'web', 'design', 'ux', 'ui', 'user-experience',
    'frontend', 'backend', 'fullstack', 'programming', 'coding', 'developer',
    'architecture', 'cloud', 'aws', 'azure', 'devops', 'testing', 'automation'
  ];
  
  const foundTerms = commonTechTerms.filter(term => 
    content.toLowerCase().includes(term)
  );
  
  return foundTerms.slice(0, 5); // Limit to 5 tags max
}

// Function to fetch articles from Notion (stub for now - implement with API key)
export async function fetchNotionArticles(): Promise<Article[]> {
  // This would be implemented with the Notion API when we have the API key
  // For now, return the local articles marked as from Notion
  return localArticles.filter(article => article.source === 'notion');
}

// Main function to aggregate articles from all sources
export async function fetchAllArticles(): Promise<Article[]> {
  try {
    // Local articles (already have these)
    const storedArticles = localArticles;
    
    // This would be implemented with actual RSS feeds and Notion API
    // Currently, we'll just use the mock data we've already created
    
    // Return combined and sorted by date (newest first)
    return storedArticles.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error aggregating blog content:', error);
    return localArticles; // Fallback to local content
  }
}

// Function to get a single article by ID
export async function getArticleById(id: string): Promise<Article | undefined> {
  // For now, just search in our local articles
  return localArticles.find(article => article.id === id);
}

// Example usage:
// With real RSS feeds, you would call like this:
// fetchRssFeeds('https://medium.com/feed/@nessakodo')
// fetchRssFeeds('https://dev.to/feed/nessakodo')