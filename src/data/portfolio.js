import { studentConfig } from "./studentConfig.js";

export const skills = {
  languages: { icon: "⌘", items: ["C++", "C", "Java", "SQL", "JavaScript", "Python"] },
  technologies: { icon: "◈", items: ["React.js", "Node.js", "Express.js", "MongoDB", "PostgreSQL", "REST APIs"] },
  tools: { icon: "✦", items: ["VS Code", "Git", "GitHub", "Docker", "Postman"] },
};

export const IGNORE_REPOS = [
  "skills-copilot-codespaces-vscode",
];

export const projects = [
  {
    name: "Cashen",
    description:
      "A full-stack budget management web application with expense categorization, planning tools, analytics, budget alerts, and secure authentication.",
    technologies: ["Node.js", "Express.js", "PostgreSQL", "HTML", "CSS", "JavaScript"],
    impact: "Secure financial planning with real-time analytics and budget alerts.",
    links: { github: `${studentConfig.githubUrl}/cashen` },
  },
  {
    name: "Pizza Delivery Application",
    description:
      "A full-stack ordering platform with JWT authentication, pizza customization, role-based access control, and a real-time order tracking workflow.",
    technologies: ["React.js", "Node.js", "Express.js", "MongoDB"],
    impact: "JWT auth, role-based access, and real-time order tracking for 100+ users.",
    links: { github: `${studentConfig.githubUrl}/pizza-delivery` },
  },
  {
    name: "Full-Stack Task Manager",
    description:
      "Comprehensive task management system with user authentication, CRUD operations, route lazy loading, backend caching, and event-driven architecture.",
    technologies: ["React.js", "Node.js", "Express.js", "MongoDB"],
    impact: "End-to-end MERN application adhering to enterprise software engineering patterns.",
    links: { github: `${studentConfig.githubUrl}/task-manager` },
  },
];
