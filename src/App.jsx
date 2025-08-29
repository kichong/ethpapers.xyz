import React from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import LINK_MAP from "./LINK_MAP"; // keep this separate

// Gold palette
const GOLD = "#f1c453";       // highlight
const GOLD_MID = "#e0b041";   // midtone
const GOLD_DEEP = "#8d6b1a";  // shadow

// Fallback titles if JSON omits them
const DEFAULT_TITLES = { triangle: "NFTs", square: "Books", circle: "GPTs", cross: "Author" };

class ErrorBoundary extends React.Component {
  constructor(p){ super(p); this.state = { error: null }; }
  static getDerivedStateFromError(error){ return { error }; }
  render(){
    if(this.state.error){
      return (
        <div className="min-h-screen bg-black text-amber-200 p-6 font-mono">
          <h2 className="text-lg mb-2">Error</h2>
          <pre className="text-xs whitespace-pre-wrap opacity-80">{String(this.state.error?.message || this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function useIsMobile(){
  const [m,setM]=React.useState(false);
  React.useEffect(()=>{
    const mq=window.matchMedia("(max-width:768px)");
    const sync=()=>setM(mq.matches);
    sync();
    mq.addEventListener?.("change",sync);
    return ()=>mq.removeEventListener?.("change",sync);
  },[]);
  return m;
}

// Accepts either Schema A: array, or Schema B: { title, items } or { title, sections }
function getGroup(key){
  const data = LINK_MAP[key];
  if(Array.isArray(data)) return { title: DEFAULT_TITLES[key], items: data };
  if(data && Array.isArray(data.sections)) return { title: data.title || DEFAULT_TITLES[key], sections: data.sections };
  if(data && Array.isArray(data.items)) return { title: data.title || DEFAULT_TITLES[key], items: data.items };
  return { title: (data && data.title) || DEFAULT_TITLES[key], items: [] };
}

const Panel = ({ items, sections, mobile, title }) => {
  const hasSections = Array.isArray(sections);
  const safeItems = Array.isArray(items) ? items : [];
  return (
    <Motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={
        "pointer-events-auto rounded-2xl bg-black/90 p-4 backdrop-blur-md border border-amber-300/20 shadow-[0_0_30px_rgba(240,200,80,0.25)] max-h-[calc(100vh-4rem)] overflow-y-auto " +
        (mobile ? "w-[min(26rem,calc(100vw-2rem))]" : "w-[min(18rem,calc(100vw-3rem))]")
      }
      role="menu"
    >
      {title && <div className="mb-2 text-amber-200/90 text-xs tracking-widest uppercase">{title}</div>}

      {!hasSections && (
        <ul className="space-y-2">
          {safeItems.map((it) => {
            const external = /^https?:\/\//.test(it?.href || "");
            return (
              <li key={it?.label}>
                <a
                  href={it?.href || "#"}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="block rounded-lg border border-amber-400/10 bg-amber-100/0 px-3 py-2 text-amber-100/90 hover:bg-amber-400/5 hover:text-amber-100 transition"
                >
                  {it?.label || "(untitled)"}
                </a>
              </li>
            );
          })}
        </ul>
      )}

      {hasSections && (
        <div className="space-y-4">
          {sections.map((sec, idx) => (
            <div key={idx}>
              {!!(sec.subtitle && String(sec.subtitle).trim()) && (
                <div className="mb-1 text-[11px] text-amber-200/80">{sec.subtitle}</div>
              )}
              <ul className="space-y-2">
                {(sec.items || []).map((it) => {
                  const external = /^https?:\/\//.test(it?.href || "");
                  return (
                    <li key={it?.label}>
                      <a
                        href={it?.href || "#"}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="block rounded-lg border border-amber-400/10 bg-amber-100/0 px-3 py-2 text-amber-100/90 hover:bg-amber-400/5 hover:text-amber-100 transition"
                      >
                        {it?.label || "(untitled)"}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Motion.div>
  );
};

const Glow = ({ className }) => (
  <div
    className={`absolute inset-0 blur-xl opacity-70 ${className || ""}`}
    style={{ boxShadow: `0 0 60px 10px ${GOLD}, inset 0 0 40px ${GOLD_MID}` }}
  />
);

function ShapeTriangle(){
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon points="50,10 90,80 10,80" fill="none" strokeWidth="4" stroke="url(#gradTri)" />
        <defs>
          <linearGradient id="gradTri" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={GOLD} />
            <stop offset="100%" stopColor={GOLD_MID} />
          </linearGradient>
        </defs>
      </svg>
      <Glow />
    </div>
  );
}

function ShapeSquare(){
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="10" y="10" width="80" height="80" fill="none" strokeWidth="4" stroke={GOLD_MID} />
      </svg>
      <Glow />
    </div>
  );
}

function ShapeCircle(){
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="40" fill="none" strokeWidth="4" stroke={GOLD_MID} />
      </svg>
      <Glow />
    </div>
  );
}

function ShapeCross(){
  return (
    <div className="relative w-44 h-44 md:w-52 md:h-52">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path
          d="M20 38 L38 20 L50 32 L62 20 L80 38 L68 50 L80 62 L62 80 L50 68 L38 80 L20 62 L32 50 Z"
          fill="none"
          strokeWidth="4"
          stroke={GOLD_MID}
        />
      </svg>
      <Glow />
    </div>
  );
}

const ControllerNode = ({ shape, items, sections, anchor, title, active, setActive }) => {
  const isMobile = useIsMobile();
  const open = active === shape;

  const ShapeComp = { triangle: ShapeTriangle, square: ShapeSquare, circle: ShapeCircle, cross: ShapeCross }[shape];

  const panelPos = {
    top: "top-[calc(100%+16px)] left-1/2 -translate-x-1/2",
    right: "right-[calc(100%+16px)] top-1/2 -translate-y-1/2",
    left: "left-[calc(100%+16px)] top-1/2 -translate-y-1/2",
    bottom: "bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2",
  }[anchor];

  const wrapperPos = isMobile ? "fixed bottom-4 left-1/2 -translate-x-1/2" : `absolute ${panelPos}`;

  const handlers = isMobile
    ? { onClick: (e) => { e.stopPropagation(); setActive(open ? null : shape); } }
    : { onMouseEnter: () => setActive(shape), onMouseLeave: () => setActive(null), onClick: (e) => e.stopPropagation() };

  return (
    <div className="group relative flex flex-col items-center justify-center" {...handlers}>
      <Motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.98 }} className="cursor-pointer select-none" aria-haspopup="menu" aria-expanded={open}>
        <ShapeComp />
      </Motion.div>

      <AnimatePresence>
        {open && (
          <div className={`${wrapperPos} pointer-events-none`}>
            <Panel items={items} sections={sections} mobile={isMobile} title={title} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App(){
  const [active, setActive] = React.useState(null);
  const TRI = getGroup("triangle"), SQU = getGroup("square"), CIR = getGroup("circle"), CRO = getGroup("cross");

  React.useEffect(() => {
    const close = () => setActive(null);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <ErrorBoundary>
      <main className="relative min-h-screen text-amber-100 bg-black overflow-hidden" onClick={() => setActive(null)}>
        <header className="relative z-10 flex items-center justify-between px-4 md:px-6 pt-6">
          <h1 className="font-mono tracking-wider text-xs md:text-sm text-amber-200/80">ETHPAPERS.XYZ</h1>
          <div className="text-[10px] font-mono text-amber-300/70">v0.1</div>
        </header>

        <section className="relative z-10 grid place-items-center pt-6 md:pt-10">
          <div className="relative w-full max-w-[900px] aspect-[1.1] md:aspect-[1.4] mx-auto">
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
              <div />
              <div className="flex items-center justify-center">
                <ControllerNode shape="triangle" items={TRI.items} sections={TRI.sections} anchor="top" title={TRI.title} active={active} setActive={setActive} />
              </div>
              <div />
              <div className="flex items-center justify-center">
                <ControllerNode shape="square" items={SQU.items} sections={SQU.sections} anchor="left" title={SQU.title} active={active} setActive={setActive} />
              </div>
              <div />
              <div className="flex items-center justify-center">
                <ControllerNode shape="circle" items={CIR.items} sections={CIR.sections} anchor="right" title={CIR.title} active={active} setActive={setActive} />
              </div>
              <div />
              <div className="flex items-center justify-center">
                <ControllerNode shape="cross" items={CRO.items} sections={CRO.sections} anchor="bottom" title={CRO.title} active={active} setActive={setActive} />
              </div>
              <div />
            </div>
          </div>
        </section>

        <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-25">
          <Scanlines />
        </div>

        <Distress />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.8))]" />
      </main>
    </ErrorBoundary>
  );
}

const Scanlines = () => (
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: "repeating-linear-gradient(0deg, rgba(241,196,83,0.08) 0px, rgba(241,196,83,0.08) 1px, rgba(0,0,0,0) 2px)",
      animation: "scan 8s linear infinite",
    }}
  />
);

const Distress = () => (
  <svg className="absolute inset-0 w-full h-full opacity-40 mix-blend-multiply">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.18" />
      </feComponentTransfer>
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" fill="#000" />
  </svg>
);
