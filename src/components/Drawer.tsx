'use client';
import { MenuItem, menuItems } from "@/lib/menuItems";
import { isRestaurant, permissionExists } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { useThemeStore } from "@/stores/themeStore";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useState } from "react";
import { FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const DRAWER_KEYFRAMES = `
  @keyframes drawerIn {
    0%   { opacity: 0; transform: translateX(-100%) scale(0.98); }
    65%  { opacity: 1; transform: translateX(3px) scale(1.004); }
    100% { opacity: 1; transform: translateX(0) scale(1); }
  }
  @keyframes overlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes itemIn {
    0%   { opacity: 0; transform: translateX(-16px); }
    65%  { opacity: 1; transform: translateX(2px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  @keyframes subItemIn {
    0%   { opacity: 0; transform: translateX(-8px) scaleX(0.96); }
    100% { opacity: 1; transform: translateX(0) scaleX(1); }
  }
  @keyframes logoIn {
    0%   { opacity: 0; transform: translateY(-8px) scale(0.96); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes footerIn {
    0%   { opacity: 0; transform: translateY(6px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes shineSlide {
    0%   { transform: translateX(-100%) skewX(-18deg); opacity: 0.6; }
    60%  { opacity: 1; }
    100% { transform: translateX(400%) skewX(-18deg); opacity: 0; }
  }
  @keyframes accentPulse {
    0%, 100% { opacity: 0.7; transform: scaleY(1); }
    50%       { opacity: 1;   transform: scaleY(1.15); }
  }
`;

const SubMenu: FC<{
  item: MenuItem;
  onClose: () => void;
  permissions: any;
  index: number;
}> = ({ item, onClose, permissions, index }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const visibleChildren = item.children?.filter(
    (child) => !child.permission || permissionExists(permissions, child.permission)
  );

  if (!visibleChildren || visibleChildren.length === 0) return null;

  const hasActiveChild = visibleChildren.some(
    (child) => child.href && pathname.startsWith(child.href.split('?')[0])
  );

  return (
    <li style={{ animation: 'itemIn 0.38s cubic-bezier(0.22,1,0.36,1) both', animationDelay: `${index * 40}ms` }}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`w-full flex justify-between items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
          hasActiveChild
            ? 'bg-white/15 text-text-inverted'
            : 'text-text-inverted/75 hover:bg-white/10 hover:text-text-inverted'
        }`}
      >
        <span className="flex items-center gap-3 min-w-0">
          <span className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${hasActiveChild ? 'text-text-inverted' : 'text-text-inverted/60'}`}>
            {item.icon}
          </span>
          <span className="truncate">{item.label}</span>
        </span>
        <FaChevronDown
          size={10}
          className={`shrink-0 transition-transform duration-300 text-text-inverted/40 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <ul className="mt-1 ml-4 pl-3 border-l border-white/15 space-y-0.5 pb-1">
          {visibleChildren.map((child, i) => {
            const active = child.href
              ? pathname === child.href || pathname.startsWith(child.href.split('?')[0] + '/')
              : false;
            return (
              <li
                key={i}
                style={{ animation: 'subItemIn 0.22s cubic-bezier(0.22,1,0.36,1) both', animationDelay: `${i * 28}ms` }}
              >
                <Link
                  href={child.href!}
                  onClick={onClose}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-all duration-150 ${
                    active
                      ? 'bg-white/20 text-text-inverted font-semibold'
                      : 'text-text-inverted/55 hover:bg-white/10 hover:text-text-inverted hover:pl-3.5'
                  }`}
                >
                  {active && (
                    <span
                      className="shrink-0 w-1 h-3.5 rounded-full bg-text-inverted/60"
                      style={{ animation: 'accentPulse 2s ease-in-out infinite' }}
                    />
                  )}
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const Drawer: FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { setTheme } = useThemeStore();
  const { tenant, permission } = useConfigStore();
  const pathname = usePathname();

  if (!isOpen) return null;

  const hasAnyPermission = (perms: string[]): boolean =>
    perms.some((p) => permissionExists(permission, p));

  const isRest = isRestaurant(tenant?.system);

  let itemIndex = 0;

  return (
    <>
      <style>{DRAWER_KEYFRAMES}</style>

      <div
        className="fixed inset-0 z-50"
        style={{ animation: 'overlayIn 0.22s ease-out both' }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px]" />

        <div
          className="absolute left-0 top-0 h-full w-[86vw] max-w-[17rem] flex flex-col bg-primary shadow-[4px_0_40px_rgba(0,0,0,0.35)] overflow-hidden"
          style={{ animation: 'drawerIn 0.38s cubic-bezier(0.22,1,0.36,1) both' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Shine sweep */}
          <div
            className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
            style={{ animation: 'shineSlide 0.75s 0.12s ease-out both' }}
          >
            <div className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          </div>

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-white/30 via-white/10 to-transparent z-10" />

          {/* Header */}
          <div
            className="relative flex items-center justify-between px-4 pt-5 pb-4 border-b border-white/10 shrink-0"
            style={{ animation: 'logoIn 0.42s cubic-bezier(0.22,1,0.36,1) 0.08s both' }}
          >
            <div className="relative h-10 flex-1 mx-auto">
              <Image
                src={`/img/${[1, 2].includes(tenant?.system) ? 'logo_hibrido_s' : 'logo_latam_s'}.png`}
                alt="Logo"
                fill
                style={{ objectFit: 'contain', objectPosition: 'center' }}
                sizes="220px"
              />
            </div>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-xl text-text-inverted/40 hover:text-text-inverted hover:bg-white/10 transition-all duration-200 hover:rotate-90"
            >
              <IoClose size={16} />
            </button>
          </div>

          {/* Menu */}
          <div className="relative flex-grow overflow-y-auto custom-scrollbar">
            <ul className="px-2.5 py-3 space-y-0.5">
              {menuItems
                .filter((item) => !(item.label === 'Restaurante' && !isRest))
                .map((item) => {
                  const currentIndex = itemIndex++;

                  if (item.children) {
                    if (item.permissions && !hasAnyPermission(item.permissions)) return null;
                    return (
                      <SubMenu
                        key={item.label}
                        item={item}
                        onClose={onClose}
                        permissions={permission}
                        index={currentIndex}
                      />
                    );
                  }

                  if (item.permission && !permissionExists(permission, item.permission)) return null;

                  const active = item.href ? pathname === item.href : false;

                  return (
                    <li
                      key={item.label}
                      style={{ animation: 'itemIn 0.38s cubic-bezier(0.22,1,0.36,1) both', animationDelay: `${currentIndex * 40}ms` }}
                    >
                      <Link
                        href={item.href!}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                          active
                            ? 'bg-white/20 text-text-inverted'
                            : 'text-text-inverted/75 hover:bg-white/10 hover:text-text-inverted'
                        }`}
                      >
                        <span className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-text-inverted' : 'text-text-inverted/60'}`}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                        {active && (
                          <span
                            className="ml-auto w-1 h-3.5 rounded-full bg-text-inverted/50 shrink-0"
                            style={{ animation: 'accentPulse 2s ease-in-out infinite' }}
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>

          {/* Theme selector — commented intentionally */}
          {/* <div className="relative px-4 py-3 border-t border-bg-subtle shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-2">Tema</p>
            <div className="flex items-center gap-2.5">
              {THEMES.map((t) => (
                <button key={t.id} title={t.label} onClick={() => setTheme(t.id)}
                  className="w-5 h-5 rounded-full transition-all duration-200"
                  style={{ backgroundColor: t.color }}
                />
              ))}
            </div>
          </div> */}

          {/* Logout */}
          <div
            className="relative px-2.5 py-3 border-t border-white/10 shrink-0"
            style={{ animation: 'footerIn 0.35s cubic-bezier(0.22,1,0.36,1) 0.28s both' }}
          >
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2.5 px-3 py-2 rounded-xl text-sm text-text-inverted/55 hover:bg-white/10 hover:text-text-inverted transition-all duration-200 group"
            >
              <FaSignOutAlt size={13} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
