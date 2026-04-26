import { Link } from "react-router-dom";
import type { Project } from "@/lib/types";
import { ExternalLink, Github, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface ProjectCardProps {
  project: Project;
}

const resolveImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith("/")) return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "127.0.0.1" || parsed.hostname === "localhost") {
      return parsed.pathname + parsed.search;
    }
  } catch {
    // not a valid URL, return as-is
  }
  return url;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = resolveImageUrl(project.image);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group rounded-xl border border-border bg-card flex flex-col h-full transition-shadow duration-500 hover:shadow-lg overflow-hidden"
    >
      {/* Project Image */}
      <div className="relative w-full h-48 overflow-hidden bg-secondary/30">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={`${project.title} preview`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
            <ImageIcon size={40} className="mb-2 opacity-30" />
            <span className="text-xs opacity-50">No preview available</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status badges overlay */}
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

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <Link to={`/projects/${project.id}`}>
          <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3 leading-relaxed">
          {project.overview}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech.id}
              className="text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground"
            >
              {tech.name}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {project.progress !== undefined && project.progress < 100 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-primary font-medium">
                {project.progress}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex gap-3 pt-3 border-t border-border mt-auto">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <ExternalLink size={12} /> Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Github size={12} /> Source
            </a>
          )}
          <Link
            to={`/projects/${project.id}`}
            className="text-xs font-medium text-primary ml-auto link-underline"
          >
            View Details →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
