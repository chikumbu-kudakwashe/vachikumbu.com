// ─── Enums ────────────────────────────────────────────────────────────────────

export type ProjectStatus =
  | "active"
  | "in-progress"
  | "completed"
  | "archived"
  | "draft"
  | "idea";

// ─── Projects App ─────────────────────────────────────────────────────────────

export interface Technology {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  title: string;
  overview: string;
  long_description: string;
  /** Absolute URL returned directly by the backend — render as-is. */
  image: string;
  technologies: Technology[];
  tags: Tag[];
  challenges: string;
  devStory: string;
  demoUrl: string;
  githubUrl: string;
  status: ProjectStatus;
  progress: number; // 0–100
  featured: boolean;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

// ─── About App ────────────────────────────────────────────────────────────────

export interface Highlight {
  id: number;
  highlight: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number; // 0–100
}

export interface AboutData {
  id: number;
  bio: string;
  philosophy: string;
  highlights: Highlight[];
  skills: Skill[];
  /** Absolute URL to the CV file — use directly in an <a href>. */
  cv: string;
  updatedAt: string;
}

export interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string; // YYYY-MM-DD
  link: string;
  /** Absolute URL returned directly by the backend — render as-is. */
  image: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
}

// ─── Reviews & Contact ────────────────────────────────────────────────────────

export interface Review {
  id: number;
  name: string;
  message: string;
  rating: number;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
}
