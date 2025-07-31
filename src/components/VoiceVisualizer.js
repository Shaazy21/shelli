import React from 'react';
import { motion } from 'framer-motion';
import './VoiceVisualizer.css';

const VoiceVisualizer = () => {
  // Create an array of bars for the visualizer
  const bars = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="voice-visualizer">
      <div className="visualizer-container">
        {bars.map((bar, index) => (
          <motion.div
            key={bar}
            className="voice-bar"
            animate={{
              scaleY: [0.2, 1.5, 0.2],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 0.8 + Math.random() * 0.4,
              repeat: Infinity,
              delay: index * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <motion.div
        className="visualizer-glow"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="visualizer-label">
        <motion.span
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Listening...
        </motion.span>
      </div>
    </div>
  );
};

export default VoiceVisualizer;