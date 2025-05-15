export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  tier: 'Starter' | 'Pro' | 'Premium';
  features: string[];
  price: string;
  highlighted?: boolean;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  icon: string;
  description: string;
  results: string[];
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  position: string;
  initials: string;
}

export interface TerminalCommand {
  name: string;
  description: string;
  action: () => void;
}

export interface TerminalHistory {
  input?: string;
  output: React.ReactNode;
}

export interface WalkthroughStep {
  message: string;
  command: string;
}
