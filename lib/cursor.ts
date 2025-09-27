/**
 * Advanced Particle Cursor System
 * 
 * A sophisticated cursor replacement with particle trails, magnetic interactions,
 * and optional WebGL fluid effects. Supports graceful degradation and accessibility.
 */

import * as PIXI from 'pixi.js';

// Types
export interface CursorOptions {
  mode: 'particles' | 'fluid' | 'hybrid';
  baseSize: number;
  haloSize: number;
  particleCount: number;
  trailBlend: 'additive' | 'normal';
  spring: {
    stiffness: number;
    damping: number;
  };
  colors: {
    base: string;
    halo: string;
    particle: string[];
  };
  magnetic: {
    enabled: boolean;
    radius: number;
    strength: number;
  };
  reducedMotion: boolean;
  themeAware?: boolean; // New option for theme-aware colors
}

export interface CursorEvents {
  onBurst?: (x: number, y: number) => void;
  onHoverEnter?: (element: Element) => void;
  onHoverLeave?: (element: Element) => void;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: number;
  alpha: number;
}

// Default configuration
const DEFAULT_OPTIONS: CursorOptions = {
  mode: 'particles',
  baseSize: 10,
  haloSize: 28,
  particleCount: 120,
  trailBlend: 'additive',
  spring: {
    stiffness: 0.22,
    damping: 0.82,
  },
  colors: {
    base: '#3b82f6',
    halo: '#8b5cf6',
    particle: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'],
  },
  magnetic: {
    enabled: true,
    radius: 60,
    strength: 0.12,
  },
  reducedMotion: false,
};

class ParticleCursor {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private pixiApp: PIXI.Application | null = null;
  private options: CursorOptions;
  private events: CursorEvents;
  
  // Animation state
  private animationId: number = 0;
  private isRunning = false;
  private lastTime = 0;
  
  // Cursor position and physics
  private cursorPos = { x: 0, y: 0 };
  private targetPos = { x: 0, y: 0 };
  private velocity = { x: 0, y: 0 };
  
  // Particle system
  private particles: Particle[] = [];
  private trailCanvas!: HTMLCanvasElement;
  private trailCtx!: CanvasRenderingContext2D;
  
  // Magnetic interactions
  private hoveredElement: Element | null = null;
  private magneticOffset = { x: 0, y: 0 };
  
  // Performance monitoring
  private frameTimes: number[] = [];
  private adaptiveParticleCount: number;
  
  // Interaction states
  private isPressed = false;
  private isMoving = false;
  private moveTimeout: number = 0;

  constructor(options: Partial<CursorOptions> = {}, events: CursorEvents = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.events = events;
    this.adaptiveParticleCount = this.options.particleCount;
    
    // Check for reduced motion preference
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.options.reducedMotion = this.options.reducedMotion || prefersReducedMotion;
    }
    
    this.initCanvas();
    this.initTrailCanvas();
    this.setupEventListeners();
    this.initParticles();
    
    if (this.options.mode === 'fluid' || this.options.mode === 'hybrid') {
      this.initWebGL();
    }
  }

  private initCanvas(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    this.canvas.style.mixBlendMode = this.options.trailBlend === 'additive' ? 'screen' : 'normal';
    
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.scale(dpr, dpr);
    
    document.body.appendChild(this.canvas);
  }

  private initTrailCanvas(): void {
    this.trailCanvas = document.createElement('canvas');
    this.trailCanvas.width = 1024;
    this.trailCanvas.height = 1024;
    this.trailCtx = this.trailCanvas.getContext('2d')!;
  }

  private async initWebGL(): Promise<void> {
    try {
      // Initialize PIXI.js for WebGL fluid effects
      this.pixiApp = new PIXI.Application();
      await this.pixiApp.init({
        width: this.canvas.width,
        height: this.canvas.height,
        backgroundAlpha: 0,
        antialias: true,
      });
      
      // Add PIXI canvas to the DOM
      this.pixiApp.canvas.style.position = 'absolute';
      this.pixiApp.canvas.style.top = '0';
      this.pixiApp.canvas.style.left = '0';
      this.pixiApp.canvas.style.pointerEvents = 'none';
      this.pixiApp.canvas.style.zIndex = '9998';
      this.canvas.parentNode?.insertBefore(this.pixiApp.canvas, this.canvas);
      
      this.setupFluidEffect();
    } catch (error) {
      console.warn('WebGL not available, falling back to Canvas 2D:', error);
      this.options.mode = 'particles';
    }
  }

  private setupFluidEffect(): void {
    if (!this.pixiApp) return;
    
    // Create fluid effect using shaders and ping-pong framebuffers
    // This is a placeholder for the full fluid simulation
    // In a full implementation, you would create proper shaders and filters
    console.log('WebGL fluid effect initialized');
  }

  private setupEventListeners(): void {
    // Mouse movement
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    
    // Window resize
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Magnetic hover detection
    if (this.options.magnetic.enabled) {
      document.addEventListener('mouseover', this.handleMouseOver.bind(this));
      document.addEventListener('mouseout', this.handleMouseOut.bind(this));
    }
    
    // Reduced motion changes
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener('change', this.handleReducedMotionChange.bind(this));
    }
  }

  private handleMouseMove(event: MouseEvent): void {
    this.targetPos.x = event.clientX;
    this.targetPos.y = event.clientY;
    this.isMoving = true;
    
    // Clear move timeout
    clearTimeout(this.moveTimeout);
    this.moveTimeout = window.setTimeout(() => {
      this.isMoving = false;
    }, 100);
    
    // Add movement particles
    if (!this.options.reducedMotion) {
      this.addMovementParticles(event.clientX, event.clientY);
    }
  }

  private handleMouseDown(event: MouseEvent): void {
    this.isPressed = true;
    
    if (!this.options.reducedMotion) {
      this.addBurstParticles(event.clientX, event.clientY);
      this.events.onBurst?.(event.clientX, event.clientY);
    }
  }

  private handleMouseUp(): void {
    this.isPressed = false;
  }

  private handleMouseOver(event: MouseEvent): void {
    const target = event.target as Element;
    const interactive = target.closest('[data-interactive], a, button, [role="button"]');
    
    if (interactive && interactive !== this.hoveredElement) {
      this.hoveredElement = interactive;
      this.events.onHoverEnter?.(interactive);
    }
  }

  private handleMouseOut(event: MouseEvent): void {
    const target = event.target as Element;
    const interactive = target.closest('[data-interactive], a, button, [role="button"]');
    
    if (interactive === this.hoveredElement && interactive) {
      this.hoveredElement = null;
      this.events.onHoverLeave?.(interactive);
    }
  }

  private handleResize(): void {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.ctx.scale(dpr, dpr);
    
    if (this.pixiApp) {
      this.pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
    }
  }

  private handleReducedMotionChange(event: MediaQueryListEvent): void {
    this.options.reducedMotion = event.matches;
    
    if (event.matches) {
      this.stop();
      this.renderSimpleCursor();
    } else {
      this.start();
    }
  }

  private initParticles(): void {
    this.particles = [];
    for (let i = 0; i < this.adaptiveParticleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }

  private createParticle(): Particle {
    const colors = this.options.colors.particle.map(c => this.hexToRgb(c));
    const color = colors[Math.floor(Math.random() * colors.length)] || { r: 59, g: 130, b: 246 };
    
    return {
      x: this.cursorPos.x,
      y: this.cursorPos.y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: Math.random() * 0.5,
      maxLife: 0.4 + Math.random() * 0.5,
      size: 1 + Math.random() * 2,
      color: this.rgbToNumber(color),
      alpha: 1,
    };
  }

  private addMovementParticles(x: number, y: number): void {
    const count = this.isMoving ? 3 : 1;
    
    for (let i = 0; i < count; i++) {
      const particle = this.createParticle();
      particle.x = x + (Math.random() - 0.5) * 10;
      particle.y = y + (Math.random() - 0.5) * 10;
      particle.vx = (Math.random() - 0.5) * 1.5;
      particle.vy = (Math.random() - 0.5) * 1.5;
      particle.life = 0;
      
      this.particles.push(particle);
    }
    
    // Keep particle count manageable
    if (this.particles.length > this.adaptiveParticleCount * 2) {
      this.particles = this.particles.slice(-this.adaptiveParticleCount);
    }
  }

  private addBurstParticles(x: number, y: number): void {
    for (let i = 0; i < 20; i++) {
      const particle = this.createParticle();
      particle.x = x;
      particle.y = y;
      const angle = (Math.PI * 2 * i) / 20;
      const speed = 1 + Math.random() * 2;
      particle.vx = Math.cos(angle) * speed;
      particle.vy = Math.sin(angle) * speed;
      particle.life = 0;
      
      this.particles.push(particle);
    }
  }

  private updatePhysics(deltaTime: number): void {
    // Update cursor position with spring physics
    const dx = this.targetPos.x - this.cursorPos.x;
    const dy = this.targetPos.y - this.cursorPos.y;
    
    // Apply magnetic attraction
    if (this.hoveredElement && this.options.magnetic.enabled) {
      const rect = this.hoveredElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.options.magnetic.radius) {
        const attraction = (this.options.magnetic.radius - distance) / this.options.magnetic.radius;
        this.magneticOffset.x = (centerX - this.targetPos.x) * attraction * this.options.magnetic.strength;
        this.magneticOffset.y = (centerY - this.targetPos.y) * attraction * this.options.magnetic.strength;
      } else {
        this.magneticOffset.x = 0;
        this.magneticOffset.y = 0;
      }
    }
    
    // Spring physics
    const springForceX = (dx + this.magneticOffset.x) * this.options.spring.stiffness;
    const springForceY = (dy + this.magneticOffset.y) * this.options.spring.stiffness;
    
    this.velocity.x += springForceX;
    this.velocity.y += springForceY;
    
    this.velocity.x *= this.options.spring.damping;
    this.velocity.y *= this.options.spring.damping;
    
    this.cursorPos.x += this.velocity.x;
    this.cursorPos.y += this.velocity.y;
    
    // Update particles
    this.updateParticles(deltaTime);
  }

  private updateParticles(deltaTime: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      if (!particle) continue;
      
      // Update physics
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.9; // Drag
      particle.vy *= 0.9;
      
      // Update life
      particle.life += deltaTime / 1000;
      particle.alpha = 1 - (particle.life / particle.maxLife);
      
      // Remove dead particles
      if (particle.life >= particle.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  private render(): void {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    // Performance monitoring
    this.frameTimes.push(deltaTime);
    if (this.frameTimes.length > 60) {
      this.frameTimes.shift();
    }
    
    const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    
    // Adaptive quality
    if (avgFrameTime > 3 && this.adaptiveParticleCount > 60) {
      this.adaptiveParticleCount = Math.max(60, this.adaptiveParticleCount * 0.75);
    } else if (avgFrameTime < 1.5 && this.adaptiveParticleCount < this.options.particleCount) {
      this.adaptiveParticleCount = Math.min(this.options.particleCount, this.adaptiveParticleCount * 1.25);
    }
    
    this.updatePhysics(deltaTime);
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.options.reducedMotion) {
      this.renderSimpleCursor();
      return;
    }
    
    // Render trail
    this.renderTrail();
    
    // Render particles
    this.renderParticles();
    
    // Render cursor
    this.renderCursor();
    
    // Render WebGL effects
    if (this.pixiApp && (this.options.mode === 'fluid' || this.options.mode === 'hybrid')) {
      this.renderFluidEffect();
    }
  }

  private renderSimpleCursor(): void {
    const scale = this.hoveredElement ? 1.4 : 1;
    
    this.ctx.save();
    this.ctx.globalAlpha = 0.8;
    
    // Halo
    this.ctx.fillStyle = this.options.colors.halo;
    this.ctx.beginPath();
    this.ctx.arc(
      this.cursorPos.x,
      this.cursorPos.y,
      this.options.haloSize * scale / 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    
    // Base cursor
    this.ctx.fillStyle = this.options.colors.base;
    this.ctx.beginPath();
    this.ctx.arc(
      this.cursorPos.x,
      this.cursorPos.y,
      this.options.baseSize * scale / 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    
    this.ctx.restore();
  }

  private renderTrail(): void {
    // Fade trail
    this.trailCtx.globalAlpha = 0.95;
    this.trailCtx.globalCompositeOperation = 'source-over';
    this.trailCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.trailCtx.fillRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);
    
    // Draw current cursor position
    this.trailCtx.globalAlpha = 1;
    this.trailCtx.fillStyle = this.options.colors.base;
    this.trailCtx.beginPath();
    this.trailCtx.arc(
      this.cursorPos.x * 2,
      this.cursorPos.y * 2,
      2,
      0,
      Math.PI * 2
    );
    this.trailCtx.fill();
    
    // Composite trail onto main canvas
    this.ctx.globalAlpha = 0.3;
    this.ctx.drawImage(this.trailCanvas, 0, 0);
    this.ctx.globalAlpha = 1;
  }

  private renderParticles(): void {
    this.ctx.save();
    
    for (const particle of this.particles) {
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fillStyle = this.numberToRgba(particle.color, particle.alpha);
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  private renderCursor(): void {
    const scale = this.hoveredElement ? 1.4 : (this.isPressed ? 0.9 : 1);
    
    this.ctx.save();
    
    // Halo
    this.ctx.globalAlpha = 0.3;
    this.ctx.fillStyle = this.options.colors.halo;
    this.ctx.beginPath();
    this.ctx.arc(
      this.cursorPos.x,
      this.cursorPos.y,
      this.options.haloSize * scale / 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    
    // Base cursor
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = this.options.colors.base;
    this.ctx.beginPath();
    this.ctx.arc(
      this.cursorPos.x,
      this.cursorPos.y,
      this.options.baseSize * scale / 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    
    // Press ring
    if (this.isPressed) {
      this.ctx.strokeStyle = this.options.colors.base;
      this.ctx.lineWidth = 2;
      this.ctx.globalAlpha = 0.5;
      this.ctx.beginPath();
      this.ctx.arc(
        this.cursorPos.x,
        this.cursorPos.y,
        this.options.baseSize * 1.5,
        0,
        Math.PI * 2
      );
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }

  private renderFluidEffect(): void {
    // WebGL fluid rendering would go here
    // This is a placeholder for the full fluid simulation
    if (this.pixiApp) {
      this.pixiApp.render();
    }
  }

  public start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    
    if (this.options.reducedMotion) {
      this.renderSimpleCursor();
      return;
    }
    
    const animate = () => {
      if (!this.isRunning) return;
      
      this.render();
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  public updateColors(colors: { base: string; halo: string; particle: string[] }): void {
    this.options.colors = { ...this.options.colors, ...colors };
  }

  public destroy(): void {
    this.stop();
    
    // Remove event listeners
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('resize', this.handleResize);
    
    if (this.options.magnetic.enabled) {
      document.removeEventListener('mouseover', this.handleMouseOver);
      document.removeEventListener('mouseout', this.handleMouseOut);
    }
    
    // Remove canvas elements
    this.canvas.remove();
    this.trailCanvas.remove();
    
    // Destroy WebGL context
    if (this.pixiApp) {
      this.pixiApp.destroy(true);
    }
  }

  // Utility functions
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1]!, 16),
      g: parseInt(result[2]!, 16),
      b: parseInt(result[3]!, 16)
    } : { r: 0, g: 0, b: 0 };
  }

  private rgbToNumber(rgb: { r: number; g: number; b: number }): number {
    return (rgb.r << 16) | (rgb.g << 8) | rgb.b;
  }

  private numberToRgba(color: number, alpha: number): string {
    const r = (color >> 16) & 255;
    const g = (color >> 8) & 255;
    const b = color & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

/**
 * Initialize the particle cursor system
 * 
 * @param options - Configuration options for the cursor
 * @param events - Event callbacks for interactions
 * @returns Destroy function to clean up the cursor
 */
// Theme-aware color detection
function getThemeAwareColors(): { base: string; halo: string; particle: string[] } {
  const isDark = document.documentElement.classList.contains('dark') || 
                 window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (isDark) {
    return {
      base: '#ffffff',
      halo: 'rgba(255, 255, 255, 0.3)',
      particle: ['#ffffff', '#e5e7eb', '#d1d5db', '#9ca3af']
    };
  } else {
    return {
      base: '#000000',
      halo: 'rgba(0, 0, 0, 0.2)',
      particle: ['#000000', '#374151', '#6b7280', '#9ca3af']
    };
  }
}

export function initCursor(
  options: Partial<CursorOptions> = {},
  events: CursorEvents = {}
): () => void {
  // Hide default cursor
  document.body.style.cursor = 'none';
  
  // Apply theme-aware colors if enabled
  if (options.themeAware) {
    const themeColors = getThemeAwareColors();
    options = {
      ...options,
      colors: {
        ...options.colors,
        ...themeColors
      }
    };
  }
  
  // Create cursor instance
  const cursor = new ParticleCursor(options, events);
  
  // Listen for theme changes if theme-aware
  let themeObserver: MutationObserver | null = null;
  if (options.themeAware) {
    themeObserver = new MutationObserver(() => {
      const newColors = getThemeAwareColors();
      cursor.updateColors(newColors);
    });
    
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
  
  // Start the cursor
  cursor.start();
  
  // Return destroy function
  return () => {
    cursor.destroy();
    themeObserver?.disconnect();
    document.body.style.cursor = '';
  };
}

// Export types and default options
export { DEFAULT_OPTIONS };
