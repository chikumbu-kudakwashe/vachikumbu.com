
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const warnInvalidResponse = (endpoint: string, expected: string, data: unknown) => {
  console.warn(`Invalid API response from ${endpoint}; expected ${expected}.`, data);
};

const asList = <T>(data: unknown, endpoint: string): T[] => {
  if (Array.isArray(data)) return data as T[];

  if (isRecord(data) && Array.isArray(data.results)) {
    return data.results as T[];
  }

  warnInvalidResponse(endpoint, "an array", data);
  return [];
};

const firstObject = <T>(data: unknown, endpoint: string): Partial<T> => {
  if (Array.isArray(data) && isRecord(data[0])) {
    return data[0] as Partial<T>;
  }

  if (isRecord(data) && Array.isArray(data.results) && isRecord(data.results[0])) {
    return data.results[0] as Partial<T>;
  }

  if (isRecord(data)) return data as Partial<T>;

  warnInvalidResponse(endpoint, "an object", data);
  return {};
};

const ensureProject = (project: Partial<Project>): Project => ({
  id: Number(project.id ?? 0),
  title: project.title ?? "",
  overview: project.overview ?? "",
  long_description: project.long_description ?? "",
  image: project.image ?? "",
  technologies: Array.isArray(project.technologies) ? project.technologies : [],
  tags: Array.isArray(project.tags) ? project.tags : [],
  challenges: project.challenges ?? "",
  devStory: project.devStory ?? "",
  demoUrl: project.demoUrl ?? "",
  githubUrl: project.githubUrl ?? "",
  status: project.status ?? "draft",
  progress: Number(project.progress ?? 0),
  featured: Boolean(project.featured),
  createdAt: project.createdAt ?? "",
  updatedAt: project.updatedAt ?? "",
});

const ensureAbout = (about: Partial<AboutData>): AboutData => ({
  id: Number(about.id ?? 0),
  bio: about.bio ?? "",
  philosophy: about.philosophy ?? "",
  highlights: Array.isArray(about.highlights) ? about.highlights : [],
  skills: Array.isArray(about.skills) ? about.skills : [],
  cv: about.cv ?? "",
  updatedAt: about.updatedAt ?? "",
});


export const api = {
  // ── Projects ──────────────────────────────────────────────────────────────
  async getProjects(): Promise<Project[]> {
    const data = await request<unknown>("/projects/");
    return asList<Partial<Project>>(data, "/projects/").map(ensureProject);
  },

  async getProject(id: string | number): Promise<Project> {
    const data = await request<unknown>(`/projects/${id}/`);
    return ensureProject(firstObject<Project>(data, `/projects/${id}/`));
  },

  async getFeaturedProjects(): Promise<Project[]> {
    const data = await request<unknown>("/projects/", { params: { featured: true } });
    return asList<Partial<Project>>(data, "/projects/?featured=true").map(ensureProject);
  },

  // ── Skills ────────────────────────────────────────────────────────────────
  async getSkills(): Promise<Skill[]> {
    const about = ensureAbout(firstObject<AboutData>(await request<unknown>("/about/"), "/about/"));
    return about.skills;
  },

  // ── About ─────────────────────────────────────────────────────────────────
  async getAbout(): Promise<AboutData> {
    return ensureAbout(firstObject<AboutData>(await request<unknown>("/about/"), "/about/"));
  },

  // ── Testimonials ──────────────────────────────────────────────────────────
  async getTestimonials(): Promise<Testimonial[]> {
    const data = await request<unknown>("/testimonials/");
    return asList<Testimonial>(data, "/testimonials/");
  },

  // ── Certifications ────────────────────────────────────────────────────────
  async getCertifications(): Promise<Certification[]> {
    const data = await request<unknown>("/certifications/");
    return asList<Certification>(data, "/certifications/");
  },

  // ── Reviews ───────────────────────────────────────────────────────────────
  async getReviews(): Promise<Review[]> {
    const data = await request<unknown>("/reviews/");
    return asList<Review>(data, "/reviews/");
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
