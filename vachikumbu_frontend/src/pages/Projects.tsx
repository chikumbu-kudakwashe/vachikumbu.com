import { useEffect, useState, useMemo } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { api } from "@/lib/api";
import type { Project } from "@/lib/types";
import { Search } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTech, setActiveTech] = useState<string | null>(null);

  useEffect(() => {
    api.getProjects().then((p) => {
      setProjects(p);
      setLoading(false);
    });
  }, []);

  const allTechs = useMemo(
    () =>
      [
        ...new Set(projects.flatMap((p) => p.technologies.map((t) => t.name))),
      ].sort(),
    [projects],
  );

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.overview.toLowerCase().includes(search.toLowerCase());
      const matchesTech =
        !activeTech || p.technologies.some((t) => t.name === activeTech);
      return matchesSearch && matchesTech;
    });
  }, [projects, search, activeTech]);

  return (
    <PageLayout>
      <section className="section-padding">
        <div className="container-wide px-4 md:px-8 lg:px-12">
          <ScrollReveal>
            <p className="text-primary font-medium text-sm tracking-wider uppercase mb-3">
              Portfolio
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Projects
            </h1>
            <p className="text-muted-foreground mb-10 max-w-xl">
              A collection of platforms, tools, and applications I've built.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mb-8 space-y-4">
              <div className="relative max-w-md">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTech(null)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    !activeTech
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary"
                  }`}
                >
                  All
                </button>
                {allTechs.map((tech) => (
                  <button
                    key={tech}
                    onClick={() =>
                      setActiveTech(tech === activeTech ? null : tech)
                    }
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      activeTech === tech
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No projects match your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 0.05}>
                  <ProjectCard project={project} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
