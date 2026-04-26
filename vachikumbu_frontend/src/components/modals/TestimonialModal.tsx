// components/modals/TestimonialModal.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface TestimonialFormData {
  name: string;
  role: string;
  company: string;
  content: string;
}

interface FormErrors {
  name?: string;
  role?: string;
  content?: string;
}

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TestimonialModal({
  isOpen,
  onClose,
  onSuccess,
}: TestimonialModalProps) {
  const [form, setForm] = useState<TestimonialFormData>({
    name: "",
    role: "",
    company: "",
    content: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm({ name: "", role: "", company: "", content: "" });
      setErrors({});
      setTouched({});
    }
  }, [isOpen]);

  // Validation
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        break;
      case "role":
        if (!value.trim()) return "Role is required";
        break;
      case "content":
        if (!value.trim()) return "Testimonial content is required";
        if (value.trim().length < 10)
          return "Testimonial must be at least 10 characters";
        if (value.trim().length > 500)
          return "Testimonial must be less than 500 characters";
        break;
    }
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Live validation if field was touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {};
    Object.keys(form).forEach((key) => {
      if (key === "company") return; // Company is optional
      const error = validateField(key, (form as any)[key]);
      if (error) newErrors[key as keyof FormErrors] = error;
    });

    setErrors(newErrors);
    setTouched({ name: true, role: true, content: true });

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setSubmitting(true);

    try {
      await api.submitTestimonial({
        name: form.name.trim(),
        role: form.role.trim(),
        company: form.company.trim(),
        content: form.content.trim(),
      });

      toast.success(
        "Thank you for your testimonial! It will be reviewed and posted shortly.",
        {
          duration: 5000,
        },
      );

      onClose();
      onSuccess?.();
    } catch (error: any) {
      const serverErrors = error.response?.data;
      if (serverErrors) {
        // Map server errors to form fields
        const fieldErrors: FormErrors = {};
        Object.keys(serverErrors).forEach((key) => {
          if (key in form) {
            fieldErrors[key as keyof FormErrors] = serverErrors[key][0];
          }
        });
        setErrors(fieldErrors);

        const firstError = Object.values(serverErrors)[0]?.[0];
        toast.error(firstError || "Failed to submit testimonial");
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-lg font-semibold">Share Your Experience</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your feedback helps others discover great work
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                disabled={submitting}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-lg border bg-background text-sm transition-colors
                    ${
                      touched.name && errors.name
                        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                        : "border-border focus:border-primary focus:ring-primary/20"
                    }
                    focus:outline-none focus:ring-2`}
                />
                {touched.name && errors.name && (
                  <p className="text-destructive text-xs mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Role <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="CEO, Product Manager, etc."
                  className={`w-full px-4 py-3 rounded-lg border bg-background text-sm transition-colors
                    ${
                      touched.role && errors.role
                        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                        : "border-border focus:border-primary focus:ring-primary/20"
                    }
                    focus:outline-none focus:ring-2`}
                />
                {touched.role && errors.role && (
                  <p className="text-destructive text-xs mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                    {errors.role}
                  </p>
                )}
              </div>

              {/* Company */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Company{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Acme Inc."
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>

              {/* Content */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Your Testimonial <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={5}
                  placeholder="Share your experience working with me..."
                  maxLength={500}
                  className={`w-full px-4 py-3 rounded-lg border bg-background text-sm resize-none transition-colors
                    ${
                      touched.content && errors.content
                        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                        : "border-border focus:border-primary focus:ring-primary/20"
                    }
                    focus:outline-none focus:ring-2`}
                />
                <div className="flex justify-between items-center mt-1.5">
                  {touched.content && errors.content ? (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                      {errors.content}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {form.content.length}/500
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 rounded-lg border border-border text-sm font-medium
                    hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground 
                    px-6 py-3 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Testimonial
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
