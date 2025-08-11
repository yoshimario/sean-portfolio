import React, { useState } from "react";

/** Helpers + UI */
const cx = (...c) => c.filter(Boolean).join(" ");
const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const section = "py-20";

const Button = ({
  asChild = false,
  variant = "default",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center rounded-2xl font-medium transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed";
  const variants = {
    default: "bg-indigo-600/90 text-white hover:bg-indigo-500/90 backdrop-blur",
    outline:
      "border bg-white/70 text-neutral-900 hover:bg-white/80 border-neutral-200 dark:border-white/30 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 backdrop-blur",
    ghost:
      "hover:bg-black/5 text-neutral-800 dark:hover:bg-white/10 dark:text-white/90 backdrop-blur",
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
  };
  const Comp = asChild ? "a" : "button";
  return (
    <Comp
      className={cx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Comp>
  );
};

const Card = ({ className = "", children }) => (
  <div
    className={cx(
      "rounded-2xl border backdrop-blur-xl shadow-lg",
      "border-neutral-200/60 bg-white/70 text-neutral-900",
      "dark:border-white/15 dark:bg-white/10 dark:text-white",
      className
    )}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={cx("p-6 pb-2", className)}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={cx("px-6 pb-6", className)}>{children}</div>
);

const CardFooter = ({ children, className = "" }) => (
  <div
    className={cx(
      "px-6 pb-6 flex items-center justify-between gap-3",
      className
    )}
  >
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3
    className={cx(
      "font-semibold tracking-tight text-neutral-900 dark:text-white",
      className
    )}
  >
    {children}
  </h3>
);

const CardDescription = ({ children, className = "" }) => (
  <p className={cx("text-sm text-neutral-600 dark:text-white/70", className)}>
    {children}
  </p>
);

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={cx(
      "w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 backdrop-blur",
      "border-neutral-300 bg-white/80 text-neutral-900 placeholder:text-neutral-500 focus:ring-indigo-400/60",
      "dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-white/60",
      className
    )}
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    {...props}
    className={cx(
      "w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 backdrop-blur resize-none",
      "border-neutral-300 bg-white/80 text-neutral-900 placeholder:text-neutral-500 focus:ring-indigo-400/60",
      "dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-white/60",
      className
    )}
  />
);

function Section({ title, subtitle, children }) {
  return (
    <section className={section}>
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white drop-shadow">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-neutral-600 dark:text-white/80 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

const PERSON = {
  email: "seankipina@alumni.depaul.edu",
  location: "Vantaa, Finland",
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would send the data to your backend here
      console.log("Form submitted:", formData);

      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={container}>
      <Section
        title="Contact"
        subtitle="Open to security, IT ops, and support roles."
      >
        <div className="grid md:grid-cols-2 gap-10 text-neutral-900 dark:text-white">
          <Card>
            <CardHeader>
              <CardTitle>Reach out</CardTitle>
              <CardDescription>
                Say hello and tell me what you're building.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Textarea
                  name="message"
                  placeholder="Message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {submitStatus === "success" && (
                <div className="mt-3 p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm">
                  Thanks for your message! I'll get back to you soon.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mt-3 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-sm">
                  Something went wrong. Please try again or email me directly.
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="text-sm text-neutral-600 dark:text-white/70">
                Or email me directly:
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    !formData.name ||
                    !formData.email ||
                    !formData.message
                  }
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
                <Button asChild variant="outline">
                  <a
                    href={`mailto:${PERSON.email}`}
                    className="inline-flex items-center gap-2"
                  >
                    {PERSON.email}
                  </a>
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
                <CardDescription>Location & availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>📍 {PERSON.location}</div>
                <div>✉️ {PERSON.email}</div>
                <div>🎯 Available for full-time opportunities</div>
                <div>🌍 Available for remote or on-site roles within Finland only.</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What I'm looking for</CardTitle>
                <CardDescription>Role preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  • <strong>Security roles:</strong> SOC analyst, vulnerability
                  management, compliance
                </div>
                <div>
                  • <strong>IT Operations:</strong> System administration,
                  network operations, DevOps
                </div>
                <div>
                  • <strong>Technical Support:</strong> L2/L3 support, customer
                  success, solutions engineering
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </main>
  );
}
