import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Inline data so the canvas runs standalone
const LINK_MAP = {
  triangle: {
    title: "NFTs",
    items: [{ label: "Mirror.xyz", href: "https://mirror.xyz/ethpapers.eth" }],
  },
  square: {
    title: "Books",
    items: [
      { label: "IngramSpark", href: "https://ingram.ethpapers.xyz" },
      { label: "Amazon", href: "https://amazon.ethpapers.xyz" },
      { label: "Indie California", href: "https://library.ethpapers.xyz" },
    ],
  },
  circle: {
    title: "GPTs",
    items: [
      {
        label: "EthereumGPT",
        href: "https://chatgpt.com/g/g-k4yMyMJW0-ethereumgpt?model=gpt-5",
      },
    ],
  },
  cross: {
    title: "Author",
    items: [{ label: "Ki Chong Tran", href: "https://kichong.xyz" }],
  },
};

// Dirty gold palette: darker, minimal glow
const GOLD_HEX = "#D4AF37";
const GOLD_MUTED = "rgba(212,175,55,0.55)";
const GLOW = "rgba(212,175,55,0.25)";

const DEFAULT_TITLES = {
  triangle: "NFTs",
  square: "Books",
  circle: "GPTs",
  cross: "Author",
};

// ---------- Error Boundary ----------
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("UI crash:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-black text-yellow-200 p-6 font-mono">
          <h2 className="text-lg mb-2">Something went wrong.</h2>
          <pre className="text-xs whitespace-pre-wrap opacity-80">
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <button
            className="mt-4 underline"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------- Utilities ----------
function useIsMobile() {
  const [m, setM] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setM(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);
  return m;
}

// Pure helper to make LINK_MAP testable
export function getGroupFrom(map, key) {
  const data = map[key];
  if (Array.isArray(data)) {
    return { title: DEFAULT_TITLES[key], items: data };
  }
  if (data && Array.isArray(data.items)) {
    return { title: data.title || DEFAULT_TITLES[key], items: data.items };
  }
  console.warn(
    `[LINK_MAP] ${key} has invalid shape; expected array or {title, items:[...]}.`,
    data
  );
  return { title: (data && data.title) || DEFAULT_TITLES[key], items: [] };
}

function getGroup(key) {
  return getGroupFrom(LINK_MAP, key);
}

const Panel = ({ items, mobile, title }) => {
  const safeItems = Array.isArray(items) ? items : [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={
        "pointer-events-auto rounded-xl bg-black/95 p-4 backdrop-blur-md border border-yellow-900/40 shadow-[0_0_6px_rgba(212,175,55,0.1)] " +
        (mobile
          ? "w-[min(26rem,calc(100vw-2rem))]"
          : "w-[min(18rem,calc(100vw-3rem))]")
      }
      role="menu"
    >
      {title && (
        <div className="mb-2 text-yellow-500/80 text-xs tracking-widest uppercase">
          {title}
        </div>
      )}
      <ul className="space-y-2">
        {safeItems.map((it) => {
          const external = /^https?:\/\//.test(it?.href || "");
          return (
            <li key={it?.label}>
              <a
                href={it?.href || "#"}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="block rounded border border-yellow-900/30 bg-yellow-900/10 px-3 py-2 text-yellow-200/80 hover:bg-yellow-900/20 hover:text-yellow-100 transition"
              >
                {it?.label || "(untitled)"}
              </a>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
};

const Glow = ({ className }) => (
  <div
    className={`absolute inset-0 blur-[1px] opacity-25 ${className || ""}`}
    style={{ boxShadow: `0 0 10px 2px ${GLOW}, inset 0 0 6px ${GLOW}` }}
  />
);

function ShapeTriangle() {
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon points="50,10 90,80 10,80" fill="none" strokeWidth="3" stroke={GOLD_HEX} />
      </svg>
      <Glow />
    </div>
  );
}

function ShapeSquare() {
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="10" y="10" width="80" height="80" fill="none" strokeWidth="3" stroke={GOLD_HEX} />
      </svg>
      <Glow />
    </div>
  );
}

function ShapeCircle() {
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="40" fill="none" strokeWidth="3" stroke={GOLD_HEX} />
      </svg>
      <Glow />
    </div>
  );
}

function ShapeCross() {
  return (
    <div className="relative w-44 h-44 md:w-52 md:h-52">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path
          d="M20 38 L38 20 L50 32 L62 20 L80 38 L68 50 L80 62 L62 80 L50 68 L38 80 L20 62 L32 50 Z"
          fill="none"
          strokeWidth="3"
          stroke={GOLD_HEX}
        />
      </svg>
      <Glow />
    </div>
  );
}

const ControllerNode = ({ shape, items, anchor, title }) => {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const ShapeComp = {
    triangle: ShapeTriangle,
    square: ShapeSquare,
    circle: ShapeCircle,
    cross: ShapeCross,
  }[shape];

  const panelPos = {
    top: "top-[calc(100%+16px)] left-1/2 -translate-x-1/2",
    right: "right-[calc(100%+16px)] top-1/2 -translate-y-1/2",
    left: "left-[calc(100%+16px)] top-1/2 -translate-y-1/2",
    bottom: "bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2",
  }[anchor];

  const mobilePos = "fixed left-1/2 -translate-x-1/2 bottom-20 z-50";

  const openOn = {
    onMouseEnter: () => !isMobile && setOpen(true),
    onMouseLeave: () => !isMobile && setOpen(false),
    onClick: () => isMobile && setOpen((v) => !v),
  };

  return (
    <div className="group relative flex flex-col items-center justify-center" {...openOn}>
      <motion.div
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer select-none"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <ShapeComp />
      </motion.div>

      <AnimatePresence>
        {open && (
          <div className={(isMobile ? mobilePos : `absolute ${panelPos}`) + " pointer-events-none"}>
            <Panel items={items} mobile={isMobile} title={title} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const TRI = getGroup("triangle");
  const SQU = getGroup("square");
  const CIR = getGroup("circle");
  const CRO = getGroup("cross");

  return (
    <ErrorBoundary>
      <main className="relative min-h-screen text-yellow-200 bg-black overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <DistressedBackdrop />
        </div>

        <header className="relative z-10 flex items-center justify-between px-4 md:px-6 pt-6">
          <h1 className="font-mono tracking-wider text-xs md:text-sm text-yellow-600/70">
            ETHPAPERS.XYZ
          </h1>
          <div className="text-[10px] font-mono text-yellow-600/60">v0.1</div>
        </header>

        <section className="relative z-10 grid place-items-center pt-6 md:pt-10">
          <div className="relative w-full max-w-[900px] aspect-[1.1] md:aspect-[1.4] mx-auto">
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
              <div />
              <div className="flex items-center justify-center">
                <ControllerNode shape="triangle" items={TRI.items} anchor="top" title={TRI.title} />
              </div>
              <div />
              <div className="flex items-center justify-center">
                <ControllerNode shape="square" items={SQU.items} anchor="left" title={SQU.title} />
              </div>
              <div />
              <div className="flex items-center justify-center">
                <ControllerNode shape="circle" items={CIR.items} anchor="right" title={CIR.title} />
              </div>
              <div />
              <div className="flex items-center justify-center">
                <ControllerNode shape="cross" items={CRO.items} anchor="bottom" title={CRO.title} />
              </div>
              <div />
            </div>
          </div>
        </section>
      </main>
    </ErrorBoundary>
  );
}

// ---------- Backgrounds ----------
const DistressedBackdrop = () => (
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: [
        "radial-gradient(circle at center, rgba(0,0,0,0.6), rgba(0,0,0,0.98))",
        "repeating-conic-gradient(from 0deg, rgba(212,175,55,0.02) 0 12deg, transparent 12deg 24deg)",
        "radial-gradient(circle at 25% 35%, rgba(212,175,55,0.04), transparent 45%)",
        "radial-gradient(circle at 70% 75%, rgba(212,175,55,0.03), transparent 50%)",
      ].join(", "),
      backgroundBlendMode: "overlay, multiply, normal, normal",
      filter: "contrast(110%) brightness(85%)",
    }}
  >
    <GrainOverlay />
  </div>
);

const GrainOverlay = () => (
  <div className="absolute inset-0 mix-blend-overlay pointer-events-none opacity-50">
    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="table" tableValues="0 0.5" />
        </feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

// ---------- Lightweight tests ----------
function runTests() {
  try {
    const tMap = {
      triangle: [{ label: "A", href: "#" }],
      circle: { title: "C", items: [{ label: "B", href: "http://x" }] },
      bad: { title: "Bad", items: null },
      empty: {},
    };

    const a = getGroupFrom(tMap, "triangle");
    console.assert(a.title === DEFAULT_TITLES.triangle, "array form uses default title");
    console.assert(Array.isArray(a.items) && a.items.length === 1, "array form items ok");

    const c = getGroupFrom(tMap, "circle");
    console.assert(c.title === "C", "object form keeps title");
    console.assert(/https?:/.test(c.items[0].href), "external link stays intact");

    const b = getGroupFrom(tMap, "bad");
    console.assert(Array.isArray(b.items) && b.items.length === 0, "invalid items become empty array");

    const m = getGroupFrom(tMap, "missing");
    console.assert(Array.isArray(m.items) && m.items.length === 0, "missing key returns empty items");

    const e = getGroupFrom(tMap, "empty");
    console.assert(Array.isArray(e.items) && e.items.length === 0, "empty object yields empty items");

    console.log("UI tests passed.");
  } catch (e) {
    console.error("UI tests failed:", e);
  }
}

if (typeof window !== "undefined") runTests();
