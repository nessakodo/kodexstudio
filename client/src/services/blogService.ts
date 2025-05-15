import Parser from 'rss-parser';
import { Article } from '@/types';
import { articles as localArticles } from '@/data/writings';
import { fetchNotionArticles as fetchFromNotion, getNotionArticleById } from './notionService';

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

// Main function to aggregate articles from all sources
export async function fetchAllArticles(): Promise<Article[]> {
  try {
    // Try to fetch from Notion first
    let notionArticles: Article[] = [];
    try {
      notionArticles = await fetchFromNotion();
    } catch (err) {
      console.error("Error fetching from Notion:", err);
    }
    
    // Local articles as fallback/supplement
    const storedArticles = localArticles.filter(article => article.source !== 'notion');
    
    // TODO: In the future, we could fetch from RSS feeds here:
    // const mediumArticles = await fetchRssFeeds('https://medium.com/feed/@nessakodo');
    // const devtoArticles = await fetchRssFeeds('https://dev.to/feed/nessakodo');
    
    // Combine all sources and sort by date (newest first)
    const allArticles = [...notionArticles, ...storedArticles];
    
    return allArticles.sort((a, b) => {
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
  try {
    // If it looks like a Notion ID (long alphanumeric string), try fetching from Notion
    if (id.length > 30) {
      try {
        const notionArticle = await getNotionArticleById(id);
        if (notionArticle) {
          return notionArticle;
        }
      } catch (err) {
        console.error("Error fetching article from Notion:", err);
      }
    }
    
    // Fallback to local articles
    return localArticles.find(article => article.id === id);
  } catch (error) {
    console.error('Error fetching article:', error);
    return undefined;
  }
}

// Example usage:
// With real RSS feeds, you would call like this:
// fetchRssFeeds('https://medium.com/feed/@nessakodo')
// fetchRssFeeds('https://dev.to/feed/nessakodo')