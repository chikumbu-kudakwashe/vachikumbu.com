import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { api } from "@/lib/api";
import type { Review } from "@/lib/types";
import { Star, Send } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", message: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getReviews().then((r) => {
      setReviews(r);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      toast.error("Please fill in your name and message.");
      return;
    }
    setSubmitting(true);
    try {
      const review = await api.submitReview(form);
      setForm({ name: "", message: "", rating: 5 });
      toast.success(
        "Thank you for your review! It will be reviewed and posted shortly.",
      );
    } catch {
      toast.error("Failed to submit review.");
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
              Feedback
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Reviews
            </h1>
            <p className="text-muted-foreground max-w-xl mb-12 leading-relaxed">
              What people say about working with me. Feel free to leave your own
              review.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="p-6 md:p-8 rounded-2xl bg-card border border-border mb-16">
              <h2 className="font-display text-xl font-bold mb-6">
                Leave a Review
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-300"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setForm({ ...form, rating: star })}
                        className="p-1 transition-colors"
                      >
                        <Star
                          size={20}
                          className={
                            star <= form.rating
                              ? "text-primary fill-primary"
                              : "text-muted-foreground"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all duration-300"
                    placeholder="Share your experience..."
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
                >
                  <Send size={16} />{" "}
                  {submitting ? "Submitting..." : "Submit Review"}
                </motion.button>
              </form>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No reviews yet. Be the first to leave one!
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, i) => (
                <ScrollReveal key={review.id} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="p-6 rounded-xl border border-border bg-card"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold">
                            {review.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {review.createdAt}
                          </div>
                        </div>
                      </div>
                      {review.rating && (
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={
                                star <= review.rating!
                                  ? "text-primary fill-primary"
                                  : "text-muted-foreground/30"
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.message}
                    </p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
