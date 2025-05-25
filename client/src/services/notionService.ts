import { Client } from '@notionhq/client';
import { Article } from '@/types';

export class NotionService {
  private notion: Client;
  private databaseId: string;

  constructor(databaseId: string, apiKey: string) {
    this.notion = new Client({ auth: apiKey });
    this.databaseId = databaseId;
  }

  private getPropertyValue(property: any, type: string): any {
    if (!property) return null;

    switch (type) {
      case 'title':
        return property.title[0]?.plain_text || '';
      case 'rich_text':
        return property.rich_text[0]?.plain_text || '';
      case 'date':
        return property.date?.start || '';
      case 'select':
        return property.select?.name || '';
      case 'multi_select':
        return property.multi_select.map((item: any) => item.name);
      case 'url':
        return property.url || '';
      case 'checkbox':
        return property.checkbox || false;
      default:
        return null;
    }
  }

  async fetchArticles(): Promise<Article[]> {
    try {
      console.log('Fetching articles from Notion database:', this.databaseId);
      
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        sorts: [
          {
            property: 'Created time',
            direction: 'descending'
          }
        ]
      });

      console.log('Notion response:', response);

      const articles: Article[] = [];

      for (const page of response.results) {
        if ('properties' in page) {
          const properties = page.properties;
          
          // Get the page content from the Body property
          const bodyContent = this.getPropertyValue(properties.Body, 'rich_text');
          
          if (!bodyContent) {
            console.warn(`No body content found for page: ${page.id}`);
            continue;
          }

          // Parse the frontmatter from the body content
          const frontmatterMatch = bodyContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
          
          if (!frontmatterMatch) {
            console.warn(`No frontmatter found for page: ${page.id}`);
            continue;
          }

          const [, frontmatter, content] = frontmatterMatch;
          const metadata: any = {};

          // Parse frontmatter
          frontmatter.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
              const value = valueParts.join(':').trim();
              if (key === 'tags') {
                metadata[key] = value.split(',').map(tag => tag.trim());
              } else if (key === 'published') {
                metadata[key] = value.toLowerCase() === 'true';
              } else {
                metadata[key] = value;
              }
            }
          });

          const article: Article = {
            id: page.id,
            title: metadata.title || this.getPropertyValue(properties.Title, 'title'),
            description: metadata.description || this.getPropertyValue(properties.Description, 'rich_text'),
            content: content.trim(),
            date: new Date(page.created_time).toISOString().split('T')[0],
            readTime: `${Math.ceil(content.split(' ').length / 200)} min read`,
            category: metadata.tags?.[0] || this.getPropertyValue(properties.Category, 'select') || 'Uncategorized',
            tags: metadata.tags || this.getPropertyValue(properties.Tags, 'multi_select') || [],
            imageUrl: metadata.cover_image || this.getPropertyValue(properties.ImageURL, 'url') || '/assets/blog-placeholder.jpg',
            source: 'notion',
            published: metadata.published || false
          };

          console.log('Processed article:', article);
          articles.push(article);
        }
      }

      console.log(`Fetched ${articles.length} articles from Notion`);
      return articles;
    } catch (error) {
      console.error('Error fetching articles from Notion:', error);
      throw error;
    }
  }
}

// Fallback articles if Notion integration fails
export const fallbackArticles: Article[] = [
  {
    id: 'fallback-1',
    title: 'Getting Started with DevSecOps',
    description: 'A comprehensive guide to implementing security in your development pipeline.',
    date: '2024-03-15',
    readTime: '5 min read',
    category: 'Security',
    tags: ['devsecops', 'security', 'ci-cd'],
    source: 'dev.to',
    sourceUrl: 'https://dev.to/nessakodo/devsecops-guide',
    imageUrl: '/assets/blog-placeholder.jpg'
  },
  // Add more fallback articles as needed
];