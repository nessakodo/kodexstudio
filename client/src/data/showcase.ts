import { Showcase, Testimonial } from "@/types";

export const showcase: Showcase[] = [
  {
    id: "cryptiq-messenger",
    name: "Cryptiq Messenger",
    industry: "Open Source | Cybersecurity",
    icon: "lock",
    description: "Leading the architecture and development of a quantum-safe, end-to-end encrypted messaging platform leveraging NIST-approved post-quantum cryptography. Actively representing technical advancements at tech/security conferences.",
    results: [
      "Implemented post-quantum encryption protocols",
      "Coordinated 100+ international contributors"
      // "Featured at the Denver Cybersecurity Symposium 2025"
    ],
    caseStudyUrl: "https://github.com/nessakodo/cryptiq"
  },
  {
    id: "kodex-world",
    name: "KODΞX.World",
    industry: "Education | Community Platform",
    icon: "globe",
    description: "Designed and launched a cyber-zen learning platform for digital sovereignty and secure development. Integrated gamified labs, XP systems, and interactive community features to foster engaged, real-world learning.",
    results: [
      "Onboarded over 150 users in the first month",
      "Developed immersive, gamified learning modules"
      // "Adopted by university tech organizations for skill development"
    ],
    caseStudyUrl: "https://kodex.world"
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "elliot-mangini",
    quote: "Consistently impressed by her technical expertise and proactive approach to complex projects. Nessa’s leadership and innovation make her an invaluable asset.",
    author: "Elliot Mangini",
    position: "CTO, SoundToggle",
    initials: "EM"
  },
  {
    id: "workshop-feedback",
    quote: "Her mentorship made complex topics approachable and fun, building real confidence in AI and secure coding. Practical, inspiring, and highly effective.",
    author: "Student, CU Denver",
    position: "Cybersecurity Cohort 2025",
    initials: "CD"
  }  
];