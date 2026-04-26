import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="w-full px-4 md:px-8 lg:px-12 max-w-7xl mx-auto py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link to="/" className="font-display text-xl font-bold text-primary">
              Kudakwashe Chikumbu
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed">
              Building intelligent systems and scalable platforms. Open to collaborations and new opportunities.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {["About", "Projects", "Reviews", "Contact"].map((link) => (
                <Link key={link} to={`/${link.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors link-underline w-fit">
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm mb-4">Connect</h4>
            <div className="flex gap-3">
              {[
                { icon: Github, href: "https://github.com/chikumbu-kudakwashe", label: "GitHub" },
                { icon: Linkedin, href: "https://linkedin.com/in/kudakwashe-chikumbu", label: "LinkedIn" },
                { icon: Mail, href: "mailto:kudakwashe@vachikumbu.com", label: "Email" },
                { icon: Phone, href: "tel:+263781618359", label: "Phone" },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="p-2.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Kudakwashe Chikumbu. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
