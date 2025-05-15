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
    // In a real implementation, this would retrieve the actual resume file
    // For now, we'll create a simple placeholder response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="nessa-kodo-resume.pdf"');
    
    // Simulate a file response
    res.send('This would be the resume PDF content');
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

  const httpServer = createServer(app);

  return httpServer;
}
