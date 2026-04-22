'use client';

import React, { useEffect, useRef } from 'react';

export default function GalacticDynamics() {
  const coreRef = useRef(null);
  const glowRef = useRef(null);
  const ringOuterRef = useRef(null);
  const ringInnerRef = useRef(null);
  const trailContainerRef = useRef(null);
  const requestRef = useRef(null);

  const state = useRef({
    mouse: { x: 0, y: 0 },
    core: { x: 0, y: 0 },
    glow: { x: 0, y: 0 },
    ringOuter: { x: 0, y: 0 },
    ringInner: { x: 0, y: 0 },
    lastParticlePos: { x: 0, y: 0 },
    isHovering: false,
    isClicking: false,
    hue: 190,
  });

  useEffect(() => {
    // Inject Iconify
    if (!document.querySelector('script[src*="iconify-icon"]')) {
      const script = document.createElement('script');
      script.src = 'https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Set initial position to center
    state.current.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    state.current.core = { ...state.current.mouse };
    state.current.glow = { ...state.current.mouse };
    state.current.ringOuter = { ...state.current.mouse };
    state.current.ringInner = { ...state.current.mouse };
    state.current.lastParticlePos = { ...state.current.mouse };

    const spawnParticle = (x, y, hue) => {
      if (!trailContainerRef.current) return;
      const p = document.createElement('div');
      p.className = 'trail-particle';
      
      const offsetX = (Math.random() - 0.5) * 10;
      const offsetY = (Math.random() - 0.5) * 10;
      
      p.style.left = `${x + offsetX}px`;
      p.style.top = `${y + offsetY}px`;
      
      const size = Math.random() * 4 + 2;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      
      const particleHue = (hue + (Math.random() * 40 - 20)) % 360;
      p.style.backgroundColor = `hsl(${particleHue}, 100%, 75%)`;
      p.style.boxShadow = `0 0 ${size * 2}px hsl(${particleHue}, 100%, 70%)`;
      
      trailContainerRef.current.appendChild(p);
      setTimeout(() => { if (p.parentNode) p.remove(); }, 800);
    };

    const spawnRipple = (x, y, hue) => {
      if (!trailContainerRef.current) return;
      const r = document.createElement('div');
      r.className = 'click-ripple';
      r.style.left = `${x}px`;
      r.style.top = `${y}px`;
      
      const clickHue = state.current.isHovering ? (hue + 180) % 360 : hue;
      r.style.borderColor = `hsl(${clickHue}, 100%, 65%)`;
      r.style.boxShadow = `0 0 20px hsl(${clickHue}, 100%, 65%) inset, 0 0 20px hsl(${clickHue}, 100%, 65%)`;
      
      trailContainerRef.current.appendChild(r);
      setTimeout(() => { if (r.parentNode) r.remove(); }, 500);
    };

    const handleMouseMove = (e) => {
      const s = state.current;
      const dx = e.clientX - s.mouse.x;
      const dy = e.clientY - s.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      s.mouse.x = e.clientX;
      s.mouse.y = e.clientY;
      s.hue = (s.hue + dist * 0.1) % 360;

      const pdx = e.clientX - s.lastParticlePos.x;
      const pdy = e.clientY - s.lastParticlePos.y;
      if (Math.sqrt(pdx * pdx + pdy * pdy) > 12) {
        spawnParticle(e.clientX, e.clientY, s.hue);
        s.lastParticlePos.x = e.clientX;
        s.lastParticlePos.y = e.clientY;
      }
    };

    const handleMouseDown = () => {
      state.current.isClicking = true;
      spawnRipple(state.current.core.x, state.current.core.y, state.current.hue);
    };
    
    const handleMouseUp = () => {
      state.current.isClicking = false;
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, input, label, .interactive')) {
        state.current.isHovering = true;
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest('a, button, input, label, .interactive')) {
        state.current.isHovering = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const render = () => {
      const s = state.current;

      s.core.x = lerp(s.core.x, s.mouse.x, 0.35);
      s.core.y = lerp(s.core.y, s.mouse.y, 0.35);
      
      s.ringInner.x = lerp(s.ringInner.x, s.mouse.x, 0.20);
      s.ringInner.y = lerp(s.ringInner.y, s.mouse.y, 0.20);

      s.ringOuter.x = lerp(s.ringOuter.x, s.mouse.x, 0.12);
      s.ringOuter.y = lerp(s.ringOuter.y, s.mouse.y, 0.12);

      s.glow.x = lerp(s.glow.x, s.mouse.x, 0.08);
      s.glow.y = lerp(s.glow.y, s.mouse.y, 0.08);

      let mainColor, glowColor, accentColor;

      if (s.isClicking) {
        mainColor = '#FF1155';
        glowColor = '#FF3366';
        accentColor = '#FF88AA';
      } else if (s.isHovering) {
        mainColor = '#00E5FF';
        glowColor = '#0088FF';
        accentColor = '#FFFFFF';
      } else {
        mainColor = `hsl(${s.hue}, 90%, 65%)`;
        glowColor = `hsl(${(s.hue + 30) % 360}, 80%, 50%)`;
        accentColor = `hsl(${(s.hue - 20) % 360}, 100%, 80%)`;
      }

      const coreSize = s.isClicking ? 18 : (s.isHovering ? 24 : 12);
      const ringInnerSize = s.isClicking ? 35 : (s.isHovering ? 45 : 30);
      const ringOuterSize = s.isClicking ? 60 : (s.isHovering ? 80 : 50);
      const glowSize = s.isClicking ? 100 : (s.isHovering ? 180 : 140);

      if (coreRef.current) {
        coreRef.current.style.transform = `translate(calc(${s.core.x}px - 50%), calc(${s.core.y}px - 50%))`;
        coreRef.current.style.width = `${coreSize}px`;
        coreRef.current.style.height = `${coreSize}px`;
        coreRef.current.style.background = `radial-gradient(circle at 35% 35%, #ffffff 0%, ${accentColor} 40%, ${mainColor} 100%)`;
        coreRef.current.style.boxShadow = `0 0 15px ${mainColor}, 0 0 30px ${glowColor}`;
      }

      if (ringInnerRef.current) {
        ringInnerRef.current.style.left = `${s.ringInner.x}px`;
        ringInnerRef.current.style.top = `${s.ringInner.y}px`;
        ringInnerRef.current.style.width = `${ringInnerSize}px`;
        ringInnerRef.current.style.height = `${ringInnerSize}px`;
        ringInnerRef.current.style.background = `conic-gradient(from 0deg, transparent 0%, transparent 60%, ${mainColor} 100%)`;
        ringInnerRef.current.style.maskImage = `radial-gradient(circle at center, transparent ${ringInnerSize/2 - 2}px, black ${ringInnerSize/2 - 1.5}px)`;
        ringInnerRef.current.style.webkitMaskImage = `radial-gradient(circle at center, transparent ${ringInnerSize/2 - 2}px, black ${ringInnerSize/2 - 1.5}px)`;
      }

      if (ringOuterRef.current) {
        ringOuterRef.current.style.left = `${s.ringOuter.x}px`;
        ringOuterRef.current.style.top = `${s.ringOuter.y}px`;
        ringOuterRef.current.style.width = `${ringOuterSize}px`;
        ringOuterRef.current.style.height = `${ringOuterSize}px`;
        ringOuterRef.current.style.borderColor = glowColor;
        if (s.isHovering) {
          ringOuterRef.current.style.borderWidth = '2px';
          ringOuterRef.current.style.boxShadow = `inset 0 0 15px ${glowColor}40, 0 0 15px ${glowColor}40`;
        } else {
          ringOuterRef.current.style.borderWidth = '1px';
          ringOuterRef.current.style.boxShadow = 'none';
        }
      }

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(calc(${s.glow.x}px - 50%), calc(${s.glow.y}px - 50%))`;
        glowRef.current.style.width = `${glowSize}px`;
        glowRef.current.style.height = `${glowSize}px`;
        glowRef.current.style.background = `radial-gradient(circle, ${mainColor}50 0%, ${glowColor}20 40%, transparent 70%)`;
      }

      requestRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            cursor: none !important;
            overflow-x: hidden;
            background-color: #09090b;
            background-image: 
                radial-gradient(circle at 15% 50%, rgba(20, 255, 255, 0.03), transparent 25%),
                radial-gradient(circle at 85% 30%, rgba(255, 51, 102, 0.03), transparent 25%);
        }
        
        * {
            cursor: none !important;
        }

        .trail-particle {
            position: fixed;
            pointer-events: none;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            mix-blend-mode: screen;
            animation: particleFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            z-index: 9995;
        }

        @keyframes particleFade {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
            100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        }

        .click-ripple {
            position: fixed;
            pointer-events: none;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            border: 2px solid transparent;
            z-index: 9997;
            animation: rippleExpand 0.5s ease-out forwards;
        }

        @keyframes rippleExpand {
            0% { width: 20px; height: 20px; opacity: 1; border-width: 3px; }
            100% { width: 140px; height: 140px; opacity: 0; border-width: 0px; }
        }

        @keyframes orbitSpin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes orbitSpinReverse {
            0% { transform: translate(-50%, -50%) rotate(360deg); }
            100% { transform: translate(-50%, -50%) rotate(0deg); }
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
      `}} />

        
        <div id="cursor-container" className="pointer-events-none fixed inset-0 z-9999">
          <div ref={trailContainerRef} id="cursor-trail"></div>
          
          <div ref={glowRef} className="fixed rounded-full mix-blend-screen transition-all duration-300 ease-out will-change-transform" style={{ filter: 'blur(24px)' }}></div>
          
          <div ref={ringOuterRef} className="fixed rounded-full border border-dashed transition-all duration-300 ease-out will-change-transform opacity-40" style={{ animation: 'orbitSpin 10s linear infinite' }}></div>
          
          <div ref={ringInnerRef} className="fixed rounded-full transition-all duration-300 ease-out will-change-transform opacity-70" style={{ animation: 'orbitSpinReverse 6s linear infinite' }}></div>
          
          <div ref={coreRef} className="fixed rounded-full transition-all duration-150 ease-out will-change-transform border-[1.5px] border-white/80"></div>
        </div>

    </>
  );
}