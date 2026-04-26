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


const BASE_URL = "http://localhost:8000/api";
// const BASE_URL = "192.168.50.1:8000/api";

// Token helpers
const getToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  const res = await fetch(`${BASE_URL}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  localStorage.setItem("access_token", data.access);
  return data.access;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (res.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) return request<T>(endpoint, options, false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

function buildFormData(data: Record<string, unknown>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (value instanceof File) {
      fd.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => fd.append(key, String(v)));
    } else {
      fd.append(key, String(value));
    }
  }
  return fd;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const auth = {
  async login(username: string, password: string): Promise<void> {
    const data = await request<{ access: string; refresh: string }>(
      "/token/",
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }
    );
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
  },
  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
  isAuthenticated: () => !!getToken(),
};

// ─── API ─────────────────────────────────────────────────────────────────────

export const api = {
  // ── Projects ──────────────────────────────────────────────────────────────

  async getProjects(): Promise<Project[]> {
    return request<Project[]>("/projects/");
  },
  async getProject(id: string): Promise<Project> {
    return request<Project>(`/projects/${id}/`);
  },
  async getFeaturedProjects(): Promise<Project[]> {
    return request<Project[]>("/projects/?featured=true");
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
  async submitReview(data: {
    name: string;
    message: string;
    rating?: number;
  }): Promise<Review> {
    return request<Review>("/reviews/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async deleteReview(id: string): Promise<void> {
    return request<void>(`/reviews/${id}/`, { method: "DELETE" });
  },

  // ── Contact ───────────────────────────────────────────────────────────────

  async submitContact(data: ContactMessage): Promise<{ success: boolean }> {
    return request<{ success: boolean }>("/contact/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // ── Dashboard: Projects ───────────────────────────────────────────────────

  async getDashboardProjects(): Promise<Project[]> {
    return request<Project[]>("/projects/");
  },
  async createProject(
    data: Omit<Project, "id" | "createdAt" | "updatedAt">
  ): Promise<Project> {
    return request<Project>("/projects/", {
      method: "POST",
      body: buildFormData(data as Record<string, unknown>),
    });
  },
  async updateProject(
    id: string,
    data: Partial<Project>
  ): Promise<Project> {
    return request<Project>(`/projects/${id}/`, {
      method: "PATCH",
      body: buildFormData(data as Record<string, unknown>),
    });
  },
  async deleteProject(id: string): Promise<void> {
    return request<void>(`/projects/${id}/`, { method: "DELETE" });
  },

  // ── Dashboard: Certifications ─────────────────────────────────────────────

  async createCertification(
    data: Omit<Certification, "id">
  ): Promise<Certification> {
    return request<Certification>("/certifications/", {
      method: "POST",
      body: buildFormData(data as Record<string, unknown>),
    });
  },
  async updateCertification(
    id: string,
    data: Partial<Certification>
  ): Promise<Certification> {
    return request<Certification>(`/certifications/${id}/`, {
      method: "PATCH",
      body: buildFormData(data as Record<string, unknown>),
    });
  },
  async deleteCertification(id: string): Promise<void> {
    return request<void>(`/certifications/${id}/`, { method: "DELETE" });
  },

  // ── Dashboard: Analytics ──────────────────────────────────────────────────

  async getAnalytics(): Promise<Analytics> {
    return request<Analytics>("/analytics/");
  },
};