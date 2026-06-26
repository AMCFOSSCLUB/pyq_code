'use client';

import { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
}

export function VisualEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Mouse Coordinate Tracking & Snapping Cursor & Magnetic Pull
  useEffect(() => {
    // Check if device supports touch
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const cursor = cursorRef.current;
    if (isTouch && cursor) {
      cursor.style.display = 'none';
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let snapEl: HTMLElement | null = null;
    let magneticEl: HTMLElement | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Track snapping & magnetic pull to interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest('a, button, input, select, textarea, .btn, .badge, .glass-card, [data-cursor-hover]');

      if (interactive && cursor) {
        // Designate magnetic element (within 25px threshold)
        const isMagnetic = interactive.closest('a, button, .btn, .badge, [data-cursor-hover]');
        if (isMagnetic) {
          magneticEl = isMagnetic as HTMLElement;
        }

        if (interactive.classList.contains('glass-card')) {
          snapEl = null;
          cursor.classList.add('cursor-card-hover');
          cursor.classList.remove('cursor-magnetic');
          cursor.style.width = '56px';
          cursor.style.height = '56px';
          cursor.style.borderRadius = '50%';
          cursor.style.backgroundColor = 'rgba(14, 147, 0, 0.06)';
          cursor.style.borderColor = 'rgba(14, 147, 0, 0.6)';
        } else {
          snapEl = interactive as HTMLElement;
          cursor.classList.add('cursor-magnetic');
          cursor.classList.remove('cursor-card-hover');
          const rect = interactive.getBoundingClientRect();
          const style = window.getComputedStyle(interactive);
          cursor.style.width = `${rect.width + 12}px`;
          cursor.style.height = `${rect.height + 12}px`;
          cursor.style.borderRadius = style.borderRadius || '8px';
          cursor.style.backgroundColor = 'rgba(14, 147, 0, 0.05)';
          cursor.style.borderColor = 'rgba(14, 147, 0, 0.9)';
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest('a, button, input, select, textarea, .btn, .badge, .glass-card, [data-cursor-hover]');

      if (interactive && cursor) {
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!relatedTarget || !relatedTarget.closest('a, button, input, select, textarea, .btn, .badge, .glass-card, [data-cursor-hover]')) {
          snapEl = null;
          cursor.classList.remove('cursor-magnetic', 'cursor-card-hover');
          cursor.style.width = '24px';
          cursor.style.height = '24px';
          cursor.style.borderRadius = '50%';
          cursor.style.backgroundColor = 'rgba(14, 147, 0, 0.04)';
          cursor.style.borderColor = 'var(--green-neon)';
        }
      }

      // Reset magnetic offset
      if (magneticEl) {
        const relativeTarget = e.relatedTarget as HTMLElement;
        if (!relativeTarget || !relativeTarget.closest('a, button, .btn, .badge, [data-cursor-hover]')) {
          magneticEl.style.transform = 'translate3d(0px, 0px, 0px)';
          magneticEl.style.transition = 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)';
          magneticEl = null;
        }
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    // Perform smooth damping & parallax grid rotation at 60fps
    let animId = 0;
    const updateLoop = () => {
      // 1. Move Custom Snapping Cursor
      if (cursor) {
        let targetX = mouseX;
        let targetY = mouseY;

        if (snapEl) {
          const rect = snapEl.getBoundingClientRect();
          targetX = rect.left + rect.width / 2;
          targetY = rect.top + rect.height / 2;
        }

        ringX += (targetX - ringX) * 0.16;
        ringY += (targetY - ringY) * 0.16;

        cursor.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate3d(-50%, -50%, 0)`;
      }

      // 2. Perform Parallax Tilt on the Quantum Grid along a 3D Z-axis
      const grid = gridRef.current;
      if (grid) {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const rx = (dy / cy) * 6; // max 6 degrees tilt
        const ry = -(dx / cx) * 6; // max 6 degrees tilt
        grid.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      }

      // 3. Apply Magnetic Pull (Warp element subtly and scale 1.02x within 25px threshold)
      if (magneticEl) {
        const rect = magneticEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 70) {
          const pullX = dx * 0.26;
          const pullY = dy * 0.26;
          magneticEl.style.transform = `translate3d(${pullX}px, ${pullY}px, 0) scale(1.02)`;
          magneticEl.style.transition = 'none';
        } else {
          magneticEl.style.transform = 'translate3d(0px, 0px, 0px)';
          magneticEl.style.transition = 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)';
        }
      }

      animId = requestAnimationFrame(updateLoop);
    };
    updateLoop();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animId);
    };
  }, []);

  // HTML5 Canvas Neural Node Background with Shockwave ripples
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let ripples: Ripple[] = [];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseAlpha: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 0.5;
        this.baseAlpha = Math.random() * 0.3 + 0.1; // Brighter nodes
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = `rgba(14, 147, 0, ${this.baseAlpha})`;
        c.fill();
      }
    }

    class DustParticle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      twinkleOffset: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.06;
        this.vy = (Math.random() - 0.5) * 0.06;
        this.alpha = Math.random() * 0.25 + 0.08;
        this.twinkleOffset = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw(c: CanvasRenderingContext2D) {
        const twinkle = Math.sin(Date.now() * 0.0018 + this.twinkleOffset) * 0.35 + 0.65;
        c.fillStyle = `rgba(14, 147, 0, ${this.alpha * twinkle})`;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
      }
    }

    let particles: Particle[] = [];
    let dust: DustParticle[] = [];
    const initParticles = () => {
      const count = window.innerWidth < 768 ? 40 : 120;
      const dustCount = window.innerWidth < 768 ? 40 : 100;
      particles = [];
      dust = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
      for (let i = 0; i < dustCount; i++) {
        dust.push(new DustParticle());
      }
    };

    initParticles();

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    // Listen for shockwave click triggers
    const handleMouseDown = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 280,
        speed: 7,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    let animId = 0;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw soft glowing center-screen green nebula
      const centerGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height) * 0.7);
      centerGrad.addColorStop(0, 'rgba(14, 147, 0, 0.045)');
      centerGrad.addColorStop(0.5, 'rgba(14, 147, 0, 0.015)');
      centerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = centerGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw mouse-following soft green aura (space ambient connection)
      if (mouseX !== -1000 && mouseY !== -1000) {
        const mouseGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 280);
        mouseGrad.addColorStop(0, 'rgba(14, 147, 0, 0.045)');
        mouseGrad.addColorStop(0.5, 'rgba(14, 147, 0, 0.01)');
        mouseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = mouseGrad;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 280, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Draw slowly drifting space dust particles
      for (let i = 0; i < dust.length; i++) {
        dust[i].update();
        dust[i].draw(ctx);
      }

      // Render ripples
      ctx.lineWidth = 1.5;
      ripples = ripples.filter((r) => {
        r.radius += r.speed;

        const progress = r.radius / r.maxRadius;
        const opacity = 1 - progress;
        if (opacity > 0) {
          ctx.strokeStyle = `rgba(30, 219, 6, ${opacity * 0.25})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(30, 219, 6, 0.4)';
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0; // reset shadow
        }

        return r.radius < r.maxRadius;
      });

      // Connections line properties
      const connectionDist = 130;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw(ctx);

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            let opacity = (1 - dist / connectionDist) * 0.02; // Duller base subtle connections

            // Highlight connections near the mouse to create dynamic constellation
            let mouseDist1 = 1000;
            let mouseDist2 = 1000;
            if (mouseX !== -1000 && mouseY !== -1000) {
              mouseDist1 = Math.sqrt(Math.pow(mouseX - p1.x, 2) + Math.pow(mouseY - p1.y, 2));
              mouseDist2 = Math.sqrt(Math.pow(mouseX - p2.x, 2) + Math.pow(mouseY - p2.y, 2));
            }
            const minMouseDist = Math.min(mouseDist1, mouseDist2);

            let hoverForce = 0;
            if (minMouseDist < 250) {
              hoverForce = (1 - minMouseDist / 250);
              opacity += hoverForce * 0.12; // Duller when cursor is near
            }

            if (opacity > 0) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(30, 219, 6, ${opacity})`;
              ctx.lineWidth = hoverForce > 0 ? 0.6 : 0.3;
              ctx.stroke();
            }
          }
        }

        // Connect to mouse cursor directly
        if (mouseX !== -1000 && mouseY !== -1000) {
          const mdx = p1.x - mouseX;
          const mdy = p1.y - mouseY;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 180) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `rgba(30, 219, 6, ${(1 - mdist / 180) * 0.1})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Cryptographic Scramble Text Effect exclusively on Mount (Initial Load)
  useEffect(() => {
    const chars = '!@#$%^&*()_+~|{}[]:;?><,./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function scrambleTextNode(node: Text, originalText: string, delay: number) {
      let frame = 0;
      const queue: Array<{ to: string; start: number; end: number; char?: string }> = [];

      for (let i = 0; i < originalText.length; i++) {
        const to = originalText[i];
        if (to === ' ' || to === '\n') {
          queue.push({ to, start: 0, end: 0 });
          continue;
        }
        const start = Math.floor(Math.random() * 6);
        const end = start + Math.floor(Math.random() * 8) + 4;
        queue.push({ to, start, end });
      }

      let timer: NodeJS.Timeout;
      function update() {
        let output = '';
        let complete = 0;

        for (let i = 0; i < queue.length; i++) {
          const { to, start, end } = queue[i];
          if (to === ' ' || to === '\n') {
            output += to;
            complete++;
          } else if (frame >= end) {
            complete++;
            output += to;
          } else if (frame >= start) {
            if (!queue[i].char || Math.random() < 0.28) {
              queue[i].char = chars[Math.floor(Math.random() * chars.length)];
            }
            output += queue[i].char;
          } else {
            output += ' ';
          }
        }

        node.nodeValue = output;

        if (complete < queue.length) {
          frame++;
          timer = setTimeout(update, 18);
        } else {
          node.nodeValue = originalText;
        }
      }

      timer = setTimeout(update, delay);
      return () => clearTimeout(timer);
    }

    const scrambleElement = (el: HTMLElement) => {
      const textNodes: Array<{ node: Text; text: string }> = [];
      const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      let node: Node | null;
      while (node = walk.nextNode()) {
        textNodes.push({ node: node as Text, text: node.nodeValue || '' });
      }

      const cleanups = textNodes.map(({ node, text }, idx) => {
        return scrambleTextNode(node, text, idx * 30 + 20);
      });

      return () => {
        cleanups.forEach(c => c());
      };
    };

    // Scramble items with class .scramble-text or attribute data-scramble exclusively on mount
    const elements = document.querySelectorAll('.scramble-text, [data-scramble]');
    const cleanups = Array.from(elements).map(el => scrambleElement(el as HTMLElement));

    return () => {
      cleanups.forEach(c => c());
    };
  }, []);

  return (
    <>
      {/* Layer 1: The Quantum Grid (Subtle Artsy) */}
      <div
        ref={gridRef}
        className="quantum-grid"
        style={{
          position: 'fixed',
          inset: '-8%',
          width: '116vw',
          height: '116vh',
          zIndex: -2,
          pointerEvents: 'none',
          backgroundSize: '45px 45px',
          backgroundImage: `
            linear-gradient(to right, rgba(14, 147, 0, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(14, 147, 0, 0.03) 1px, transparent 1px)
          `,
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)',
          willChange: 'transform',
          transition: 'transform 0.4s cubic-bezier(0.1, 0.75, 0.25, 1)',
        }}
      />





      {/* Layer 2: Neural Nodes Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />

      {/* Custom snuggled snapping cursor */}
      <div
        ref={cursorRef}
        className="custom-cursor-ring"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 24,
          height: 24,
          border: '1.5px solid var(--green-neon)',
          background: 'rgba(14, 147, 0, 0.04)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate3d(-100px, -100px, 0) translate3d(-50%, -50%, 0)',
          willChange: 'transform, width, height, border-radius, background-color, border-color',
          transition: 'width 0.2s cubic-bezier(0.25, 1, 0.5, 1), height 0.2s cubic-bezier(0.25, 1, 0.5, 1), border-radius 0.2s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.2s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      />
    </>
  );
}
