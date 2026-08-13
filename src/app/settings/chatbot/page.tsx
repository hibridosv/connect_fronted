'use client';
import { ChatbotCapabilitiesList } from '@/components/settings/ChatbotCapabilitiesList';
import { ChatbotPhoneCard } from '@/components/settings/ChatbotPhoneCard';
import { ToasterMessage } from '@/components/toaster-message';
import { ViewTitle } from '@/components/ViewTitle';
import { useChatbotLogic } from '@/hooks/settings/useChatbotLogic';
import { permissionExists } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';

export default function Page() {
  const { phoneNumber, loadingPhone, onSavePhone, saving } = useChatbotLogic();
  const { permission } = useConfigStore();

  const canManagePhone = permissionExists(permission, 'config-chatbot');

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-4 md:border-r md:border-primary">
        <ViewTitle text="Chatbot de WhatsApp" />
        <div className="mx-4">
          <ChatbotPhoneCard
            phoneNumber={phoneNumber}
            loadingPhone={loadingPhone}
            saving={saving}
            canManagePhone={canManagePhone}
            onSavePhone={onSavePhone}
          />
        </div>
      </div>

      <div className="md:col-span-6">
        <ViewTitle text="¿Qué puede hacer el chatbot?" />
        <div className="px-4">
          <ChatbotCapabilitiesList />
        </div>
      </div>

      <ToasterMessage />
    </div>
  );
}
