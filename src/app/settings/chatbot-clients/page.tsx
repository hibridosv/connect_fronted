'use client';
import { Alert } from '@/components/Alert/Alert';
import { Button, Preset } from '@/components/button/button';
import { Loader } from '@/components/Loader';
import { ToasterMessage } from '@/components/toaster-message';
import { ViewTitle } from '@/components/ViewTitle';
import chatbotSettingsStore from '@/stores/chatbot/chatbotSettingsStore';
import { useEffect, useState } from 'react';

export default function Page() {
  const { settings, loading, saving, loadSettings, updateSettings } = chatbotSettingsStore();
  const [businessInfo, setBusinessInfo] = useState('');

  useEffect(() => { loadSettings(); }, [loadSettings]);
  useEffect(() => { setBusinessInfo(settings?.business_info ?? ''); }, [settings?.business_info]);

  if (loading && !settings) return <div className="flex justify-center mt-10"><Loader size="35" /></div>;
  if (!settings) return <div className="p-4"><Alert type="danger" text="No se pudo cargar la configuración del chatbot." /></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-6 md:border-r md:border-primary">
        <ViewTitle text="Chatbot de WhatsApp para clientes" />
        <div className="mx-4 space-y-4">
          {!settings.enabled && (
            <Alert type="info" text="El chatbot no está activo. Actívalo en Configuraciones > Principal (Activar el chatbot de WhatsApp para clientes)." />
          )}
          {settings.enabled && !settings.whatsapp_connected && (
            <Alert type="warning" text="Aún no llega ningún mensaje de WhatsApp. Pide a Hibrido que registre el número del negocio." />
          )}
          {settings.limit_reached && (
            <Alert type="danger" text="Se llegó al tope de respuestas del bot de este mes: las conversaciones se responden a mano hasta el próximo mes." />
          )}

          <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold">Bot activo en todas las conversaciones</div>
              <div className="text-sm text-text-muted">Al apagarlo, el bot no responde en ningún número y todas las conversaciones se atienden a mano. Cada conversación conserva su estado al volver a encenderlo.</div>
            </div>
            <label className="inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" className="sr-only peer" checked={settings.global_bot_enabled} disabled={saving}
                onChange={(e) => updateSettings({ global_bot_enabled: e.target.checked })} />
              <div className="relative w-11 h-6 bg-bg-subtle rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </div>

          {settings.is_restaurant && (
            <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-4 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold">Aceptando pedidos</div>
                  <div className="text-sm text-text-muted">Apagado, el bot no manda enlaces de pedido y la pantalla de pedido no deja confirmar (p. ej. cocina saturada o fuera de horario).</div>
                </div>
                <label className="inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={settings.accepting_orders} disabled={saving}
                    onChange={(e) => updateSettings({ accepting_orders: e.target.checked })} />
                  <div className="relative w-11 h-6 bg-bg-subtle rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
              <div>
                <label className="input-label">Cuando el cliente confirma un pedido</label>
                <select className="input-select w-full" value={settings.orders_to_kitchen} disabled={saving}
                  onChange={(e) => updateSettings({ orders_to_kitchen: Number(e.target.value) })}>
                  <option value={1}>Espera a que alguien lo acepte (se cancela solo a los 30 minutos)</option>
                  <option value={2}>Entra directo a cocina a nombre del usuario WhatsApp</option>
                </select>
              </div>
              <p className="text-sm text-text-muted">Los platillos que se ofrecen se eligen en Restaurante &gt; Productos de Menu, con la opción &quot;Ofrecer en WhatsApp&quot; de cada producto.</p>
            </div>
          )}

          <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-4 space-y-2">
            <label className="input-label">Información del negocio para el bot</label>
            <p className="text-sm text-text-muted">Horario, zonas y costo de entrega, formas de pago, dirección. El bot la usa para responder; no puede cambiar sus reglas (no inventa precios ni existencias).</p>
            <textarea className="input w-full" rows={8} maxLength={4000} value={businessInfo} onChange={(e) => setBusinessInfo(e.target.value)} />
            <div className="flex justify-end">
              <Button preset={saving ? Preset.saving : Preset.save} disabled={saving} onClick={() => updateSettings({ business_info: businessInfo })} />
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-4">
        <ViewTitle text="¿Cómo funciona?" />
        <ul className="px-6 list-disc space-y-2 text-sm text-text-base">
          {settings.is_restaurant ? (
            <>
              <li>El bot responde dudas del menú de WhatsApp y, cuando el cliente quiere pedir, le manda un enlace que vence a los 5 minutos sin actividad.</li>
              <li>El cliente elige platillos y opciones, si es para llevar o a domicilio y cómo paga. El pedido aparece en <b>Pedidos de WhatsApp</b> para aceptarlo y mandarlo a cocina.</li>
            </>
          ) : (
            <>
              <li>El bot responde a tus clientes por WhatsApp: precios, existencias y fotos de los productos activos.</li>
              <li>Arma el pedido con el cliente y, al confirmarlo, aparece en <b>Pedidos de WhatsApp</b>. Ahí lo conviertes en venta como una cotización.</li>
            </>
          )}
          <li>En <b>Conversaciones</b> puedes tomar el control de un chat: el bot deja de responder en ese número por 12 horas o hasta que lo devuelvas.</li>
          <li>WhatsApp solo permite escribir libremente dentro de las 24 horas siguientes al último mensaje del cliente.</li>
        </ul>
      </div>
      <ToasterMessage />
    </div>
  );
}
