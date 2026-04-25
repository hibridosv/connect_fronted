'use client';

import { LuBuilding2, LuMail, LuFileJson, LuShieldCheck, LuBookOpen } from "react-icons/lu";

export function AutomationFlowIllustration() {
  return (
    <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-4">
      <style>{`
        @keyframes flowParticle {
          0%   { left: -6px; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { left: calc(100% + 6px); opacity: 0; }
        }
        @keyframes softPing {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50%       { transform: scale(1.7); opacity: 0; }
        }
      `}</style>

      <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-600/60 mb-4">
        Flujo de procesamiento
      </p>

      <div className="flex items-start">

        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="relative w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'rgb(148 163 184 / 0.12)', border: '1px solid rgb(148 163 184 / 0.35)' }}>
            <span className="absolute inset-0 rounded-xl"
              style={{ background: 'rgb(148 163 184 / 0.2)', animation: 'softPing 2.8s ease-in-out infinite', animationDelay: '0s' }} />
            <LuBuilding2 size={19} style={{ color: 'rgb(100 116 139)' }} />
          </div>
          <span className="text-[10px] font-bold text-slate-500 text-center leading-tight">Proveedor</span>
          <span className="text-[9px] text-slate-400 text-center leading-tight">Emite factura</span>
        </div>

        <div className="flex-1 relative mx-1 mt-5 h-0.5 overflow-hidden"
          style={{ background: 'linear-gradient(to right, rgb(148 163 184 / 0.25), rgb(34 211 238 / 0.25))' }}>
          {[0, 0.67, 1.34].map((d) => (
            <span key={d} className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
              style={{ background: 'rgb(34 211 238)', animation: 'flowParticle 2s linear infinite', animationDelay: `${d}s` }} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="relative w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'rgb(6 182 212 / 0.12)', border: '1px solid rgb(34 211 238 / 0.4)' }}>
            <span className="absolute inset-0 rounded-xl"
              style={{ background: 'rgb(34 211 238 / 0.2)', animation: 'softPing 2.8s ease-in-out infinite', animationDelay: '0.6s' }} />
            <LuMail size={19} style={{ color: 'rgb(6 182 212)' }} />
          </div>
          <span className="text-[10px] font-bold text-cyan-600 text-center leading-tight">Email</span>
          <span className="text-[9px] text-cyan-500/70 text-center leading-tight">JSON adjunto</span>
        </div>

        <div className="flex-1 relative mx-1 mt-5 h-0.5 overflow-hidden"
          style={{ background: 'linear-gradient(to right, rgb(34 211 238 / 0.25), rgb(96 165 250 / 0.25))' }}>
          {[0.25, 0.92, 1.59].map((d) => (
            <span key={d} className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
              style={{ background: 'rgb(96 165 250)', animation: 'flowParticle 2s linear infinite', animationDelay: `${d}s` }} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="relative w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'rgb(59 130 246 / 0.12)', border: '1px solid rgb(96 165 250 / 0.4)' }}>
            <span className="absolute inset-0 rounded-xl"
              style={{ background: 'rgb(96 165 250 / 0.2)', animation: 'softPing 2.8s ease-in-out infinite', animationDelay: '1.2s' }} />
            <LuFileJson size={19} style={{ color: 'rgb(59 130 246)' }} />
          </div>
          <span className="text-[10px] font-bold text-blue-600 text-center leading-tight">Extracción</span>
          <span className="text-[9px] text-blue-500/70 text-center leading-tight">Procesamiento</span>
        </div>

        <div className="flex-1 relative mx-1 mt-5 h-0.5 overflow-hidden"
          style={{ background: 'linear-gradient(to right, rgb(96 165 250 / 0.25), rgb(129 140 248 / 0.25))' }}>
          {[0.1, 0.77, 1.44].map((d) => (
            <span key={d} className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
              style={{ background: 'rgb(129 140 248)', animation: 'flowParticle 2s linear infinite', animationDelay: `${d}s` }} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="relative w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'rgb(99 102 241 / 0.12)', border: '1px solid rgb(129 140 248 / 0.4)' }}>
            <span className="absolute inset-0 rounded-xl"
              style={{ background: 'rgb(129 140 248 / 0.2)', animation: 'softPing 2.8s ease-in-out infinite', animationDelay: '1.8s' }} />
            <LuShieldCheck size={19} style={{ color: 'rgb(99 102 241)' }} />
          </div>
          <span className="text-[10px] font-bold text-indigo-600 text-center leading-tight">Validación</span>
          <span className="text-[9px] text-indigo-500/70 text-center leading-tight">Sin errores</span>
        </div>

        <div className="flex-1 relative mx-1 mt-5 h-0.5 overflow-hidden"
          style={{ background: 'linear-gradient(to right, rgb(129 140 248 / 0.25), rgb(52 211 153 / 0.25))' }}>
          {[0.4, 1.07, 1.74].map((d) => (
            <span key={d} className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
              style={{ background: 'rgb(52 211 153)', animation: 'flowParticle 2s linear infinite', animationDelay: `${d}s` }} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="relative w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'rgb(16 185 129 / 0.12)', border: '1px solid rgb(52 211 153 / 0.4)' }}>
            <span className="absolute inset-0 rounded-xl"
              style={{ background: 'rgb(52 211 153 / 0.2)', animation: 'softPing 2.8s ease-in-out infinite', animationDelay: '2.4s' }} />
            <LuBookOpen size={19} style={{ color: 'rgb(16 185 129)' }} />
          </div>
          <span className="text-[10px] font-bold text-emerald-600 text-center leading-tight">Libro</span>
          <span className="text-[9px] text-emerald-500/70 text-center leading-tight">Actualizado</span>
        </div>

      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-ping opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[10px] text-text-muted">Sistema monitoreando su correo en tiempo real</span>
      </div>
    </div>
  );
}
