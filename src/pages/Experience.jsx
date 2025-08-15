// src/pages/Experience.jsx
import React from "react";
import { Calendar, MapPin, TrendingUp } from "lucide-react";

/* -------------------- helpers & layout -------------------- */
const cx = (...c) => c.filter(Boolean).join(" ");
const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const section = "py-16 md:py-20";

/* -------------------- UI primitives (readability tuned) -------------------- */
const Card = ({ className = "", children }) => (
  <div
    className={cx(
      "rounded-2xl border shadow-lg backdrop-blur-xl transition-colors",
      // Light
      "border-neutral-200/70 bg-white/80 text-neutral-900",
      // Dark — more opaque so text stays readable over aurora
      "dark:border-white/15 dark:bg-[rgba(10,15,30,0.72)] dark:text-white",
      className
    )}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={cx("p-6 pb-4 md:p-7 md:pb-4", className)}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={cx("px-6 pb-6 md:px-7 md:pb-7", className)}>{children}</div>
);

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

const CardDescription = ({ children, className = "" }) => (
  <p
    className={cx(
      "text-sm md:text-[0.95rem] leading-relaxed",
      "text-neutral-700 dark:text-white/85",
      className
    )}
  >
    {children}
  </p>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-200 border border-indigo-200/70 dark:border-indigo-400/20",
    success:
      "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-200 border border-green-200/70 dark:border-green-400/20",
    warning:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-200 border border-yellow-200/70 dark:border-yellow-400/20",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur",
        variants[variant],
        className
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
          <p className="mt-2 text-neutral-700 dark:text-white/80 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

/* -------------------- data -------------------- */
const EXPERIENCE = [
  {
    org: "Hublet Oy",
    role: "Hublet Security Expert – Trainee",
    time: "Mar 2025 – Aug 2025",
    location: "Helsinki, Finland",
    type: "Cybersecurity",
    description:
      "Security trainee focused on vulnerability assessment, secure update testing, documentation, and security enablement across teams and customers.",
    bullets: [
      "Conducted vulnerability assessments of the Hublet Solution; identified risks and recommended mitigation strategies.",
      "Tested software updates for reliability and stability to support a secure release process.",
      "Created, updated, and maintained internal and customer-facing security documentation (Help Center, FAQs).",
      "Contributed to security awareness materials for customer onboarding and internal staff training.",
      "Improved tender documentation and IT/customer support resources with security inputs.",
      "Collaborated with supervisors and cross‑functional teams to address issues and enhance overall security posture.",
      "Applied theoretical cybersecurity knowledge to practical tasks with strong attention to detail and problem-solving.",
    ],
    skills: [
      "Vulnerability Assessment",
      "Application Security",
      "Secure SDLC",
      "Risk Analysis",
      "Technical Writing",
      "Security Awareness",
      "Cross‑functional Collaboration",
    ],
    achievements: [
      { metric: "Assessments", label: "Security posture reviews completed" },
      { metric: "Docs", label: "Security guides & FAQs maintained" },
      { metric: "Releases", label: "Updates validated for stability" },
    ],
  },
  {
    org: "Slush",
    role: "Customer Success Team (Offline) Group Lead",
    time: "Sep 2023 – Dec 2023",
    location: "Helsinki, Finland",
    type: "Event Management",
    description:
      "Led customer success operations for Europe's leading startup event with 13,000+ attendees.",
    bullets: [
      "Led and supervised a team of 10+ volunteers, providing training, guidance, and performance oversight to ensure smooth event operations for a large-scale international audience.",
      "Streamlined and automated workflow processes, improving response times and overall team efficiency.",
      "Developed and implemented a volunteer onboarding and training program, enhancing role readiness and operational consistency.",
      "Coordinated and managed event logistics, ensuring the timely completion of scheduled activities.",
      "Facilitated cross-team communication and task coordination, enabling efficient collaboration between volunteers, staff, and event stakeholders.",
    ],
    skills: [
      "Team Leadership",
      "Process Automation",
      "Event Logistics",
      "IT Support",
    ],
    achievements: [
      { metric: "13,000+", label: "Attendees supported" },
      { metric: "35%", label: "Response time improvement" },
      { metric: "98%", label: "On-time completion rate" },
    ],
  },
  {
    org: "McDonald's",
    role: "Food Service Worker",
    time: "Nov 2022 – May 2023",
    location: "Oulu, Finland",
    type: "Operations",
    description:
      "High-volume food service operations with focus on efficiency and quality control.",
    bullets: [
      "Prepared 150+ meals/shift; reduced waste by ~15% via inventory & portion control.",
      "Ensured 100% hygiene compliance; maintained equipment to reduce downtime by ~25%.",
    ],
    skills: [
      "Operations",
      "Quality Control",
      "Inventory Management",
      "Process Optimization",
    ],
    achievements: [
      { metric: "150+", label: "Meals per shift" },
      { metric: "15%", label: "Waste reduction" },
      { metric: "100%", label: "Hygiene compliance" },
    ],
  },
  {
    org: "Flexasoft",
    role: "Video Game Tester",
    time: "Jul 2016 – May 2017",
    location: "Redmond, USA",
    type: "Quality Assurance",
    description:
      "Quality assurance testing for video game development with focus on bug identification and documentation.",
    bullets: [
      "Executed multiple structured test cases daily to identify and document gameplay bugs, UI/UX issues, and performance defects.",
      "Logged and tracked software bugs in a defect management system, improving debugging speed and resolution accuracy.",
      "Verified bug fixes to ensure correct implementation and functionality in game updates.",
      "Followed detailed test scripts to assess game stability, performance, and compliance with QA standards.",
      "Provided actionable feedback on gameplay mechanics, contributing to improved user experience prior to final release.",
    ],
    skills: [
      "Quality Assurance",
      "Bug Testing",
      "Documentation",
      "Team Collaboration",
    ],
    achievements: [
      { metric: "30+", label: "Test cases per day" },
      { metric: "50+", label: "Bugs documented" },
      { metric: "5", label: "Team members" },
    ],
  },
];

/* -------------------- card -------------------- */
function ExperienceCard({ experience }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="mb-1">{experience.role}</CardTitle>
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-medium mb-2">
              <span className="truncate">{experience.org}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600 dark:text-white/75">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>{experience.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>{experience.location}</span>
              </div>
            </div>
          </div>
          <Badge>{experience.type}</Badge>
        </div>

        <CardDescription>{experience.description}</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Achievements — DARKER chips in dark mode */}
        <div
          className={cx(
            "grid grid-cols-3 gap-3 md:gap-4 mb-6 p-4 rounded-xl border",
            // light: soft, readable on white
            "border-white/40 bg-white/70 text-neutral-900",
            // dark: strong contrast on aurora
            "dark:border-white/10 dark:bg-[rgba(255,255,255,0.06)] dark:text-white"
          )}
        >
          {experience.achievements.map((a) => (
            <div key={a.label} className="text-center">
              <div className="text-lg md:text-xl font-bold text-indigo-800 dark:text-indigo-300">
                {a.metric}
              </div>
              <div className="text-[11px] md:text-xs opacity-80">{a.label}</div>
            </div>
          ))}
        </div>

        {/* Responsibilities */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-sm text-neutral-800 dark:text-white/90">
            Key Responsibilities & Impact
          </h4>
          <ul className="space-y-2.5">
            {experience.bullets.map((bullet, i) => (
              <li
                key={`${experience.org}-b-${i}`}
                className="flex items-start gap-2 text-[0.95rem] leading-relaxed"
              >
                <TrendingUp
                  className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-neutral-800 dark:text-white/90">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills */}
        <div>
          <h4 className="font-medium mb-2 text-sm text-neutral-800 dark:text-white/90">
            Skills Applied
          </h4>
          <div className="flex flex-wrap gap-2">
            {experience.skills.map((skill) => (
              <Badge key={`${experience.org}-s-${skill}`}>{skill}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------- page -------------------- */
export default function Experience() {
  return (
    <main className={container}>
      <Section
        title="Experience"
        subtitle="Professional journey with measurable impact and continuous growth."
      >
        {/* Timeline */}
        <div className="space-y-8">
          {EXPERIENCE.map((exp, idx) => (
            <div key={exp.org} className="relative">
              {/* vertical line */}
              {idx < EXPERIENCE.length - 1 && (
                <div
                  className="absolute left-6 top-16 w-px h-full opacity-40"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(99,102,241,0.45), transparent)",
                  }}
                  aria-hidden="true"
                />
              )}

              {/* dot */}
              <div className="absolute left-4 top-8 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-[#0b1022] shadow-lg" />

              {/* card */}
              <div className="ml-12">
                <ExperienceCard experience={exp} />
              </div>
            </div>
          ))}
        </div>

        {/* Summary cards */}
        <div className="mt-14 grid sm:grid-cols-3 gap-4 md:gap-6">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-800 dark:text-indigo-300 mb-1">
              16+
            </div>
            <div className="text-sm text-neutral-700 dark:text-white/85">
              Career milestones
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-800 dark:text-indigo-300 mb-1">
              13k+
            </div>
            <div className="text-sm text-neutral-700 dark:text-white/85">
              People impacted
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-800 dark:text-indigo-300 mb-1">
              2
            </div>
            <div className="text-sm text-neutral-700 dark:text-white/85">
              Countries worked in
            </div>
          </Card>
        </div>
      </Section>
    </main>
  );
}
