import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs/promises";
import { findDatabaseByTitle, getArticles, getArticleById } from "./notion";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Resume download endpoint
  app.get('/api/resume', async (req, res) => {
    try {
      const resumePath = path.join(process.cwd(), 'public', 'data', 'Nessa_Kodo_Resume.pdf');
      
      // Check if file exists
      await fs.access(resumePath);
      
      // Set headers for PDF file
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="nessa-kodo-resume.pdf"');
      
      // Stream the file to the response
      const fileStream = fs.readFile(resumePath);
      res.send(await fileStream);
    } catch (error) {
      console.error('Error serving resume file:', error);
      res.status(404).send('Resume file not found');
    }
  });
  
  // Fetch projects
  app.get('/api/projects', (req, res) => {
    // This would typically fetch from a database
    // For now, we're returning the static data directly from the server
    const projects = [
      {
        id: "securenet",
        title: "SecureNet",
        description: "Threat intelligence platform with real-time visualization for enterprise networks.",
        image: "https://images.unsplash.com/photo-1551808525-51a94da548ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        technologies: ["React", "Node.js", "D3.js"]
      },
      {
        id: "quantum-guard",
        title: "Quantum Guard",
        description: "Post-quantum cryptography implementation for sensitive data protection.",
        image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        technologies: ["Python", "Go", "WebAssembly"]
      },
      {
        id: "biosafe",
        title: "BioSafe",
        description: "Biometric authentication system with anti-spoofing measures for critical infrastructure.",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        technologies: ["TensorFlow", "C++", "OpenCV"]
      }
    ];
    
    res.json(projects);
  });
  
  // Submit contact form
  app.post('/api/contact', (req, res) => {
    try {
      const { name, email, projectType, message } = req.body;
      
      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // In a real implementation, this would store the contact request
      // For now, just return success
      res.status(200).json({ 
        message: 'Contact request submitted successfully',
        data: { name, email, projectType, message }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error submitting contact form' });
    }
  });
  
  // Notion integration API endpoints
  app.get('/api/notion/articles', async (req, res) => {
    try {
      // Check if notion credentials are available
      if (!process.env.NOTION_INTEGRATION_SECRET || !process.env.NOTION_PAGE_URL) {
        return res.status(500).json({ 
          error: "Notion credentials not configured", 
          message: "Please set the NOTION_INTEGRATION_SECRET and NOTION_PAGE_URL environment variables"
        });
      }
      
      // Find the Articles database
      const articlesDb = await findDatabaseByTitle("Articles");
      
      if (!articlesDb) {
        return res.status(404).json({
          error: "Articles database not found", 
          message: "Please run the setup-notion.ts script to create the database"
        });
      }
      
      // Get articles from the database
      const articles = await getArticles(articlesDb.id);
      
      // Transform the articles to match the Article type in client/src/types.ts
      const transformedArticles = articles.map((article: any) => ({
        id: article.notionId,
        title: article.title,
        description: article.description,
        date: article.date,
        readTime: article.readTime,
        category: article.category,
        source: 'notion',
        content: article.content,
        tags: article.tags,
        imageUrl: article.imageUrl
      }));
      
      res.json(transformedArticles);
    } catch (error) {
      console.error("Error fetching Notion articles:", error);
      res.status(500).json({ error: "Failed to fetch articles from Notion" });
    }
  });
  
  app.get('/api/notion/articles/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if notion credentials are available
      if (!process.env.NOTION_INTEGRATION_SECRET || !process.env.NOTION_PAGE_URL) {
        return res.status(500).json({ 
          error: "Notion credentials not configured", 
          message: "Please set the NOTION_INTEGRATION_SECRET and NOTION_PAGE_URL environment variables"
        });
      }
      
      // Find the Articles database
      const articlesDb = await findDatabaseByTitle("Articles");
      
      if (!articlesDb) {
        return res.status(404).json({
          error: "Articles database not found", 
          message: "Please run the setup-notion.ts script to create the database"
        });
      }
      
      // Get the article by ID
      const article = await getArticleById(articlesDb.id, id);
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      // Transform the article to match the Article type in client/src/types.ts
      const transformedArticle = {
        id: article.notionId,
        title: article.title,
        description: article.description,
        date: article.date,
        readTime: article.readTime,
        category: article.category,
        source: 'notion',
        content: article.content,
        tags: article.tags,
        imageUrl: article.imageUrl
      };
      
      res.json(transformedArticle);
    } catch (error) {
      console.error("Error fetching Notion article:", error);
      res.status(500).json({ error: "Failed to fetch article from Notion" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
