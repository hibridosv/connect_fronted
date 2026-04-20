'use client';

import { isProducts } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

function useMouseParallax() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setOffset({ x, y });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return offset;
}

function AnimatedDigit({ digit, delay }: { digit: string; delay: number }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let frame = 0;
      const totalFrames = 20;
      const interval = setInterval(() => {
        frame++;
        setCount(Math.floor(Math.random() * 10));
        if (frame >= totalFrames) {
          clearInterval(interval);
          setCount(Number(digit));
          setDone(true);
        }
      }, 50);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [digit, delay]);

  return (
    <span
      className={`inline-block transition-all duration-500 ${done ? 'text-primary' : 'text-primary/40'}`}
      style={{ transform: done ? 'scale(1)' : 'scale(1.1)' }}
    >
      {count}
    </span>
  );
}

function ScanLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
      <div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        style={{ animation: 'scanDown 3s ease-in-out infinite' }}
      />
    </div>
  );
}

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgb(var(--color-primary)) 1px, transparent 1px),
                           linear-gradient(90deg, rgb(var(--color-primary)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

function ConstellationDots() {
  const dots = [
    { x: '12%', y: '18%', size: 3, delay: 0 },
    { x: '88%', y: '22%', size: 2, delay: 0.5 },
    { x: '75%', y: '72%', size: 4, delay: 1.2 },
    { x: '20%', y: '78%', size: 2, delay: 0.8 },
    { x: '55%', y: '12%', size: 3, delay: 1.5 },
    { x: '92%', y: '55%', size: 2, delay: 2 },
    { x: '8%', y: '48%', size: 3, delay: 0.3 },
    { x: '42%', y: '85%', size: 2, delay: 1.8 },
    { x: '65%', y: '32%', size: 2, delay: 1 },
    { x: '35%', y: '42%', size: 2, delay: 0.6 },
  ];

  return (
    <>
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary/30"
          style={{
            width: dot.size,
            height: dot.size,
            left: dot.x,
            top: dot.y,
            animation: `twinkle ${2 + dot.delay}s ease-in-out ${dot.delay}s infinite`,
          }}
        />
      ))}
    </>
  );
}

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = 'La página que buscas no existe o fue movida.';
  const parallax = useMouseParallax();
  const containerRef = useRef<HTMLDivElement>(null);
  const { tenant } = useConfigStore();
  const redirect = isProducts(tenant?.system) ? "/orders/products" : "/orders/restaurant";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 35);
    return () => clearInterval(interval);
  }, [mounted]);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-bg-base p-4"
    >
      <style jsx>{`
        @keyframes scanDown {
          0% { top: -2%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 102%; opacity: 0; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.5); }
        }
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <GridBackground />
      <ConstellationDots />

      {/* Orbes de fondo con parallax */}
      <div
        className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-primary/[0.04] blur-3xl transition-transform duration-700 ease-out"
        style={{ transform: `translate(${parallax.x * -15}px, ${parallax.y * -15}px)` }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/[0.04] blur-3xl transition-transform duration-700 ease-out"
        style={{ transform: `translate(${parallax.x * 20}px, ${parallax.y * 20}px)` }}
      />

      {/* Anillos orbitales con parallax */}
      <div
        className={`absolute top-1/2 left-1/2 h-[340px] w-[340px] md:h-[440px] md:w-[440px] rounded-full border border-primary/[0.06] transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        style={{ transform: `translate(calc(-50% + ${parallax.x * 8}px), calc(-50% + ${parallax.y * 8}px))` }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-accent/50 animate-orbit" />
      </div>
      <div
        className={`absolute top-1/2 left-1/2 h-[240px] w-[240px] md:h-[320px] md:w-[320px] rounded-full border border-dashed border-accent/[0.06] transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        style={{ transform: `translate(calc(-50% + ${parallax.x * -5}px), calc(-50% + ${parallax.y * -5}px))` }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1 w-1 rounded-full bg-primary/50 animate-orbit-reverse" />
      </div>

      {/* Contenido principal */}
      <div
        className="relative z-10 text-center max-w-lg mx-auto transition-transform duration-700 ease-out"
        style={{ transform: `translate(${parallax.x * 5}px, ${parallax.y * 5}px)` }}
      >
        {/* Tarjeta principal */}
        <div className={`relative bg-bg-content/60 backdrop-blur-xl rounded-3xl border border-bg-subtle/50 shadow-2xl shadow-primary/[0.06] p-8 md:p-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <ScanLine />

          {/* Badge superior */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-danger/10 border border-danger/20 mb-8 transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
            <span className="text-xs font-medium text-danger tracking-wide uppercase">Error</span>
          </div>

          {/* Número 404 con slot machine */}
          <div className="mb-6">
            <div className="text-[7rem] md:text-[9rem] font-black leading-none tracking-tighter select-none">
              <AnimatedDigit digit="4" delay={200} />
              <AnimatedDigit digit="0" delay={400} />
              <AnimatedDigit digit="4" delay={600} />
            </div>
          </div>

          {/* Línea decorativa animada */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`h-px bg-gradient-to-r from-transparent to-primary/30 transition-all duration-1000 delay-500 ${mounted ? 'w-16' : 'w-0'}`} />
            <div className={`w-2 h-2 rounded-full bg-accent transition-all duration-500 delay-700 ${mounted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
            <div className={`h-px bg-gradient-to-l from-transparent to-primary/30 transition-all duration-1000 delay-500 ${mounted ? 'w-16' : 'w-0'}`} />
          </div>

          {/* Título */}
          <h2 className={`text-xl md:text-2xl font-bold text-text-base mb-4 transition-all duration-600 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Página no encontrada
          </h2>

          {/* Texto con efecto typewriter */}
          <div className={`h-12 flex items-center justify-center transition-opacity duration-500 delay-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-text-muted text-sm md:text-base max-w-sm leading-relaxed">
              {typedText}
              <span
                className="inline-block w-0.5 h-4 bg-accent ml-0.5 align-middle"
                style={{ animation: 'cursorBlink 0.8s step-end infinite' }}
              />
            </p>
          </div>

          {/* Botón */}
          <div className={`mt-8 transition-all duration-600 delay-[900ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link
              href={redirect}
              className="group relative inline-flex items-center gap-2.5 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-text-inverted shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <svg
                className="relative h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="relative">Volver al inicio</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className={`mt-8 text-[10px] font-mono text-text-muted/25 tracking-[0.2em] uppercase transition-all duration-700 delay-[1100ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          HTTP 404 &middot; Resource not found
        </p>
      </div>
    </div>
  );
}
