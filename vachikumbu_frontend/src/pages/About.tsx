import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { api } from "@/lib/api1";
import type { AboutData, Skill, Certification } from "@/lib/types";
import { Download, CheckCircle, Award, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAbout(),
      api.getSkills(),
      api.getCertifications(),
    ]).then(([a, s, c]) => {
      setAbout(a);
      setSkills(s);
      setCertifications(c);
      setLoading(false);
    });
  }, []);

  const categories = [...new Set(skills.map((s) => s.category))];

  if (loading) {
    return (
      <PageLayout>
        <div className="section-padding px-4 md:px-8 max-w-5xl mx-auto">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="section-padding">
        <div className="px-4 md:px-8 lg:px-12 max-w-5xl mx-auto">
          {/* Header with profile image */}
          <ScrollReveal>
            <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center md:items-start mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl  shrink-0 overflow-hidden"
              >
                <img
                  src="/images/profile.png"
                  alt="Kudakwashe Chikumbu"
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
              <div>
                <p className="text-primary font-medium text-xs tracking-widest uppercase mb-4">
                  About Me
                </p>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                  Kudakwashe <span className="text-primary">Chikumbu</span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  {about?.bio}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Philosophy */}
          <ScrollReveal animation="fade-right">
            <div className="mb-16 p-6 md:p-10 rounded-2xl bg-card border border-border">
              <h2 className="font-display text-2xl font-bold mb-4">
                Development Philosophy
              </h2>
              <p className="text-muted-foreground italic text-lg leading-relaxed">
                "{about?.philosophy}"
              </p>
            </div>
          </ScrollReveal>

          {/* Career Highlights */}
          <ScrollReveal>
            <div className="mb-16">
              <h2 className="font-display text-2xl font-bold mb-6">
                Career Highlights
              </h2>
              <div className="space-y-4">
                {about?.highlights.map((h, i) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle
                      size={18}
                      className="text-primary mt-0.5 shrink-0"
                    />
                    <span className="text-muted-foreground">{h.highlight}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Skills */}
          <ScrollReveal>
            <h2 className="font-display text-2xl font-bold mb-8">
              Skills & Technologies
            </h2>
            <div className="space-y-8 mb-16">
              {categories.map((cat, ci) => (
                <ScrollReveal key={cat} delay={ci * 0.08}>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                    {cat}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills
                      .filter((s) => s.category === cat)
                      .map((skill, i) => (
                        <motion.span
                          key={skill.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.03, duration: 0.3 }}
                          className="px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium hover:border-primary hover:text-primary transition-colors cursor-default"
                        >
                          {skill.name}
                        </motion.span>
                      ))}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>

          {/* Certifications */}
          {certifications.length > 0 && (
            <ScrollReveal>
              <h2 className="font-display text-2xl font-bold mb-8">
                Certifications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
                {certifications.map((cert, i) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    whileHover={{ y: -4 }}
                    className="p-5 rounded-xl border border-border bg-card"
                  >
                    <Award size={20} className="text-primary mb-3" />
                    <h4 className="font-display text-sm font-semibold mb-1">
                      {cert.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-1">
                      {cert.issuer}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {cert.date}
                    </p>
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary inline-flex items-center gap-1 hover:underline"
                      >
                        View <ExternalLink size={10} />
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal animation="scale">
            <div className="text-center">
              <a className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-lg font-medium hover:opacity-90 transition-all duration-300"
                href={about.cv}
                download="Kudakwashe_Chikumbu_CV.pdf"
              >
                
                <Download size={16} /> Download CV
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}
