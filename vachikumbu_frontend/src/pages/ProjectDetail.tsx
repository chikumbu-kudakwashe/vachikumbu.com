import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { api } from "@/lib/api";
import type { Project } from "@/lib/types";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (id) {
      api
        .getProject(id)
        .then((p) => setProject(p ?? null))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <div className="section-padding px-4 md:px-8 container-narrow">
          <div className="h-96 rounded-xl bg-muted animate-pulse" />
        </div>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout>
        <div className="section-padding px-4 md:px-8 container-narrow text-center">
          <h1 className="font-display text-3xl font-bold mb-4">
            Project Not Found
          </h1>
          <Link to="/projects" className="text-primary link-underline">
            ← Back to Projects
          </Link>
        </div>
      </PageLayout>
    );
  }

  const imageUrl = project.image || null;

  return (
    <PageLayout>
      <section className="section-padding">
        <div className="container-narrow px-4 md:px-8">
          <ScrollReveal>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={14} /> Back to Projects
            </Link>

            {/* Hero image */}
            <div className="relative w-full h-48 overflow-hidden bg-secondary/30 rounded-xl mb-8">
              {imageUrl && !imageError ? (
                <img
                  src={imageUrl}
                  alt={`${project.title} preview`}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                  <ImageIcon size={40} className="mb-2 opacity-30" />
                  <span className="text-xs opacity-50">
                    No preview available
                  </span>
                </div>
              )}

              {/* Status badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 text-foreground capitalize shadow-sm">
                  {project.status}
                </span>
                {project.featured && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-primary-foreground shadow-sm">
                    Featured
                  </span>
                )}
              </div>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {project.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {project.overview}
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all duration-300"
                >
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border bg-card text-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:border-primary transition-all duration-300"
                >
                  <Github size={14} /> View Source
                </a>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-left">
            <div className="mb-12">
              <h2 className="font-display text-2xl font-bold mb-4">
                About This Project
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {project.long_description}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mb-12">
              <h2 className="font-display text-2xl font-bold mb-4">
                Technologies Used
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <motion.span
                    key={tech.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium"
                  >
                    {tech.name}
                  </motion.span>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {project.devStory && (
            <ScrollReveal animation="fade-right">
              <div className="mb-12">
                <h2 className="font-display text-2xl font-bold mb-4">
                  Development Story
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {project.devStory}
                </p>
              </div>
            </ScrollReveal>
          )}

          {project.challenges && (
            <ScrollReveal animation="scale">
              <div className="mb-12 p-6 md:p-10 rounded-2xl bg-card border border-border">
                <h2 className="font-display text-2xl font-bold mb-4">
                  Challenges & Solutions
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {project.challenges}
                </p>
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Calendar size={14} />
              <span>
                Last updated: {new Date(project.updatedAt).toLocaleDateString()}
              </span>
              <span className="ml-auto">Progress: {project.progress}%</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${project.progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}
