// src/pages/Projects.jsx
import React from "react";
import PropTypes from "prop-types";
import { ExternalLink, Camera, Car } from "lucide-react";

/* -------------------- tiny helpers & constants -------------------- */
const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const section = "py-20";

/* -------------------- minimal UI primitives (Tailwind only) -------------------- */
function Button({
  asChild = false,
  variant = "default",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-2xl font-medium transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  const variants = {
    default:
      "bg-indigo-600/90 text-white hover:bg-indigo-500/90 backdrop-blur focus-visible:outline-indigo-400",
    outline:
      "border bg-white/70 text-neutral-900 hover:bg-white/80 border-neutral-200 dark:border-white/30 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 backdrop-blur focus-visible:outline-indigo-400",
    ghost:
      "hover:bg-black/5 text-neutral-800 dark:hover:bg-white/10 dark:text-white/90 backdrop-blur focus-visible:outline-indigo-400",
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
  };
  const Comp = asChild ? "a" : "button";
  return (
    <Comp
      className={[base, variants[variant], sizes[size], className].join(" ")}
      {...props}
    >
      {children}
    </Comp>
  );
}
Button.propTypes = {
  asChild: PropTypes.bool,
  variant: PropTypes.oneOf(["default", "outline", "ghost"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  children: PropTypes.node,
};

function Card({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-2xl border backdrop-blur-xl shadow-lg h-full",
        "border-neutral-200/60 bg-white/80 text-neutral-900",
        "dark:border-white/15 dark:bg-[rgba(10,15,30,0.70)] dark:text-white",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

const CardHeader = ({ className = "", children }) => (
  <div className={["p-6 pb-2", className].join(" ")}>{children}</div>
);
CardHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

const CardContent = ({ className = "", children }) => (
  <div className={["px-6 pb-6", className].join(" ")}>{children}</div>
);
CardContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

const CardFooter = ({ className = "", children }) => (
  <div
    className={[
      "px-6 pb-6 flex items-center justify-between gap-3",
      className,
    ].join(" ")}
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
    className={[
      "font-semibold tracking-tight text-neutral-900 dark:text-white",
      className,
    ].join(" ")}
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
    className={["text-sm text-neutral-700 dark:text-white/80", className].join(
      " "
    )}
  >
    {children}
  </p>
);
CardDescription.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

const Badge = ({ children }) => (
  <span
    className={[
      "inline-flex items-center rounded-full border px-2 py-0.5 text-xs backdrop-blur",
      "border-neutral-200 bg-white/70 text-neutral-800",
      "dark:border-white/20 dark:bg-white/10 dark:text-white/90",
    ].join(" ")}
  >
    {children}
  </span>
);
Badge.propTypes = {
  children: PropTypes.node,
};

/* -------------------- accessible modal -------------------- */
function Modal({ open, onOpenChange, children }) {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl text-white max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {children}
        <div className="mt-6 text-right">
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  children: PropTypes.node,
};

/* -------------------- data -------------------- */
const PROJECTS = [
  {
    title: "Fracture PTSD Game",
    description:
      "Unity URP narrative experience planned as a 2.5D isometric puzzle–object game that reflects the chaos of living with PTSD. The Campfire scene explores emotion-based object placement and atmospheric lighting. Work in progress — no public code or demo yet.",
    tech: ["Unity", "C#", "URP"],
    links: { demo: null, code: null },
    icon: <Camera className="w-5 h-5" />,
    category: "creative",
    details: [
      "Mood-driven lighting rig with URP.",
      "Interactable props mapped to narrative beats.",
      "Visual puzzles designed to convey psychological tension and fragmentation.",
    ],
  },
  {
    title: "Cars (React app)",
    description:
      "Small React project exploring component composition and state patterns. Open source on GitHub.",
    tech: ["React", "Vite", "JavaScript"],
    links: {
      code: "https://github.com/yoshimario/cars",
      demo: null,
    },
    icon: <Car className="w-5 h-5" />,
    category: "dev",
    details: [
      "Organized components for clarity and reuse.",
      "Lightweight state handling patterns for predictable updates.",
    ],
  },
];

/* -------------------- section wrapper -------------------- */
function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className={section}>
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
Section.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node,
};

/* -------------------- page -------------------- */
export default function Projects() {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(null);

  const openCase = (p) => {
    if (!p.details || p.details.length === 0) return;
    setActive(p);
    setOpen(true);
  };

  return (
    <main className={container}>
      <Section
        id="projects"
        title="Projects"
        subtitle="Selected builds, labs, and experiments."
      >
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {PROJECTS.map((p) => (
            <div key={p.title}>
              <Card className="group flex flex-col">
                <CardHeader className="flex-row items-start gap-3">
                  <div className="rounded-lg p-2 bg-white/15 text-white">
                    {p.icon}
                  </div>
                  <div>
                    <CardTitle className="leading-tight">{p.title}</CardTitle>
                    <CardDescription>{p.description}</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <div className="flex items-center gap-3">
                    {p.links?.code && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        aria-label={`Open ${p.title} code link`}
                      >
                        <a
                          href={p.links.code}
                          target="_blank"
                          rel="noreferrer"
                          className="gap-2 inline-flex items-center"
                        >
                          Code <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {p.links?.demo && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        aria-label={`Open ${p.title} demo link`}
                      >
                        <a
                          href={p.links.demo}
                          target="_blank"
                          rel="noreferrer"
                          className="gap-2 inline-flex items-center"
                        >
                          Demo <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                  {p.details && p.details.length > 0 ? (
                    <Button size="sm" onClick={() => openCase(p)}>
                      Case study
                    </Button>
                  ) : null}
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </Section>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl text-white max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div>
              <h4 className="text-xl font-semibold text-white">
                {active?.title ?? "Project"}
              </h4>
              <p className="text-sm text-white/70 mt-1">
                {active?.description}
              </p>
              <div className="prose prose-invert max-w-none mt-4">
                {active?.details?.length > 0 ? (
                  <ul>
                    {active.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No additional write-up yet.</p>
                )}
              </div>
              <div className="mt-6 flex gap-3">
                {active?.links?.code && (
                  <Button asChild variant="outline">
                    <a
                      href={active.links.code}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Code <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {active?.links?.demo && (
                  <Button asChild>
                    <a
                      href={active.links.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Demo <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-6 text-right">
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
