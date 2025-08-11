// src/pages/Projects.jsx
import React from "react";
import { ExternalLink, Shield, Terminal, Camera, Bike } from "lucide-react";

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

function Card({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-2xl border backdrop-blur-xl shadow-lg h-full",
        "border-neutral-200/60 bg-white/70 text-neutral-900",
        "dark:border-white/15 dark:bg-white/10 dark:text-white",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

const CardHeader = ({ className = "", children }) => (
  <div className={["p-6 pb-2", className].join(" ")}>{children}</div>
);

const CardContent = ({ className = "", children }) => (
  <div className={["px-6 pb-6", className].join(" ")}>{children}</div>
);

const CardFooter = ({ className = "", children }) => (
  <div className={["px-6 pb-6 flex items-center gap-3", className].join(" ")}>
    {children}
  </div>
);

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

const CardDescription = ({ children, className = "" }) => (
  <p
    className={["text-sm text-neutral-600 dark:text-white/70", className].join(
      " "
    )}
  >
    {children}
  </p>
);

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
        if (e.target === e.currentTarget) onOpenChange(false);
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

/* -------------------- data -------------------- */
const PROJECTS = [
  {
    title: "PTSD Narrative Game – Campfire Scene",
    description:
      "Unity URP narrative experience with emotion-based object placement and lighting design.",
    tech: ["Unity", "C#", "URP"],
    links: { demo: "#", code: "#" },
    icon: <Camera className="w-5 h-5" />,
    category: "creative",
    details: [
      "Mood-driven lighting rig with URP.",
      "Interactable props mapped to narrative beats.",
      "Performance tested on mid-range GPUs.",
    ],
  },
  {
    title: "Cisco ASA AnyConnect Lab",
    description:
      "Clientless SSL VPN + AnyConnect with NPS/RADIUS and hardened ACLs.",
    tech: ["Cisco ASA", "AnyConnect", "NPS", "RADIUS"],
    links: { demo: "#", code: "#" },
    icon: <Shield className="w-5 h-5" />,
    category: "security",
    details: [
      "AAA via NPS w/ RADIUS; fallback local auth.",
      "Tuned ACLs and object groups; logging to syslog.",
      "Client posture check and split-tunnel config.",
    ],
  },
  {
    title: "Bosch eBike Data Companion (WIP)",
    description:
      "iOS companion exploring Smart System data bridging and Garmin integration.",
    tech: ["iOS", "Swift", "BLE"],
    links: { demo: "#", code: "#" },
    icon: <Bike className="w-5 h-5" />,
    category: "dev",
    details: [
      "BLE characteristics exploration and caching.",
      "Data bridge prototype to Garmin Connect IQ.",
      "Privacy-first local storage model.",
    ],
  },
  {
    title: "Forensics Workflow Cheat-Suite",
    description:
      "Imaging & triage workflow using Sleuth Kit/Autopsy with scripted helpers.",
    tech: ["Kali", "TSK", "Autopsy", "Bash"],
    links: { demo: "#", code: "#" },
    icon: <Terminal className="w-5 h-5" />,
    category: "security",
    details: [
      "Automated image mounting and hashing.",
      "Repeatable triage checklist with scripted steps.",
      "Notes export to markdown for chain-of-custody.",
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

/* -------------------- page -------------------- */
export default function Projects() {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(null);

  return (
    <main className={container}>
      <Section
        id="projects"
        title="Projects"
        subtitle="Selected builds, labs, and experiments."
      >
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {PROJECTS.map((p, idx) => (
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

                <CardFooter className="justify-between">
                  <div className="flex items-center gap-3">
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
                  </div>

                  <Button
                    size="sm"
                    onClick={() => {
                      setActive(p);
                      setOpen(true);
                    }}
                  >
                    Case study
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </Section>

      {/* Case study modal */}
      <Modal open={open} onOpenChange={setOpen}>
        <div>
          <h4 className="text-xl font-semibold text-white">
            {active?.title ?? "Project"}
          </h4>
          <p className="text-sm text-white/70 mt-1">{active?.description}</p>

          <div className="prose prose-invert max-w-none mt-4">
            {active?.details ? (
              <ul>
                {active.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            ) : (
              <p>
                This is a placeholder for a deeper write-up: goals, constraints,
                architecture, risks, metrics, and what you would do differently
                next time.
              </p>
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
      </Modal>
    </main>
  );
}
