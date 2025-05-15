import { Service } from "@/types";

export const services: Service[] = [
  {
    id: "security-audit",
    title: "Security Audit",
    description: "Comprehensive analysis of your digital infrastructure with actionable recommendations.",
    tier: "Starter",
    features: [
      "Vulnerability Assessment",
      "Basic Penetration Testing",
      "Security Recommendations",
      "Documentation & Reporting"
    ],
    contactLink: "https://calendly.com/nessakodo/custom-security-inquiry"
  },
  {
    id: "secure-development",
    title: "Secure Development",
    description: "End-to-end secure application development with continuous testing and monitoring.",
    tier: "Pro",
    features: [
      "Custom Security Architecture",
      "Advanced Penetration Testing",
      "Secure UI/UX Implementation",
      "CI/CD Security Integration",
      "Maintenance & Support"
    ],
    contactLink: "https://calendly.com/nessakodo/custom-security-inquiry",
    highlighted: true
  },
  {
    id: "enterprise-security",
    title: "Enterprise Security",
    description: "Complete cybersecurity strategy and implementation for organizations with complex requirements.",
    tier: "Premium",
    features: [
      "All Pro Features",
      "Red Team Exercises",
      "Security Training & Workshops",
      "24/7 Incident Response",
      "Quarterly Security Audits",
      "Dedicated Support Team"
    ],
    contactLink: "https://calendly.com/nessakodo/custom-security-inquiry"
  }
];
