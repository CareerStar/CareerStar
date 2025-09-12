import React, { useState, useEffect, useMemo } from 'react';

// Add the CSS animation directly to the component
const starFieldStyles = `
  @keyframes animStar {
    from {
      transform: translateY(0px);
    }
    to {
      transform: translateY(-2000px);
    }
  }
`;

// Inject styles into the document head
if (typeof document !== 'undefined' && !document.getElementById('starfield-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'starfield-styles';
  styleSheet.textContent = starFieldStyles;
  document.head.appendChild(styleSheet);
}

const StarField = ({ 
  starCount = { small: 400, medium: 150, large: 80 }, 
  animationSpeed = { small: 50, medium: 100, large: 150 },
  className = "stars-container" 
}) => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateStars = useMemo(() => {
    const generateStarLayer = (count, size, speed, offsetY = 0) => {
      const stars = [];
      // Normal star area since transform is removed
      const maxX = windowSize.width;
      const maxY = windowSize.height + 2000;
      
      for (let i = 0; i < count; i++) {
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;
        stars.push(`${x}px ${y}px #fff`);
      }

      return {
        width: `${size}px`,
        height: `${size}px`,
        background: 'transparent',
        position: 'absolute',
        top: `${offsetY}px`,
        left: 0,
        boxShadow: stars.join(', '),
        animation: `animStar ${speed}s linear infinite`,
      };
    };

    return {
      small1: generateStarLayer(starCount.small, 1, animationSpeed.small, 0),
      small2: generateStarLayer(starCount.small, 1, animationSpeed.small, 100),
      medium1: generateStarLayer(starCount.medium, 2, animationSpeed.medium, 0),
      medium2: generateStarLayer(starCount.medium, 2, animationSpeed.medium, 100),
      large1: generateStarLayer(starCount.large, 3, animationSpeed.large, 0),
      large2: generateStarLayer(starCount.large, 3, animationSpeed.large, 100),
    };
  }, [
    windowSize.width, 
    windowSize.height, 
    starCount.small, 
    starCount.medium, 
    starCount.large,
    animationSpeed.small,
    animationSpeed.medium,
    animationSpeed.large
  ]);

  const containerStyle = {
    width: '100%',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 1, // Changed from -1 to make stars visible
    // transform: 'translateX(-250px)', // Temporarily removed to test coverage
  };

  return (
    <section className={className} style={containerStyle}>
      <div style={generateStars.small1}></div>
      <div style={generateStars.small2}></div>
      <div style={generateStars.medium1}></div>
      <div style={generateStars.medium2}></div>
      <div style={generateStars.large1}></div>
      <div style={generateStars.large2}></div>
    </section>
  );
};

export default StarField;