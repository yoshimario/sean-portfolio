import React, { useState, useMemo } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/* Tiny helpers + UI */
const cx = (...c) => c.filter(Boolean).join(" ");
const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const section = "py-20";

const Card = ({ className = "", children, ...props }) => (
  <div
    {...props}
    className={cx(
      "rounded-2xl border backdrop-blur-xl shadow-lg overflow-hidden group cursor-pointer",
      "border-neutral-200/60 bg-white/70 text-neutral-900",
      "dark:border-white/15 dark:bg-white/10 dark:text-white",
      "transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
      className
    )}
  >
    {children}
  </div>
);

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

/* Lightbox (with fade) */
function Lightbox({ isOpen, photos, currentIndex, onClose, onNext, onPrev }) {
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, onNext, onPrev]);

  return (
    <AnimatePresence>
      {isOpen && photos[currentIndex] && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                onClick={onPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={onNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <motion.img
            key={photos[currentIndex]}
            src={photos[currentIndex]}
            alt={`Photo ${currentIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          />

          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm">
              {currentIndex + 1} / {photos.length}
            </div>
          )}

          <div className="absolute inset-0 -z-10" onClick={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ----- Load categories from folders (Vite glob) ----- */
const naturePhotos = Object.values(
  import.meta.glob(
    "../assets/img/photography/nature/*.{jpg,jpeg,png,webp,avif}",
    { eager: true, query: "?url", import: "default" }
  )
);
const urbanPhotos = Object.values(
  import.meta.glob(
    "../assets/img/photography/urban/*.{jpg,jpeg,png,webp,avif}",
    { eager: true, query: "?url", import: "default" }
  )
);
const lifePhotos = Object.values(
  import.meta.glob(
    "../assets/img/photography/life/*.{jpg,jpeg,png,webp,avif}",
    { eager: true, query: "?url", import: "default" }
  )
);

export default function Photography() {
  const categories = useMemo(
    () => ({
      All: [...naturePhotos, ...urbanPhotos, ...lifePhotos],
      Nature: naturePhotos,
      Urban: urbanPhotos,
      Life: lifePhotos,
    }),
    []
  );

  const [currentCategory, setCurrentCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const photos = categories[currentCategory] || [];

  const openLightbox = (index) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  /* animation presets */
  const list = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.03 },
    },
    exit: { opacity: 0 },
  };
  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
  };

  return (
    <main className={container}>
      <Section
        title="Photography"
        subtitle="Water, Urban, and Climbing shots — with a touch of glass."
      >
        {/* Category pills */}
        <div className="mb-8 flex justify-center">
          <div className="flex gap-2 p-1 rounded-2xl bg-white/50 dark:bg-white/10 backdrop-blur">
            {Object.keys(categories).map((cat) => (
              <button
                key={cat}
                onClick={() => setCurrentCategory(cat)}
                className={cx(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  currentCategory === cat
                    ? "bg-indigo-600/90 text-white"
                    : "text-neutral-600 dark:text-white/70 hover:bg-white/50 dark:hover:bg-white/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Animated grid */}
        <AnimatePresence mode="popLayout">
          {photos.length === 0 ? (
            <motion.p
              key="empty"
              className="text-center text-neutral-500 dark:text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No photos in this category.
            </motion.p>
          ) : (
            <motion.div
              key={currentCategory}
              variants={list}
              initial="hidden"
              animate="show"
              exit="exit"
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {photos.map((src, i) => (
                <motion.div key={src + i} variants={item} layout>
                  <Card onClick={() => openLightbox(i)}>
                    <div className="relative aspect-[4/3]">
                      <img
                        src={src}
                        alt={`Photo ${i + 1}`}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      <Lightbox
        isOpen={lightboxOpen}
        photos={photos}
        currentIndex={currentPhotoIndex}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setCurrentPhotoIndex((i) => (i + 1) % photos.length)}
        onPrev={() =>
          setCurrentPhotoIndex((i) => (i - 1 + photos.length) % photos.length)
        }
      />
    </main>
  );
}
