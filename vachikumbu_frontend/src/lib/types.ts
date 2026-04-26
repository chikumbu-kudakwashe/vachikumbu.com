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

export interface ProjectImage {
  id: number;
  image: string; // URL returned by DRF
}

export interface Project {
  id: number;
  title: string;
  overview: string;
  long_description: string;
  technologies: Technology[];
  image: string;
  tags: Tag[];
  project_images: ProjectImage[];
  challenges: string;
  devStory: string;
  demoUrl: string;
  githubUrl: string;
  status: ProjectStatus;
  progress: number; // 0–100
  featured: boolean;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime

  // write-only (used in create/update payloads)
  technology_ids?: number[];
  tag_ids?: number[];
  image_ids?: number[];
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
  cv: string; // URL returned by DRF
  updatedAt: string; // ISO datetime

  // write-only (used in update payloads)
  highlight_ids?: number[];
  skill_ids?: number[];
}

export interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string; // YYYY-MM-DD
  link: string;
  image: string; // URL returned by DRF
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
  rating?: number;
  createdAt: string; // ISO datetime
}

export interface ContactMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface Analytics {
  totalProjects: number;
  completedProjects: number;
  activeProjects: number;
  totalCertifications: number;
  totalTestimonials: number;
  totalReviews: number;
  averageRating: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
}

// ─── API Helpers ──────────────────────────────────────────────────────────────

export type CreateProject = Omit<Project, "id" | "createdAt" | "updatedAt">;
export type UpdateProject = Partial<CreateProject>;

export type CreateCertification = Omit<Certification, "id">;
export type UpdateCertification = Partial<CreateCertification>;

export type CreateSkill = Omit<Skill, "id">;
export type UpdateSkill = Partial<CreateSkill>;

export type CreateTestimonial = Omit<Testimonial, "id">;
export type UpdateTestimonial = Partial<CreateTestimonial>;

export type SubmitReview = Pick<Review, "name" | "message" | "rating">;