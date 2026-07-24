'use client';

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
    { x: '10%', y: '15%', size: 3, delay: 0 },
    { x: '85%', y: '20%', size: 2, delay: 0.6 },
    { x: '78%', y: '75%', size: 3, delay: 1.4 },
    { x: '18%', y: '80%', size: 2, delay: 0.9 },
    { x: '50%', y: '8%', size: 3, delay: 1.6 },
    { x: '90%', y: '50%', size: 2, delay: 2.1 },
    { x: '6%', y: '52%', size: 3, delay: 0.4 },
    { x: '40%', y: '88%', size: 2, delay: 1.9 },
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

export default function MaintenancePage() {
  const [mounted, setMounted] = useState(false);
  const parallax = useMouseParallax();

  useEffect(() => { setMounted(true); }, []);

  const handleRetry = () => {
    window.location.reload();
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
        @keyframes toolPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgb(var(--color-warning) / 0.2); }
          50% { box-shadow: 0 0 0 12px rgb(var(--color-warning) / 0); }
        }
        @keyframes wrenchTurn {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(15deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>

      <GridBackground />
      <ConstellationDots />

      <div
        className="absolute top-1/3 left-1/5 h-80 w-80 rounded-full bg-warning/[0.04] blur-3xl transition-transform duration-700 ease-out pointer-events-none"
        style={{ transform: `translate(${parallax.x * -15}px, ${parallax.y * -15}px)` }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/[0.03] blur-3xl transition-transform duration-700 ease-out pointer-events-none"
        style={{ transform: `translate(${parallax.x * 20}px, ${parallax.y * 20}px)` }}
      />

      <div
        className={`absolute top-1/2 left-1/2 h-[340px] w-[340px] md:h-[440px] md:w-[440px] rounded-full border border-warning/[0.07] transition-all duration-1000 pointer-events-none ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        style={{ transform: `translate(calc(-50% + ${parallax.x * 8}px), calc(-50% + ${parallax.y * 8}px))` }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-warning/50 animate-orbit" />
      </div>
      <div
        className={`absolute top-1/2 left-1/2 h-[240px] w-[240px] md:h-[320px] md:w-[320px] rounded-full border border-dashed border-warning/[0.07] transition-all duration-1000 delay-200 pointer-events-none ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        style={{ transform: `translate(calc(-50% + ${parallax.x * -5}px), calc(-50% + ${parallax.y * -5}px))` }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1 w-1 rounded-full bg-primary/40 animate-orbit-reverse" />
      </div>

      <div
        className="relative z-10 text-center max-w-lg mx-auto transition-transform duration-700 ease-out"
        style={{ transform: `translate(${parallax.x * 5}px, ${parallax.y * 5}px)` }}
      >
        <div className={`relative bg-bg-content/60 backdrop-blur-xl rounded-3xl border border-bg-subtle/50 shadow-2xl shadow-warning/[0.08] p-8 md:p-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <ScanLine />

          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 border border-warning/20 mb-8 transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
            <span className="text-xs font-medium text-warning tracking-wide uppercase">Mantenimiento en curso</span>
          </div>

          <div className={`mx-auto mb-6 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div
              className="mx-auto w-24 h-24 md:w-28 md:h-28 rounded-full bg-warning/10 flex items-center justify-center"
              style={{ animation: mounted ? 'toolPulse 2.5s ease-in-out infinite' : 'none' }}
            >
              <svg
                className="w-12 h-12 md:w-14 md:h-14 text-warning"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                style={{ animation: mounted ? 'wrenchTurn 3s ease-in-out 1s 1' : 'none' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`h-px bg-gradient-to-r from-transparent to-warning/40 transition-all duration-1000 delay-500 ${mounted ? 'w-16' : 'w-0'}`} />
            <div className={`w-2 h-2 rounded-full bg-warning transition-all duration-500 delay-700 ${mounted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
            <div className={`h-px bg-gradient-to-l from-transparent to-warning/40 transition-all duration-1000 delay-500 ${mounted ? 'w-16' : 'w-0'}`} />
          </div>

          <h1 className={`text-2xl md:text-3xl font-bold text-text-base mb-4 transition-all duration-600 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Sistema en Mantenimiento
          </h1>

          <div className={`transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-text-muted text-sm md:text-base max-w-md leading-relaxed mx-auto">
              Estamos realizando mejoras en el sistema. El acceso estará disponible nuevamente en unos minutos. Gracias por tu paciencia.
            </p>
          </div>

          <div className={`mt-8 flex justify-center transition-all duration-600 delay-[900ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button
              onClick={handleRetry}
              className="group relative inline-flex items-center gap-2.5 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-text-inverted shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <svg className="relative h-4 w-4 transition-transform duration-500 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span className="relative">Reintentar</span>
            </button>
          </div>
        </div>

        <p className={`mt-8 text-[10px] font-mono text-text-muted/25 tracking-[0.2em] uppercase transition-all duration-700 delay-[1100ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          Estado &middot; Mantenimiento &middot; Volviendo pronto
        </p>
      </div>
    </div>
  );
}
