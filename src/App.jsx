// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Sun, Moon, ExternalLink } from "lucide-react";
import AuroraBackgroundR3F from "./components/AuroraBackgroundR3F";

// Pages
import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import Photography from "./pages/Photography.jsx";
import Experience from "./pages/Experience.jsx";
import Education from "./pages/Education.jsx";
import Writing from "./pages/Writing.jsx";
import Contact from "./pages/Contact.jsx";

/* ---------------- helpers ---------------- */
const cx = (...c) => c.filter(Boolean).join(" ");
const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

/* ---------------- tiny error boundary ---------------- */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }
  static getDerivedStateFromError(err) {
    return { err };
  }
  componentDidCatch(err, info) {
    console.error("App crashed:", err, info);
  }
  render() {
    if (this.state.err) {
      return (
        <div className="p-6 text-red-600 dark:text-red-300">
          <h1 className="text-xl font-semibold">Something went wrong.</h1>
          <pre className="mt-4 whitespace-pre-wrap">
            {String(this.state.err?.message || this.state.err)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ---------------- UI: Button ---------------- */
function Button({
  asChild = false,
  variant = "default",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-2xl font-medium transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400";
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
    icon: "h-10 w-10 p-0",
  };
  const Comp = asChild ? "a" : "button";
  return (
    <Comp
      className={cx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

/* ---------------- shared TopNav ---------------- */
function TopNav({ dark, setDark }) {
  const links = [
    { to: "/", label: "Home" },
    { to: "/projects", label: "Projects" },
    { to: "/photography", label: "Photography" },
    { to: "/experience", label: "Experience" },
    { to: "/education", label: "Education" },
    { to: "/writing", label: "Writing" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <div
      className={cx(
        "sticky top-0 z-50 border-b backdrop-blur-xl",
        dark
          ? "border-white/10 bg-[#0b1220]/40 text-white"
          : "border-black/10 bg-white/50 text-neutral-900"
      )}
    >
      <div className={cx(container, "flex h-16 items-center justify-between")}>
        <Link to="/" className="font-semibold tracking-tight">
          seankipina
          <span className={dark ? "text-indigo-300" : "text-indigo-600"}>
            .com
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className={cx(
                "text-sm transition",
                dark
                  ? "text-white/80 hover:text-white"
                  : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              {l.label}
            </Link>
          ))}

          <Button asChild size="sm" variant={dark ? "outline" : "default"}>
            <a href="/Sean-KipinaCV.pdf" className="flex items-center gap-2">
              Resume <ExternalLink className="w-4 h-4" />
            </a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- shared Footer ---------------- */
function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div
        className={cx(
          container,
          "py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-neutral-600 dark:text-white/80"
        )}
      >
        <p className="text-sm">© {new Date().getFullYear()} Sean Kipinä</p>
        <div className="text-sm">Built with React + Tailwind</div>
      </div>
    </footer>
  );
}

/* ---------------- App ---------------- */
export default function App() {
  const [dark, setDark] = React.useState(true);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div
          className={cx(
            "min-h-screen relative",
            dark ? "text-white" : "text-neutral-900"
          )}
        >
          <React.Suspense fallback={null}>
            <AuroraBackgroundR3F
              theme={dark ? "dark" : "light"}
              intensity={1.35}
              speed={1.1}
              hueShift={0.3}
              scaleY={2}
              contrast={1.6}
              saturation={1.7}
            />
          </React.Suspense>

          <TopNav dark={dark} setDark={setDark} />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/photography" element={<Photography />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/education" element={<Education />} />
            <Route path="/writing" element={<Writing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
