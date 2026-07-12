import { motion } from "framer-motion";

export default function SVGCat({ state = "idle", size = 56, facing = 1 }) {
  const bodyAnim = {
    idle: { y: [0, -1, 0], transition: { duration: 2, repeat: Infinity } },
    walking: { y: [0, -2, 0], transition: { duration: 0.4, repeat: Infinity } },
    sleeping: { y: 0 },
    happy: { y: [0, -8, 0], transition: { duration: 0.5, repeat: Infinity } },
    yawning: { scale: [1, 1.05, 1], transition: { duration: 1.5 } },
  };

  const tailAnim = {
    idle: { rotate: [0, 15, -10, 0], transition: { duration: 3, repeat: Infinity } },
    walking: { rotate: [0, 20, -5, 0], transition: { duration: 0.5, repeat: Infinity } },
    sleeping: { rotate: 0 },
    happy: { rotate: [0, 30, -20, 0], transition: { duration: 0.3, repeat: Infinity } },
    yawning: { rotate: [0, 10, 0], transition: { duration: 1.5 } },
  };

  const eyeScale = state === "sleeping" ? 0.1 : state === "yawning" ? 0.3 : 1;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ transform: `scaleX(${facing})`, display: "block" }}
      animate={bodyAnim[state]}
    >
      <motion.path
        d="M 75 65 Q 90 55, 88 40"
        stroke="#f97316"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        style={{ transformOrigin: "75px 65px" }}
        animate={tailAnim[state]}
      />
      <ellipse cx="50" cy="65" rx="25" ry="20" fill="#f97316" />
      <ellipse cx="50" cy="70" rx="15" ry="10" fill="#fef3c7" />
      <path d="M 35 55 Q 40 52, 45 55" stroke="#c2410c" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 55 55 Q 60 52, 65 55" stroke="#c2410c" strokeWidth="2" fill="none" strokeLinecap="round" />

      <motion.g
        animate={state === "walking" ? { y: [0, -2, 0, -2, 0], transition: { duration: 0.4, repeat: Infinity } } : {}}
      >
        <ellipse cx="38" cy="82" rx="5" ry="4" fill="#f97316" />
        <ellipse cx="62" cy="82" rx="5" ry="4" fill="#f97316" />
      </motion.g>

      <circle cx="50" cy="40" r="22" fill="#f97316" />
      <path d="M 40 25 Q 43 22, 46 25" stroke="#c2410c" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 54 25 Q 57 22, 60 25" stroke="#c2410c" strokeWidth="2" fill="none" strokeLinecap="round" />

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

      {state === "yawning" ? (
        <ellipse cx="50" cy="53" rx="4" ry="5" fill="#1a1a1a" />
      ) : state === "happy" ? (
        <path d="M 46 52 Q 50 56, 54 52" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ) : (
        <>
          <path d="M 50 50 Q 47 53, 45 52" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 50 50 Q 53 53, 55 52" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
      )}

      <line x1="25" y1="45" x2="38" y2="46" stroke="white" strokeWidth="1" opacity="0.7" />
      <line x1="25" y1="48" x2="38" y2="48" stroke="white" strokeWidth="1" opacity="0.7" />
      <line x1="62" y1="46" x2="75" y2="45" stroke="white" strokeWidth="1" opacity="0.7" />
      <line x1="62" y1="48" x2="75" y2="48" stroke="white" strokeWidth="1" opacity="0.7" />

      {state === "sleeping" && (
        <motion.text
          x="70" y="25" fill="#60a5fa" fontSize="12" fontWeight="bold"
          animate={{ y: [25, 15], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >z</motion.text>
      )}

      {state === "happy" && (
        <motion.text
          x="70" y="25" fontSize="14"
          animate={{ y: [25, 10], opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >♥</motion.text>
      )}
    </motion.svg>
  );
}