'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export const NeonUfo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && pathname.startsWith('/activity')) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 200;
    let height = 200;
    
    // Support High DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let time = 0;
    let isHovering = false;
    let shockwaveRadius = 0;
    let shockwaveActive = false;
    let targetTilt = 0;
    let currentTilt = 0;
    
    const cx = width / 2;
    const cy = height / 2;
    const neonColor = '#00ffcc';

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const ufoCenterX = rect.left + rect.width / 2;
      
      const dx = e.clientX - ufoCenterX;
      targetTilt = (dx / window.innerWidth) * 0.8;

      if (e.clientX >= rect.left && e.clientX <= rect.right && 
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        isHovering = true;
      } else {
        isHovering = false;
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (isHovering && !shockwaveActive) {
        shockwaveActive = true;
        shockwaveRadius = 10;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += isHovering ? 0.12 : 0.04; 

      const bobY = Math.sin(time * 0.5) * 12;
      
      if (!isHovering) {
         targetTilt = Math.cos(time * 0.3) * 0.1;
      }
      currentTilt += (targetTilt - currentTilt) * 0.1;

      ctx.save();
      ctx.translate(cx, cy + bobY);
      ctx.rotate(currentTilt);

      // Tractor beam
      ctx.beginPath();
      ctx.moveTo(-18, 12);
      ctx.lineTo(-35, 90);
      ctx.quadraticCurveTo(0, 100, 35, 90);
      ctx.lineTo(18, 12);
      const beamGradient = ctx.createLinearGradient(0, 12, 0, 100);
      beamGradient.addColorStop(0, 'rgba(0, 255, 204, 0.4)');
      beamGradient.addColorStop(1, 'rgba(0, 255, 204, 0)');
      ctx.fillStyle = beamGradient;
      ctx.fill();

      // Base Dome
      ctx.shadowBlur = 15;
      ctx.shadowColor = neonColor;
      
      ctx.beginPath();
      ctx.ellipse(0, 0, 48, 16, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#0a0a0a';
      ctx.fill();
      
      ctx.lineWidth = 3;
      ctx.strokeStyle = neonColor;
      ctx.stroke();

      // Top Dome
      ctx.beginPath();
      ctx.ellipse(0, -6, 26, 22, 0, Math.PI, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 40, 30, 0.8)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = neonColor;
      ctx.stroke();

      // Pulsing Core
      const corePulse = (Math.sin(time * 2) + 1) / 2;
      ctx.beginPath();
      ctx.arc(0, -12, 6 + corePulse * 5, 0, Math.PI * 2);
      ctx.fillStyle = neonColor;
      ctx.shadowBlur = 20 + corePulse * 25;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, -12, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      // Wings/fins
      ctx.shadowBlur = 5;
      ctx.fillStyle = neonColor;
      ctx.beginPath();
      ctx.ellipse(-52, 0, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(52, 0, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rim lights
      for (let i = -3; i <= 3; i++) {
        const lx = i * 14;
        const ly = (Math.abs(i) * 1.5) + 3;
        ctx.beginPath();
        ctx.arc(lx, ly, 2.5, 0, Math.PI * 2);
        
        const lightPhase = (time * 2 + i * 0.8) % (Math.PI * 2);
        const isOn = Math.sin(lightPhase) > 0.5 || isHovering;
        
        ctx.fillStyle = isOn ? '#fff' : '#004433';
        ctx.shadowBlur = isOn ? 12 : 0;
        ctx.shadowColor = neonColor;
        ctx.fill();
      }

      ctx.restore();

      // Shockwave EMP
      if (shockwaveActive) {
        ctx.save();
        ctx.translate(cx, cy + bobY);
        
        ctx.beginPath();
        ctx.arc(0, 0, shockwaveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 204, ${1 - shockwaveRadius / 200})`;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 20;
        ctx.shadowColor = neonColor;
        ctx.stroke();

        if (shockwaveRadius > 20) {
          ctx.beginPath();
          ctx.arc(0, 0, shockwaveRadius - 20, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 255, 204, ${1 - (shockwaveRadius - 20) / 200})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        for(let i=0; i<8; i++) {
           const angle = (Math.PI * 2 / 8) * i + (shockwaveRadius * 0.02);
           const dist = shockwaveRadius * 1.2;
           ctx.beginPath();
           ctx.arc(Math.cos(angle)*dist, Math.sin(angle)*dist, 2, 0, Math.PI*2);
           ctx.fillStyle = `rgba(255, 255, 255, ${1 - shockwaveRadius / 200})`;
           ctx.fill();
        }
        
        ctx.restore();

        shockwaveRadius += 8;
        if (shockwaveRadius > 200) {
          shockwaveActive = false;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [pathname]);

  if (pathname && pathname.startsWith('/activity')) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '200px',
        height: '200px',
        zIndex: 9999,
        pointerEvents: 'auto',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', cursor: 'crosshair' }} />
    </div>
  );
};
