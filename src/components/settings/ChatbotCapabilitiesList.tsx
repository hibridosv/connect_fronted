'use client';
import { CAPABILITIES } from '@/app/settings/chatbot/chatbotConfig';
import { FaQuoteLeft } from 'react-icons/fa';

export function ChatbotCapabilitiesList() {
  return (
    <>
      <p className="text-sm text-text-muted mb-2 animate-fade-in">
        Tu negocio, a una pregunta de distancia. Escríbele por WhatsApp y obtén la respuesta al instante, sin abrir el sistema.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {CAPABILITIES.map((capability, index) => (
          <div
            key={capability.title}
            className="group flex flex-col gap-1.5 p-2.5 bg-bg-content rounded-lg shadow-sm border border-bg-subtle transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex gap-2.5">
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg text-base shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${capability.accent}`}>
                {capability.icon}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-text-base text-sm leading-tight">{capability.title}</div>
                <div className="text-xs text-text-muted mt-0.5 leading-snug">{capability.description}</div>
              </div>
            </div>
            <div className="flex items-start gap-1.5 text-xs text-text-muted/80 bg-bg-subtle/50 rounded-md px-2 py-1 mt-auto">
              <FaQuoteLeft size={8} className="shrink-0 mt-0.5 text-primary/50" />
              <span className="italic leading-snug">{capability.example}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
