/**
 * Cursor Integration Examples
 * 
 * Examples of how to integrate the particle cursor system into your portfolio
 * with different configurations and use cases.
 */

import { initCursor, type CursorOptions } from './cursor';

// Default portfolio cursor configuration
export const portfolioCursorConfig: CursorOptions = {
  mode: 'particles',
  particleCount: 80,
  baseSize: 8,
  haloSize: 24,
  trailBlend: 'normal',
  spring: {
    stiffness: 0.35, // Increased for more responsive feel
    damping: 0.75   // Reduced for less lag
  },
  colors: {
    base: '#000000', // Will be overridden by theme-aware colors
    halo: '#333333',
    particle: ['#000000', '#333333', '#666666', '#999999']
  },
  magnetic: {
    enabled: true,
    radius: 40, // Reduced radius for less aggressive attraction
    strength: 0.08 // Reduced strength for subtlety
  },
  reducedMotion: false,
  themeAware: true // Enable theme-aware colors
};

// High-performance configuration for mobile
export const mobileCursorConfig: CursorOptions = {
  ...portfolioCursorConfig,
  particleCount: 60,
  mode: 'particles'
};

// Premium configuration with WebGL fluid effects
export const premiumCursorConfig: CursorOptions = {
  ...portfolioCursorConfig,
  mode: 'hybrid',
  particleCount: 200,
  baseSize: 12,
  haloSize: 32,
  spring: {
    stiffness: 0.25,
    damping: 0.75
  }
};

// Accessibility-focused configuration
export const accessibleCursorConfig: CursorOptions = {
  ...portfolioCursorConfig,
  particleCount: 40,
  baseSize: 12,
  haloSize: 24,
  magnetic: {
    enabled: false,
    radius: 0,
    strength: 0
  },
  reducedMotion: true
};

/**
 * Initialize cursor with automatic device detection
 */
export function initPortfolioCursor(): () => void {
  // Detect device capabilities
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let config: CursorOptions;

  if (prefersReducedMotion) {
    config = accessibleCursorConfig;
  } else if (isMobile || isLowEnd) {
    config = mobileCursorConfig;
  } else {
    config = portfolioCursorConfig;
  }

  return initCursor(config, {
    onBurst: () => {
      // We only track that a burst occurred, not the coordinates
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'cursor_burst', {
          event_category: 'interaction',
          event_label: 'particle_cursor'
        });
      }
    },
    onHoverEnter: (element) => {
      // Add hover analytics
      const elementType = element.tagName.toLowerCase();
      const elementClass = element.className;

      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'cursor_hover', {
          event_category: 'interaction',
          event_label: `${elementType}_${elementClass}`,
          value: 1
        });
      }
    },
    onHoverLeave: (element) => {
      // Clean up any hover effects
      element.classList.remove('cursor-hovering');
    }
  });
}

/**
 * Initialize cursor with custom theme colors
 */
export function initThemedCursor(theme: 'blue' | 'purple' | 'green' | 'orange'): () => void {
  const themes = {
    blue: {
      base: '#3b82f6',
      halo: '#1e40af',
      particle: ['#3b82f6', '#1e40af', '#60a5fa', '#93c5fd']
    },
    purple: {
      base: '#8b5cf6',
      halo: '#7c3aed',
      particle: ['#8b5cf6', '#7c3aed', '#a78bfa', '#c4b5fd']
    },
    green: {
      base: '#10b981',
      halo: '#059669',
      particle: ['#10b981', '#059669', '#34d399', '#6ee7b7']
    },
    orange: {
      base: '#f59e0b',
      halo: '#d97706',
      particle: ['#f59e0b', '#d97706', '#fbbf24', '#fcd34d']
    }
  };

  const selectedTheme = themes[theme];

  return initCursor({
    ...portfolioCursorConfig,
    colors: selectedTheme
  });
}

/**
 * Initialize cursor with performance monitoring
 */
export function initMonitoredCursor(): () => void {
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 60;

  const updateFPS = () => {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime - lastTime >= 1000) {
      fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      frameCount = 0;
      lastTime = currentTime;

      // Log performance metrics
      console.log(`Cursor FPS: ${fps}`);

      // Send to analytics if available
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'cursor_performance', {
          event_category: 'performance',
          event_label: 'fps',
          value: fps
        });
      }
    }

    requestAnimationFrame(updateFPS);
  };

  const destroy = initCursor(portfolioCursorConfig);
  updateFPS();

  return destroy;
}

/**
 * Initialize cursor with interaction tracking
 */
export function initTrackedCursor(): () => void {
  let hoverCount = 0;
  let burstCount = 0;

  return initCursor(portfolioCursorConfig, {
    onBurst: (x, y) => {
      burstCount++;
      console.log(`Burst ${burstCount} at (${x}, ${y})`);
    },
    onHoverEnter: (element) => {
      hoverCount++;
      element.classList.add('cursor-hovering');
      console.log(`Hover ${hoverCount} on ${element.tagName}`);
    },
    onHoverLeave: (element) => {
      element.classList.remove('cursor-hovering');
    }
  });
}

// Type declarations for gtag (if using Google Analytics)
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
