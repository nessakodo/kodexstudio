import { Client, Testimonial } from "@/types";

export const clients: Client[] = [
  {
    id: "finsecure",
    name: "FinSecure Banking",
    industry: "Financial Services",
    icon: "building",
    description: "Implemented comprehensive security architecture for digital banking platform serving over 2 million customers.",
    results: [
      "96% reduction in security incidents",
      "PCI-DSS compliance achieved",
      "Zero downtime during implementation"
    ]
  },
  {
    id: "meditech",
    name: "MediTech Solutions",
    industry: "Healthcare Technology",
    icon: "hospital",
    description: "Designed and implemented secure patient data management system with HIPAA-compliant architecture.",
    results: [
      "HIPAA & GDPR compliance certified",
      "400% faster data access with enhanced security",
      "Secure API integration with 12 partner systems"
    ]
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "sarah-chen",
    quote: "Nessa's approach combines technical expertise with a deep understanding of user psychology. This dual perspective helped us build a secure system that our users actually love to use.",
    author: "Sarah Chen",
    position: "CTO, FinSecure Banking",
    initials: "SC"
  },
  {
    id: "james-torres",
    quote: "The security architecture Nessa designed for our healthcare platform is nothing short of brilliant. It meets all compliance requirements while maintaining exceptional performance.",
    author: "Dr. James Torres",
    position: "CEO, MediTech Solutions",
    initials: "JT"
  }
];
