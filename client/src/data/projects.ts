import { Project } from "@/types";

export const projects: Project[] = [
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
