// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import path from "path";
import fs from "fs/promises";

// server/notion.ts
import { Client } from "@notionhq/client";
var notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET
});
function extractPageIdFromUrl(pageUrl) {
  const match = pageUrl.match(/([a-f0-9]{32})(?:[?#]|$)/i);
  if (match && match[1]) {
    return match[1];
  }
  throw Error("Failed to extract page ID");
}
var NOTION_PAGE_ID = process.env.NOTION_PAGE_URL ? extractPageIdFromUrl(process.env.NOTION_PAGE_URL) : "";
async function getNotionDatabases() {
  if (!NOTION_PAGE_ID) {
    throw new Error("NOTION_PAGE_ID is not defined. Please set NOTION_PAGE_URL environment variable.");
  }
  const childDatabases = [];
  try {
    let hasMore = true;
    let startCursor = void 0;
    while (hasMore) {
      const response = await notion.blocks.children.list({
        block_id: NOTION_PAGE_ID,
        start_cursor: startCursor
      });
      for (const block of response.results) {
        if (block.type === "child_database") {
          const databaseId = block.id;
          try {
            const databaseInfo = await notion.databases.retrieve({
              database_id: databaseId
            });
            childDatabases.push(databaseInfo);
          } catch (error) {
            console.error(`Error retrieving database ${databaseId}:`, error);
          }
        }
      }
      hasMore = response.has_more;
      startCursor = response.next_cursor || void 0;
    }
    return childDatabases;
  } catch (error) {
    console.error("Error listing child databases:", error);
    throw error;
  }
}
async function findDatabaseByTitle(title) {
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
async function getArticles(articlesDatabaseId) {
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
    return response.results.map((page) => {
      const properties = page.properties;
      return {
        notionId: page.id,
        title: properties.Title?.title?.[0]?.plain_text || "Untitled Article",
        description: properties.Description?.rich_text?.[0]?.plain_text || "",
        content: properties.Content?.rich_text?.[0]?.plain_text || "",
        date: properties.Date?.date?.start || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        readTime: properties.ReadTime?.rich_text?.[0]?.plain_text || "5 min read",
        category: properties.Category?.select?.name || "Uncategorized",
        tags: properties.Tags?.multi_select?.map((tag) => tag.name) || [],
        imageUrl: properties.ImageUrl?.url || ""
      };
    });
  } catch (error) {
    console.error("Error fetching articles from Notion:", error);
    throw new Error("Failed to fetch articles from Notion");
  }
}
async function getArticleById(articlesDatabaseId, articleId) {
  try {
    const response = await notion.pages.retrieve({
      page_id: articleId
    });
    const properties = response.properties;
    return {
      notionId: response.id,
      title: properties.Title?.title?.[0]?.plain_text || "Untitled Article",
      description: properties.Description?.rich_text?.[0]?.plain_text || "",
      content: properties.Content?.rich_text?.[0]?.plain_text || "",
      date: properties.Date?.date?.start || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      readTime: properties.ReadTime?.rich_text?.[0]?.plain_text || "5 min read",
      category: properties.Category?.select?.name || "Uncategorized",
      tags: properties.Tags?.multi_select?.map((tag) => tag.name) || [],
      imageUrl: properties.ImageUrl?.url || ""
    };
  } catch (error) {
    console.error(`Error fetching article ${articleId} from Notion:`, error);
    throw new Error("Failed to fetch article from Notion");
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/resume", async (req, res) => {
    try {
      const resumePath = path.join(process.cwd(), "public", "data", "Nessa_Kodo_Resume.pdf");
      await fs.access(resumePath);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="nessa-kodo-resume.pdf"');
      const fileStream = fs.readFile(resumePath);
      res.send(await fileStream);
    } catch (error) {
      console.error("Error serving resume file:", error);
      res.status(404).send("Resume file not found");
    }
  });
  app2.get("/api/projects", (req, res) => {
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
  app2.post("/api/contact", (req, res) => {
    try {
      const { name, email, projectType, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      res.status(200).json({
        message: "Contact request submitted successfully",
        data: { name, email, projectType, message }
      });
    } catch (error) {
      res.status(500).json({ message: "Error submitting contact form" });
    }
  });
  app2.get("/api/notion/articles", async (req, res) => {
    try {
      if (!process.env.NOTION_INTEGRATION_SECRET || !process.env.NOTION_PAGE_URL) {
        return res.status(500).json({
          error: "Notion credentials not configured",
          message: "Please set the NOTION_INTEGRATION_SECRET and NOTION_PAGE_URL environment variables"
        });
      }
      const articlesDb = await findDatabaseByTitle("Articles");
      if (!articlesDb) {
        return res.status(404).json({
          error: "Articles database not found",
          message: "Please run the setup-notion.ts script to create the database"
        });
      }
      const articles = await getArticles(articlesDb.id);
      const transformedArticles = articles.map((article) => ({
        id: article.notionId,
        title: article.title,
        description: article.description,
        date: article.date,
        readTime: article.readTime,
        category: article.category,
        source: "notion",
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
  app2.get("/api/notion/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!process.env.NOTION_INTEGRATION_SECRET || !process.env.NOTION_PAGE_URL) {
        return res.status(500).json({
          error: "Notion credentials not configured",
          message: "Please set the NOTION_INTEGRATION_SECRET and NOTION_PAGE_URL environment variables"
        });
      }
      const articlesDb = await findDatabaseByTitle("Articles");
      if (!articlesDb) {
        return res.status(404).json({
          error: "Articles database not found",
          message: "Please run the setup-notion.ts script to create the database"
        });
      }
      const article = await getArticleById(articlesDb.id, id);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      const transformedArticle = {
        id: article.notionId,
        title: article.title,
        description: article.description,
        date: article.date,
        readTime: article.readTime,
        category: article.category,
        source: "notion",
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
var app = express2();
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
var limiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 100
  // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);
app.use(express2.json({ limit: "10kb" }));
app.use(express2.urlencoded({ extended: false, limit: "10kb" }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message || "Internal Server Error";
    console.error(`Server Error: ${status} - ${message}`);
    if (err.stack && process.env.NODE_ENV !== "production") {
      console.error(err.stack);
    }
    res.status(status).json({ message });
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = process.env.PORT || 5001;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${port}`);
  });
})();
