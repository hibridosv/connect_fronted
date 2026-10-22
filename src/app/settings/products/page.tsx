'use client';
import SettingsBrandList from "@/components/settings/SettingsBrandList";
import SettingsCashDrawerList from "@/components/settings/SettingsCashDrawerList";
import SettingsCategoryList from "@/components/settings/SettingsCategoryList";
import SettingsCreditForm from "@/components/settings/SettingsCreditForm";
import SettingsDocumentList from "@/components/settings/SettingsDocumentList";
import SettingsLocationList from "@/components/settings/SettingsLocationList";
import SettingsQuantityUnitList from "@/components/settings/SettingsQuantityUnitList";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { permissionExists } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { useState } from "react";
import { menuOptions } from "./menuOptions";

export default function Page() {
  const { activeConfig, permission } = useConfigStore();
  const [screen, setScreen] = useState(1);

  const changes = permissionExists(permission, 'config-changes');
  const creditChanges = permissionExists(permission, 'credits-settings');
  const showCredits = activeConfig && activeConfig?.includes('sales-credit');
  const showBrands = activeConfig && activeConfig?.includes('product-brand');
  const showLocations = activeConfig && activeConfig?.includes('product-locations');

  const visibilityMap: Record<number, boolean> = {
    1: true,
    2: true,
    3: !!showBrands,
    4: !!showLocations,
    5: true,
    6: true,
    7: !!showCredits,
  };

  const visibleOptions = menuOptions.filter((o) => visibilityMap[o.value]);

  const renderContent = () => {
    switch (screen) {
      case 1: return <SettingsCategoryList />;
      case 2: return <SettingsQuantityUnitList />;
      case 3: return <SettingsBrandList />;
      case 4: return <SettingsLocationList />;
      case 5: return <SettingsDocumentList changes={changes} />;
      case 6: return <SettingsCashDrawerList changes={changes} />;
      case 7: return <SettingsCreditForm changes={creditChanges} />;
      default: return null;
    }
  };

  return (
    <div className="pb-4 md:pb-10">
      <ViewTitle text="Configuración de Productos" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">

        <div className="md:col-span-3">
          <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden">
            <div className="px-4 py-3 bg-bg-subtle/60 border-b border-bg-subtle">
              <span className="text-sm font-semibold text-text-base">Seleccione una opción</span>
            </div>
            {visibleOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setScreen(option.value)}
                className={`w-full flex items-center px-4 py-3 text-sm transition-colors border-b border-bg-subtle last:border-b-0 ${
                  screen === option.value
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-text-muted hover:bg-bg-subtle/50"
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-9">
          <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden">
            {renderContent()}
          </div>
        </div>
      </div>
      <ToasterMessage />
    </div>
  );
}
