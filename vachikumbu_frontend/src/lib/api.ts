// lib/api.ts
import axios from 'axios';
import type {
  ProjectStatus,
  Technology,
  Tag,
  ProjectImage,
  Project,
  Highlight,
  Skill,
  AboutData,
  Certification,
  Testimonial,
  Review,
  ContactMessage,
  Analytics,
  TokenPair,
  TokenRefreshResponse,
  CreateProject,
  UpdateProject,
  CreateCertification,
  UpdateCertification,
  CreateSkill,
  UpdateSkill,
  CreateTestimonial,
  UpdateTestimonial,
  SubmitReview,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://vachikumbu.com";

const apiInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const request = async <T>(url: string, config = {}): Promise<T> => {
  const response = await apiInstance.request<T>({ url, ...config });
  return response.data;
};

const transformImageUrl = (url: string): string => {
  if (!url) return '';
  if (import.meta.env.DEV) {
    return "https://vachikumbu.com/";
  }
  return url;
};

const processProject = (project: Project): Project => ({
  ...project,
  image: transformImageUrl(project.image),
});

export const api = {
  // ── Projects ──────────────────────────────────────────────────────────────
  async getProjects(): Promise<Project[]> {
    const projects = await request<Project[]>("/projects/");
    return projects.map(processProject);
  },

  async getProject(id: string): Promise<Project> {
    const project = await request<Project>(`/projects/${id}/`);
    return processProject(project);
  },

  async getFeaturedProjects(): Promise<Project[]> {
    const projects = await request<Project[]>("/projects/", { params: { featured: true } });
    return projects.map(processProject);
  },

  // ── Skills ────────────────────────────────────────────────────────────────
  async getSkills(): Promise<Skill[]> {
    return request<Skill[]>("/skills/");
  },

  // ── About ─────────────────────────────────────────────────────────────────
  async getAbout(): Promise<AboutData> {
    return request<AboutData>("/about/");
  },

  // ── Testimonials ──────────────────────────────────────────────────────────
  async getTestimonials(): Promise<Testimonial[]> {
    return request<Testimonial[]>("/testimonials/");
  },

  // ── Certifications ────────────────────────────────────────────────────────
  async getCertifications(): Promise<Certification[]> {
    return request<Certification[]>("/certifications/");
  },

  // ── Reviews ───────────────────────────────────────────────────────────────
  async getReviews(): Promise<Review[]> {
    return request<Review[]>("/reviews/");
  },

  async submitReview(data: { name: string; message: string; rating?: number }): Promise<Review> {
    return request<Review>("/reviews/", {
      method: "POST",
      data,
    });
  },

  async deleteReview(id: string): Promise<void> {
    return request<void>(`/reviews/${id}/`, { method: "DELETE" });
  },

  // ── Testimonial Submission ────────────────────────────────────────────────
  async submitTestimonial(data: { name: string; role: string; company?: string; content: string }): Promise<any> {
    return request("/testimonials/", {
      method: "POST",
      data,
    });
  },

  // ── Contact ───────────────────────────────────────────────────────────────
  async SubmitContact(data: ContactMessage): Promise<{ success: boolean }> {
    return request<{ success: boolean }>("/contact/", {
      method: "POST",
      data,
    });
  }
};