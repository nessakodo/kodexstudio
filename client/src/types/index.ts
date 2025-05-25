export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  imageUrl: string;
  source: 'notion' | 'dev.to' | 'medium';
  sourceUrl?: string;
  published: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  links: {
    github?: string;
    demo?: string;
  };
  content?: {
    overview: string;
    technicalDetails: string;
    securityFeatures: string[];
    challenges: string[];
    impact: string;
  };
  imageUrl?: string;
} 