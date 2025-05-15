import { notion, NOTION_PAGE_ID, createDatabaseIfNotExists, findDatabaseByTitle } from "./notion";

// Environment variables validation
if (!process.env.NOTION_INTEGRATION_SECRET) {
    throw new Error("NOTION_INTEGRATION_SECRET is not defined. Please add it to your environment variables.");
}

if (!process.env.NOTION_PAGE_URL) {
    throw new Error("NOTION_PAGE_URL is not defined. Please add it to your environment variables.");
}

// Setup database for articles
async function setupNotionDatabases() {
    console.log("Setting up Notion databases...");
    
    await createDatabaseIfNotExists("Articles", {
        // Every database needs a Name/Title property
        Title: {
            title: {}
        },
        Description: {
            rich_text: {}
        },
        Content: {
            rich_text: {}
        },
        Date: {
            date: {}
        },
        ReadTime: {
            rich_text: {}
        },
        Category: {
            select: {
                options: [
                    { name: "Cybersecurity", color: "red" },
                    { name: "Technology", color: "blue" },
                    { name: "Software Development", color: "green" },
                    { name: "UI/UX Design", color: "orange" },
                    { name: "Project Management", color: "purple" },
                    { name: "Career", color: "yellow" },
                    { name: "Uncategorized", color: "gray" }
                ]
            }
        },
        Tags: {
            multi_select: {
                options: [
                    { name: "react", color: "blue" },
                    { name: "javascript", color: "yellow" },
                    { name: "css", color: "green" },
                    { name: "typescript", color: "purple" },
                    { name: "design", color: "orange" },
                    { name: "security", color: "red" },
                    { name: "networking", color: "gray" },
                    { name: "api", color: "pink" },
                    { name: "tutorial", color: "brown" }
                ]
            }
        },
        ImageUrl: {
            url: {}
        }
    });

    console.log("Notion databases setup complete.");
}

// Create sample articles
async function createSampleData() {
    try {
        console.log("Adding sample articles...");

        // Find the databases
        const articlesDb = await findDatabaseByTitle("Articles");

        if (!articlesDb) {
            throw new Error("Articles database not found. Please check if it was created correctly.");
        }

        const articles = [
            {
                title: "The Future of Cybersecurity in an AI-Driven World",
                description: "Exploring how artificial intelligence is both a threat and solution in modern cybersecurity landscapes.",
                content: `# The Future of Cybersecurity in an AI-Driven World

As we advance further into the digital age, the intersection of artificial intelligence and cybersecurity presents both unprecedented challenges and opportunities. This article explores how AI is revolutionizing the cybersecurity landscape, offering both new attack vectors and defensive capabilities.

## AI-Powered Threats

Attackers are increasingly leveraging AI to:

- Generate sophisticated phishing attempts that can mimic human writing patterns
- Automate vulnerability discovery in target systems
- Create advanced malware that can evade traditional detection methods
- Conduct large-scale reconnaissance with minimal human intervention

## Defensive Applications of AI

On the defensive side, cybersecurity professionals are using AI to:

- Monitor networks for anomalous behavior in real-time
- Automate threat hunting across vast datasets
- Predict potential vulnerabilities before they're exploited
- Enhance authentication through behavioral biometrics

## The Human Element

Despite technological advances, the human element remains crucial in cybersecurity. AI systems require expert guidance, interpretation, and oversight. The most effective cybersecurity strategies will combine:

1. Advanced AI-powered tools
2. Human expertise and intuition
3. Robust organizational policies
4. Regular training and awareness programs

The future belongs to those who can effectively leverage AI while maintaining the critical thinking and creativity that only humans can provide.`,
                date: "2025-04-20",
                readTime: "8 min read",
                category: "Cybersecurity",
                tags: ["security", "ai", "technology"],
                imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
            },
            {
                title: "Building Resilient Distributed Systems",
                description: "A technical deep dive into designing systems that can withstand failures and scale efficiently.",
                content: `# Building Resilient Distributed Systems

Modern applications demand resilience, scalability, and performance. This article explores key principles and patterns for building distributed systems that can withstand failures while maintaining availability.

## Fundamental Principles

When designing resilient distributed systems, several core principles should guide your architecture:

### 1. Embrace Failure

Failure is inevitable in distributed systems. Instead of trying to prevent all failures, design systems that:

- Expect components to fail
- Degrade gracefully when failures occur
- Recover automatically when possible
- Maintain data integrity across failure scenarios

### 2. Design for Horizontal Scalability

- Stateless services where possible
- Data partitioning strategies
- Asynchronous processing
- Load balancing across multiple instances

### 3. Implement Circuit Breakers

Prevent cascading failures by implementing circuit breakers that:

- Monitor for failures
- Trip when failure thresholds are exceeded
- Allow for graceful degradation
- Automatically test for recovery

## Practical Patterns

Several proven patterns can help implement these principles:

- **Bulkhead Pattern**: Isolate components so failure in one doesn't cascade to others
- **Saga Pattern**: Manage distributed transactions with compensating actions
- **CQRS**: Separate read and write operations for better scalability
- **Event Sourcing**: Use an append-only event log as the system of record

## Monitoring and Observability

A resilient system must be observable. Implement:

- Distributed tracing
- Centralized logging
- Real-time metrics
- Anomaly detection

By following these principles and patterns, you can build systems that not only survive in the face of inevitable failures but continue to perform and scale effectively.`,
                date: "2025-03-15",
                readTime: "12 min read",
                category: "Software Development",
                tags: ["systems-design", "backend", "scalability"],
                imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31"
            },
            {
                title: "The Psychology of Effective UI Design",
                description: "How understanding human cognitive patterns can lead to more intuitive and engaging interfaces.",
                content: `# The Psychology of Effective UI Design

Creating interfaces that truly resonate with users requires more than just aesthetic appeal—it demands an understanding of how humans perceive, process, and interact with visual information. This article explores the psychological principles that underpin effective UI design.

## Cognitive Load Theory

Every interface imposes a cognitive load on users. The goal of good UI design is to minimize unnecessary cognitive load by:

- Breaking complex tasks into manageable steps
- Using recognition rather than recall where possible
- Creating clear visual hierarchies
- Maintaining consistency throughout the interface

## Gestalt Principles in UI Design

The Gestalt principles of visual perception offer valuable insights for designers:

### Proximity
Elements placed close together are perceived as related. Use spacing strategically to group related items and separate unrelated ones.

### Similarity
Elements that share visual characteristics (color, shape, size) are perceived as related. Use consistent styling for items with similar functions.

### Closure
Humans naturally fill in gaps to create complete shapes. This allows for more minimalist designs where the user's mind completes the picture.

### Continuity
Elements arranged in a line or curve are perceived as related and following a path. Use this to guide users through multi-step processes.

## Color Psychology

Colors evoke emotional and psychological responses:

- Blue: Trust, security, calmness
- Green: Growth, health, permission
- Red: Urgency, importance, errors
- Yellow: Optimism, warning, energy
- Purple: Creativity, luxury, wisdom

Strategic use of color can guide attention, communicate status, and evoke appropriate emotional responses.

## Practical Applications

- Use progressive disclosure to reveal information as needed
- Implement consistent feedback mechanisms for user actions
- Design with cultural and accessibility considerations in mind
- Test designs with real users to validate psychological assumptions

By designing with human psychology in mind, we create interfaces that feel intuitive, reduce friction, and ultimately lead to more satisfying user experiences.`,
                date: "2025-02-05",
                readTime: "10 min read",
                category: "UI/UX Design",
                tags: ["design", "psychology", "user-experience"],
                imageUrl: "https://images.unsplash.com/photo-1545235617-9465d2a55698"
            }
        ];

        for (const article of articles) {
            await notion.pages.create({
                parent: {
                    database_id: articlesDb.id
                },
                properties: {
                    Title: {
                        title: [
                            {
                                text: {
                                    content: article.title
                                }
                            }
                        ]
                    },
                    Description: {
                        rich_text: [
                            {
                                text: {
                                    content: article.description
                                }
                            }
                        ]
                    },
                    Content: {
                        rich_text: [
                            {
                                text: {
                                    content: article.content
                                }
                            }
                        ]
                    },
                    Date: {
                        date: {
                            start: article.date
                        }
                    },
                    ReadTime: {
                        rich_text: [
                            {
                                text: {
                                    content: article.readTime
                                }
                            }
                        ]
                    },
                    Category: {
                        select: {
                            name: article.category
                        }
                    },
                    Tags: {
                        multi_select: article.tags.map(tag => ({
                            name: tag
                        }))
                    },
                    ImageUrl: {
                        url: article.imageUrl
                    }
                }
            });
        }

        console.log(`Created ${articles.length} sample articles`);
        console.log("Sample data creation complete.");
    } catch (error) {
        console.error("Error creating sample data:", error);
    }
}

// Run the setup
if (require.main === module) {
    setupNotionDatabases()
        .then(() => {
            return createSampleData();
        })
        .then(() => {
            console.log("Setup complete!");
            process.exit(0);
        })
        .catch(error => {
            console.error("Setup failed:", error);
            process.exit(1);
        });
}