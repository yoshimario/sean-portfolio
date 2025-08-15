// src/pages/Education.jsx
import React from "react";
import {
  Calendar,
  MapPin,
  Award,
  BookOpen,
  Star,
  TrendingUp,
} from "lucide-react";

/* -------------------- helpers & layout -------------------- */
const cx = (...c) => c.filter(Boolean).join(" ");
const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const section = "py-16 md:py-20";

/* -------------------- UI primitives (match Experience.jsx) -------------------- */
const Card = ({ className = "", children }) => (
  <div
    className={cx(
      "rounded-2xl border shadow-lg backdrop-blur-xl transition-colors",
      // Light
      "border-neutral-200/70 bg-white/85 text-neutral-900",
      // Dark (more opaque for legibility over aurora)
      "dark:border-white/15 dark:bg-[rgba(10,15,30,0.78)] dark:text-white",
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
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-200 border border-indigo-200/70 dark:border-indigo-400/25",
    success:
      "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-200 border border-green-200/70 dark:border-green-400/25",
    warning:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-200 border border-yellow-200/70 dark:border-yellow-400/25",
    honor:
      "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-200 border border-purple-200/70 dark:border-purple-400/25",
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
          <p className="mt-2 text-neutral-700 dark:text-white/85 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

/* -------------------- data (unchanged content) -------------------- */
const EDUCATION = [
  {
    school: "Laurea University of Applied Sciences",
    degree: "BBA Business Information Technology",
    specialization: "Cyber Security",
    time: "Aug 2023 – present",
    location: "Espoo, Finland",
    status: "In Progress",
    gpa: null,
    description:
      "Comprehensive program combining business acumen with technical cybersecurity skills, preparing for leadership roles in IT security.",
    highlights: [
      "Network security and vulnerability assessment",
      "Risk management and compliance frameworks",
      "Business continuity and incident response",
      "Cloud security architectures",
    ],
    skills: [
      "Network Security",
      "Risk Assessment",
      "Compliance",
      "Business Analysis",
    ],
    logoPlaceholder: "🏛️",
  },
  {
    school: "Tacoma Community College",
    degree: "AS Cybersecurity and Networking",
    specialization: null,
    time: "2018 – 2020",
    location: "Tacoma, USA",
    status: "Completed",
    gpa: "4.0 GPA",
    honors: "PTK Honors",
    description:
      "Intensive technical program focused on network administration, cybersecurity fundamentals, and hands-on lab experience.",
    highlights: [
      "Network configuration and troubleshooting",
      "Security protocols and encryption",
      "System administration (Windows/Linux)",
      "Ethical hacking and penetration testing",
    ],
    skills: [
      "Network Administration",
      "System Security",
      "Penetration Testing",
      "Linux/Windows",
    ],
    logoPlaceholder: "🎓",
  },
  {
    school: "DePaul University",
    degree: "BA Digital Cinema",
    specialization: "Minor Game Production",
    time: "2010 – 2017",
    location: "Chicago, USA",
    status: "Completed",
    gpa: null,
    description:
      "Creative and technical program combining storytelling, visual production, and interactive media development.",
    highlights: [
      "Digital media production and post-production",
      "Interactive storytelling and game design",
      "Project management for creative teams",
      "Technical problem-solving in production environments",
    ],
    skills: [
      "Creative Problem Solving",
      "Project Management",
      "Technical Production",
      "Team Collaboration",
    ],
    logoPlaceholder: "🎬",
  },
];

/* -------------------- card -------------------- */
function EducationCard({ education }) {
  const isCurrentlyEnrolled = education.status === "In Progress";

  return (
    <Card className="group hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-start gap-4 mb-3">
          {/* Logo placeholder */}
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-2xl flex-shrink-0">
            {education.logoPlaceholder}
          </div>

          <div className="flex-1 min-w-0">
            <CardTitle className="mb-1">{education.school}</CardTitle>

            <div className="text-indigo-600 dark:text-indigo-300 font-medium mb-2">
              {education.degree}
              {education.specialization && (
                <span className="text-neutral-700 dark:text-white/85 font-normal">
                  {" • "}
                  {education.specialization}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600 dark:text-white/80">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>{education.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>{education.location}</span>
              </div>
            </div>

            {/* Status badges */}
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <Badge variant={isCurrentlyEnrolled ? "warning" : "success"}>
                {education.status}
              </Badge>
              {education.gpa && (
                <Badge variant="success">
                  <Star className="w-3 h-3 mr-1" />
                  {education.gpa}
                </Badge>
              )}
              {education.honors && (
                <Badge variant="honor">
                  <Award className="w-3 h-3 mr-1" />
                  {education.honors}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <CardDescription>{education.description}</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Key Learning Areas */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-sm text-neutral-800 dark:text-white/90 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Key Learning Areas
          </h4>
          <ul className="space-y-2.5">
            {education.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-2 text-[0.95rem] leading-relaxed"
              >
                <TrendingUp
                  className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-neutral-800 dark:text-white/90">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills */}
        <div>
          <h4 className="font-medium mb-2 text-sm text-neutral-800 dark:text-white/90">
            Skills Developed
          </h4>
          <div className="flex flex-wrap gap-2">
            {education.skills.map((skill) => (
              <Badge key={`${education.school}-s-${skill}`}>{skill}</Badge>
            ))}
          </div>
        </div>

        {/* Progress for current studies */}
        {isCurrentlyEnrolled && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-neutral-700 dark:text-white/85">
                Progress
              </span>
              <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                ~60%
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700/70 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-700"
                style={{ width: "60%" }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* -------------------- page -------------------- */
export default function Education() {
  const completedDegrees = EDUCATION.filter(
    (ed) => ed.status === "Completed"
  ).length;
  const currentlyEnrolled = EDUCATION.filter(
    (ed) => ed.status === "In Progress"
  ).length;

  return (
    <main className={container}>
      <Section
        title="Education"
        subtitle="Academic foundation building technical expertise and analytical thinking."
      >
        {/* Timeline (matches Experience.jsx alignment) */}
        <div className="space-y-8 mb-16">
          {EDUCATION.map((ed, idx) => (
            <div key={ed.school} className="relative">
              {/* vertical line aligned to header baseline */}
              {idx < EDUCATION.length - 1 && (
                <div
                  className="absolute left-6 top-16 w-px h-[calc(100%-2rem)] opacity-40"
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
                <EducationCard education={ed} />
              </div>
            </div>
          ))}
        </div>

        {/* Summary cards (match Experience.jsx styling) */}
        <div className="grid sm:grid-cols-4 gap-4 md:gap-6">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-1">
              {completedDegrees + currentlyEnrolled}
            </div>
            <div className="text-sm text-neutral-700 dark:text-white/85">
              Degrees pursued
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-1">
              4.0
            </div>
            <div className="text-sm text-neutral-700 dark:text-white/85">
              GPA achieved
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-1">
              {currentlyEnrolled}
            </div>
            <div className="text-sm text-neutral-700 dark:text-white/85">
              Currently enrolled
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-1">
              2
            </div>
            <div className="text-sm text-neutral-700 dark:text-white/85">
              Countries studied
            </div>
          </Card>
        </div>
      </Section>
    </main>
  );
}
