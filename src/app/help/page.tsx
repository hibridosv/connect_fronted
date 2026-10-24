'use client';

import { isProducts, isRestaurant } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  LuArrowRight,
  LuBookOpen,
  LuChevronDown,
  LuChevronRight,
  LuCircleAlert,
  LuCircleCheckBig,
  LuLightbulb,
  LuListOrdered,
  LuMapPin,
  LuSearch,
  LuSlidersHorizontal,
  LuX,
} from 'react-icons/lu';
import { HelpGuide, HelpSection, HelpSubsection, HelpSystem, SECTIONS } from './sections';

/** Texto de una subseccion donde se busca */
const subsectionText = (sub: HelpSubsection) => [
  sub.title,
  sub.description,
  sub.menu ?? '',
  ...(sub.features ?? []),
  ...(sub.tips ?? []),
  ...(sub.warnings ?? []),
  ...(sub.guides ?? []).flatMap((guide) => [guide.title, ...guide.steps]),
].join(' ').toLowerCase();

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-text-base">
      <LuCircleCheckBig size={14} className="text-success mt-0.5 shrink-0" />
      <span>{text}</span>
    </li>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-xs text-text-muted">
      <LuLightbulb size={13} className="text-warning mt-0.5 shrink-0" />
      <span>{text}</span>
    </li>
  );
}

function WarningItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-xs text-danger">
      <LuCircleAlert size={13} className="mt-0.5 shrink-0" />
      <span>{text}</span>
    </li>
  );
}

function GuideSteps({ guide }: { guide: HelpGuide }) {
  return (
    <div className="bg-bg-base border border-bg-subtle rounded-lg px-3 py-3">
      <p className="text-sm font-bold text-text-base mb-2.5 flex items-center gap-2">
        <LuListOrdered size={14} className="text-primary shrink-0" /> {guide.title}
      </p>
      <ol className="space-y-2">
        {guide.steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-text-base">
            <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <span className="leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SubsectionCard({ sub, defaultOpen }: { sub: HelpSubsection; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => { setOpen(defaultOpen); }, [defaultOpen]);

  return (
    <div className="bg-bg-content border border-bg-subtle rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 hover:bg-bg-subtle/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-primary shrink-0">{sub.icon}</span>
          <span className="font-bold text-text-base text-sm">{sub.title}</span>
          {sub.guides && sub.guides.length > 0 && (
            <span className="hidden sm:inline text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">
              {sub.guides.length} {sub.guides.length === 1 ? 'guía' : 'guías'}
            </span>
          )}
        </div>
        <LuChevronDown
          size={16}
          className={`text-text-muted transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-bg-subtle/60">
          <p className="text-sm text-text-muted pt-3 leading-relaxed">{sub.description}</p>

          {(sub.menu || sub.route) && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              {sub.menu && (
                <p className="text-xs text-text-muted flex items-center gap-1.5">
                  <LuMapPin size={12} className="text-primary shrink-0" />
                  <span>Dónde está: <strong className="text-text-base font-semibold">{sub.menu}</strong></span>
                </p>
              )}
              {sub.route && (
                <Link href={sub.route} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  Ir a la página <LuArrowRight size={12} />
                </Link>
              )}
            </div>
          )}

          {sub.guides && sub.guides.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Paso a paso</p>
              <div className="space-y-3">
                {sub.guides.map((guide, i) => (
                  <GuideSteps key={i} guide={guide} />
                ))}
              </div>
            </div>
          )}

          {sub.features && sub.features.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">En esta pantalla</p>
              <ul className="space-y-1.5">
                {sub.features.map((feature, i) => (
                  <FeatureItem key={i} text={feature} />
                ))}
              </ul>
            </div>
          )}

          {sub.tips && sub.tips.length > 0 && (
            <div className="bg-warning/5 border border-warning/20 rounded-lg px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-warning mb-1.5 flex items-center gap-1.5">
                <LuLightbulb size={11} /> Consejos
              </p>
              <ul className="space-y-1">
                {sub.tips.map((tip, i) => (
                  <TipItem key={i} text={tip} />
                ))}
              </ul>
            </div>
          )}

          {sub.warnings && sub.warnings.length > 0 && (
            <div className="bg-danger/5 border border-danger/20 rounded-lg px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-danger mb-1.5 flex items-center gap-1.5">
                <LuCircleAlert size={11} /> Advertencias
              </p>
              <ul className="space-y-1">
                {sub.warnings.map((warning, i) => (
                  <WarningItem key={i} text={warning} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const { tenant } = useConfigStore();
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const systemIsRestaurant = isRestaurant(tenant?.system);
  const systemIsProducts = isProducts(tenant?.system);

  const visibleSections = useMemo(() => {
    // solo lo que aplica al tipo de sistema del negocio
    const appliesTo = (system?: HelpSystem) => {
      if (system === 'restaurant') return systemIsRestaurant;
      if (system === 'products') return systemIsProducts;
      return true;
    };
    return SECTIONS
      .filter((s) => appliesTo(s.system))
      .map((s) => ({ ...s, subsections: s.subsections.filter((sub) => appliesTo(sub.system)) }));
  }, [systemIsRestaurant, systemIsProducts]);

  const currentSection = useMemo(
    () => visibleSections.find((s) => s.id === activeSection) ?? visibleSections[0],
    [activeSection, visibleSections]
  );

  const filteredSections = useMemo((): HelpSection[] => {
    if (!searchTerm.trim()) return visibleSections;
    const term = searchTerm.toLowerCase();
    return visibleSections
      .map((section) => ({
        ...section,
        subsections: section.subsections.filter((sub) => subsectionText(sub).includes(term)),
      }))
      .filter((s) => s.subsections.length > 0);
  }, [searchTerm, visibleSections]);

  const isSearching = searchTerm.trim().length > 0;
  const resultsCount = filteredSections.reduce((total, s) => total + s.subsections.length, 0);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setSearchTerm('');
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (!isSearching) {
      const ref = sectionRefs.current[activeSection];
      if (ref) ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeSection, isSearching]);

  return (
    <div className="bg-bg-base min-h-screen pb-8">
      <div className="px-4 py-3 border-b border-bg-subtle bg-bg-content">
        <div className="flex items-center justify-between gap-4 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2.5">
            <LuBookOpen size={20} className="text-primary" />
            <h1 className="text-lg font-extrabold uppercase text-primary tracking-wide">
              Manual de Usuario
            </h1>
          </div>
          <div className="relative w-full max-w-xs">
            <LuSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10" />
            <input
              type="text"
              placeholder="¿Qué necesita hacer? Ej: cerrar caja"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input !pl-8 pr-3 py-1.5 text-sm w-full"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-danger"
              >
                <LuX size={13} />
              </button>
            )}
          </div>
          <button
            className="md:hidden shrink-0 p-2 rounded-lg border border-bg-subtle text-text-muted hover:bg-bg-subtle"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <LuSlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto flex gap-0 md:gap-6 px-0 md:px-4 pt-4">
        <aside
          className={`
            fixed md:static inset-0 z-30 md:z-auto bg-bg-base/95 md:bg-transparent
            transition-transform duration-300 md:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            w-64 shrink-0
          `}
        >
          <div className="md:sticky md:top-16 bg-bg-content border border-bg-subtle rounded-lg overflow-hidden">
            <div className="px-3 py-2.5 border-b border-bg-subtle flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Módulos</p>
              <button
                className="md:hidden text-text-muted hover:text-danger"
                onClick={() => setSidebarOpen(false)}
              >
                <LuX size={15} />
              </button>
            </div>
            <nav className="py-1 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
              {visibleSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                    currentSection.id === section.id && !isSearching
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-text-base hover:bg-bg-subtle'
                  }`}
                >
                  <span className={section.color}>{section.icon}</span>
                  <span className="truncate">{section.label}</span>
                  {currentSection.id === section.id && !isSearching && (
                    <LuChevronRight size={13} className="ml-auto text-primary" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-w-0 px-4 md:px-0 space-y-6">
          {isSearching ? (
            <>
              {filteredSections.length === 0 ? (
                <div className="text-center py-16 text-text-muted">
                  <LuSearch size={36} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No se encontraron resultados para <strong>&ldquo;{searchTerm}&rdquo;</strong></p>
                  <p className="text-xs mt-1">Intente con otra palabra, por ejemplo: cobrar, gasto, crédito, factura.</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-text-muted">
                    {resultsCount} {resultsCount === 1 ? 'resultado' : 'resultados'} para <strong>&ldquo;{searchTerm}&rdquo;</strong>
                  </p>
                  {filteredSections.map((section) => (
                    <div key={section.id}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={section.color}>{section.icon}</span>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted">
                          {section.label}
                        </h2>
                      </div>
                      <div className="space-y-3">
                        {section.subsections.map((sub) => (
                          <SubsectionCard key={sub.id} sub={sub} defaultOpen={true} />
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          ) : (
            <div
              ref={(el) => { sectionRefs.current[currentSection.id] = el; }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className={`${currentSection.color} text-xl`}>{currentSection.icon}</span>
                <h2 className="text-xl font-extrabold uppercase tracking-wide text-primary">
                  {currentSection.label}
                </h2>
                <span className="text-xs text-text-muted bg-bg-subtle px-2 py-0.5 rounded-full">
                  {currentSection.subsections.length} {currentSection.subsections.length === 1 ? 'tema' : 'temas'}
                </span>
              </div>
              {currentSection.description && (
                <p className="text-sm text-text-muted mb-4 leading-relaxed">{currentSection.description}</p>
              )}

              <div className="space-y-3">
                {currentSection.subsections.map((sub, i) => (
                  <SubsectionCard key={sub.id} sub={sub} defaultOpen={i === 0} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <LuLightbulb size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-primary mb-1">¿Necesita más ayuda?</p>
                <p className="text-xs text-text-muted leading-relaxed">
                  Si una opción de esta guía no le aparece, puede que su usuario no tenga el permiso o que la función no esté activada
                  para su negocio: consulte con el administrador. Para otras dudas contacte al equipo de soporte técnico e indique
                  el módulo y la acción que intenta realizar.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
