export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  links: {
    github: string;
    demo: string;
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

export const projects: Project[] = [
  {
    id: "phishkiller",
    title: "PhishKiller – Phishing Analyzer",
    description: "CLI tool for detecting phishing attacks via SPF, DMARC, and email header analysis. Simulates real-world threats to support user security training.",
    tags: ["Python", "CLI", "SPF/DMARC", "Security"],
    links: {
      github: "https://github.com/nessakodo/phishkiller",
      demo: "https://phishkiller.onrender.com"
    },
    content: {
      overview: "PhishKiller is a command-line tool designed to enhance email security by analyzing potential phishing attempts. It implements industry-standard email authentication protocols and provides detailed security insights.",
      technicalDetails: "Built with Python, the tool leverages SPF and DMARC protocols to verify email authenticity. It analyzes email headers, performs domain validation, and simulates various attack vectors to test security measures.",
      securityFeatures: [
        "SPF record validation and analysis",
        "DMARC policy enforcement checking",
        "Email header integrity verification",
        "Domain reputation assessment",
        "Attack vector simulation for training"
      ],
      challenges: [
        "Implementing accurate SPF record parsing",
        "Handling various email header formats",
        "Optimizing performance for large email volumes",
        "Ensuring accurate threat detection"
      ],
      impact: "PhishKiller has been used to enhance security awareness training programs and improve email security posture across multiple organizations. The tool has helped identify and mitigate potential phishing threats before they reach end users."
    },
    imageUrl: "/assets/projects/phishkiller.png"
  },
  {
    id: "cryptiq",
    title: "Cryptiq – Futureproof Messaging",
    description: "Encrypted messaging app using NIST-approved post-quantum cryptography (Kyber, Dilithium). Built for robust, futureproof privacy.",
    tags: ["React", "Node.js", "Kyber", "Dilithium"],
    links: {
      github: "https://github.com/nessakodo/cryptiq",
      demo: "https://cryptiq-frontend.onrender.com"
    },
    content: {
      overview: "Cryptiq is a secure messaging platform that implements post-quantum cryptography to ensure long-term message security. It uses NIST-approved algorithms to protect against both current and future threats.",
      technicalDetails: "The application combines React for the frontend with a Node.js backend, implementing Kyber for key encapsulation and Dilithium for digital signatures. All cryptographic operations are performed client-side for maximum security.",
      securityFeatures: [
        "Post-quantum key exchange using Kyber",
        "Digital signatures with Dilithium",
        "End-to-end encryption",
        "Perfect forward secrecy",
        "Zero-knowledge message verification"
      ],
      challenges: [
        "Implementing complex cryptographic algorithms",
        "Optimizing performance of post-quantum operations",
        "Ensuring cross-platform compatibility",
        "Maintaining user experience while prioritizing security"
      ],
      impact: "Cryptiq demonstrates the practical implementation of post-quantum cryptography in real-world applications. It serves as a reference implementation for secure messaging systems that need to be resistant to quantum computing threats."
    },
    imageUrl: "/assets/projects/cryptiq.png"
  },
  {
    id: "caresense",
    title: "CareSense – AI Triage System",
    description: "NLP-driven mental health triage tool designed with privacy-first architecture. Award-winning solution for secure, ethical AI in healthcare.",
    tags: ["Python", "NLP", "Streamlit", "Security"],
    links: {
      github: "https://github.com/nessakodo/caresense",
      demo: "https://caresense.streamlit.app/"
    },
    content: {
      overview: "CareSense is an AI-powered mental health triage system that prioritizes user privacy and data security. It uses natural language processing to assess mental health needs while maintaining strict confidentiality.",
      technicalDetails: "Built with Python and Streamlit, the system implements advanced NLP models for sentiment analysis and risk assessment. All data processing occurs locally when possible, with optional secure cloud storage for authorized users.",
      securityFeatures: [
        "End-to-end encryption for all communications",
        "HIPAA-compliant data handling",
        "Local-first data processing",
        "Secure authentication and authorization",
        "Privacy-preserving analytics"
      ],
      challenges: [
        "Balancing AI accuracy with privacy requirements",
        "Implementing secure data storage and transmission",
        "Ensuring compliance with healthcare regulations",
        "Maintaining system performance with encryption"
      ],
      impact: "CareSense has been recognized for its innovative approach to mental health triage while maintaining strict privacy standards. It has helped healthcare providers streamline their intake process while ensuring patient confidentiality."
    },
    imageUrl: "/assets/projects/caresense.png"
  }
];
