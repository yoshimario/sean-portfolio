// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import seanImg from "../assets/img/sean.jpg";

/* --- tiny helpers / UI --- */
const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

function Button({
  asChild = false,
  variant = "default",
  size = "md",
  className = "",
  children,
  ...props
}) {
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
        "rounded-2xl border backdrop-blur-xl shadow-lg",
        "border-neutral-200/60 bg-white/70 text-neutral-900",
        "dark:border-white/15 dark:bg-white/10 dark:text-white",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="py-20">
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

/* --- content data --- */
const PERSON = {
  name: "Sean Kipinä",
  tagline: "Cybersecurity • IT Operations • Problem Solver",
  blurb:
    "Cybersecurity & IT professional focused on network security, vulnerability assessment, and realistic troubleshooting.",
  location: "Vamtaa, Finland",
  email: "seankipina@alumni.depaul.edu",
  github: "https://github.com/yoshimario",
  linkedin: "https://www.linkedin.com/in/seankipina/",
};

/* --- page --- */
export default function Home() {
  return (
    <>
      {/* Hero */}
      <section
        id="hero"
        className="relative overflow-hidden border-b border-white/10"
      >
        <div
          className={[
            container,
            "py-28 md:py-36 grid md:grid-cols-2 gap-10 items-center text-neutral-900 dark:text-white relative z-10",
          ].join(" ")}
        >
          {/* Left: copy & CTAs */}
          <div>
            <div className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-white/80 mb-3">
              <MapPin className="w-4 h-4" /> {PERSON.location}
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight drop-shadow">
              {PERSON.name}
            </h1>

            <p className="mt-3 text-2xl text-indigo-700 dark:text-indigo-200">
              {PERSON.tagline}
            </p>

            <p className="mt-4 text-neutral-700 dark:text-white/85 max-w-xl">
              {PERSON.blurb}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/projects" className="flex items-center gap-2">
                  See projects <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a
                  href={`mailto:${PERSON.email}`}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Contact
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a
                  href={PERSON.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a
                  href={PERSON.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              </Button>
            </div>
          </div>

          {/* Right: portrait */}
          <div className="md:justify-self-end">
            <Card className="glass relative size-56 md:size-72 overflow-hidden ring-1 ring-white/10">
              <img
                src={seanImg} // make sure this import exists: import seanImg from "../assets/img/sean.jpg";
                alt="Sean Kipinä"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Water shimmer overlay */}
              <svg
                className="absolute inset-0 h-full w-full mix-blend-soft-light opacity-70"
                aria-hidden="true"
              >
                <filter id="introRippleHome">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.006 0.012"
                    numOctaves="2"
                    seed="7"
                  >
                    <animate
                      attributeName="baseFrequency"
                      dur="10s"
                      values="0.006 0.012;0.008 0.016;0.006 0.012"
                      repeatCount="indefinite"
                    />
                  </feTurbulence>
                  <feDisplacementMap in="SourceGraphic" scale="18" />
                </filter>
                <rect
                  width="100%"
                  height="100%"
                  filter="url(#introRippleHome)"
                  fill="url(#introGradHome)"
                />
                <defs>
                  <linearGradient
                    id="introGradHome"
                    x1="0"
                    x2="1"
                    y1="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.25" />
                    <stop
                      offset="100%"
                      stopColor="#a5f3fc"
                      stopOpacity="0.15"
                    />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/15 to-cyan-300/10" />
              <span className="sr-only">Water-glass aesthetic portrait</span>
            </Card>
          </div>
        </div>
      </section>

      <main className={container}>
        {/* About (preview) */}
        <Section
          id="about"
          title="About"
          subtitle="Cybersecurity-focused tech problem solver who translates chaos into stable systems."
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">What I'm into</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700 dark:text-white/80">
                <li>
                  Network security, vulnerability management, and
                  troubleshooting.
                </li>
                <li>
                  Hands-on problem solving, straightforward processes, and
                  outcomes you can trust.
                </li>
                <li>Unity tinkering, photography, and eMTB rides.</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Current focus</h3>
              <div className="text-sm text-neutral-700 dark:text-white/80 space-y-2">
                <p>
                  🎓 Finishing BBA in Business IT & Cyber Security at Laurea UAS
                </p>
                <p>🔍 Seeking security, IT ops, or technical support roles</p>
                <p>
                  📍 Based in Finland — available for remote or on-site roles
                  within Finland only.
                </p>
              </div>
            </Card>
          </div>
        </Section>

        {/* Quick stats */}
        <Section id="stats" title="At a glance">
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                3+
              </div>
              <div className="text-sm text-neutral-600 dark:text-white/70">
                Years in tech
              </div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                4.0
              </div>
              <div className="text-sm text-neutral-600 dark:text-white/70">
                GPA in Cybersecurity
              </div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                13k+
              </div>
              <div className="text-sm text-neutral-600 dark:text-white/70">
                Event attendees managed
              </div>
            </Card>
          </div>
        </Section>

        {/* Callouts to other pages */}
        <Section id="explore" title="Explore">
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="p-6 flex items-center justify-between group hover:bg-white/80 dark:hover:bg-white/15 transition-colors">
              <div>
                <h3 className="font-semibold text-lg">Projects</h3>
                <p className="text-sm text-neutral-600 dark:text-white/70">
                  Labs, builds, and experiments.
                </p>
              </div>
              <Button asChild>
                <Link to="/projects" className="inline-flex items-center gap-2">
                  View{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </Card>
            <Card className="p-6 flex items-center justify-between group hover:bg-white/80 dark:hover:bg-white/15 transition-colors">
              <div>
                <h3 className="font-semibold text-lg">Photography</h3>
                <p className="text-sm text-neutral-600 dark:text-white/70">
                  Selected shots — water, urban, and climbs.
                </p>
              </div>
              <Button asChild>
                <Link
                  to="/photography"
                  className="inline-flex items-center gap-2"
                >
                  View{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </Card>
          </div>
        </Section>
      </main>
    </>
  );
}
