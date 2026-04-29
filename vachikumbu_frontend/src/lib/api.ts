
import axios from 'axios';
import type {
  Project,
  Skill,
  AboutData,
  Certification,
  Testimonial,
  Review,
  ContactMessage,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://vachikumbu.com";
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.50.1:8000";

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


export const api = {
  // ── Projects ──────────────────────────────────────────────────────────────
  async getProjects(): Promise<Project[]> {
    return request<Project[]>("/projects/");
  },

  async getProject(id: string | number): Promise<Project> {
    return request<Project>(`/projects/${id}/`);
  },

  async getFeaturedProjects(): Promise<Project[]> {
    return request<Project[]>("/projects/", { params: { featured: true } });
  },

  // ── Skills ────────────────────────────────────────────────────────────────
  async getSkills(): Promise<Skill[]> {
    const skills = (await request<AboutData>("/about/")).skills
    return skills;
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