import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Layers,
  Rocket,
  Zap,
  ChevronLeft,
  ChevronRight,
  Quote,
  Linkedin,
  Github,
  Mail,
  Phone,
  MessageSquarePlus,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { TestimonialModal } from "@/components/modals/TestimonialModal";
import { api } from "@/lib/api";
import type { Project, Skill, Testimonial } from "@/lib/types";

function ProjectCarousel({ projects }: { projects: Project[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    slidesToScroll: 1,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setSelectedIdx(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex-[0_0_100%] min-w-0 md:flex-[0_0_calc(33.333%-16px)]"
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 mt-8">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canPrev}
          className="p-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-30"
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-1.5">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`carousel-dot ${i === selectedIdx ? "active" : ""}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canNext}
          className="p-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-30"
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIdx, setSelectedIdx] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIdx(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((t) => (
            <div key={t.id} className="flex-[0_0_100%] min-w-0 px-4">
              <div className="text-center">
                <Quote size={36} className="mx-auto text-primary/20 mb-6" />
                <p className="text-lg md:text-xl leading-relaxed text-foreground mb-8">
                  "{t.content}"
                </p>
                <div className="font-display font-semibold">{t.name}</div>
                <div className="text-sm text-muted-foreground">
                  {t.role} at {t.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 mt-8">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="p-2 rounded-lg border border-border hover:border-primary transition-all"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex gap-1.5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`carousel-dot ${i === selectedIdx ? "active" : ""}`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="p-2 rounded-lg border border-border hover:border-primary transition-all"
          aria-label="Next testimonial"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

const socialLinks = [
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/kudakwashe-chikumbu",
    label: "LinkedIn",
  },
  {
    icon: Github,
    href: "https://github.com/chikumbu-kudakwashe",
    label: "GitHub",
  },
  { icon: Mail, href: "mailto:kudakwashe@vachikumbu.com", label: "Email" },
  { icon: Phone, href: "tel:+263781618359", label: "Phone" },
];

export default function Index() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getFeaturedProjects(),
      api.getSkills(),
      api.getTestimonials(),
    ]).then(([p, s, t]) => {
      setProjects(p);
      setSkills(s);
      setTestimonials(t);
      setLoading(false);
    });
  }, []);

  const skillCategories = [...new Set(skills.map((s) => s.category))];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="min-h-[90vh] pb-11 pt-6 flex items-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-32 right-20 w-64 h-64 rounded-full border border-primary/10 animate-float" />
          <div
            className="absolute bottom-40 left-10 w-40 h-40 rounded-full border border-primary/10 animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-primary/30 animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="w-full px-4 md:px-8 lg:px-12 max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <span className="px-4 py-2 text-md rounded-full bg-card border border-border hover:border-primary hover:text-primary transition font-display font-bold">
              Kudakwashe Chikumbu
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-primary font-medium text-sm tracking-widest uppercase mb-6"
            >
              Backend Engineer • Robotics Developer • ML Enthusiast
            </motion.p>
            <h1 className="font-display text-3xl sm:text-5xl md:text-7xl font-bold leading-[0.95] mb-8 tracking-tight">
              Building <span className="text-primary">Intelligent Systems</span>
              <br />
              for a Smarter Future
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              I design scalable backend systems, AI-driven applications, machine
              learning models, and robotics solutions that solve real-world
              problems.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-lg font-medium hover:opacity-90 transition-all duration-300"
              >
                View My Work <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-border bg-card text-foreground px-6 py-3.5 rounded-lg font-medium hover:border-primary transition-all duration-300"
              >
                Get In Touch
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex gap-3 mt-10"
            >
              {socialLinks.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="p-3 rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
                  aria-label={s.label}
                >
                  <s.icon size={18} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Preview */}
      <section className="section-padding bg-card/50">
        <div className="px-4 md:px-8 lg:px-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <ScrollReveal animation="fade-left">
              <div>
                <p className="text-primary font-medium text-xs tracking-widest uppercase mb-4">
                  About
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                  Building for <span className="text-primary">Impact</span>
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  I'm a backend and machine learning engineer who thrives at the
                  intersection of scalable systems and intelligent automation.
                </p>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Every project I build is driven by a commitment to robust
                  architecture, thoughtful design, and code that stands the test
                  of time.
                </p>
                <Link
                  to="/about"
                  className="text-sm font-medium text-primary link-underline inline-flex items-center gap-1"
                >
                  Read More About Me <ArrowRight size={14} />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-right" delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: Code2,
                    title: "Clean Code",
                    desc: "Maintainable, well-tested codebases",
                  },
                  {
                    icon: Layers,
                    title: "Backend",
                    desc: "Scalable APIs & microservices",
                  },
                  {
                    icon: Rocket,
                    title: "Robotics",
                    desc: "Embedded systems & automation",
                  },
                  {
                    icon: Zap,
                    title: "AI/ML",
                    desc: "Intelligent data-driven solutions",
                  },
                ].map((item) => (
                  <motion.div
                    key={item.title}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="p-5 rounded-xl border border-border bg-background"
                  >
                    <item.icon size={22} className="text-primary mb-3" />
                    <h4 className="font-display text-sm font-semibold mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Featured Projects Carousel */}
      <section className="section-padding">
        <div className="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-primary font-medium text-xs tracking-widest uppercase mb-3">
                  Portfolio
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  Featured Projects
                </h2>
              </div>
              <Link
                to="/projects"
                className="text-sm font-medium text-primary link-underline hidden md:inline-flex items-center gap-1"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-64 rounded-xl bg-muted animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <ProjectCarousel projects={projects} />
            )}
          </ScrollReveal>
          <Link
            to="/projects"
            className="mt-8 text-sm font-medium text-primary link-underline md:hidden inline-flex items-center gap-1"
          >
            View All Projects <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Skills */}
      <section className="section-padding bg-card/50">
        <div className="px-4 md:px-8 lg:px-12 max-w-5xl mx-auto">
          <ScrollReveal>
            <p className="text-primary font-medium text-xs tracking-widest uppercase mb-3 text-center">
              Expertise
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 text-center">
              Skills & Technologies
            </h2>
            <p className="text-muted-foreground text-center mb-12">
              Tools and technologies I work with daily
            </p>
          </ScrollReveal>
          {loading ? (
            <div className="h-48 rounded-xl bg-muted animate-pulse" />
          ) : (
            <div className="space-y-8">
              {skillCategories.map((cat, ci) => (
                <ScrollReveal key={cat} delay={ci * 0.08}>
                  <h3 className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                    {cat}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills
                      .filter((s) => s.category === cat)
                      .map((skill) => (
                        <motion.div
                          key={skill.id}
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium hover:border-primary hover:text-primary transition-colors cursor-default"
                        >
                          {skill.name}
                        </motion.div>
                      ))}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="px-4 md:px-8 lg:px-12 max-w-5xl mx-auto">
          <ScrollReveal>
            <p className="text-primary font-medium text-xs tracking-widest uppercase mb-3 text-center">
              Testimonials
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 text-center">
              What People Say
            </h2>
          </ScrollReveal>

          {testimonials.length > 0 ? (
            <ScrollReveal delay={0.15}>
              <TestimonialCarousel testimonials={testimonials} />
            </ScrollReveal>
          ) : (
            <ScrollReveal delay={0.15}>
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  No testimonials yet. Be the first to share your experience!
                </p>
              </div>
            </ScrollReveal>
          )}

          {/* Add Testimonial Button - Always visible */}
          <div className="flex justify-center mt-12">
            <motion.button
              onClick={() => setShowTestimonialModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MessageSquarePlus size={20} />
              Share Your Experience
            </motion.button>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding">
        <div className="px-4 md:px-8 lg:px-12 max-w-5xl mx-auto">
          <ScrollReveal animation="scale">
            <div className="text-center rounded-2xl bg-primary p-8 md:p-20">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Let's Build Something Great
              </h2>
              <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
                I'm always open to new projects, collaborations, and
                opportunities.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-background text-foreground px-6 py-3.5 rounded-lg font-medium hover:opacity-90 transition-all duration-300"
              >
                Get In Touch <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonial Modal */}
      <TestimonialModal
        isOpen={showTestimonialModal}
        onClose={() => setShowTestimonialModal(false)}
        onSuccess={() => {
          // Optionally refresh testimonials
          api.getTestimonials().then(setTestimonials);
        }}
      />
    </PageLayout>
  );
}
