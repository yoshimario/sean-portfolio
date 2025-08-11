// src/pages/Writing.jsx
import React, { useState } from "react";
import placementPDF from "../assets/docs/Kipinä_Sean_Placement1_Report.pdf";

import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Tag,
  ExternalLink,
} from "lucide-react";

/**
 * BEFORE USING:
 * 1) Put your file here (recommended to avoid special characters):
 *    public/docs/Sean_Kipina_Placement1_Report.docx
 *    (or export to PDF for nicer in-browser viewing:
 *    public/docs/Sean_Kipina_Placement1_Report.pdf)
 *
 * 2) If you keep .docx, most browsers will download it. If you export to PDF,
 *    it will open in a tab. Update WRITING[0].href accordingly.
 */

/* ------------ tiny helpers + UI ------------ */
const cx = (...c) => c.filter(Boolean).join(" ");
const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const section = "py-20";

const Card = ({ className = "", children }) => (
  <div
    className={cx(
      "rounded-2xl border backdrop-blur-xl shadow-lg overflow-hidden group",
      "border-neutral-200/60 bg-white/70 text-neutral-900",
      "dark:border-white/15 dark:bg-white/10 dark:text-white",
      "hover:shadow-xl transition-all duration-300",
      className
    )}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={cx("p-6", className)}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={cx("px-6 pb-6", className)}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3
    className={cx(
      "font-semibold tracking-tight text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors",
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

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    category:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    readTime:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
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

/* ------------ only your provided article ------------ */
const WRITING = [
  {
    title: "Placement 1 — Hublet Oy (Learning Assignment)",
    href: placementPDF, // will open directly in most browsers
    date: "2025-01-15",
    category: "Work & Reports",
    readTime: "10–15 min (report)",
    excerpt:
      "A practical placement report covering IT support, QA testing in a SaaS environment, documentation improvements, and reflections on professional growth.",
    tags: ["Internship", "Documentation", "SaaS", "Support"],
    featured: true,
  },
];

/* ------------ categories (visible but some will be empty for now) ------------ */
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
        className="block h-full"
        target="_blank"
        rel="noreferrer"
      >
        {featured && (
          <div className="h-48 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 flex items-center justify-center">
            <div className="text-center text-white/70">
              <BookOpen className="w-12 h-12 mx-auto mb-2" />
              <div className="text-sm font-medium">Featured</div>
            </div>
          </div>
        )}

        <CardHeader className={cx(featured && "pb-4")}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-white/60">
              {formattedDate && <Calendar className="w-4 h-4" />}
              {formattedDate}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="category">
                <Tag className="w-3 h-3 mr-1" />
                {article.category}
              </Badge>
              {article.readTime && (
                <Badge variant="readTime">
                  <Clock className="w-3 h-3 mr-1" />
                  {article.readTime}
                </Badge>
              )}
            </div>
          </div>

          <CardTitle
            className={cx(
              "leading-tight mb-2",
              featured ? "text-xl" : "text-lg"
            )}
          >
            {article.title}
            <ArrowRight className="w-4 h-4 inline-block ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
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
        {/* Category filter */}
        <div className="mb-8 flex justify-center">
          <div className="flex gap-2 p-1 rounded-2xl bg-white/50 dark:bg-white/10 backdrop-blur flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cx(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  selectedCategory === cat
                    ? "bg-indigo-600/90 text-white"
                    : "text-neutral-600 dark:text-white/70 hover:bg-white/50 dark:hover:bg-white/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-neutral-400 dark:text-white/40" />
            <p className="text-neutral-600 dark:text-white/70 mb-2">
              No articles found in this category.
            </p>
            <p className="text-sm text-neutral-500 dark:text-white/50">
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600/90 text-white rounded-xl hover:bg-indigo-500/90 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Connect on LinkedIn
          </a>
        </div>
      </Section>
    </main>
  );
}
