import { Article } from '@/types';
import { NotionService } from './notionService';

export interface ContentSource {
  type: 'dev.to' | 'medium' | 'notion';
  apiKey?: string;
  username?: string;
  databaseId?: string;
}

export class ContentService {
  private sources: ContentSource[];

  constructor(sources: ContentSource[]) {
    this.sources = sources;
    console.log('ContentService initialized with sources:', sources.map(s => ({
      type: s.type,
      hasUsername: !!s.username,
      hasApiKey: !!s.apiKey,
      hasDatabaseId: !!s.databaseId
    })));
  }

  async fetchDevToArticles(username: string): Promise<Article[]> {
    try {
      console.log('Fetching Dev.to articles for username:', username);
      
      const articlesResponse = await fetch(`https://dev.to/api/articles?username=${username}`);
      console.log('Dev.to response status:', articlesResponse.status);
      
      if (!articlesResponse.ok) {
        const errorText = await articlesResponse.text();
        console.error('Failed to fetch Dev.to articles:', {
          status: articlesResponse.status,
          statusText: articlesResponse.statusText,
          error: errorText
        });
        throw new Error(`Failed to fetch Dev.to articles: ${articlesResponse.statusText} - ${errorText}`);
      }
      
      const articles = await articlesResponse.json();
      console.log(`Fetched ${articles.length} articles from Dev.to`);
      
      // Fetch full content for each article
      const articlesWithContent = await Promise.all(articles.map(async (article: any) => {
        try {
          const fullArticleResponse = await fetch(`https://dev.to/api/articles/${article.id}`);
          const fullArticle = await fullArticleResponse.json();
          
          return {
            id: article.id.toString(),
            title: article.title,
            description: article.description || article.title,
            content: fullArticle.body_markdown || article.body_markdown || '',
            date: new Date(article.published_at).toISOString().split('T')[0],
            readTime: `${article.reading_time_minutes || 5} min read`,
            category: article.tag_list[0] || 'Security',
            tags: article.tag_list || [],
            imageUrl: article.cover_image || article.social_image || `/assets/blog-placeholder.jpg`,
            source: 'dev.to',
            sourceUrl: article.url,
            published: true
          };
        } catch (error) {
          console.error(`Error fetching full content for article ${article.id}:`, error);
          return null;
        }
      }));

      return articlesWithContent.filter((article): article is Article => article !== null);
    } catch (error) {
      console.error('Error in fetchDevToArticles:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
      throw error;
    }
  }

  // Commenting out Notion integration for now
  /*
  async fetchNotionArticles(databaseId: string, apiKey: string): Promise<Article[]> {
    try {
      if (!databaseId || !apiKey) {
        throw new Error('Missing Notion database ID or API key');
      }

      console.log('Fetching Notion articles for database:', databaseId);
      
      const notionService = new NotionService(databaseId, apiKey);
      const articles = await notionService.fetchArticles();
      
      console.log(`Fetched ${articles.length} articles from Notion`);
      return articles;
    } catch (error) {
      console.error('Error fetching Notion articles:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
      throw error;
    }
  }
  */

  async fetchAllArticles(): Promise<Article[]> {
    const allArticles: Article[] = [];
    const errors: string[] = [];
    
    for (const source of this.sources) {
      try {
        let articles: Article[] = [];
        
        switch (source.type) {
          case 'dev.to':
            if (source.username) {
              articles = await this.fetchDevToArticles(source.username);
            } else {
              console.warn('Missing username for Dev.to source');
            }
            break;
          // Commenting out Notion for now
          /*
          case 'notion':
            if (source.databaseId && source.apiKey) {
              articles = await this.fetchNotionArticles(source.databaseId, source.apiKey);
            } else {
              console.warn('Missing databaseId or apiKey for Notion source');
            }
            break;
          */
        }
        
        allArticles.push(...articles);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error fetching from ${source.type}:`, errorMessage);
        errors.push(`${source.type}: ${errorMessage}`);
      }
    }
    
    if (errors.length > 0) {
      console.warn('Errors occurred while fetching articles:', errors);
    }
    
    if (allArticles.length === 0 && errors.length > 0) {
      throw new Error(`Failed to fetch articles from any source: ${errors.join(', ')}`);
    }
    
    // Sort articles by date
    return allArticles.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
}

// Example usage:
// const contentService = new ContentService([
//   { type: 'dev.to', username: 'nessakodo' },
//   { type: 'medium', username: 'nessakodo', apiKey: 'your-medium-api-key' },
//   { type: 'notion', databaseId: 'your-database-id', apiKey: 'your-notion-api-key' }
// ]); 