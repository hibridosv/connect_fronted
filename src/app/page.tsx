'use client';

import { getBrand, isCustomBrand } from "@/lib/brand";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BiSave } from "react-icons/bi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { LuLoader } from "react-icons/lu";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const brand = useMemo(() => getBrand(), []);
  const custom = isCustomBrand(brand);
  const c = brand.colors;

  useEffect(() => {
    localStorage.removeItem('config-storage');
    localStorage.removeItem('menu-storage');
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let usernameNew = username.includes("@") ? username : username + "@hibridosv.com";
    try {
      setUsername(usernameNew);
      setLoading(true);
      setError(null);
      setMessage("Verificando credenciales...");
      const result = await signIn('credentials', {
        username: usernameNew,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError(result.error);
        setLoading(false);
        setMessage(null);
      } else if (result?.ok) {
        setMessage("Sesión iniciada correctamente");
        setRedirecting(true);
        setLoading(false);
        const session = await getSession();
        document.cookie = `tenant-status=${session?.status ?? 0}; path=/; SameSite=Lax`;
        const redirectTo = session?.redirect || "/dashboard";
        setMessage(`Redirigiendo...`);
        router.push(redirectTo);
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      setLoading(false);
      setMessage(null);
    }
  };

  return (
    <div
      className={`min-h-screen flex ${!custom ? 'bg-primary' : ''}`}
      style={custom ? { backgroundColor: c.panel } : undefined}
    >
      {/* Panel Izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col justify-center items-center">
        {/* Fondo con gradiente */}
        <div
          className={`absolute inset-0 ${!custom ? 'bg-gradient-to-br from-primary via-secondary/80 to-primary' : ''}`}
          style={custom ? { background: c.panelGradient } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

        {/* Patrón de líneas cruzadas */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(45deg, white 1px, transparent 1px), linear-gradient(-45deg, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Orbes orbitando */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="animate-orbit">
            <div
              className={`w-3 h-3 rounded-full shadow-lg ${!custom ? 'bg-accent/60 shadow-accent/30' : ''}`}
              style={custom ? { backgroundColor: c.accent, boxShadow: `0 0 10px ${c.accentGlow}` } : undefined}
            />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="animate-orbit-reverse">
            <div className="w-2 h-2 bg-white/40 rounded-full" />
          </div>
        </div>

        {/* Formas decorativas flotantes */}
        <div className="absolute top-12 left-12 w-80 h-80 bg-white/[0.03] rounded-full blur-sm animate-float" />
        <div className="absolute bottom-12 right-6 w-[26rem] h-[26rem] bg-white/[0.03] rounded-full blur-sm animate-float-slow" />
        <div
          className={`absolute top-1/3 right-1/4 w-52 h-52 rounded-full animate-float-diagonal ${!custom ? 'bg-accent/[0.06]' : ''}`}
          style={custom ? { backgroundColor: `${c.accent}0F` } : undefined}
        />
        <div className="absolute bottom-1/4 left-16 w-24 h-24 bg-white/[0.05] rounded-2xl rotate-45 animate-float" />
        <div
          className={`absolute top-20 right-20 w-16 h-16 rounded-xl rotate-12 animate-float-slow ${!custom ? 'bg-accent/[0.08]' : ''}`}
          style={custom ? { backgroundColor: `${c.accent}14` } : undefined}
        />

        {/* Líneas decorativas de fondo */}
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" />
        <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-white/[0.05] to-transparent" />

        {/* Contenido de marca */}
        <div className="relative z-10 text-center px-12">
          {/* Logo con glow */}
          <div className="mb-12 animate-scale-in">
            <div className="relative w-28 h-28 mx-auto">
              <div
                className={`absolute inset-0 rounded-3xl blur-xl animate-pulse-glow ${!custom ? 'bg-accent/20' : ''}`}
                style={custom ? { backgroundColor: c.accentGlow } : undefined}
              />
              <div className="relative w-full h-full bg-white/[0.12] rounded-3xl backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl">
                <span className={`${brand.logoSize} font-black text-white tracking-tighter`} style={{ textShadow: '0 0 40px rgba(255,255,255,0.15)' }}>{brand.logo}</span>
              </div>
            </div>
          </div>

          <h1 className="text-6xl font-black text-white mb-4 tracking-tight animate-slide-up" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>
            {brand.name}
          </h1>
          <div className="flex items-center justify-center gap-3 mb-6 animate-slide-up-delay">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" />
            <div
              className={`w-2 h-2 rounded-full shadow-lg ${!custom ? 'bg-accent shadow-accent/50' : ''}`}
              style={custom ? { backgroundColor: c.accent, boxShadow: `0 0 8px ${c.accentGlow}` } : undefined}
            />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" />
          </div>
          <p className="text-lg text-white/50 max-w-sm mx-auto leading-relaxed animate-slide-up-delay-2 font-light">
            {brand.subtitle}
          </p>

          {/* Feature pills */}
          <div className="mt-14 flex flex-wrap justify-center gap-3 animate-fade-in-delay">
            <span className="px-4 py-1.5 bg-white/[0.08] border border-white/10 rounded-full text-xs text-white/50 backdrop-blur-sm">
              Inventario
            </span>
            <span className="px-4 py-1.5 bg-white/[0.08] border border-white/10 rounded-full text-xs text-white/50 backdrop-blur-sm">
              Facturación
            </span>
            <span className="px-4 py-1.5 bg-white/[0.08] border border-white/10 rounded-full text-xs text-white/50 backdrop-blur-sm">
              Reportes
            </span>
          </div>
        </div>

        {/* Línea decorativa inferior con glow */}
        <div className="absolute bottom-0 left-0 right-0">
          <div
            className={`h-px ${!custom ? 'bg-gradient-to-r from-transparent via-accent/40 to-transparent' : ''}`}
            style={custom ? { background: `linear-gradient(to right, transparent, ${c.accent}66, transparent)` } : undefined}
          />
          <div className="h-8 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Destellos en las esquinas */}
        <div className="absolute top-8 left-8 w-32 h-32 bg-gradient-radial from-white/[0.06] to-transparent" />
        <div
          className={`absolute bottom-8 right-8 w-40 h-40 ${!custom ? 'bg-gradient-radial from-accent/[0.06] to-transparent' : ''}`}
          style={custom ? { background: `radial-gradient(circle, ${c.accent}0F, transparent)` } : undefined}
        />
      </div>

      {/* Panel Derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center bg-bg-base p-6 sm:p-12 relative overflow-hidden">
        {/* Decoraciones de fondo */}
        <div
          className={`absolute -top-40 -right-40 w-[30rem] h-[30rem] rounded-full blur-3xl ${!custom ? 'bg-primary/[0.03]' : ''}`}
          style={custom ? { backgroundColor: `${c.panel}08` } : undefined}
        />
        <div
          className={`absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-2xl ${!custom ? 'bg-accent/[0.04]' : ''}`}
          style={custom ? { backgroundColor: `${c.accent}0A` } : undefined}
        />
        <div className="absolute top-1/4 right-12 w-1 h-32 bg-gradient-to-b from-transparent via-primary/[0.06] to-transparent" />

        <div className="relative z-10 w-full max-w-md">
          {/* Logo para móvil */}
          <div className="lg:hidden text-center mb-10 animate-scale-in">
            <div className="relative w-18 h-18 mx-auto mb-4">
              <div
                className={`absolute inset-0 rounded-2xl blur-lg ${!custom ? 'bg-primary/30' : ''}`}
                style={custom ? { backgroundColor: `${c.panel}4D` } : undefined}
              />
              <div
                className={`relative w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-xl ${!custom ? 'bg-primary shadow-primary/30' : ''}`}
                style={custom ? { backgroundColor: c.panel, boxShadow: `0 10px 15px ${c.panel}4D` } : undefined}
              >
                <span className="text-2xl font-black text-text-inverted">{brand.logo}</span>
              </div>
            </div>
            <h1 className="text-xl font-bold text-text-base">{brand.name}</h1>
            <div
              className={`w-8 h-0.5 mx-auto rounded-full mt-2 ${!custom ? 'bg-accent' : ''}`}
              style={custom ? { backgroundColor: c.accent } : undefined}
            />
          </div>

          {/* Tarjeta del formulario */}
          <div className="bg-bg-content rounded-2xl shadow-2xl shadow-black/[0.08] border border-bg-subtle/50 p-8 sm:p-10 animate-fade-in relative overflow-hidden">
            {/* Barra superior */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${loading ? 'bg-bg-subtle overflow-hidden' : redirecting ? 'bg-success' : ''} transition-colors duration-500`}>
              {!loading && !redirecting && (
                <div
                  className={`h-full w-full ${!custom ? 'bg-gradient-to-r from-primary via-accent to-primary' : ''}`}
                  style={custom ? { background: `linear-gradient(to right, ${c.panel}, ${c.accent}, ${c.panel})` } : undefined}
                />
              )}
              {loading && (
                <div
                  className={`h-full w-1/3 rounded-full animate-[shimmer_1s_ease-in-out_infinite] ${!custom ? 'bg-gradient-to-r from-primary via-accent to-primary' : ''}`}
                  style={custom ? { background: `linear-gradient(to right, ${c.panel}, ${c.accent}, ${c.panel})` } : undefined}
                />
              )}
            </div>

            {/* Overlay de redirección */}
            {redirecting && (
              <div className="absolute inset-0 z-20 bg-bg-content/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-fade-in rounded-2xl">
                <div className="relative">
                  <div className="absolute inset-0 bg-success/20 rounded-full blur-xl animate-pulse-glow" />
                  <div className="relative w-16 h-16 bg-success/10 rounded-full flex items-center justify-center border-2 border-success/30 animate-scale-in">
                    <FaCheck className="text-success" size={28} />
                  </div>
                </div>
                <div className="text-center animate-slide-up">
                  <p className="text-lg font-semibold text-text-base">{message}</p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <LuLoader className="animate-spin text-primary" size={14} />
                    <p className="text-sm text-text-muted">Preparando tu espacio de trabajo...</p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mb-8 animate-slide-up">
              <h2 className="text-2xl font-bold text-text-base">Bienvenido de nuevo</h2>
              <p className="mt-2 text-sm text-text-muted">Inicia sesión en tu cuenta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm flex items-start gap-2 animate-slide-up" role="alert">
                  <strong className="font-semibold shrink-0">Error:</strong>
                  <span>{error}</span>
                </div>
              )}
              <div className="animate-slide-up-delay">
                <label htmlFor="username" className="block text-sm font-medium text-text-muted mb-1.5">
                  Usuario
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  disabled={loading || redirecting}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`input ${(loading || redirecting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Tu nombre de usuario o email"
                />
              </div>
              <div className="animate-slide-up-delay-2">
                <label htmlFor="password" className="block text-sm font-medium text-text-muted mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    disabled={loading || redirecting}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`input pr-11 ${(loading || redirecting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || redirecting}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted/50 hover:text-primary transition-colors duration-200 disabled:opacity-50"
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="pt-2 animate-fade-in-delay">
                <button
                  type="submit"
                  disabled={loading || redirecting}
                  className={`group w-full flex justify-center items-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-semibold text-text-inverted shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-xl ${!custom ? 'bg-primary hover:bg-primary/90 focus:ring-primary shadow-primary/25 hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-offset-2' : ''}`}
                  style={custom ? { backgroundColor: c.panel, boxShadow: `0 10px 25px ${c.panel}40` } : undefined}
                >
                  {loading ? <LuLoader className="animate-spin" size={18} /> : <BiSave size={18} className="transition-transform duration-300 group-hover:scale-110" />}
                  {loading ? 'Verificando...' : 'Iniciar Sesión'}
                </button>
                {message && !redirecting && (
                  <div className="flex items-center justify-center gap-2 mt-4 animate-fade-in">
                    <LuLoader className="animate-spin text-primary" size={14} />
                    <span className="text-sm text-text-muted">{message}</span>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Pie sutil */}
          <p className="text-center text-xs text-text-muted/30 mt-8 tracking-widest uppercase animate-fade-in-delay">
            {brand.footer}
          </p>
        </div>
      </div>
    </div>
  );
}
