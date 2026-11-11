'use client';
import { Spinner } from "@/components/Spinner";
import { Alert } from '@/components/Alert/Alert';
import { ChatbotProfileEditor } from '@/components/chatbot/profile/ChatbotProfileEditor';
import { ChatbotQuestionnaire } from '@/components/chatbot/profile/ChatbotQuestionnaire';
import { ChatbotSettingsCard } from '@/components/chatbot/settings/ChatbotSettingsCard';
import { ChatbotSettingSwitch } from '@/components/chatbot/settings/ChatbotSettingSwitch';
import { ChatbotSettingsSkeleton } from '@/components/skeleton/ChatbotSettingsSkeleton';
import { ViewTitle } from '@/components/ViewTitle';
import { useChatbotProfileLogic } from '@/hooks/chatbot/useChatbotProfileLogic';
import { ChatbotSettings } from '@/interfaces/chatbot';
import chatbotSettingsStore from '@/stores/chatbot/chatbotSettingsStore';
import { useEffect, useState } from 'react';
import { FaClock, FaComments, FaMagic, FaRobot, FaStore, FaUserCheck, FaUtensils, FaWhatsapp } from 'react-icons/fa';

export default function Page() {
  const { settings, loading, saving, loadSettings, updateSettings } = chatbotSettingsStore();
  const { profile, loading: loadingProfile, saving: savingProfile, saveQuestionnaire, generate, saveDraft, publish } = useChatbotProfileLogic();
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  // el spinner sale solo en el interruptor o la lista que se esta guardando
  const update = async (key: string, data: Partial<ChatbotSettings>) => {
    setUpdating(key);
    await updateSettings(data);
    setUpdating(null);
  };

  if (loading && !settings) return <ChatbotSettingsSkeleton />;
  if (!settings) return <div className="p-4"><Alert type="danger" text="No se pudo cargar la configuración del chatbot." /></div>;

  const steps = settings.is_restaurant ? [
    { icon: <FaUtensils />, accent: 'bg-warning/10 text-warning', text: 'El bot responde dudas del menú de WhatsApp y, cuando el cliente quiere pedir, le manda un botón con el menú que vence a los 5 minutos sin actividad.' },
    { icon: <FaStore />, accent: 'bg-success/10 text-success', text: 'El cliente elige platillos y opciones, si es para llevar o a domicilio y cómo paga. El pedido aparece en Pedidos de WhatsApp para aceptarlo y mandarlo a cocina.' },
  ] : [
    { icon: <FaStore />, accent: 'bg-warning/10 text-warning', text: 'El bot responde a tus clientes por WhatsApp: precios, existencias y fotos de los productos activos.' },
    { icon: <FaWhatsapp />, accent: 'bg-success/10 text-success', text: 'Arma el pedido con el cliente y, al confirmarlo, aparece en Pedidos de WhatsApp. Ahí lo conviertes en venta como una cotización.' },
  ];
  steps.push(
    { icon: <FaUserCheck />, accent: 'bg-primary/10 text-primary', text: 'En Conversaciones puedes tomar el control de un chat: el bot deja de responder en ese número por 12 horas o hasta que lo devuelvas.' },
    { icon: <FaClock />, accent: 'bg-info/10 text-info', text: 'WhatsApp solo permite escribir libremente dentro de las 24 horas siguientes al último mensaje del cliente.' },
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-6 md:border-r md:border-primary">
        <ViewTitle text="Chatbot de WhatsApp para clientes" />
        <div className="mx-4 space-y-4">
          {!settings.enabled && (
            <Alert type="info" className="animate-fade-in" text="El chatbot no está activo. Actívalo en Configuraciones > Principal (Activar el chatbot de WhatsApp para clientes)." />
          )}
          {settings.enabled && !settings.whatsapp_connected && (
            <Alert type="warning" className="animate-fade-in" text="Aún no llega ningún mensaje de WhatsApp. Pide a Hibrido que registre el número del negocio." />
          )}
          {settings.limit_reached && (
            <Alert type="danger" className="animate-fade-in" text="Se llegó al tope de respuestas del bot de este mes: las conversaciones se responden a mano hasta el próximo mes." />
          )}

          <ChatbotSettingsCard icon={<FaRobot />} accent="bg-primary/10 text-primary" title="Funcionamiento del bot">
            <div className="divide-y divide-bg-subtle -my-3">
              <div className="py-3">
                <ChatbotSettingSwitch title="Bot activo en todas las conversaciones" checked={settings.global_bot_enabled}
                  description="Al apagarlo, el bot no responde en ningún número y todas las conversaciones se atienden a mano. Cada conversación conserva su estado al volver a encenderlo."
                  updating={updating === 'global_bot_enabled'} disabled={saving} onChange={(checked) => update('global_bot_enabled', { global_bot_enabled: checked })} />
              </div>
              {settings.is_restaurant && (
                <>
                  <div className="py-3">
                    <ChatbotSettingSwitch title="Aceptando pedidos" checked={settings.accepting_orders}
                      description="Apagado, el bot no manda enlaces de pedido y la pantalla de pedido no deja confirmar (p. ej. cocina saturada o fuera de horario)."
                      updating={updating === 'accepting_orders'} disabled={saving} onChange={(checked) => update('accepting_orders', { accepting_orders: checked })} />
                  </div>
                  <div className="py-3">
                    <label className="input-label flex items-center gap-2">
                      Cuando el cliente confirma un pedido
                      {updating === 'orders_to_kitchen' && <Spinner size={14} />}
                    </label>
                    <select className="input-select w-full" value={settings.orders_to_kitchen} disabled={saving}
                      onChange={(e) => update('orders_to_kitchen', { orders_to_kitchen: Number(e.target.value) })}>
                      <option value={1}>Espera a que alguien lo acepte (se cancela solo a los 30 minutos)</option>
                      <option value={2}>Entra directo a cocina a nombre del usuario WhatsApp</option>
                    </select>
                    <p className="text-xs text-text-muted mt-2">Los platillos que se ofrecen se eligen en Restaurante &gt; Productos de Menu, con la opción &quot;Ofrecer en WhatsApp&quot; de cada producto.</p>
                  </div>
                </>
              )}
            </div>
          </ChatbotSettingsCard>

          <ChatbotSettingsCard icon={<FaStore />} accent="bg-warning/10 text-warning" title="Lo que el bot sabe del negocio" animation="animate-slide-up-delay"
            description="El bot solo responde con estos datos: si un campo está vacío, ofrece que un asesor responda en lugar de inventar. Son solo datos; no cambian sus reglas (no hace descuentos ni inventa precios o existencias).">
            <div className="space-y-4">
              <div className="rounded-lg border border-bg-subtle overflow-hidden">
                <div className="divide-y divide-bg-subtle text-sm">
                  {[['Nombre', settings.business?.name, 'Sin nombre'], ['Dirección', settings.business?.address, 'Sin dirección'], ['Teléfono', settings.business?.phone, 'Sin teléfono']].map(([label, value, empty]) => (
                    <div key={label} className="flex justify-between items-center gap-4 px-3 py-2">
                      <span className="text-text-muted">{label}</span>
                      <span className={`text-right ${value ? 'font-semibold text-text-base' : 'text-text-muted italic'}`}>{value || empty}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-bg-subtle/40 px-3 py-1.5 text-xs text-text-muted">Se toman de los datos del negocio; para cambiarlos pide a Hibrido que los actualice.</div>
              </div>

              {profile ? (
                <ChatbotQuestionnaire questionnaire={profile.questionnaire} tone={profile.tone} isRestaurant={settings.is_restaurant}
                  saving={savingProfile} onSave={saveQuestionnaire} />
              ) : loadingProfile && (
                <div className="space-y-3 animate-pulse">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="space-y-1.5">
                      <div className="h-3.5 bg-bg-subtle rounded-md w-1/3" />
                      <div className="h-16 bg-bg-subtle rounded-md w-full" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ChatbotSettingsCard>

          {profile && (
            <ChatbotSettingsCard icon={<FaMagic />} accent="bg-info/10 text-info" title="Perfil del negocio redactado con IA" animation="animate-slide-up-delay-2"
              description="La IA ordena y pule tus respuestas en un perfil para el bot. Revísalo, edítalo o pídele ajustes; el bot solo lo usa cuando lo publicas. Mientras no haya uno publicado, usa las respuestas tal como están.">
              <ChatbotProfileEditor profile={profile} saving={savingProfile} onGenerate={generate} onSaveDraft={saveDraft} onPublish={publish} />
            </ChatbotSettingsCard>
          )}
        </div>
      </div>

      <div className="md:col-span-4">
        <ViewTitle text="¿Cómo funciona?" />
        <div className="px-4 space-y-2">
          {steps.map((step, index) => (
            <div key={index} style={{ animationDelay: `${index * 80}ms` }}
              className="group flex gap-3 p-3 bg-bg-content rounded-lg shadow-sm border border-bg-subtle transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 animate-slide-up">
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${step.accent}`}>
                {step.icon}
              </div>
              <p className="text-sm text-text-base leading-snug">{step.text}</p>
            </div>
          ))}
          <div className="flex items-center gap-2 text-xs text-text-muted pt-2 animate-fade-in-delay">
            <FaComments className="text-primary/60" /> Las conversaciones y los pedidos están en el menú WhatsApp.
          </div>
        </div>
      </div>
    </div>
  );
}
