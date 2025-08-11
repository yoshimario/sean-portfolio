import React from "react";
import {
  Calendar,
  MapPin,
  Award,
  BookOpen,
  Star,
  TrendingUp,
} from "lucide-react";

/** Helpers + UI */
const cx = (...c) => c.filter(Boolean).join(" ");
const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const section = "py-20";

const Card = ({ className = "", children }) => (
  <div
    className={cx(
      "rounded-2xl border backdrop-blur-xl shadow-lg h-full",
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
    honor:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
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

/** Enhanced education data */
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

function EducationCard({ education, index }) {
  const isCurrentlyEnrolled = education.status === "In Progress";

  return (
    <Card className="group hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-start gap-4 mb-4">
          {/* Logo placeholder */}
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-2xl flex-shrink-0">
            {education.logoPlaceholder}
          </div>

          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-1">{education.school}</CardTitle>
            <div className="text-indigo-600 dark:text-indigo-400 font-medium mb-1">
              {education.degree}
              {education.specialization && (
                <span className="text-neutral-600 dark:text-white/70 font-normal">
                  {" • "}
                  {education.specialization}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-white/60 mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {education.time}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {education.location}
              </div>
            </div>

            {/* Status badges */}
            <div className="flex items-center gap-2 flex-wrap">
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

        <p className="text-sm text-neutral-600 dark:text-white/70 leading-relaxed">
          {education.description}
        </p>
      </CardHeader>

      <CardContent>
        {/* Key learning areas */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-sm text-neutral-700 dark:text-white/80 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Key Learning Areas
          </h4>
          <ul className="space-y-2">
            {education.highlights.map((highlight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <TrendingUp className="w-3 h-3 text-indigo-500 mt-1 flex-shrink-0" />
                <span className="text-neutral-700 dark:text-white/80">
                  {highlight}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills developed */}
        <div>
          <h4 className="font-medium mb-2 text-sm text-neutral-700 dark:text-white/80">
            Skills Developed
          </h4>
          <div className="flex flex-wrap gap-2">
            {education.skills.map((skill) => (
              <Badge key={skill} variant="default">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Progress indicator for current studies */}
        {isCurrentlyEnrolled && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-neutral-600 dark:text-white/70">
                Progress
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                ~60%
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
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

export default function Education() {
  const completedDegrees = EDUCATION.filter(
    (ed) => ed.status === "Completed"
  ).length;
  const currentlyEnrolled = EDUCATION.filter(
    (ed) => ed.status === "In Progress"
  ).length;
  const totalYears = EDUCATION.reduce((acc, ed) => {
    // Simple calculation - in a real app you'd parse the dates properly
    return acc + (ed.status === "Completed" ? 3 : 2); // rough estimate
  }, 0);

  return (
    <main className={container}>
      <Section
        title="Education"
        subtitle="Academic foundation building technical expertise and analytical thinking."
      >
        {/* Education timeline */}
        <div className="space-y-8 mb-16">
          {EDUCATION.map((ed, idx) => (
            <div key={ed.school} className="relative">
              {/* Timeline line */}
              {idx < EDUCATION.length - 1 && (
                <div className="absolute left-6 top-20 w-px h-full bg-gradient-to-b from-indigo-300 to-transparent dark:from-indigo-600 opacity-30" />
              )}

              {/* Timeline dot */}
              <div
                className={cx(
                  "absolute left-4 top-12 w-4 h-4 rounded-full ring-4 ring-white dark:ring-gray-900 shadow-lg z-10",
                  ed.status === "In Progress"
                    ? "bg-yellow-500"
                    : "bg-indigo-500"
                )}
              />

              {/* Content */}
              <div className="ml-12">
                <EducationCard education={ed} index={idx} />
              </div>
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="grid sm:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              {completedDegrees + currentlyEnrolled}
            </div>
            <div className="text-sm text-neutral-600 dark:text-white/70">
              Degrees pursued
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              4.0
            </div>
            <div className="text-sm text-neutral-600 dark:text-white/70">
              GPA achieved
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              {currentlyEnrolled}
            </div>
            <div className="text-sm text-neutral-600 dark:text-white/70">
              Currently enrolled
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              3
            </div>
            <div className="text-sm text-neutral-600 dark:text-white/70">
              Countries studied
            </div>
          </Card>
        </div>
      </Section>
    </main>
  );
}
