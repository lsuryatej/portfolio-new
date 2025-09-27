'use client';

import * as React from 'react';
import { motion, type Variants } from 'framer-motion';
import { ReactNode, forwardRef, useEffect, useState, useRef, useCallback } from 'react';
import { DURATIONS, VIEWPORT, motionTokens } from './tokens';
import { prefersReducedMotion } from '../accessibility';
import { cn } from '@/lib/utils';

// Base animation variants
const fadeInVariants: Variants = {
  hidden: { 
    opacity: 0,
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: DURATIONS.sm,
      ease: motionTokens.easings.entrance,
    },
  },
};

const riseInVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: motionTokens.transforms.slideDistance,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.md,
      ease: motionTokens.easings.entrance,
    },
  },
};

const scaleInVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: motionTokens.transforms.scaleStart,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATIONS.md,
      ease: motionTokens.easings.bounce,
    },
  },
};

const slideInVariants = {
  left: {
    hidden: { opacity: 0, x: -motionTokens.transforms.slideDistance },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: DURATIONS.md,
        ease: motionTokens.easings.entrance,
      },
    },
  },
  right: {
    hidden: { opacity: 0, x: motionTokens.transforms.slideDistance },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: DURATIONS.md,
        ease: motionTokens.easings.entrance,
      },
    },
  },
  up: {
    hidden: { opacity: 0, y: motionTokens.transforms.slideDistance },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: DURATIONS.md,
        ease: motionTokens.easings.entrance,
      },
    },
  },
  down: {
    hidden: { opacity: 0, y: -motionTokens.transforms.slideDistance },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: DURATIONS.md,
        ease: motionTokens.easings.entrance,
      },
    },
  },
};

// Hook to check for reduced motion preference
const useReducedMotion = () => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    setShouldReduceMotion(prefersReducedMotion());
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setShouldReduceMotion(mediaQuery.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return shouldReduceMotion;
};

// Component interfaces
interface BaseMotionProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  disabled?: boolean;
}

interface SlideInProps extends BaseMotionProps {
  direction?: 'left' | 'right' | 'up' | 'down';
}

// FadeIn Component
export const FadeIn = forwardRef<HTMLDivElement, BaseMotionProps>(
  ({ children, delay = 0, duration, className, disabled = false }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    
    if (disabled || shouldReduceMotion) {
      return <div ref={ref} className={className}>{children}</div>;
    }

    const variants = duration ? {
      ...fadeInVariants,
      visible: {
        opacity: 1,
        transition: {
          duration: duration / 1000,
          ease: motionTokens.easings.entrance,
        },
      },
    } : fadeInVariants;

    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ margin: VIEWPORT.rootMargin, amount: VIEWPORT.amount, once: false }}
        variants={variants}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    );
  }
);

FadeIn.displayName = 'FadeIn';

// ImmediateFadeIn Component for above-the-fold content
export const ImmediateFadeIn = forwardRef<HTMLDivElement, BaseMotionProps>(
  ({ children, delay = 0, duration, className, disabled = false }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    
    if (disabled || shouldReduceMotion) {
      return <div ref={ref} className={className}>{children}</div>;
    }

    const variants = duration ? {
      ...fadeInVariants,
      visible: {
        opacity: 1,
        transition: {
          duration: duration / 1000,
          ease: motionTokens.easings.entrance,
        },
      },
    } : fadeInVariants;

    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    );
  }
);

ImmediateFadeIn.displayName = 'ImmediateFadeIn';

// ImmediateRiseIn Component for above-the-fold content
export const ImmediateRiseIn = forwardRef<HTMLDivElement, BaseMotionProps>(
  ({ children, delay = 0, duration, className, disabled = false }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    
    if (disabled || shouldReduceMotion) {
      return <div ref={ref} className={className}>{children}</div>;
    }

    const variants = duration ? {
      ...riseInVariants,
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: duration / 1000,
          ease: motionTokens.easings.entrance,
        },
      },
    } : riseInVariants;

    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    );
  }
);

ImmediateRiseIn.displayName = 'ImmediateRiseIn';

// RiseIn Component
export const RiseIn = forwardRef<HTMLDivElement, BaseMotionProps>(
  ({ children, delay = 0, duration, className, disabled = false }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    
    if (disabled || shouldReduceMotion) {
      return <div ref={ref} className={className}>{children}</div>;
    }

    const variants = duration ? {
      ...riseInVariants,
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: duration / 1000,
          ease: motionTokens.easings.entrance,
        },
      },
    } : riseInVariants;

    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ margin: VIEWPORT.rootMargin, amount: VIEWPORT.amount, once: false }}
        variants={variants}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    );
  }
);

RiseIn.displayName = 'RiseIn';

// ScaleIn Component
export const ScaleIn = forwardRef<HTMLDivElement, BaseMotionProps>(
  ({ children, delay = 0, duration, className, disabled = false }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    
    if (disabled || shouldReduceMotion) {
      return <div ref={ref} className={className}>{children}</div>;
    }

    const variants = duration ? {
      ...scaleInVariants,
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: duration / 1000,
          ease: motionTokens.easings.bounce,
        },
      },
    } : scaleInVariants;

    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ margin: VIEWPORT.rootMargin, amount: VIEWPORT.amount, once: false }}
        variants={variants}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    );
  }
);

ScaleIn.displayName = 'ScaleIn';

// SlideIn Component
export const SlideIn = forwardRef<HTMLDivElement, SlideInProps>(
  ({ children, direction = 'up', delay = 0, duration, className, disabled = false }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    
    if (disabled || shouldReduceMotion) {
      return <div ref={ref} className={className}>{children}</div>;
    }

    const variants = duration ? {
      ...slideInVariants[direction],
      visible: {
        ...slideInVariants[direction].visible,
        transition: {
          ...slideInVariants[direction].visible.transition,
          duration: duration / 1000,
        },
      },
    } : slideInVariants[direction];

    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ margin: VIEWPORT.rootMargin, amount: VIEWPORT.amount, once: false }}
        variants={variants}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    );
  }
);

SlideIn.displayName = 'SlideIn';

// StaggerChildren Component
interface StaggerChildrenProps {
  children: ReactNode;
  stagger?: number;
  className?: string;
  disabled?: boolean;
}

export const StaggerChildren = forwardRef<HTMLDivElement, StaggerChildrenProps>(
  ({ children, stagger = motionTokens.reveal.stagger, className, disabled = false }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    
    if (disabled || shouldReduceMotion) {
      return <div ref={ref} className={className}>{children}</div>;
    }

    const containerVariants: Variants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: stagger,
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ margin: VIEWPORT.rootMargin, amount: VIEWPORT.amount, once: false }}
        variants={containerVariants}
      >
        {children}
      </motion.div>
    );
  }
);

StaggerChildren.displayName = 'StaggerChildren';

// Magnetic Component for cursor attraction effects
interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
  disabled?: boolean;
}

export const Magnetic = forwardRef<HTMLDivElement, MagneticProps>(
  ({ children, strength = 0.4, className, disabled = false }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    const magneticRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (!magneticRef.current) return;
      
      const rect = magneticRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      // Calculate distance from center
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = Math.max(rect.width, rect.height);
      
      // Apply magnetic effect with smooth interpolation
      const magneticX = deltaX * strength;
      const magneticY = deltaY * strength;
      
      // Add subtle rotation based on position
      const rotation = (deltaX / rect.width) * 2;
      
      // Apply transform with smooth easing
      magneticRef.current.style.transform = `
        translate3d(${magneticX}px, ${magneticY}px, 0) 
        rotate(${rotation}deg) 
        scale(${1 + (distance / maxDistance) * 0.05})
      `;
      
      // Add glow effect based on proximity
      const glowIntensity = Math.max(0, 1 - distance / (maxDistance * 0.8));
      magneticRef.current.style.filter = `brightness(${1 + glowIntensity * 0.1}) saturate(${1 + glowIntensity * 0.2})`;
    }, [strength]);

    const handleMouseEnter = useCallback(() => {
      setIsHovered(true);
      if (magneticRef.current) {
        magneticRef.current.style.transition = 'none';
      }
    }, []);

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
      if (magneticRef.current) {
        magneticRef.current.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.320, 1)';
        magneticRef.current.style.transform = 'translate3d(0px, 0px, 0) rotate(0deg) scale(1)';
        magneticRef.current.style.filter = 'brightness(1) saturate(1)';
      }
    }, []);

    if (disabled || shouldReduceMotion) {
      return <div ref={ref} className={className}>{children}</div>;
    }

    return (
      <motion.div
        ref={magneticRef}
        className={cn('magnetic-element', className)}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.95 }}
        transition={motionTokens.springs.snappy}
        style={{
          willChange: 'transform, filter',
          cursor: 'pointer',
        }}
      >
        {children}
        
        {/* Magnetic field visualization (subtle) */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 0.1 : 0,
            scale: isHovered ? 1.2 : 0.8,
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            zIndex: -1,
          }}
        />
      </motion.div>
    );
  }
);

Magnetic.displayName = 'Magnetic';