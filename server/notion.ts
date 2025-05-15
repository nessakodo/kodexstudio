import { Client } from "@notionhq/client";

// Initialize Notion client
export const notion = new Client({
    auth: process.env.NOTION_INTEGRATION_SECRET!,
});

// Extract the page ID from the Notion page URL
function extractPageIdFromUrl(pageUrl: string): string {
    const match = pageUrl.match(/([a-f0-9]{32})(?:[?#]|$)/i);
    if (match && match[1]) {
        return match[1];
    }

    throw Error("Failed to extract page ID");
}

export const NOTION_PAGE_ID = process.env.NOTION_PAGE_URL 
    ? extractPageIdFromUrl(process.env.NOTION_PAGE_URL) 
    : "";

/**
 * Lists all child databases contained within NOTION_PAGE_ID
 * @returns {Promise<Array<{id: string, title: string}>>} - Array of database objects with id and title
 */
export async function getNotionDatabases() {
    if (!NOTION_PAGE_ID) {
        throw new Error("NOTION_PAGE_ID is not defined. Please set NOTION_PAGE_URL environment variable.");
    }

    // Array to store the child databases
    const childDatabases = [];

    try {
        // Query all child blocks in the specified page
        let hasMore = true;
        let startCursor: string | undefined = undefined;

        while (hasMore) {
            const response = await notion.blocks.children.list({
                block_id: NOTION_PAGE_ID,
                start_cursor: startCursor,
            });

            // Process the results
            for (const block of response.results) {
                // Check if the block is a child database
                if (block.type === "child_database") {
                    const databaseId = block.id;

                    // Retrieve the database title
                    try {
                        const databaseInfo = await notion.databases.retrieve({
                            database_id: databaseId,
                        });

                        // Add the database to our list
                        childDatabases.push(databaseInfo);
                    } catch (error) {
                        console.error(`Error retrieving database ${databaseId}:`, error);
                    }
                }
            }

            // Check if there are more results to fetch
            hasMore = response.has_more;
            startCursor = response.next_cursor || undefined;
        }

        return childDatabases;
    } catch (error) {
        console.error("Error listing child databases:", error);
        throw error;
    }
}

// Find a Notion database with the matching title
export async function findDatabaseByTitle(title: string) {
    const databases = await getNotionDatabases();

    for (const db of databases) {
        if (db.title && Array.isArray(db.title) && db.title.length > 0) {
            const dbTitle = db.title[0]?.plain_text?.toLowerCase() || "";
            if (dbTitle === title.toLowerCase()) {
                return db;
            }
        }
    }

    return null;
}

// Create a new database if one with a matching title does not exist
export async function createDatabaseIfNotExists(title: any, properties: any) {
    try {
        const existingDb = await findDatabaseByTitle(title);
        if (existingDb) {
            return existingDb;
        }
        
        return await notion.databases.create({
            parent: {
                type: "page_id",
                page_id: NOTION_PAGE_ID
            },
            title: [
                {
                    type: "text",
                    text: {
                        content: title
                    }
                }
            ],
            properties
        });
    } catch (error) {
        console.error("Error creating database:", error);
        throw error;
    }
}

// Get all articles from the Notion database
export async function getArticles(articlesDatabaseId: string) {
    try {
        const response = await notion.databases.query({
            database_id: articlesDatabaseId,
            sorts: [
                {
                    property: "Date",
                    direction: "descending"
                }
            ]
        });

        return response.results.map((page: any) => {
            const properties = page.properties;
            
            return {
                notionId: page.id,
                title: properties.Title?.title?.[0]?.plain_text || "Untitled Article",
                description: properties.Description?.rich_text?.[0]?.plain_text || "",
                content: properties.Content?.rich_text?.[0]?.plain_text || "",
                date: properties.Date?.date?.start || new Date().toISOString().split('T')[0],
                readTime: properties.ReadTime?.rich_text?.[0]?.plain_text || "5 min read",
                category: properties.Category?.select?.name || "Uncategorized",
                tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
                imageUrl: properties.ImageUrl?.url || "",
            };
        });
    } catch (error) {
        console.error("Error fetching articles from Notion:", error);
        throw new Error("Failed to fetch articles from Notion");
    }
}

// Get a specific article by ID
export async function getArticleById(articlesDatabaseId: string, articleId: string) {
    try {
        const response = await notion.pages.retrieve({
            page_id: articleId
        });
        
        const properties = (response as any).properties;
        
        return {
            notionId: response.id,
            title: properties.Title?.title?.[0]?.plain_text || "Untitled Article",
            description: properties.Description?.rich_text?.[0]?.plain_text || "",
            content: properties.Content?.rich_text?.[0]?.plain_text || "",
            date: properties.Date?.date?.start || new Date().toISOString().split('T')[0],
            readTime: properties.ReadTime?.rich_text?.[0]?.plain_text || "5 min read",
            category: properties.Category?.select?.name || "Uncategorized",
            tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
            imageUrl: properties.ImageUrl?.url || "",
        };
    } catch (error) {
        console.error(`Error fetching article ${articleId} from Notion:`, error);
        throw new Error("Failed to fetch article from Notion");
    }
}