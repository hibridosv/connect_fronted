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
          backgroundImage: `linear-gradient(rgb(var(--color-info)) 1px, transparent 1px),
                           linear-gradient(90deg, rgb(var(--color-info)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

function ConstellationDots() {
  const dots = [
    { x: '12%', y: '14%', size: 3, delay: 0 },
    { x: '84%', y: '22%', size: 2, delay: 0.7 },
    { x: '75%', y: '72%', size: 3, delay: 1.3 },
    { x: '20%', y: '80%', size: 2, delay: 0.5 },
    { x: '50%', y: '9%',  size: 3, delay: 1.8 },
    { x: '91%', y: '52%', size: 2, delay: 2.2 },
    { x: '4%',  y: '48%', size: 3, delay: 0.3 },
    { x: '42%', y: '91%', size: 2, delay: 1.6 },
    { x: '63%', y: '35%', size: 2, delay: 2.8 },
    { x: '28%', y: '60%', size: 2, delay: 1.1 },
  ];
  return (
    <>
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-info/30"
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
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-info/30 to-transparent"
        style={{ animation: 'scanDown 3.5s ease-in-out infinite' }}
      />
    </div>
  );
}

const newFeatures = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Reportes mejorados',
    description: 'Nuevos filtros y vistas en reportes de ventas, compras y márgenes con mayor detalle.',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    borderColor: 'hover:border-violet-200',
    dotColor: 'bg-violet-400',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Ventas hasta 3× más rápidas',
    description: 'El flujo de cobro fue rediseñado para reducir clics y tiempo por transacción.',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    borderColor: 'hover:border-amber-200',
    dotColor: 'bg-amber-400',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    title: 'Compras electrónicas',
    description: 'Recepción y gestión de facturas electrónicas de proveedores directamente en el sistema.',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    borderColor: 'hover:border-emerald-200',
    dotColor: 'bg-emerald-400',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    title: 'Refresh token automático',
    description: 'Las sesiones se renuevan automáticamente sin interrumpir el trabajo en curso.',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    borderColor: 'hover:border-sky-200',
    dotColor: 'bg-sky-400',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
    title: 'Resúmenes rediseñados',
    description: 'Los totalizadores de cada tabla muestran información con colores semánticos claros.',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    borderColor: 'hover:border-orange-200',
    dotColor: 'bg-orange-400',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Seguridad mejorada',
    description: 'Cierre de sesión automático al detectar múltiples respuestas no autorizadas.',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    borderColor: 'hover:border-rose-200',
    dotColor: 'bg-rose-400',
  },
];

export default function InfoPage() {
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
        @keyframes infoPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgb(var(--color-info) / 0.2); }
          50% { box-shadow: 0 0 0 14px rgb(var(--color-info) / 0); }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
          50% { transform: scale(1.12) rotate(8deg); opacity: 1; }
        }
        @keyframes ringPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.07; }
          50% { transform: translate(-50%, -50%) scale(1.08); opacity: 0.14; }
        }
        @keyframes featureIn {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <GridBackground />
      <ConstellationDots />

      <div
        className="absolute top-1/3 left-1/5 h-96 w-96 rounded-full bg-info/[0.04] blur-3xl transition-transform duration-700 ease-out pointer-events-none"
        style={{ transform: `translate(${parallax.x * -18}px, ${parallax.y * -18}px)` }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-3xl transition-transform duration-700 ease-out pointer-events-none"
        style={{ transform: `translate(${parallax.x * 22}px, ${parallax.y * 22}px)` }}
      />
      <div
        className="absolute top-1/4 right-1/3 h-64 w-64 rounded-full bg-violet-500/[0.03] blur-3xl pointer-events-none"
      />

      <div
        className="absolute top-1/2 left-1/2 h-[420px] w-[420px] md:h-[560px] md:w-[560px] rounded-full border border-info/[0.07] transition-all duration-1000 pointer-events-none"
        style={{ transform: `translate(calc(-50% + ${parallax.x * 8}px), calc(-50% + ${parallax.y * 8}px))` }}
      >
        <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}
          style={{ animation: mounted ? 'ringPulse 4s ease-in-out infinite' : 'none' }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-info/50 animate-orbit" />
      </div>
      <div
        className="absolute top-1/2 left-1/2 h-[280px] w-[280px] md:h-[380px] md:w-[380px] rounded-full border border-dashed border-info/[0.07] transition-all duration-1000 delay-200 pointer-events-none"
        style={{ transform: `translate(calc(-50% + ${parallax.x * -6}px), calc(-50% + ${parallax.y * -6}px))` }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1 w-1 rounded-full bg-violet-400/50 animate-orbit-reverse" />
      </div>

      <div
        className="relative z-10 text-center max-w-2xl mx-auto w-full transition-transform duration-700 ease-out"
        style={{ transform: `translate(${parallax.x * 5}px, ${parallax.y * 5}px)` }}
      >
        <div className={`relative bg-bg-content/70 backdrop-blur-xl rounded-3xl border border-bg-subtle/60 shadow-2xl shadow-info/[0.08] p-5 md:p-7 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <ScanLine />

          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-info/10 border border-info/25 mb-3 transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse" />
            <span className="text-xs font-semibold text-info tracking-widest uppercase">Novedades del sistema</span>
            <span className="ml-1 text-[10px] font-bold text-info/60 bg-info/10 rounded-full px-1.5 py-0.5">{newFeatures.length}</span>
          </div>

          <div className={`mx-auto mb-2 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="relative mx-auto w-fit">
              <div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-info/20 to-info/5 border border-info/20 flex items-center justify-center"
                style={{ animation: mounted ? 'infoPulse 2.5s ease-in-out infinite' : 'none' }}
              >
                <svg
                  className="w-8 h-8 text-info"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  style={{ animation: mounted ? 'sparkle 3s ease-in-out infinite' : 'none' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-info flex items-center justify-center shadow-md shadow-info/40">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <div className={`h-px bg-gradient-to-r from-transparent to-info/40 transition-all duration-1000 delay-500 ${mounted ? 'w-20' : 'w-0'}`} />
            <div className={`w-2 h-2 rounded-full bg-info/70 transition-all duration-500 delay-700 ${mounted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
            <div className={`h-px bg-gradient-to-l from-transparent to-info/40 transition-all duration-1000 delay-500 ${mounted ? 'w-20' : 'w-0'}`} />
          </div>

          <h1 className={`text-2xl md:text-3xl font-bold text-text-base mb-1 transition-all duration-600 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Nuevas Características
          </h1>
          <p className={`text-text-muted text-sm mb-3 transition-all duration-700 delay-600 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            Tu sistema ha sido actualizado. Estas son las mejoras disponibles a partir de hoy.
          </p>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-left mb-3 transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {newFeatures.map((feature, i) => (
              <div
                key={i}
                className={`group flex items-start gap-3 p-2.5 rounded-xl bg-bg-subtle/30 border border-bg-subtle ${feature.borderColor} hover:bg-bg-subtle/60 transition-all duration-200 hover:shadow-sm`}
                style={{ animation: mounted ? `featureIn 0.4s ease-out ${0.75 + i * 0.07}s both` : 'none' }}
              >
                <div className={`flex-shrink-0 mt-0.5 w-9 h-9 rounded-xl ${feature.iconBg} flex items-center justify-center ${feature.iconColor} transition-colors duration-200 group-hover:brightness-110`}>
                  {feature.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${feature.dotColor} shrink-0`} />
                    <div className="text-sm font-semibold text-text-base leading-tight truncate">{feature.title}</div>
                  </div>
                  <div className="text-xs text-text-muted leading-relaxed">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>

          <p className={`text-xs text-text-muted/60 text-center mb-3 transition-all duration-700 delay-[850ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            Todas las características del sistema anterior siguen disponibles.
          </p>

          <div className={`flex justify-center transition-all duration-600 delay-[900ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button
              onClick={handleContinue}
              className="group relative z-20 inline-flex items-center gap-2.5 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-text-inverted shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/35 hover:brightness-110 active:brightness-95 overflow-hidden cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/12 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <svg className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              <span className="relative">Continuar al sistema</span>
            </button>
          </div>
        </div>

        <p className={`mt-4 text-[10px] font-mono text-text-muted/25 tracking-[0.2em] uppercase transition-all duration-700 delay-[1100ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          Estado &middot; Informativo &middot; Actualización disponible
        </p>
      </div>
    </div>
  );
}
