import { PublishingService } from '../services/publishingService';

async function publishUnpublishedPosts() {
  const notionApiKey = process.env.VITE_NOTION_API_KEY;
  const notionDatabaseId = process.env.VITE_NOTION_DATABASE_ID;
  const devToApiKey = process.env.VITE_DEVTO_API_KEY;

  if (!notionApiKey || !notionDatabaseId || !devToApiKey) {
    console.error('Missing required environment variables');
    process.exit(1);
  }

  const publishingService = new PublishingService(
    notionApiKey,
    notionDatabaseId,
    devToApiKey
  );

  try {
    console.log('Fetching unpublished posts...');
    const unpublishedPosts = await publishingService.fetchUnpublishedPosts();
    console.log(`Found ${unpublishedPosts.length} unpublished posts`);

    for (const post of unpublishedPosts) {
      try {
        console.log(`Publishing "${post.title}" to dev.to...`);
        const devToUrl = await publishingService.publishToDevTo(post);
        
        console.log(`Updating Notion post "${post.title}"...`);
        await publishingService.updateNotionPost(post.id, devToUrl);
        
        console.log(`Successfully published "${post.title}" to dev.to: ${devToUrl}`);
      } catch (error) {
        console.error(`Failed to publish "${post.title}":`, error);
      }
    }
  } catch (error) {
    console.error('Error in publishing process:', error);
    process.exit(1);
  }
}

// Run the publishing process
publishUnpublishedPosts(); 