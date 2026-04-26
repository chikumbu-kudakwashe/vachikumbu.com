import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { api } from "@/lib/api";
import { Mail, MapPin, Send, Github, Linkedin, Phone } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  // ✅ VALIDATION
  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "name") {
      if (!value.trim()) error = "Name is required";
    }

    if (name === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Enter a valid email (e.g. contact@vachikumbu.com)";
      }
    }

    if (name === "message") {
      if (!value.trim()) error = "Message is required";
    }

    return error;
  };

  // ✅ ON CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev: any) => ({ ...prev, [name]: error }));
    }
  };

  // ✅ ON BLUR
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setTouched((prev: any) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev: any) => ({ ...prev, [name]: error }));
  };

  // ✅ SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};

    Object.keys(form).forEach((key) => {
      const error = validateField(key, (form as any)[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setSubmitting(true);

    try {
      await api.SubmitContact(form);
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
      setErrors({});
      setTouched({});
    } catch (error: any) {
      const serverErrors = error.response?.data;

      if (serverErrors) {
        const firstError = Object.values(serverErrors)[0]?.[0];
        toast.error(firstError || "Validation error");
      } else {
        toast.error("Failed to send message.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <section className="section-padding">
        <div className="px-4 md:px-8 lg:px-12 max-w-5xl mx-auto">
          <ScrollReveal>
            <p className="text-primary font-medium text-xs tracking-widest uppercase mb-4">
              Contact
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              Get In Touch
            </h1>
            <p className="text-muted-foreground max-w-xl mb-16 leading-relaxed">
              Have a project in mind or want to collaborate? I'd love to hear
              from you.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16">
            <ScrollReveal animation="fade-left" className="md:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* NAME + EMAIL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* NAME */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm"
                    />
                    {touched.name && errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm"
                    />
                    {touched.email && errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* SUBJECT */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm"
                  />
                </div>

                {/* MESSAGE */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Message *
                  </label>
                  <textarea
                    rows={6}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm"
                  />
                  {touched.message && errors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* BUTTON */}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-lg font-medium disabled:opacity-50"
                >
                  <Send size={16} />
                  {submitting ? "Sending..." : "Send Message"}
                </motion.button>
              </form>
            </ScrollReveal>

            {/* RIGHT SIDE (unchanged) */}
            <ScrollReveal
              animation="fade-right"
              delay={0.15}
              className="md:col-span-2"
            >
              <div className="space-y-8">
                <div>
                  <h3 className="font-display font-semibold mb-4">
                    Contact Info
                  </h3>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-primary" />
                      <a href="mailto:kudakwashe@vachikumbu.com">
                        kudakwashe@vachikumbu.com
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-primary" />
                      <span>Harare, Zimbabwe</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {[Github, Linkedin, Phone].map((Icon, i) => (
                    <motion.div key={i} className="p-3 border rounded-lg">
                      <Icon size={18} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
