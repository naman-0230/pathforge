// src/components/pets/CompanionCat.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============ Inline SVG Cat ============
function SVGCat({ state = "idle", size = 48 }) {
  const bodyAnim = {
    idle: { y: [0, -1, 0], transition: { duration: 2, repeat: Infinity } },
    sleeping: { y: 0 },
    happy: { y: [0, -6, 0], transition: { duration: 0.5, repeat: Infinity } },
    yawning: { scale: [1, 1.05, 1], transition: { duration: 1.5 } },
  };
  const tailAnim = {
    idle: { rotate: [0, 15, -10, 0], transition: { duration: 3, repeat: Infinity } },
    sleeping: { rotate: 0 },
    happy: { rotate: [0, 30, -20, 0], transition: { duration: 0.3, repeat: Infinity } },
    yawning: { rotate: [0, 10, 0], transition: { duration: 1.5 } },
  };
  const eyeScale = state === "sleeping" ? 0.1 : state === "yawning" ? 0.3 : 1;

  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 100 100"
      style={{ display: "block" }}
      animate={bodyAnim[state]}
    >
      <motion.path d="M 75 65 Q 90 55, 88 40" stroke="#f97316" strokeWidth="8" strokeLinecap="round" fill="none"
        style={{ transformOrigin: "75px 65px" }} animate={tailAnim[state]} />
      <ellipse cx="50" cy="65" rx="25" ry="20" fill="#f97316" />
      <ellipse cx="50" cy="70" rx="15" ry="10" fill="#fef3c7" />
      <ellipse cx="38" cy="82" rx="5" ry="4" fill="#f97316" />
      <ellipse cx="62" cy="82" rx="5" ry="4" fill="#f97316" />
      <circle cx="50" cy="40" r="22" fill="#f97316" />
      <path d="M 32 28 L 28 15 L 40 22 Z" fill="#f97316" />
      <path d="M 68 28 L 72 15 L 60 22 Z" fill="#f97316" />
      <path d="M 33 25 L 31 19 L 37 22 Z" fill="#fda4af" />
      <path d="M 67 25 L 69 19 L 63 22 Z" fill="#fda4af" />
      <motion.g animate={{ scaleY: eyeScale }} style={{ transformOrigin: "50px 40px" }}>
        {state === "sleeping" ? (
          <>
            <path d="M 40 40 Q 43 42, 46 40" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 54 40 Q 57 42, 60 40" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="43" cy="40" r="4" fill="#1a1a1a" />
            <circle cx="57" cy="40" r="4" fill="#1a1a1a" />
            <circle cx="44" cy="39" r="1.2" fill="white" />
            <circle cx="58" cy="39" r="1.2" fill="white" />
          </>
        )}
      </motion.g>
      <path d="M 48 47 L 52 47 L 50 50 Z" fill="#fb7185" />
      {state === "happy" ? (
        <path d="M 46 52 Q 50 56, 54 52" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ) : (
        <>
          <path d="M 50 50 Q 47 53, 45 52" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 50 50 Q 53 53, 55 52" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {state === "sleeping" && (
        <motion.text x="70" y="25" fill="#60a5fa" fontSize="12" fontWeight="bold"
          animate={{ y: [25, 15], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}>z</motion.text>
      )}
      {state === "happy" && (
        <motion.text x="70" y="25" fontSize="14"
          animate={{ y: [25, 10], opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}>♥</motion.text>
      )}
    </motion.svg>
  );
}

// ============ Companion Cat Behavior (STATIC POSITION) ============
export default function CompanionCat({ streakActive = true, mood = "normal" }) {
  const [state, setState] = useState("yawning");
  const [message, setMessage] = useState(null);
  const idleTimer = useRef(null);

  const isNight = () => {
    const h = new Date().getHours();
    return h >= 22 || h < 6;
  };

  // Wake up on mount
  useEffect(() => {
    if (isNight()) {
      setState("sleeping");
      return;
    }
    setState("yawning");
    const t = setTimeout(() => {
      setState("idle");
      setMessage("meow~");
      setTimeout(() => setMessage(null), 1500);
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  // Idle → sleep
  useEffect(() => {
    const resetIdle = () => {
      clearTimeout(idleTimer.current);
      if (state === "sleeping" && !isNight()) setState("idle");
      idleTimer.current = setTimeout(() => setState("sleeping"), 60000);
    };
    ["mousemove", "keydown", "click"].forEach((e) => window.addEventListener(e, resetIdle));
    resetIdle();
    return () => {
      ["mousemove", "keydown", "click"].forEach((e) => window.removeEventListener(e, resetIdle));
      clearTimeout(idleTimer.current);
    };
  }, [state]);

  // Random meows
  useEffect(() => {
    const interval = setInterval(() => {
      if (state === "idle" && Math.random() < 0.3) {
        setMessage(streakActive ? "meow~" : "...");
        setTimeout(() => setMessage(null), 1500);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [state, streakActive]);

  // Celebrate on mood change
  useEffect(() => {
    if (mood === "celebrate") {
      setState("happy");
      setMessage("purr♥");
      setTimeout(() => {
        setMessage(null);
        setState("idle");
      }, 2000);
    }
  }, [mood]);

  const handleClick = () => {
    if (state === "sleeping") {
      setState("yawning");
      setTimeout(() => setState("idle"), 1500);
    } else {
      setState("happy");
      setMessage("purr♥");
      setTimeout(() => {
        setMessage(null);
        setState("idle");
      }, 1500);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: 48,
        height: 48,
        cursor: "pointer",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      <SVGCat state={state} size={48} />

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            style={{
              position: "absolute",
              top: "50%",
              left: "calc(100% + 8px)",
              transform: "translateY(-50%)",
              background: "#1a1a1a",
              color: "#fdba74",
              fontSize: 11,
              padding: "3px 8px",
              borderRadius: 999,
              whiteSpace: "nowrap",
              border: "1px solid rgba(249, 115, 22, 0.3)",
              fontFamily: "monospace",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}