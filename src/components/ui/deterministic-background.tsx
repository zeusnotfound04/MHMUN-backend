"use client"

import { motion } from "framer-motion";
import React from "react";

// Helper function to ensure consistent number formatting
const formatNumber = (num: number) => {
  return Number(num.toFixed(4));
};

// Deterministic positions for server-side rendering to match client rendering
const generateDeterministicBubble = (index: number, total: number) => {
  // Use deterministic algorithm instead of Math.random
  const angleStep = (Math.PI * 2) / total;
  const angle = angleStep * index;
  const radius = 40 + (index % 3) * 20;
  
  // Convert to percentage positions
  const left = 50 + radius * Math.cos(angle);
  const top = 50 + radius * Math.sin(angle);
  
  // Generate size based on index
  const size = 50 + (index % 5) * 25;
  
  return {
    // Use consistent precision to ensure server and client render the same values
    left: `${formatNumber(left)}%`,
    top: `${formatNumber(top)}%`,
    width: `${formatNumber(size)}px`,
    height: `${formatNumber(size)}px`,
    duration: formatNumber(15 + (index % 10)),
    delay: formatNumber(index * 0.5)
  };
};

function DeterministicBubbles({ pattern = 1 }: { pattern?: 1 | 2 | 3 }) {
  // Precomputed patterns to avoid hydration mismatches
  const patterns = {    1: (      <motion.div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: formatNumber(0.15) }}
        transition={{ duration: formatNumber(2) }}
      >
        {Array.from({ length: 20 }).map((_, i) => {
          const position = generateDeterministicBubble(i, 20);
          return (
            <motion.div 
              key={`bubble-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"
              style={{
                left: position.left,
                top: position.top,
                width: position.width,
                height: position.height,
                opacity: 0, // Explicitly set initial opacity as number not string
                transform: 'scale(0)' // Explicitly set initial transform
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0.8],
                opacity: [0, 0.2, 0],
                y: [0, -100]
              }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: position.duration,
                delay: position.delay,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </motion.div>
    ),    2: (
      <motion.div 
        className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: formatNumber(0.15) }}
        transition={{ duration: formatNumber(2) }}
      >        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div 
            key={`grid-${i}`}
            className="absolute bg-gradient-to-r from-blue-400 to-indigo-400"
            style={{
              left: `${formatNumber((i % 6) * 20)}%`,
              top: `${formatNumber(Math.floor(i / 6) * 20)}%`,
              width: "1px",
              height: "1px",
              opacity: 0,
              transform: "scale(0)"
            }}
            animate={{ 
              scale: [1, 80, 1],
              opacity: [0, 0.2, 0],
              borderRadius: ["0%", "50%", "0%"]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 12,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    ),
    3: (
      <motion.div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
      >        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div 
            key={`wave-${i}`}
            className="absolute left-0 right-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
            style={{
              top: `${formatNumber(i * 10 + (i % 5))}%`,
              height: "1px",
              opacity: 0,
              transform: "scale(1)"
            }}
            animate={{ 
              scaleY: [1, 15, 1],
              opacity: [0, 0.15, 0],
              filter: ["blur(0px)", "blur(4px)", "blur(0px)"]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 10 + i * 2,
              delay: i * 1.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    )
  };
  return patterns[pattern];
}

export { DeterministicBubbles };
