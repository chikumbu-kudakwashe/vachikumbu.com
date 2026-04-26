import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, auth } from "@/lib/api1";
import type { Project, Analytics, Certification, Review } from "@/lib/types";
import {
  BarChart3,
  FolderOpen,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Award,
  Star,
  Lock,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(auth.isAuthenticated());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "projects" | "certifications" | "reviews"
  >("overview");

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    overview: "",
    long_description: "",
    technologies: "",
    tags: "",
    demoUrl: "",
    githubUrl: "",
    status: "active" as Project["status"],
    progress: 0,
    featured: false,
  });

  const [showCertForm, setShowCertForm] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [certForm, setCertForm] = useState({
    title: "",
    issuer: "",
    date: "",
    link: "",
  });

  useEffect(() => {
    if (!authenticated) return;
    Promise.all([
      api.getDashboardProjects(),
      api.getAnalytics(),
      api.getCertifications(),
      api.getReviews(),
    ])
      .then(([p, a, c, r]) => {
        setProjects(p);
        setAnalytics(a);
        setCertifications(c);
        setReviews(r);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load dashboard data");
        setLoading(false);
      });
  }, [authenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth.login(username, password);
      setAuthenticated(true);
    } catch {
      toast.error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    auth.logout();
    setAuthenticated(false);
  };

  const openProjectForm = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setProjectForm({
        title: project.title,
        overview: project.overview,
        long_description: project.long_description,
        technologies: project.technologies.map((t) => t.name).join(", "),
        tags: project.tags.map((t) => t.name).join(", "),
        demoUrl: project.demoUrl || "",
        githubUrl: project.githubUrl || "",
        status: project.status,
        progress: project.progress,
        featured: project.featured,
      });
    } else {
      setEditingProject(null);
      setProjectForm({
        title: "",
        overview: "",
        long_description: "",
        technologies: "",
        tags: "",
        demoUrl: "",
        githubUrl: "",
        status: "active",
        progress: 0,
        featured: false,
      });
    }
    setShowProjectForm(true);
  };

  const saveProject = async () => {
    if (!projectForm.title || !projectForm.overview) {
      toast.error("Title and overview required");
      return;
    }
    const { technologies: _t, tags: _tg, ...rest } = projectForm;
    const payload = {
      ...rest,
      technologies: [],
      tags: [],
      project_images: [],
      challenges: "",
      devStory: "",
      technology_ids: [],
      tag_ids: [],
      image_ids: [],
    } as any;
    try {
      if (editingProject) {
        await api.updateProject(String(editingProject.id), payload);
        toast.success("Project updated");
      } else {
        await api.createProject(payload);
        toast.success("Project created");
      }
      const p = await api.getDashboardProjects();
      setProjects(p);
      setShowProjectForm(false);
    } catch {
      toast.error("Failed to save project");
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await api.deleteProject(String(id));
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const openCertForm = (cert?: Certification) => {
    if (cert) {
      setEditingCert(cert);
      setCertForm({
        title: cert.title,
        issuer: cert.issuer,
        date: cert.date,
        link: cert.link || "",
      });
    } else {
      setEditingCert(null);
      setCertForm({ title: "", issuer: "", date: "", link: "" });
    }
    setShowCertForm(true);
  };

  const saveCert = async () => {
    if (!certForm.title || !certForm.issuer) {
      toast.error("Title and issuer required");
      return;
    }
    try {
      if (editingCert) {
        await api.updateCertification(String(editingCert.id), certForm);
        toast.success("Certification updated");
      } else {
        await api.createCertification({ ...certForm, image: "" });
        toast.success("Certification added");
      }
      const c = await api.getCertifications();
      setCertifications(c);
      setShowCertForm(false);
    } catch {
      toast.error("Failed to save certification");
    }
  };

  const deleteCert = async (id: number) => {
    try {
      await api.deleteCertification(String(id));
      setCertifications((prev) => prev.filter((c) => c.id !== id));
      toast.success("Certification deleted");
    } catch {
      toast.error("Failed to delete certification");
    }
  };

  const deleteReview = async (id: number) => {
    try {
      await api.deleteReview(String(id));
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm p-8 rounded-2xl border border-border bg-card">
          <div className="text-center mb-6">
            <Lock size={32} className="mx-auto text-primary mb-3" />
            <h1 className="font-display text-xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to continue
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-all"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const tabs = ["overview", "projects", "certifications", "reviews"] as const;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border glass-surface sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Back to Site
            </Link>
            <span className="font-display font-bold text-sm">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {activeTab === "overview" && analytics && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Projects",
                  value: analytics.totalProjects,
                  icon: FolderOpen,
                },
                {
                  label: "Completed",
                  value: analytics.completedProjects,
                  icon: BarChart3,
                },
                {
                  label: "Reviews",
                  value: analytics.totalReviews,
                  icon: MessageSquare,
                },
                {
                  label: "Avg Rating",
                  value: analytics.averageRating.toFixed(1),
                  icon: Star,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-5 rounded-xl border border-border bg-card"
                >
                  <stat.icon size={18} className="text-primary mb-2" />
                  <div className="font-display text-2xl font-bold">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Projects</h2>
              <button
                onClick={() => openProjectForm()}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
              >
                <Plus size={14} /> Add Project
              </button>
            </div>

            {showProjectForm && (
              <div className="p-6 rounded-xl border border-border bg-card space-y-4">
                <h3 className="font-display font-semibold">
                  {editingProject ? "Edit Project" : "New Project"}
                </h3>
                <input
                  value={projectForm.title}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, title: e.target.value })
                  }
                  placeholder="Title"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <textarea
                  value={projectForm.overview}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, overview: e.target.value })
                  }
                  placeholder="Short overview"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <textarea
                  value={projectForm.long_description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      long_description: e.target.value,
                    })
                  }
                  placeholder="Full description"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    value={projectForm.technologies}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        technologies: e.target.value,
                      })
                    }
                    placeholder="Technologies (comma separated)"
                    className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    value={projectForm.tags}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, tags: e.target.value })
                    }
                    placeholder="Tags (comma separated)"
                    className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    value={projectForm.demoUrl}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        demoUrl: e.target.value,
                      })
                    }
                    placeholder="Demo URL"
                    className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    value={projectForm.githubUrl}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        githubUrl: e.target.value,
                      })
                    }
                    placeholder="GitHub URL"
                    className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <select
                    value={projectForm.status}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        status: e.target.value as Project["status"],
                      })
                    }
                    className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {[
                      "active",
                      "in-progress",
                      "completed",
                      "archived",
                      "draft",
                      "idea",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Progress:</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={projectForm.progress}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          progress: Number(e.target.value),
                        })
                      }
                      className="w-20 px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={projectForm.featured}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          featured: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    Featured
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={saveProject}
                    className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowProjectForm(false)}
                    className="border border-border px-5 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-border bg-card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                      Title
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden md:table-cell">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden lg:table-cell">
                      Updated
                    </th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="text-sm font-medium">{p.title}</div>
                        <div className="text-xs text-muted-foreground md:hidden capitalize">
                          {p.status}
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary capitalize">
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 hidden lg:table-cell text-xs text-muted-foreground">
                        {p.updatedAt}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openProjectForm(p)}
                            className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                            aria-label="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => deleteProject(p.id)}
                            className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                            aria-label="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "certifications" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Certifications</h2>
              <button
                onClick={() => openCertForm()}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
              >
                <Plus size={14} /> Add Certification
              </button>
            </div>

            {showCertForm && (
              <div className="p-6 rounded-xl border border-border bg-card space-y-4">
                <h3 className="font-display font-semibold">
                  {editingCert ? "Edit Certification" : "New Certification"}
                </h3>
                <input
                  value={certForm.title}
                  onChange={(e) =>
                    setCertForm({ ...certForm, title: e.target.value })
                  }
                  placeholder="Title"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    value={certForm.issuer}
                    onChange={(e) =>
                      setCertForm({ ...certForm, issuer: e.target.value })
                    }
                    placeholder="Issuer"
                    className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    value={certForm.date}
                    onChange={(e) =>
                      setCertForm({ ...certForm, date: e.target.value })
                    }
                    placeholder="Date (e.g. 2025-06)"
                    className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <input
                  value={certForm.link}
                  onChange={(e) =>
                    setCertForm({ ...certForm, link: e.target.value })
                  }
                  placeholder="Link (optional)"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="flex gap-3">
                  <button
                    onClick={saveCert}
                    className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowCertForm(false)}
                    className="border border-border px-5 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {certifications.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-border bg-card flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Award size={18} className="text-primary" />
                    <div>
                      <div className="text-sm font-medium">{c.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.issuer} • {c.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openCertForm(c)}
                      className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => deleteCert(c.id)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            <h2 className="font-display text-xl font-bold">
              Reviews ({reviews.length})
            </h2>
            <div className="space-y-3">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-xl border border-border bg-card flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{r.name}</span>
                      {r.rating && (
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              className={
                                s <= r.rating!
                                  ? "text-primary fill-primary"
                                  : "text-muted-foreground/30"
                              }
                            />
                          ))}
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {r.createdAt}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.message}</p>
                  </div>
                  <button
                    onClick={() => deleteReview(r.id)}
                    className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No reviews yet.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
