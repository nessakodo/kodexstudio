import { ContentSource } from '@/services/contentService';

export const contentSources: ContentSource[] = [
  {
    type: 'dev.to',
    username: 'nessakodo'
  },
  // Add other sources as needed:
  // {
  //   type: 'medium',
  //   username: 'nessakodo',
  //   apiKey: process.env.MEDIUM_API_KEY
  // },
  {
    type: 'notion',
    databaseId: process.env.NOTION_DATABASE_ID,
    apiKey: process.env.NOTION_API_KEY
  }
]; 