import { Client } from '@notionhq/client';
import { Article } from '@/types';

interface NotionPost {
  id: string;
  title: string;
  description: string;
  body: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  publishedToDevTo: boolean;
  devToUrl: string | null;
}

export class PublishingService {
  private notion: Client;
  private databaseId: string;
  private devToApiKey: string;

  constructor(notionApiKey: string, notionDatabaseId: string, devToApiKey: string) {
    this.notion = new Client({ auth: notionApiKey });
    this.databaseId = notionDatabaseId;
    this.devToApiKey = devToApiKey;
  }

  async fetchUnpublishedPosts(): Promise<NotionPost[]> {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter: {
          property: 'Published to Dev.to',
          checkbox: {
            equals: false
          }
        }
      });

      return response.results.map((page: any) => ({
        id: page.id,
        title: this.getPropertyValue(page.properties.Title, 'title'),
        description: this.getPropertyValue(page.properties.Description, 'rich_text'),
        body: this.getPropertyValue(page.properties.Body, 'rich_text'),
        date: this.getPropertyValue(page.properties.Date, 'date'),
        readTime: this.getPropertyValue(page.properties.ReadTime, 'rich_text'),
        category: this.getPropertyValue(page.properties.Category, 'select'),
        tags: this.getPropertyValue(page.properties.Tags, 'multi_select'),
        publishedToDevTo: this.getPropertyValue(page.properties['Published to Dev.to'], 'checkbox'),
        devToUrl: this.getPropertyValue(page.properties['Dev.to URL'], 'url')
      }));
    } catch (error) {
      console.error('Error fetching unpublished posts:', error);
      throw error;
    }
  }

  async publishToDevTo(post: NotionPost): Promise<string> {
    try {
      const response = await fetch('https://dev.to/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.devToApiKey
        },
        body: JSON.stringify({
          article: {
            title: post.title,
            body_markdown: post.body,
            published: true,
            tags: post.tags.map(tag => tag.toLowerCase()),
            description: post.description
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to publish to dev.to: ${response.statusText}`);
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error publishing to dev.to:', error);
      throw error;
    }
  }

  async updateNotionPost(postId: string, devToUrl: string): Promise<void> {
    try {
      await this.notion.pages.update({
        page_id: postId,
        properties: {
          'Published to Dev.to': {
            checkbox: true
          },
          'Dev.to URL': {
            url: devToUrl
          }
        }
      });
    } catch (error) {
      console.error('Error updating Notion post:', error);
      throw error;
    }
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
} 