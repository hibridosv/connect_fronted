'use client';

import { ENCRYPT_CLIENT_ID } from '@/constants';
import { encryptText } from '@/lib/encrypt';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

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

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgb(var(--color-warning)) 1px, transparent 1px),
                           linear-gradient(90deg, rgb(var(--color-warning)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

function ConstellationDots() {
  const dots = [
    { x: '14%', y: '12%', size: 3, delay: 0 },
    { x: '82%', y: '25%', size: 2, delay: 0.7 },
    { x: '72%', y: '70%', size: 3, delay: 1.3 },
    { x: '22%', y: '82%', size: 2, delay: 0.5 },
    { x: '48%', y: '10%', size: 3, delay: 1.8 },
    { x: '88%', y: '55%', size: 2, delay: 2.2 },
    { x: '5%', y: '45%', size: 3, delay: 0.3 },
    { x: '38%', y: '90%', size: 2, delay: 1.6 },
  ];
  return (
    <>
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-warning/30"
          style={{
            width: dot.size, height: dot.size,
            left: dot.x, top: dot.y,
            animation: `twinkle ${2 + dot.delay}s ease-in-out ${dot.delay}s infinite`,
          }}
        />
      ))}
    </>
  );
}

function ScanLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
      <div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-warning/30 to-transparent"
        style={{ animation: 'scanDown 3.5s ease-in-out infinite' }}
      />
    </div>
  );
}

function HourglassIcon({ mounted }: { mounted: boolean }) {
  return (
    <div
      className="mx-auto w-24 h-24 md:w-28 md:h-28 rounded-full bg-warning/10 flex items-center justify-center"
      style={{ animation: mounted ? 'shieldPulse 2.5s ease-in-out infinite' : 'none' }}
    >
      <svg
        className="w-12 h-12 md:w-14 md:h-14 text-warning"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        style={{ animation: mounted ? 'hourglassFlip 4s ease-in-out 1s infinite' : 'none' }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  );
}

export default function OverduePage() {
  const [mounted, setMounted] = useState(false);
  const parallax = useMouseParallax();

  useEffect(() => { setMounted(true); }, []);

  const handleContinue = async () => {
    const encrypted = encryptText('Active', ENCRYPT_CLIENT_ID);
    document.cookie = `tenant-status=${encrypted}; path=/; SameSite=Lax`;
    const session = await getSession();
    window.location.href = session?.redirect || '/dashboard';
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-bg-base p-4">
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
        @keyframes shieldPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgb(var(--color-warning) / 0.2); }
          50% { box-shadow: 0 0 0 12px rgb(var(--color-warning) / 0); }
        }
        @keyframes hourglassFlip {
          0%, 40% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
          90%, 100% { transform: rotate(180deg); }
        }
        @keyframes countDown {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>

      <GridBackground />
      <ConstellationDots />

      <div
        className="absolute top-1/3 left-1/5 h-80 w-80 rounded-full bg-warning/[0.03] blur-3xl transition-transform duration-700 ease-out pointer-events-none"
        style={{ transform: `translate(${parallax.x * -15}px, ${parallax.y * -15}px)` }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/[0.03] blur-3xl transition-transform duration-700 ease-out pointer-events-none"
        style={{ transform: `translate(${parallax.x * 20}px, ${parallax.y * 20}px)` }}
      />

      {/* Anillos */}
      <div
        className={`absolute top-1/2 left-1/2 h-[340px] w-[340px] md:h-[440px] md:w-[440px] rounded-full border border-warning/[0.06] transition-all duration-1000 pointer-events-none ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        style={{ transform: `translate(calc(-50% + ${parallax.x * 8}px), calc(-50% + ${parallax.y * 8}px))` }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-warning/50 animate-orbit" />
      </div>
      <div
        className={`absolute top-1/2 left-1/2 h-[240px] w-[240px] md:h-[320px] md:w-[320px] rounded-full border border-dashed border-warning/[0.06] transition-all duration-1000 delay-200 pointer-events-none ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        style={{ transform: `translate(calc(-50% + ${parallax.x * -5}px), calc(-50% + ${parallax.y * -5}px))` }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1 w-1 rounded-full bg-primary/40 animate-orbit-reverse" />
      </div>

      {/* Contenido */}
      <div
        className="relative z-10 text-center max-w-lg mx-auto transition-transform duration-700 ease-out"
        style={{ transform: `translate(${parallax.x * 5}px, ${parallax.y * 5}px)` }}
      >
        <div className={`relative bg-bg-content/60 backdrop-blur-xl rounded-3xl border border-bg-subtle/50 shadow-2xl shadow-warning/[0.06] p-8 md:p-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <ScanLine />

          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 border border-warning/20 mb-8 transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-warning" style={{ animation: 'countDown 1.5s ease-in-out infinite' }} />
            <span className="text-xs font-medium text-warning tracking-wide uppercase">Pago Pendiente</span>
          </div>

          {/* Icono reloj */}
          <div className={`mx-auto mb-6 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <HourglassIcon mounted={mounted} />
          </div>

          {/* Línea decorativa */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`h-px bg-gradient-to-r from-transparent to-warning/30 transition-all duration-1000 delay-500 ${mounted ? 'w-16' : 'w-0'}`} />
            <div className={`w-2 h-2 rounded-full bg-warning transition-all duration-500 delay-700 ${mounted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
            <div className={`h-px bg-gradient-to-l from-transparent to-warning/30 transition-all duration-1000 delay-500 ${mounted ? 'w-16' : 'w-0'}`} />
          </div>

          {/* Título */}
          <h1 className={`text-2xl md:text-3xl font-bold text-text-base mb-4 transition-all duration-600 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Facturación Pendiente de Pago
          </h1>

          {/* Mensaje */}
          <div className={`transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-text-muted text-sm md:text-base max-w-md leading-relaxed mx-auto">
              Tienes pagos pendientes en tu servicio de facturación electrónica. Tu sistema seguirá funcionando y todos los documentos se emitirán con normalidad, sin embargo algunas funciones como historiales y reportes estarán limitadas hasta regularizar tu cuenta.
            </p>
          </div>

          {/* Botones */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => { const enc = encryptText('Active', ENCRYPT_CLIENT_ID); document.cookie = `tenant-status=${enc}; path=/; SameSite=Lax`; window.location.href = '/settings/payments'; }}
              className="group relative z-20 inline-flex items-center gap-2.5 rounded-xl bg-warning px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-warning/20 transition-all duration-300 hover:shadow-xl hover:shadow-warning/30 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden cursor-pointer"
            >
              <svg className="relative h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
              <span className="relative">Realizar Pago</span>
            </button>
            <button
              onClick={handleContinue}
              className="group relative z-20 inline-flex items-center gap-2.5 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-text-inverted shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden cursor-pointer"
            >
              <svg className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              <span className="relative">Continuar</span>
            </button>
          </div>
        </div>

        <p className={`mt-8 text-[10px] font-mono text-text-muted/25 tracking-[0.2em] uppercase transition-all duration-700 delay-[1100ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          Estado &middot; Pendiente &middot; Facturación electrónica
        </p>
      </div>
    </div>
  );
}
