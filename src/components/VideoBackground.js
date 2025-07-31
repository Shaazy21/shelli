import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './VideoBackground.css';

const VideoBackground = ({ emotion = 'neutral' }) => {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  // Video mapping based on emotions
  const videoMap = {
    neutral: [
      'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', // Placeholder for neutral
    ],
    happy: [
      'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', // Happy person
    ],
    thinking: [
      'https://images.pexels.com/photos/1181686/pexels-photo-1186686.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', // Thoughtful
    ],
    encouraging: [
      'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', // Encouraging
    ],
    dancing: [
      'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', // Dancing/movement
    ],
    contemplative: [
      'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', // Contemplative
    ]
  };

  // For now, we'll use a beautiful gradient background with animated elements
  // In a real implementation, you would replace this with actual video files
  const getCurrentBackground = () => {
    const backgrounds = {
      neutral: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      happy: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      thinking: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      encouraging: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      dancing: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      contemplative: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    };
    
    return backgrounds[emotion] || backgrounds.neutral;
  };

  useEffect(() => {
    // Simulate video loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Trigger background change when emotion changes
    setActiveVideo(prev => (prev + 1) % 2);
  }, [emotion]);

  return (
    <div className="video-background">
      {/* Animated Background */}
      <motion.div
        className="animated-background"
        style={{ background: getCurrentBackground() }}
        animate={{ 
          background: getCurrentBackground(),
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Floating Particles */}
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Emotion-based Visual Effects */}
      <div className={`visual-effects ${emotion}`}>
        {emotion === 'happy' && (
          <div className="sparkles">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="sparkle"
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        )}

        {emotion === 'thinking' && (
          <div className="thought-bubbles">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="thought-bubble"
                animate={{
                  y: [-20, -100],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              />
            ))}
          </div>
        )}

        {emotion === 'dancing' && (
          <div className="dance-waves">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="wave"
                animate={{
                  scaleY: [1, 2, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Avatar Representation */}
      <motion.div
        className="digital-avatar"
        animate={{
          scale: emotion === 'happy' ? [1, 1.1, 1] : 1,
          rotate: emotion === 'dancing' ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          duration: 2,
          repeat: emotion === 'happy' || emotion === 'dancing' ? Infinity : 0
        }}
      >
        <div className="avatar-glow" />
        <div className="avatar-core">
          <span className="avatar-initial">S</span>
        </div>
      </motion.div>

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          className="loading-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="loading-spinner" />
        </motion.div>
      )}
    </div>
  );
};

export default VideoBackground;