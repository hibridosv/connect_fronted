'use client';

import { useSession } from 'next-auth/react';
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
          backgroundImage: `linear-gradient(rgb(var(--color-danger)) 1px, transparent 1px),
                           linear-gradient(90deg, rgb(var(--color-danger)) 1px, transparent 1px)`,
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
  ];
  return (
    <>
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-danger/30"
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
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-danger/30 to-transparent"
        style={{ animation: 'scanDown 3.5s ease-in-out infinite' }}
      />
    </div>
  );
}

const pendingInvoices = [
  { label: 'Factura #0042', amount: '$29.99', due: 'Vence hoy' },
  { label: 'Factura #0038', amount: '$29.99', due: 'Vencida hace 15 días' },
];

export default function ExpiringPage() {
  const [mounted, setMounted] = useState(false);
  const parallax = useMouseParallax();
  const { data: sessionData, update } = useSession();

  useEffect(() => { setMounted(true); }, []);

  const handleContinue = async () => {
    await update({ tenantStatus: 'Active' });
    window.location.href = sessionData?.redirect || '/dashboard';
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
        @keyframes dangerPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgb(var(--color-danger) / 0.2); }
          50% { box-shadow: 0 0 0 14px rgb(var(--color-danger) / 0); }
        }
        @keyframes urgentBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes shakeX {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-8deg); }
          40% { transform: rotate(8deg); }
          60% { transform: rotate(-5deg); }
          80% { transform: rotate(5deg); }
        }
        @keyframes slideIn {
          0% { opacity: 0; transform: translateX(-8px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <GridBackground />
      <ConstellationDots />

      <div
        className="absolute top-1/3 left-1/5 h-80 w-80 rounded-full bg-danger/[0.04] blur-3xl transition-transform duration-700 ease-out pointer-events-none"
        style={{ transform: `translate(${parallax.x * -15}px, ${parallax.y * -15}px)` }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/[0.03] blur-3xl transition-transform duration-700 ease-out pointer-events-none"
        style={{ transform: `translate(${parallax.x * 20}px, ${parallax.y * 20}px)` }}
      />

      <div
        className={`absolute top-1/2 left-1/2 h-[380px] w-[380px] md:h-[500px] md:w-[500px] rounded-full border border-danger/[0.07] transition-all duration-1000 pointer-events-none ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        style={{ transform: `translate(calc(-50% + ${parallax.x * 8}px), calc(-50% + ${parallax.y * 8}px))` }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-danger/50 animate-orbit" />
      </div>
      <div
        className={`absolute top-1/2 left-1/2 h-[260px] w-[260px] md:h-[340px] md:w-[340px] rounded-full border border-dashed border-danger/[0.07] transition-all duration-1000 delay-200 pointer-events-none ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        style={{ transform: `translate(calc(-50% + ${parallax.x * -5}px), calc(-50% + ${parallax.y * -5}px))` }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1 w-1 rounded-full bg-warning/50 animate-orbit-reverse" />
      </div>

      <div
        className="relative z-10 text-center max-w-lg mx-auto w-full transition-transform duration-700 ease-out"
        style={{ transform: `translate(${parallax.x * 5}px, ${parallax.y * 5}px)` }}
      >
        <div className={`relative bg-bg-content/70 backdrop-blur-xl rounded-3xl border border-bg-subtle/60 shadow-2xl shadow-danger/[0.08] p-5 md:p-7 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <ScanLine />

          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-danger/10 border border-danger/25 mb-4 transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <span
              className="w-1.5 h-1.5 rounded-full bg-danger"
              style={{ animation: 'urgentBlink 1s ease-in-out infinite' }}
            />
            <span className="text-xs font-semibold text-danger tracking-widest uppercase">Suspensión inminente</span>
          </div>

          <div className={`mx-auto mb-3 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="relative mx-auto w-fit">
              <div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-danger/20 to-danger/5 border border-danger/20 flex items-center justify-center"
                style={{ animation: mounted ? 'dangerPulse 2s ease-in-out infinite' : 'none' }}
              >
                <svg
                  className="w-8 h-8 text-danger"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  style={{ animation: mounted ? 'shakeX 3s ease-in-out 2s infinite' : 'none' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger flex items-center justify-center shadow-md shadow-danger/40"
                style={{ animation: 'urgentBlink 1s ease-in-out infinite' }}
              >
                <span className="text-white text-[9px] font-black leading-none">!</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <div className={`h-px bg-gradient-to-r from-transparent to-danger/40 transition-all duration-1000 delay-500 ${mounted ? 'w-16' : 'w-0'}`} />
            <div className={`w-2 h-2 rounded-full bg-danger/70 transition-all duration-500 delay-700 ${mounted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
            <div className={`h-px bg-gradient-to-l from-transparent to-danger/40 transition-all duration-1000 delay-500 ${mounted ? 'w-16' : 'w-0'}`} />
          </div>

          <h1 className={`text-xl md:text-2xl font-bold text-text-base mb-1 transition-all duration-600 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Tu sistema está en proceso de suspensión
          </h1>
          <p className={`text-text-muted text-sm mb-4 transition-all duration-700 delay-600 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            Tienes facturas pendientes de pago. <span className="font-semibold text-danger">Hoy es el último día</span> para regularizar tu cuenta antes de que el acceso sea suspendido.
          </p>

          <div className={`mb-4 transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-bg-subtle" />
              <span className="text-[10px] uppercase tracking-widest font-semibold text-text-muted/60">Facturas pendientes</span>
              <div className="h-px flex-1 bg-bg-subtle" />
            </div>
            <div className="space-y-2">
              {pendingInvoices.map((inv, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-danger/5 border border-danger/15 text-left"
                  style={{ animation: mounted ? `slideIn 0.35s ease-out ${0.8 + i * 0.1}s both` : 'none' }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-danger/10 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text-base leading-tight">{inv.label}</div>
                      <div className="text-[11px] text-text-muted leading-tight">{inv.due}</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-danger shrink-0">{inv.amount}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-2.5 transition-all duration-600 delay-[950ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button
              onClick={async () => { await update({ tenantStatus: 'Active' }); window.location.href = '/settings/payments'; }}
              className="group relative z-20 w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-danger px-7 py-2.5 text-sm font-semibold text-white shadow-lg shadow-danger/25 transition-all duration-300 hover:shadow-xl hover:shadow-danger/35 hover:brightness-110 overflow-hidden cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <svg className="relative h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
              <span className="relative">Realizar Pago</span>
            </button>
            <button
              onClick={handleContinue}
              className="group relative z-20 w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-primary px-7 py-2.5 text-sm font-semibold text-text-inverted shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110 overflow-hidden cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <svg className="relative h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              <span className="relative">Continuar al sistema</span>
            </button>
          </div>
        </div>

        <p className={`mt-4 text-[10px] font-mono text-text-muted/25 tracking-[0.2em] uppercase transition-all duration-700 delay-[1100ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          Estado &middot; Suspensión inminente &middot; Último aviso
        </p>
      </div>
    </div>
  );
}
