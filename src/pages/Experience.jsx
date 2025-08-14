import React from "react";
import { Calendar, MapPin, Users, TrendingUp } from "lucide-react";

/** Helpers + UI */
const cx = (...c) => c.filter(Boolean).join(" ");
const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const section = "py-20";

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
  <div className={cx("p-6 pb-4", className)}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={cx("px-6 pb-6", className)}>{children}</div>
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

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    success:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    warning:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
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

/** Enhanced experience data with more context */
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
      "Led and supervised a team of 10+ volunteers, providing training, guidance, and performance oversight to ensure smooth event operationsfor a large-scale international audience.",
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
      { metric: "13,000+", label: "Attendees managed" },
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
      "Logged and tracked software bugs in a defect management system, improving debugging speed and resolution accuracy.•",
      "Verified bug fixes to ensure correct implementation and functionality in game updates",
      "Followed detailed test scripts to assess game stability, performance, and compliance with quality assurance standards.",
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

function ExperienceCard({ experience, index }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{experience.role}</CardTitle>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium mb-2">
              <span>{experience.org}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-white/60">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {experience.time}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {experience.location}
              </div>
            </div>
          </div>
          <Badge>{experience.type}</Badge>
        </div>

        <p className="text-sm text-neutral-600 dark:text-white/70 leading-relaxed">
          {experience.description}
        </p>
      </CardHeader>

      <CardContent>
        {/* Key achievements */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-xl bg-white/50 dark:bg-white/5">
          {experience.achievements.map((achievement, i) => (
            <div key={i} className="text-center">
              <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {achievement.metric}
              </div>
              <div className="text-xs text-neutral-600 dark:text-white/60">
                {achievement.label}
              </div>
            </div>
          ))}
        </div>

        {/* Responsibilities */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-sm text-neutral-700 dark:text-white/80">
            Key Responsibilities & Impact
          </h4>
          <ul className="space-y-2">
            {experience.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-700 dark:text-white/80">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills */}
        <div>
          <h4 className="font-medium mb-2 text-sm text-neutral-700 dark:text-white/80">
            Skills Applied
          </h4>
          <div className="flex flex-wrap gap-2">
            {experience.skills.map((skill) => (
              <Badge key={skill} variant="default">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Experience() {
  return (
    <main className={container}>
      <Section
        title="Experience"
        subtitle="Professional journey with measurable impact and continuous growth."
      >
        {/* Timeline view */}
        <div className="space-y-8">
          {EXPERIENCE.map((exp, idx) => (
            <div key={exp.org} className="relative">
              {/* Timeline line */}
              {idx < EXPERIENCE.length - 1 && (
                <div className="absolute left-6 top-16 w-px h-full bg-gradient-to-b from-indigo-300 to-transparent dark:from-indigo-600 opacity-30" />
              )}

              {/* Timeline dot */}
              <div className="absolute left-4 top-8 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-gray-900 shadow-lg z-10" />

              {/* Content */}
              <div className="ml-12">
                <ExperienceCard experience={exp} index={idx} />
              </div>
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="mt-16 grid sm:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              16+
            </div>
            <div className="text-sm text-neutral-600 dark:text-white/70">
              Years of experience
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              13k+
            </div>
            <div className="text-sm text-neutral-600 dark:text-white/70">
              People impacted
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              2
            </div>
            <div className="text-sm text-neutral-600 dark:text-white/70">
              Countries worked in
            </div>
          </Card>
        </div>
      </Section>
    </main>
  );
}
