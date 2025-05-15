import { Article } from '@/types';
import { apiRequest } from '@/lib/queryClient';

// Helper to extract page ID from Notion URL
export function extractPageIdFromUrl(pageUrl: string): string {
  const match = pageUrl.match(/([a-f0-9]{32})(?:[?#]|$)/i);
  if (match && match[1]) {
    return match[1];
  }
  throw Error("Failed to extract Notion page ID");
}

// Function to check if Notion is properly configured
export async function hasNotionCredentials(): Promise<boolean> {
  try {
    const response = await fetch('/api/notion/articles');
    
    // If response is 500 with a message about credentials, return false
    if (!response.ok) {
      const data = await response.json();
      if (data.error === 'Notion credentials not configured') {
        return false;
      }
    }
    
    // If we can fetch articles, Notion is configured
    return true;
  } catch (error) {
    console.error("Error checking Notion credentials:", error);
    return false;
  }
}

// Fetch articles from Notion API endpoint
export async function fetchNotionArticles(): Promise<Article[]> {
  try {
    // Call our server API
    const response = await fetch('/api/notion/articles');
    
    // If response is not OK, return empty array
    if (!response.ok) {
      console.error("Error fetching Notion articles:", response.statusText);
      return [];
    }
    
    // Parse the response
    const articles = await response.json();
    
    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      return [];
    }
    
    // Return the articles with properly formatted URLs
    return articles.map((article: Article) => ({
      ...article,
      sourceUrl: `#/writings/${article.id}`
    }));
  } catch (error) {
    console.error("Error fetching articles from Notion:", error);
    return [];
  }
}

// Get a single article from Notion by ID
export async function getNotionArticleById(id: string): Promise<Article | undefined> {
  try {
    // Call our server API
    const response = await fetch(`/api/notion/articles/${id}`);
    
    // If response is not OK, return undefined
    if (!response.ok) {
      console.error(`Error fetching Notion article ${id}:`, response.statusText);
      return undefined;
    }
    
    // Parse the response
    const article = await response.json();
    
    if (!article || !article.id) {
      return undefined;
    }
    
    // Return the article with properly formatted URL
    return {
      ...article,
      sourceUrl: `#/writings/${article.id}`
    };
  } catch (error) {
    console.error(`Error fetching Notion article ${id}:`, error);
    return undefined;
  }
}