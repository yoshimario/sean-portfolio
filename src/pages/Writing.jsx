// src/pages/Writing.jsx
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Tag,
  ExternalLink,
} from "lucide-react";

/* ------------ tiny helpers + UI ------------ */
const cx = (...c) => c.filter(Boolean).join(" ");
const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const section = "py-16 md:py-20";

/* Cards are made more opaque in dark mode for legibility over the aurora bg */
const Card = ({ className = "", children }) => (
  <div
    className={cx(
      "rounded-2xl border shadow-lg overflow-hidden group transition-colors",
      // Light
      "border-neutral-200/70 bg-white/85 text-neutral-900",
      // Dark (higher opacity + slight tint)
      "dark:border-white/15 dark:bg-[rgba(10,15,30,0.72)] dark:text-white",
      // Subtle elevation on hover
      "hover:shadow-xl backdrop-blur-xl",
      className
    )}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={cx("p-6 md:p-7", className)}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={cx("px-6 pb-6 md:px-7 md:pb-7", className)}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3
    className={cx(
      "font-semibold tracking-tight",
      "text-neutral-900 dark:text-white",
      "text-[1.05rem] md:text-lg leading-snug",
      "group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors",
      className
    )}
  >
    {children}
  </h3>
);

const CardDescription = ({ children, className = "" }) => (
  <p
    className={cx(
      "text-[0.95rem] md:text-base leading-relaxed",
      "text-neutral-700 dark:text-white/85",
      className
    )}
  >
    {children}
  </p>
);

/* Chips with stronger borders/contrast in dark mode */
const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default:
      "bg-indigo-50 text-indigo-700 border border-indigo-200/70 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-400/20",
    category:
      "bg-purple-50 text-purple-700 border border-purple-200/70 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-400/20",
    readTime:
      "bg-green-50 text-green-700 border border-green-200/70 dark:bg-green-950/50 dark:text-green-300 dark:border-green-400/20",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur",
        variants[variant]
      )}
    >
      {children}
    </span>
  );
};

function Section({ title, subtitle, children }) {
  return (
    <section className={section}>
      <div className="mb-8 md:mb-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white drop-shadow">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-neutral-700 dark:text-white/85 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

/* ------------ your article(s) ------------ */
/* Put the PDF in /public/docs/ and link it with an absolute path. 
   Avoid special characters in filenames if possible. */
const WRITING = [
  {
    title: "Placement 1 — Hublet Oy (Learning Assignment)",
    href: "/public/docs/Sean_Kipina_Placement1_Report.pdf", // served from /public/docs
    date: "2025-01-15",
    category: "Work & Reports",
    readTime: "10–15 min (report)",
    excerpt:
      "Practical placement report: IT support, QA in a SaaS environment, documentation improvements, and reflections on professional growth.",
    tags: ["Internship", "Documentation", "SaaS", "Support"],
    featured: true,
  },
];

/* ------------ categories ------------ */
const CATEGORIES = [
  "All",
  "Work & Reports",
  "Society & Perspective",
  "Cycling & Gear",
  "Cybersecurity",
  "Career & Development",
];

function WritingCard({ article, featured = false }) {
  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <Card className={cx("cursor-pointer h-full", featured && "md:col-span-2")}>
      <a
        href={article.href}
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-2xl"
        target="_blank"
        rel="noreferrer"
      >
        {featured && (
          <div className="h-48 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/25 to-purple-500/25" />
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center text-neutral-700 dark:text-white/80">
                <BookOpen className="w-12 h-12 mx-auto mb-2" />
                <div className="text-sm font-medium tracking-wide uppercase">
                  Featured
                </div>
              </div>
            </div>
          </div>
        )}

        <CardHeader className={cx(featured && "pb-4")}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-white/70">
              {formattedDate && <Calendar className="w-4 h-4" />}
              <span className="whitespace-nowrap">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="category">
                <Tag className="w-3 h-3" />
                <span className="ml-1">{article.category}</span>
              </Badge>
              {article.readTime && (
                <Badge variant="readTime">
                  <Clock className="w-3 h-3" />
                  <span className="ml-1">{article.readTime}</span>
                </Badge>
              )}
            </div>
          </div>

          <CardTitle
            className={cx(
              "leading-tight mb-2",
              featured ? "text-xl md:text-[1.35rem]" : "text-lg"
            )}
          >
            {article.title}
            <ArrowRight className="w-4 h-4 inline-block ml-2 opacity-0 align-[-2px] group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </CardTitle>

          <CardDescription className="leading-relaxed">
            {article.excerpt}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2">
            {article.tags?.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </a>
    </Card>
  );
}

export default function Writing() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered =
    selectedCategory === "All"
      ? WRITING
      : WRITING.filter((a) => a.category === selectedCategory);

  return (
    <main className={container}>
      <Section
        title="Selected Writing"
        subtitle="Thoughts on technology, security, and the intersection of digital life with human experience."
      >
        {/* Category filter — higher contrast, clearer focus/pressed state */}
        <div className="mb-8 flex justify-center">
          <div
            className={cx(
              "flex gap-2 p-1 rounded-2xl backdrop-blur border",
              "bg-white/70 border-neutral-200",
              "dark:bg-[rgba(10,15,30,0.6)] dark:border-white/15"
            )}
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={active}
                  className={cx(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
                    active
                      ? "bg-indigo-600/95 text-white shadow-sm"
                      : "text-neutral-700 dark:text-white/80 hover:bg-white/70 dark:hover:bg-white/10"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-neutral-400 dark:text-white/50" />
            <p className="text-neutral-700 dark:text-white/85 mb-2">
              No articles found in this category.
            </p>
            <p className="text-sm text-neutral-600 dark:text-white/70">
              More coming soon.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <WritingCard
                key={article.title}
                article={article}
                featured={article.featured}
              />
            ))}
          </div>
        )}

        {/* LinkedIn link */}
        <div className="mt-16 text-center">
          <a
            href="https://www.linkedin.com/in/seankipina/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 bg-indigo-600/95 text-white hover:bg-indigo-500/95"
          >
            <ExternalLink className="w-4 h-4" />
            Connect on LinkedIn
          </a>
        </div>
      </Section>
    </main>
  );
}
