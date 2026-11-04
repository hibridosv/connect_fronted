'use client';
import { Alert } from '@/components/Alert/Alert';
import { Button, Preset } from '@/components/button/button';
import { Loader } from '@/components/Loader';
import { ToasterMessage } from '@/components/toaster-message';
import { ViewTitle } from '@/components/ViewTitle';
import chatbotSettingsStore from '@/stores/chatbot/chatbotSettingsStore';
import { useEffect, useState } from 'react';

type ProfileField = 'schedule' | 'delivery_info' | 'payment_info' | 'faq' | 'business_info';

// campos guiados del prompt: cada negocio los llena con sus datos; el bot solo responde con lo que hay aqui
const PROFILE_FIELDS: { key: ProfileField; label: string; max: number; rows: number; example: string; restaurantExample?: string }[] = [
  { key: 'schedule', label: 'Horario de atención', max: 500, rows: 2, example: 'Lunes a viernes de 8:00 a 18:00, sábados de 8:00 a 13:00. Domingos cerrado.' },
  { key: 'delivery_info', label: 'Entregas', max: 1000, rows: 3, example: 'Entregamos en San Salvador y Antiguo Cuscatlán. Envío $2.50, gratis en compras mayores a $30. Llega el mismo día si pides antes de las 3 pm.', restaurantExample: 'Delivery en un radio de 5 km. El costo de envío se suma al pedido. Tiempo aproximado: 40 minutos.' },
  { key: 'payment_info', label: 'Formas de pago', max: 500, rows: 2, example: 'Efectivo, tarjeta de crédito o débito y transferencia a Banco Agrícola.' },
  { key: 'faq', label: 'Preguntas frecuentes', max: 3000, rows: 5, example: '¿Hacen factura? Sí, ticket, factura o crédito fiscal. ¿Tienen garantía? 30 días en herramientas eléctricas.', restaurantExample: '¿Tienen opciones vegetarianas? Sí, pregunta por el menú. ¿Hacen pedidos para eventos? Sí, con 2 días de anticipación.' },
  { key: 'business_info', label: 'Otros datos', max: 2000, rows: 3, example: 'Cualquier otra cosa que el bot deba saber del negocio.' },
];

const emptyProfile: Record<ProfileField, string> = { schedule: '', delivery_info: '', payment_info: '', faq: '', business_info: '' };

export default function Page() {
  const { settings, loading, saving, loadSettings, updateSettings } = chatbotSettingsStore();
  const [profile, setProfile] = useState<Record<ProfileField, string>>(emptyProfile);
  const [tone, setTone] = useState(1);

  useEffect(() => { loadSettings(); }, [loadSettings]);
  useEffect(() => {
    if (!settings) return;
    setProfile({
      schedule: settings.schedule ?? '',
      delivery_info: settings.delivery_info ?? '',
      payment_info: settings.payment_info ?? '',
      faq: settings.faq ?? '',
      business_info: settings.business_info ?? '',
    });
    setTone(settings.tone ?? 1);
  }, [settings]);

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

          <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-4 space-y-4">
            <div>
              <div className="font-semibold">Lo que el bot sabe del negocio</div>
              <p className="text-sm text-text-muted">El bot solo responde con estos datos: si un campo está vacío, ofrece que un asesor responda en lugar de inventar. Son solo datos; no cambian sus reglas (no hace descuentos ni inventa precios o existencias).</p>
            </div>

            <div className="text-sm rounded-lg bg-bg-subtle/40 p-3">
              <div><span className="font-semibold">Nombre:</span> {settings.business?.name || 'Sin nombre'}</div>
              <div><span className="font-semibold">Dirección:</span> {settings.business?.address || 'Sin dirección'}</div>
              <div><span className="font-semibold">Teléfono:</span> {settings.business?.phone || 'Sin teléfono'}</div>
              <div className="text-xs text-text-muted mt-1">Se toman de los datos del negocio; para cambiarlos pide a Hibrido que los actualice.</div>
            </div>

            <div>
              <label className="input-label">Tono de las respuestas</label>
              <select className="input-select w-full" value={tone} onChange={(e) => setTone(Number(e.target.value))}>
                <option value={1}>Cercano: tutea al cliente y usa algún emoji</option>
                <option value={2}>Formal: trata al cliente de usted, sin emojis</option>
              </select>
            </div>

            {PROFILE_FIELDS.map((field) => (
              <div key={field.key}>
                <label className="input-label">{field.label}</label>
                <textarea className="input w-full" rows={field.rows} maxLength={field.max}
                  placeholder={`Ej.: ${settings.is_restaurant && field.restaurantExample ? field.restaurantExample : field.example}`}
                  value={profile[field.key]} onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })} />
                <div className="text-xs text-text-muted text-right">{profile[field.key].length}/{field.max}</div>
              </div>
            ))}

            <div className="flex justify-end">
              <Button preset={saving ? Preset.saving : Preset.save} disabled={saving}
                onClick={() => updateSettings({ ...profile, tone })} />
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
