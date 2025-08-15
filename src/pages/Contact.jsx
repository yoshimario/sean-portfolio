// src/pages/Contact.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";

/** Helpers + UI */
const cx = (...c) => c.filter(Boolean).join(" ");
const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const section = "py-16 md:py-20";

/* ---- Buttons / Inputs / Cards tuned for legibility over aurora ---- */
const Button = ({
  asChild = false,
  variant = "default",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center rounded-2xl font-medium transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400";
  const variants = {
    default: "bg-indigo-600/95 text-white hover:bg-indigo-500/95",
    outline:
      "border bg-white/80 text-neutral-900 hover:bg-white/90 border-neutral-200 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/16",
    ghost:
      "hover:bg-black/5 text-neutral-800 dark:hover:bg-white/10 dark:text-white/90",
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
Button.propTypes = {
  asChild: PropTypes.bool,
  variant: PropTypes.oneOf(["default", "outline", "ghost"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  children: PropTypes.node,
};

const Card = ({ as: Comp = "div", className = "", children, ...rest }) => (
  <Comp
    className={cx(
      "rounded-2xl border shadow-lg backdrop-blur-xl transition-colors",
      // Light
      "border-neutral-200/70 bg-white/85 text-neutral-900",
      // Dark – higher opacity so text stays readable over the aurora
      "dark:border-white/15 dark:bg-[rgba(10,15,30,0.72)] dark:text-white",
      className
    )}
    {...rest}
  >
    {children}
  </Comp>
);
Card.propTypes = {
  as: PropTypes.elementType,
  className: PropTypes.string,
  children: PropTypes.node,
};

const CardHeader = ({ children, className = "" }) => (
  <div className={cx("p-6 pb-3 md:p-7 md:pb-3", className)}>{children}</div>
);
CardHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

const CardContent = ({ children, className = "" }) => (
  <div className={cx("px-6 pb-6 md:px-7 md:pb-7", className)}>{children}</div>
);
CardContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

const CardFooter = ({ children, className = "" }) => (
  <div
    className={cx(
      "px-6 pb-6 md:px-7 md:pb-7 flex items-center justify-between gap-3",
      className
    )}
  >
    {children}
  </div>
);
CardFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

const CardTitle = ({ children, className = "" }) => (
  <h3
    className={cx(
      "font-semibold tracking-tight text-neutral-900 dark:text-white",
      "text-lg md:text-xl leading-tight",
      className
    )}
  >
    {children}
  </h3>
);
CardTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

const CardDescription = ({ children, className = "" }) => (
  <p
    className={cx(
      "text-sm md:text-[0.95rem] leading-relaxed",
      "text-neutral-700 dark:text-white/80",
      className
    )}
  >
    {children}
  </p>
);
CardDescription.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={cx(
      "w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 transition",
      // Light
      "border-neutral-300 bg-white/90 text-neutral-900 placeholder:text-neutral-500 focus:ring-indigo-400/60",
      // Dark – darker field, brighter text/placeholder
      "dark:border-white/15 dark:bg-[rgba(255,255,255,0.06)] dark:text-white dark:placeholder:text-white/65 focus:ring-indigo-400/50",
      className
    )}
  />
);
Input.propTypes = {
  className: PropTypes.string,
};

const Textarea = ({ className = "", ...props }) => (
  <textarea
    {...props}
    className={cx(
      "w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 transition resize-none",
      "border-neutral-300 bg-white/90 text-neutral-900 placeholder:text-neutral-500 focus:ring-indigo-400/60",
      "dark:border-white/15 dark:bg-[rgba(255,255,255,0.06)] dark:text-white dark:placeholder:text-white/65 focus:ring-indigo-400/50",
      className
    )}
  />
);
Textarea.propTypes = {
  className: PropTypes.string,
};

function Section({ title, subtitle, children }) {
  return (
    <section className={section}>
      <div className="mb-8 md:mb-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white drop-shadow">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-neutral-700 dark:text-white/80 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}
Section.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node,
};

/* ---- Page data ---- */
const PERSON = {
  email: "seankipina@alumni.depaul.edu",
  location: "Vantaa, Finland",
};

// 🔑 Replace this with your real Web3Forms access key (move to env for production)
const ACCESS_KEY = "0020de78-e8ec-4ff5-9239-9caa75008fc5";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    botcheck: "", // honeypot (should stay empty)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(""); // "success" | "error" | ""

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ACCESS_KEY || ACCESS_KEY.includes("YOUR_ACCESS_KEY")) {
      setSubmitStatus("error");
      console.error("Missing Web3Forms ACCESS_KEY.");
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus("");

    try {
      const fd = new FormData();
      fd.append("access_key", ACCESS_KEY);
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("message", formData.message);
      fd.append("subject", "Portfolio Contact Form");
      fd.append("from_name", "seankipina.com");
      // honeypot
      fd.append("botcheck", formData.botcheck || "");

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (data.success) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "", botcheck: "" });
      } else {
        console.error("Web3Forms error:", data);
        setSubmitStatus("error");
      }
    } catch (err) {
      console.error("Network error:", err);
      setSubmitStatus("error");
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
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 text-neutral-900 dark:text-white">
          {/* Form */}
          <Card as="section" aria-labelledby="contact-heading">
            <CardHeader>
              <CardTitle id="contact-heading">Reach out</CardTitle>
              <CardDescription>
                Say hello and tell me what you're building.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-3" onSubmit={handleSubmit}>
                {/* Honeypot (hidden) */}
                <input
                  type="text"
                  name="botcheck"
                  value={formData.botcheck}
                  onChange={handleInputChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <label className="block">
                  <span className="sr-only">Name</span>
                  <Input
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    aria-label="Your name"
                  />
                </label>

                <label className="block">
                  <span className="sr-only">Email</span>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    aria-label="Your email"
                  />
                </label>

                <label className="block">
                  <span className="sr-only">Message</span>
                  <Textarea
                    name="message"
                    rows={6}
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    aria-label="Your message"
                  />
                </label>

                {submitStatus === "success" && (
                  <div className="p-3 rounded-lg bg-green-100 text-green-900 text-sm dark:bg-green-900/35 dark:text-green-200">
                    Thanks for your message! I’ll get back to you soon.
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="p-3 rounded-lg bg-red-100 text-red-900 text-sm dark:bg-red-900/35 dark:text-red-200">
                    Something went wrong. Please try again or email me directly.
                  </div>
                )}

                <div className="pt-1 flex items-center gap-2">
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !formData.name ||
                      !formData.email ||
                      !formData.message
                    }
                  >
                    {isSubmitting ? "Sending…" : "Send Message"}
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
              </form>
            </CardContent>
          </Card>

          {/* Sidebar info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
                <CardDescription>Location & availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>📍 {PERSON.location}</div>
                <div>✉️ {PERSON.email}</div>
                <div>🎯 Available for full‑time opportunities</div>
                <div>🌍 Remote or on‑site within Finland only</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What I’m looking for</CardTitle>
                <CardDescription>About Me & Role Preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-enhanced">
                <p>
                  💻{" "}
                  <strong>Entry-level Cybersecurity & IT Professional:</strong>{" "}
                  Skilled in network security, vulnerability assessment, and IT
                  infrastructure.
                </p>
                <p>
                  📚 <strong>Experience:</strong> Academic projects, product
                  testing, and a 400-hour internship as a Security Expert –
                  Trainee at Hublet Oy.
                </p>
                <p>
                  🛡️ <strong>Contributions:</strong> Delivered improvements to
                  security documentation, vulnerability management, and software
                  reliability.
                </p>
                <p>
                  🤝 <strong>Communication:</strong> Strong customer service &
                  event operations background, fluent in English and
                  conversational in Spanish.
                </p>
                <p>
                  🚀 <strong>Motivation:</strong> Eager to apply hands-on
                  experience to real-world security challenges and grow
                  expertise in cyber defense, threat detection, and cloud
                  security.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </main>
  );
}
