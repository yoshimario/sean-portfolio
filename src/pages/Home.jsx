// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import seanImg from "../assets/img/sean.jpg";

/* --- tiny helpers / UI --- */
const container = "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"; // unified width

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
        // keep your glass look, bump dark opacity for readability
        "glass rounded-2xl shadow-lg border dark:bg-white/[0.06] bg-neutral-100/70 dark:border-white/10 border-neutral-200",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/* Section: consistent vertical rhythm site-wide */
function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="scroll-mt-[72px] pt-8 pb-8">
      <div className="mb-3">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white text-enhanced">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm md:text-base text-neutral-700 dark:text-white/85 text-enhanced max-w-2xl">
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
  location: "Vantaa, Finland",
  email: "seankipina@alumni.depaul.edu",
  github: "https://github.com/yoshimario",
  linkedin: "https://www.linkedin.com/in/seankipina/",
};

/* --- page --- */
export default function Home() {
  return (
    <>
      {/* HERO — offset for sticky header + tight bottom spacing */}
      <section
        id="hero"
        className="relative overflow-hidden border-b border-white/10 pt-[72px] pb-8"
      >
        <div
          className={[
            container,
            "min-h-[20vh] flex flex-col justify-center items-start text-neutral-900 dark:text-white relative z-10",
          ].join(" ")}
        >
          <div className="grid md:grid-cols-2 items-center w-full gap-6 md:gap-8">
            {/* Left: copy & CTAs */}
            <div
              className={
                // subtle readability surface behind text in dark mode
                "space-y-4 rounded-2xl p-4 md:p-5 dark:bg-black/35 bg-white/0 backdrop-blur-[2px]"
              }
            >
              <div className="inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-white/80 text-enhanced">
                <MapPin className="w-4 h-4" /> {PERSON.location}
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-neutral-900 dark:text-white text-enhanced drop-shadow">
                {PERSON.name}
              </h1>

              <p className="text-xl md:text-2xl text-indigo-700 dark:text-indigo-200 text-enhanced">
                {PERSON.tagline}
              </p>

              <p className="text-neutral-800 dark:text-white/85 max-w-lg leading-relaxed text-enhanced">
                {PERSON.blurb}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg" className="btn-enhanced">
                  <Link to="/projects" className="flex items-center gap-2">
                    See projects <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="btn-enhanced"
                >
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
            <div className="md:justify-self-center">
              <div className="glass-strong glow-ring rounded-2xl relative size-48 md:size-64 overflow-hidden ring-1 dark:ring-white/10 ring-black/10 mx-auto">
                <img
                  src={seanImg}
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
                      <stop
                        offset="0%"
                        className="dark:stop-color-indigo-400/25 stop-color-cyan-300/40"
                      />
                      <stop
                        offset="100%"
                        className="dark:stop-color-cyan-300/15 stop-color-indigo-400/30"
                      />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-indigo-400/15 dark:to-cyan-300/10 bg-gradient-to-br from-cyan-300/30 to-indigo-400/20" />
                <span className="sr-only">Water-glass aesthetic portrait</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN sections with uniform spacing */}
      <main className={container}>
        <Section
          id="about"
          title="About"
          subtitle="Cybersecurity-focused tech problem solver who translates chaos into stable systems."
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="font-semibold mb-3 text-enhanced">
                What I'm into
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-neutral-800 dark:text-white/85 text-enhanced">
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
            <Card className="p-5">
              <h3 className="font-semibold mb-3 text-enhanced">
                Current focus
              </h3>
              <div className="text-sm text-neutral-800 dark:text-white/85 space-y-1.5 text-enhanced">
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

        <Section id="stats" title="At a glance">
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="p-5 text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 text-enhanced">
                3+
              </div>
              <div className="text-sm text-neutral-700 dark:text-white/80 text-enhanced">
                Years in tech
              </div>
            </Card>
            <Card className="p-5 text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 text-enhanced">
                16+
              </div>
              <div className="text-sm text-neutral-700 dark:text-white/80 text-enhanced">
                Years in customer service roles
              </div>
            </Card>
            <Card className="p-5 text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 text-enhanced">
                4.75
              </div>
              <div className="text-sm text-neutral-700 dark:text-white/80 text-enhanced">
                GPA in current Business IT & Cyber Security program
              </div>
            </Card>
            <Card className="p-5 text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 text-enhanced">
                13k+
              </div>
              <div className="text-sm text-neutral-700 dark:text-white/80 text-enhanced">
                Event attendees managed
              </div>
            </Card>
            <Card className="p-5 text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 text-enhanced">
                4.75
              </div>
              <div className="text-sm text-neutral-700 dark:text-white/80 text-enhanced">
                GPA in current Business IT & Cyber Security program
              </div>
            </Card>
          </div>
        </Section>

        <Section id="explore" title="Explore">
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-5 flex items-center justify-between group hover:bg-white/80 dark:hover:bg-white/15 transition-colors">
              <div>
                <h3 className="font-semibold text-lg text-enhanced">
                  Projects
                </h3>
                <p className="text-sm text-neutral-700 dark:text-white/80 text-enhanced">
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
            <Card className="p-5 flex items-center justify-between group hover:bg-white/80 dark:hover:bg-white/15 transition-colors">
              <div>
                <h3 className="font-semibold text-lg text-enhanced">
                  Photography
                </h3>
                <p className="text-sm text-neutral-700 dark:text-white/80 text-enhanced">
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
