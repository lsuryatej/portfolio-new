'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { DURATIONS, EASING, motionTokens } from './tokens';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

/**
 * Initialize GSAP with optimized settings
 */
export function initGSAP() {
  if (typeof window === 'undefined') return;

  // Set GSAP defaults
  gsap.defaults({
    duration: DURATIONS.md,
    ease: EASING.standard,
  });

  // Configure ScrollTrigger defaults
  ScrollTrigger.defaults({
    toggleActions: 'play none none reverse',
    start: 'top 80%',
    end: 'bottom 20%',
  });

  // Refresh ScrollTrigger on window resize
  ScrollTrigger.addEventListener('refresh', () => {
    console.log('ScrollTrigger refreshed');
  });
}

/**
 * Create a scroll-triggered animation
 */
export function createScrollAnimation(
  target: string | Element,
  animation: gsap.TweenVars,
  options: ScrollTrigger.Vars = {}
) {
  if (typeof window === 'undefined') return null;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Apply final state immediately without animation
    gsap.set(target, animation);
    return null;
  }

  return gsap.fromTo(target, 
    // From state (initial)
    {
      opacity: 0,
      y: motionTokens.reveal.distance,
      ...animation.from,
    },
    // To state (final)
    {
      opacity: 1,
      y: 0,
      duration: motionTokens.durations.slow / 1000,
      ease: motionTokens.gsapEasings.entrance,
      ...animation,
      scrollTrigger: {
        trigger: target,
        start: motionTokens.scroll.start,
        end: motionTokens.scroll.end,
        toggleActions: 'play none none reverse',
        ...options,
      },
    }
  );
}

/**
 * Create staggered scroll animations
 */
export function createStaggeredScrollAnimation(
  targets: string | Element[],
  animation: gsap.TweenVars,
  options: ScrollTrigger.Vars & { stagger?: number } = {}
) {
  if (typeof window === 'undefined') return null;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    gsap.set(targets, animation);
    return null;
  }

  const { stagger = motionTokens.reveal.stagger, ...scrollTriggerOptions } = options;

  return gsap.fromTo(targets,
    {
      opacity: 0,
      y: motionTokens.reveal.distance,
      ...animation.from,
    },
    {
      opacity: 1,
      y: 0,
      duration: motionTokens.durations.slow / 1000,
      ease: motionTokens.gsapEasings.entrance,
      stagger,
      ...animation,
      scrollTrigger: {
        trigger: typeof targets === 'string' ? targets : targets[0],
        start: motionTokens.scroll.start,
        end: motionTokens.scroll.end,
        toggleActions: 'play none none reverse',
        ...scrollTriggerOptions,
      },
    }
  );
}

/**
 * Create parallax effect
 */
export function createParallaxEffect(
  target: string | Element,
  speed: number = motionTokens.parallax.moderate,
  options: ScrollTrigger.Vars = {}
) {
  if (typeof window === 'undefined') return null;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return null;
  }

  return gsap.fromTo(target,
    {
      yPercent: -50 * speed,
    },
    {
      yPercent: 50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: target,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        ...options,
      },
    }
  );
}

/**
 * Create scroll progress animation
 */
export function createScrollProgress(
  target: string | Element,
  options: ScrollTrigger.Vars = {}
) {
  if (typeof window === 'undefined') return null;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    gsap.set(target, { scaleX: 1 });
    return null;
  }

  return gsap.fromTo(target,
    {
      scaleX: 0,
      transformOrigin: 'left center',
    },
    {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        ...options,
      },
    }
  );
}

/**
 * Create magnetic cursor effect
 */
export function createMagneticEffect(
  target: string | Element,
  strength: number = motionTokens.magnetic.strength
) {
  if (typeof window === 'undefined') return null;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return null;
  }

  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return null;

  const handleMouseMove = (e: Event) => {
    const mouseEvent = e as MouseEvent;
    const rect = element.getBoundingClientRect();
    const x = mouseEvent.clientX - rect.left - rect.width / 2;
    const y = mouseEvent.clientY - rect.top - rect.height / 2;

    gsap.to(element, {
      x: x * strength,
      y: y * strength,
      duration: motionTokens.magnetic.duration,
      ease: motionTokens.magnetic.ease,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: motionTokens.magnetic.duration,
      ease: motionTokens.magnetic.ease,
    });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
}

/**
 * Batch ScrollTrigger refresh for performance
 */
export function batchRefreshScrollTrigger() {
  if (typeof window === 'undefined') return;

  ScrollTrigger.batch('[data-animate]', {
    onEnter: (elements) => {
      gsap.fromTo(elements, 
        {
          opacity: 0,
          y: motionTokens.reveal.distance,
        },
        {
          opacity: 1,
          y: 0,
          duration: motionTokens.durations.slow / 1000,
          ease: motionTokens.gsapEasings.entrance,
          stagger: motionTokens.reveal.stagger,
        }
      );
    },
    onLeave: (elements) => {
      gsap.to(elements, {
        opacity: 0,
        y: -motionTokens.reveal.distance,
        duration: motionTokens.durations.normal / 1000,
        ease: motionTokens.gsapEasings.exit,
        stagger: motionTokens.reveal.stagger,
      });
    },
    onEnterBack: (elements) => {
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: motionTokens.durations.slow / 1000,
        ease: motionTokens.gsapEasings.entrance,
        stagger: motionTokens.reveal.stagger,
      });
    },
  });
}

/**
 * Kill all ScrollTrigger instances
 */
export function killAllScrollTriggers() {
  if (typeof window !== 'undefined') {
    ScrollTrigger.killAll();
  }
}

/**
 * Refresh all ScrollTrigger instances
 */
export function refreshScrollTrigger() {
  if (typeof window !== 'undefined') {
    ScrollTrigger.refresh();
  }
}

/**
 * Create horizontal scroll section
 */
export function createHorizontalScroll(
  container: string | Element,
  items: string | Element[]
) {
  if (typeof window === 'undefined') return null;

  const sections = gsap.utils.toArray(items);
  
  return gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      snap: 1 / (sections.length - 1),
      end: () => '+=' + (typeof container === 'string' 
        ? (document.querySelector(container) as HTMLElement)?.offsetWidth || 0
        : (container as HTMLElement).offsetWidth || 0)
    }
  });
}

/**
 * Parallax helper with data-speed attribute
 */
export function parallax(selector = '[data-speed]') {
  if (typeof window === 'undefined') return;

  gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
    const speed = parseFloat(el.dataset.speed || '0.2');
    const y = -50 * speed;
    
    gsap.to(el, {
      yPercent: y,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

/**
 * Magnetic sections that snap to viewport
 */
export function magneticSections(selector = '.magnetic-section') {
  if (typeof window === 'undefined') return;

  gsap.utils.toArray<HTMLElement>(selector).forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => {
        gsap.to(window, {
          scrollTo: section,
          duration: DURATIONS.md,
          ease: EASING.standard
        });
      }
    });
  });
}

/**
 * Velocity bus for scroll-based animations
 */
export const velocityBus = {
  velocity: 0,
  listeners: new Set<(velocity: number) => void>(),
  
  subscribe(callback: (velocity: number) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  },
  
  update(velocity: number) {
    this.velocity = velocity;
    this.listeners.forEach(callback => callback(velocity));
  }
};

/**
 * Utility to check if animations should be enabled
 */
export function shouldAnimate(): boolean {
  if (typeof window === 'undefined') return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Setup reduced motion listener for GSAP animations
 */
export function setupGSAPReducedMotionListener() {
  if (typeof window === 'undefined') return;

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    if (e.matches) {
      // Kill all animations and set final states
      gsap.globalTimeline.clear();
      killAllScrollTriggers();
    } else {
      // Re-enable animations
      refreshScrollTrigger();
    }
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
  } else {
    mediaQuery.addListener(handleChange);
  }

  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.removeListener(handleChange);
    }
  };
}