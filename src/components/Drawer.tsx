'use client';
import { MenuItem, menuItems } from "@/lib/menuItems";
import { isRestaurant, permissionExists } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { useThemeStore } from "@/stores/themeStore";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from 'next/link';
import { FC, useState } from "react";
import { FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

// --- SubMenu Component ---
const SubMenu: FC<{ item: MenuItem; onClose: () => void; permissions: any }> = ({ item, onClose, permissions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(!isOpen);
  const { tenant } = useConfigStore();
  const isRest = isRestaurant(tenant?.system);

  const visibleChildren = item.children?.filter(
    (child) => !child.permission || permissionExists(permissions, child.permission)
  );

  if (!visibleChildren || visibleChildren.length === 0) return null;

  return (
    <li className="mb-2">
      <button
        onClick={handleToggle}
        className="w-full flex justify-between items-center p-2 rounded text-text-inverted/90 hover:bg-white/10 hover:text-text-inverted"
      >
        <span className="flex">{item.icon}{item.label}</span>
        <FaChevronDown
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          size={14}
        />
      </button>
      {isOpen && (
        <ul className="pl-2 pt-2">
          {visibleChildren.map((child, index) => (
            <li key={index} className="mb-1">
              <Link
                href={child.href!}
                onClick={onClose}
                className="block p-2 rounded text-text-inverted/70 hover:bg-white/10 hover:text-text-inverted"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

// --- Drawer Component ---
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const Drawer: FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useThemeStore();
  const { tenant, permission } = useConfigStore();
  if (!isOpen) return null;

  const hasAnyPermission = (perms: string[]): boolean => {
    return perms.some(p => permissionExists(permission, p));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 transition-opacity"
      onClick={onClose}
    >
      <div
        className={`left-0 top-0 h-full w-[85vw] max-w-[16rem] sm:w-64 shadow-lg z-50 transform transition-all duration-500 ease-in-out flex flex-col relative bg-[url('/img/sidenav.jpg')] bg-cover bg-center ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
        style={{ transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}
      >
        {/* Overlay para la opacidad del fondo */}
        <div className="absolute inset-0 bg-primary/80 z-0"></div>

        {/* Header */}
        <div className="relative m-2 p-4 border-b border-white/10 flex-shrink-0 z-10">
          <div className="w-full h-8">
            <Image
                  src={`/img/${[1, 2].includes(tenant?.system)
                    ? 'logo_hibrido_s'
                    : 'logo_latam_s'}.png`}
                  alt="Logo Hibrido SV"
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
          </div>
          <button onClick={onClose} className="absolute top-2 right-2 z-10 text-text-inverted/70 hover:text-text-inverted">
            <IoClose size={24} />
          </button>
        </div>

        {/* Menu List (Scrollable)*/}
        <div className="flex-grow overflow-y-auto z-10 custom-scrollbar relative">
          <ul className="p-4 relative z-10">
            {menuItems
              .filter(item => !(item.label === "Restaurante" && !isRest))
              .map((item, index) => {
                if (item.children) {
                  if (item.permissions && !hasAnyPermission(item.permissions)) return null;
                  return <SubMenu key={index} item={item} onClose={onClose} permissions={permission} />;
                }

              if (item.permission && !permissionExists(permission, item.permission)) return null;

              return (
                <li key={index} className="mb-2">
                  <Link
                    href={item.href!}
                    onClick={onClose}
                    className="p-2 rounded text-text-inverted/90 hover:bg-white/10 hover:text-text-inverted flex"
                  >
                   {item.icon}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* <div className="flex justify-center items-center p-2 gap-3 z-10 bg-primary/95">
            <button
              title="MDB"
              onClick={() => setTheme('mdb')}
              className={`w-6 h-6 rounded-full transition-all ${theme === 'mdb' ? 'ring-2 ring-offset-2 ring-offset-primary ring-white' : ''}`}
              style={{ backgroundColor: '#243A51' }}
            />
            <button
              title="Azul"
              onClick={() => setTheme('blue')}
              className={`w-6 h-6 rounded-full transition-all ${theme === 'blue' ? 'ring-2 ring-offset-2 ring-offset-primary ring-white' : ''}`}
              style={{ backgroundColor: '#162B69' }}
            />
            <button
              title="Verde"
              onClick={() => setTheme('green')}
              className={`w-6 h-6 rounded-full transition-all ${theme === 'green' ? 'ring-2 ring-offset-2 ring-offset-primary ring-white' : ''}`}
              style={{ backgroundColor: '#0C381F' }}
            />
            <button
              title="Navy"
              onClick={() => setTheme('navy')}
              className={`w-6 h-6 rounded-full transition-all ${theme === 'navy' ? 'ring-2 ring-offset-2 ring-offset-primary ring-white' : ''}`}
              style={{ backgroundColor: '#223E5A' }}
            />
        </div> */}

        {/* Footer (Logout) */}
        <div className="p-2 border-t border-white/10 flex-shrink-0 font-semibold z-10 bg-primary/95">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center p-2 rounded text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <FaSignOutAlt className="mr-2" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
