'use client';

import React, { useEffect, useRef, createContext, useContext } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { velocityBus } from '@/lib/motion/scroll';
import { metricsCollector } from '@/lib/metrics';

gsap.registerPlugin(ScrollTrigger);

interface ScrollContextType {
  lenis: Lenis | null;
  velocity: number;
}

const ScrollContext = createContext<ScrollContextType>({ 
  lenis: null, 
  velocity: 0 
});

export const useScrollCtx = () => useContext(ScrollContext);

interface ScrollProviderProps {
  children: React.ReactNode;
}

export default function ScrollProvider({ children }: ScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const velRef = useRef(0);

  useEffect(() => {
    // Check for reduced motion preference
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Initialize Lenis with conditional smooth scrolling
    const lenis = new Lenis({ 
      lerp: reduce ? 1 : 0.1,
      duration: reduce ? 0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });
    
    lenisRef.current = lenis;

    let lastY = 0;
    
    function raf(time: number) {
      lenis.raf(time);
      
      // Calculate velocity
      const y = lenis.scroll;
      const velocity = y - lastY;
      velRef.current = velocity;
      lastY = y;
      
      // Update velocity bus
      velocityBus.update(velocity);
      
      // Update ScrollTrigger
      ScrollTrigger.update();
      
      // Record frame for global performance tracking
      metricsCollector.recordFrame('scroll-provider');
      
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);

    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Start performance tracking
    metricsCollector.startTracking('scroll-provider');

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      metricsCollector.stopTracking('scroll-provider');
      lenis.destroy();
    };
  }, []);

  return (
    <ScrollContext.Provider value={{ 
      lenis: lenisRef.current, 
      velocity: velRef.current 
    }}>
      {children}
    </ScrollContext.Provider>
  );
}