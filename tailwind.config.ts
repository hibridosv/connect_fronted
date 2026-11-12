
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      // Tamaños menores que text-xs (12px) para pantallas densas; solo cambian el font-size
      fontSize: {
        xxs: '11px',
        '2xs': '10px',
        '3xs': '9px',
      },
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'text-base': 'rgb(var(--color-text-base) / <alpha-value>)',
        'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',
        'text-inverted': 'rgb(var(--color-text-inverted) / <alpha-value>)',
        'bg-base': 'rgb(var(--color-bg-base) / <alpha-value>)',
        'bg-content': 'rgb(var(--color-bg-content) / <alpha-value>)',
        'bg-subtle': 'rgb(var(--color-bg-subtle) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        info: 'rgb(var(--color-info) / <alpha-value>)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite reverse',
        'float-diagonal': 'floatDiagonal 10s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out both',
        'slide-up-delay': 'slideUp 0.6s ease-out 0.15s both',
        'slide-up-delay-2': 'slideUp 0.6s ease-out 0.3s both',
        'fade-in': 'fadeIn 0.8s ease-out both',
        'fade-in-delay': 'fadeIn 0.8s ease-out 0.3s both',
        'scale-in': 'scaleIn 0.5s ease-out both',
        'orbit': 'orbit 20s linear infinite',
        'orbit-reverse': 'orbit 25s linear infinite reverse',
        'bump': 'bump 0.35s ease-out',
        // Login: salida suave (ease-out-expo) y recorridos cortos
        'login-enter': 'loginEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'login-rise': 'loginRise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'login-swap': 'loginSwap 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
        'login-logo': 'loginLogo 1s cubic-bezier(0.16, 1, 0.3, 1) both',
        'login-breathe': 'loginBreathe 6s ease-in-out infinite',
        'login-shake': 'loginShake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
        'login-pop': 'loginPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'login-ring': 'loginRing 1.2s ease-out 0.15s both',
        'login-progress': 'loginProgress 1.1s ease-in-out infinite',
      },
      keyframes: {
        loginEnter: {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.985)', filter: 'blur(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
        },
        loginRise: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        loginSwap: {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        loginLogo: {
          '0%': { opacity: '0', transform: 'scale(0.94)', filter: 'blur(6px)' },
          '100%': { opacity: '1', transform: 'scale(1)', filter: 'blur(0)' },
        },
        loginBreathe: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1.1)' },
          '50%': { opacity: '1', transform: 'scale(1.18)' },
        },
        loginShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        },
        loginPop: {
          '0%': { opacity: '0', transform: 'scale(0.6)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        loginRing: {
          '0%': { opacity: '0.5', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.7)' },
        },
        loginProgress: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(300%)' },
        },
        bump: {
          '0%, 100%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.06)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floatDiagonal: {
          '0%, 100%': { transform: 'translate(0px, 0px)' },
          '33%': { transform: 'translate(10px, -15px)' },
          '66%': { transform: 'translate(-8px, -10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
