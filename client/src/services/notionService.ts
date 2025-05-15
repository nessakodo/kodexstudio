import { Client } from "@notionhq/client";
import { Article } from '@/types';

// Helper to check if Notion credentials are available
export function hasNotionCredentials(): boolean {
  return !!(
    typeof process !== 'undefined' && 
    process.env.NOTION_INTEGRATION_SECRET && 
    process.env.NOTION_PAGE_URL
  );
}

// Extract page ID from Notion URL
export function extractPageIdFromUrl(pageUrl: string): string {
  const match = pageUrl.match(/([a-f0-9]{32})(?:[?#]|$)/i);
  if (match && match[1]) {
    return match[1];
  }
  throw Error("Failed to extract Notion page ID");
}

// Initialize Notion client if credentials are available
let notionClient: any = null;
let notionPageId: string | null = null;

try {
  if (hasNotionCredentials() && typeof process !== 'undefined') {
    notionClient = new Client({
      auth: process.env.NOTION_INTEGRATION_SECRET
    });
    
    if (process.env.NOTION_PAGE_URL) {
      notionPageId = extractPageIdFromUrl(process.env.NOTION_PAGE_URL);
    }
  } else {
    console.log("Notion credentials not available. Using mock data.");
  }
} catch (error) {
  console.error("Error initializing Notion client:", error);
}

// Function to fetch articles from a Notion database
export async function fetchNotionArticles(): Promise<Article[]> {
  if (!notionClient || !notionPageId) {
    return []; // If no client or page ID, return empty array
  }
  
  try {
    // First, find the "Articles" database in the specified page
    const childDatabases = await findDatabaseByTitle("Articles");
    
    if (!childDatabases) {
      console.log("No Articles database found in Notion page");
      return [];
    }
    
    // Query the database for articles
    const response = await notionClient.databases.query({
      database_id: childDatabases.id
    });
    
    // Map Notion results to our Article type
    return response.results.map((page: any) => {
      const props = page.properties;
      
      // Extract tags from multi-select property
      const tags = props.Tags?.multi_select?.map((tag: any) => tag.name) || [];
      
      // Extract publication date
      const pubDate = props.Date?.date?.start 
        ? new Date(props.Date.date.start) 
        : new Date();
      
      // Format date string
      const dateStr = pubDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      // Calculate read time based on content length
      const content = props.Content?.rich_text?.[0]?.plain_text || '';
      const wordCount = content.split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
      
      return {
        id: page.id,
        title: props.Title?.title?.[0]?.plain_text || 'Untitled',
        description: props.Description?.rich_text?.[0]?.plain_text || '',
        date: dateStr,
        readTime: `${readTime} min read`,
        category: props.Category?.select?.name || 'Uncategorized',
        source: 'notion',
        sourceUrl: `#/writings/${page.id}`, // For internal routing
        tags,
        content
      };
    });
  } catch (error) {
    console.error("Error fetching articles from Notion:", error);
    return [];
  }
}

// Helper: Find database by title
async function findDatabaseByTitle(title: string) {
  if (!notionClient || !notionPageId) return null;
  
  try {
    // Query all child blocks in the page
    const response = await notionClient.blocks.children.list({
      block_id: notionPageId
    });
    
    // Find a child database with matching title
    for (const block of response.results) {
      if (block.type === "child_database") {
        try {
          const dbInfo = await notionClient.databases.retrieve({
            database_id: block.id
          });
          
          // Extract database title
          const dbTitle = dbInfo.title?.[0]?.plain_text || '';
          
          if (dbTitle.toLowerCase() === title.toLowerCase()) {
            return dbInfo;
          }
        } catch (err) {
          console.error(`Error retrieving database ${block.id}:`, err);
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error searching for Notion databases:", error);
    return null;
  }
}

// Get a single article from Notion by ID
export async function getNotionArticleById(id: string): Promise<Article | undefined> {
  if (!notionClient) return undefined;
  
  try {
    const page = await notionClient.pages.retrieve({
      page_id: id
    });
    
    const props = page.properties;
    
    // Extract article content
    const blocks = await notionClient.blocks.children.list({
      block_id: id
    });
    
    // This is a simplified content extraction - in a real app, you'd parse the blocks properly
    let content = '';
    blocks.results.forEach((block: any) => {
      if (block.type === 'paragraph' && block.paragraph.rich_text.length > 0) {
        content += block.paragraph.rich_text[0].plain_text + '\n\n';
      }
    });
    
    // Extract tags from multi-select property
    const tags = props.Tags?.multi_select?.map((tag: any) => tag.name) || [];
    
    // Extract publication date
    const pubDate = props.Date?.date?.start 
      ? new Date(props.Date.date.start) 
      : new Date();
    
    // Format date string
    const dateStr = pubDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    return {
      id: page.id,
      title: props.Title?.title?.[0]?.plain_text || 'Untitled',
      description: props.Description?.rich_text?.[0]?.plain_text || '',
      date: dateStr,
      readTime: `${Math.ceil(content.split(/\s+/).length / 200)} min read`,
      category: props.Category?.select?.name || 'Uncategorized',
      source: 'notion',
      sourceUrl: `#/writings/${page.id}`,
      tags,
      content
    };
  } catch (error) {
    console.error(`Error fetching Notion article ${id}:`, error);
    return undefined;
  }
}