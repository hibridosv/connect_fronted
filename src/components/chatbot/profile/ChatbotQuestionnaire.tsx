'use client';
import { Button, Preset } from '@/components/button/button';
import { useEffect, useState } from 'react';

type Question = { key: string; label: string; max: number; rows: number; example: string; restaurantExample?: string };

// mismas preguntas que ManageChatbotProfile::QUESTIONS y los campos guiados de chatbot_settings
const QUESTIONS: Question[] = [
  { key: 'what_we_sell', label: '¿Qué vende el negocio y qué lo distingue?', max: 1500, rows: 3, example: 'Ferretería con materiales de construcción, herramientas y pinturas. Asesoramos en proyectos y cortamos madera a la medida.', restaurantExample: 'Pupusería familiar desde 1998: pupusas de arroz y maíz, desayunos típicos y bebidas naturales.' },
  { key: 'customers', label: '¿A qué tipo de clientes atiende?', max: 1000, rows: 2, example: 'Maestros de obra, contratistas y familias que remodelan su casa.' },
  { key: 'schedule', label: 'Horario de atención', max: 500, rows: 2, example: 'Lunes a viernes de 8:00 a 18:00, sábados de 8:00 a 13:00. Domingos cerrado.' },
  { key: 'delivery_info', label: 'Entregas', max: 1000, rows: 3, example: 'Entregamos en San Salvador y Antiguo Cuscatlán. Envío $2.50, gratis en compras mayores a $30.', restaurantExample: 'Delivery en un radio de 5 km; el costo se suma al pedido. Tiempo aproximado: 40 minutos.' },
  { key: 'payment_info', label: 'Formas de pago', max: 500, rows: 2, example: 'Efectivo, tarjeta de crédito o débito y transferencia.' },
  { key: 'policies', label: 'Cambios, devoluciones y garantías', max: 1500, rows: 3, example: 'Cambios dentro de 8 días con factura y el producto sin usar. Herramientas eléctricas con 6 meses de garantía.', restaurantExample: 'Si un platillo llega mal, lo reponemos al reportarlo en los primeros 30 minutos.' },
  { key: 'faq', label: 'Preguntas frecuentes', max: 3000, rows: 4, example: '¿Hacen factura? Sí, ticket, factura o crédito fiscal. ¿Tienen estacionamiento? Sí, frente al local.' },
  { key: 'avoid', label: '¿De qué no debe hablar o qué no debe prometer el bot?', max: 1000, rows: 2, example: 'No confirmar pedidos especiales ni fechas de llegada de productos agotados.' },
  { key: 'greeting', label: '¿Cómo quiere que salude y se despida?', max: 500, rows: 2, example: 'Saludar con "¡Hola! Bienvenido a Ferretería El Clavo" y despedirse con "Gracias por preferirnos".' },
  { key: 'business_info', label: 'Otros datos', max: 2000, rows: 2, example: 'Cualquier otra cosa que el bot deba saber del negocio.' },
];

export interface ChatbotQuestionnaireI {
  questionnaire: Record<string, string | null>;
  tone: number;
  isRestaurant: boolean;
  saving: boolean;
  onSave: (data: Record<string, any>) => Promise<boolean>;
}

export function ChatbotQuestionnaire({ questionnaire, tone, isRestaurant, saving, onSave }: ChatbotQuestionnaireI) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedTone, setSelectedTone] = useState(tone);

  useEffect(() => {
    setAnswers(Object.fromEntries(QUESTIONS.map((q) => [q.key, questionnaire?.[q.key] ?? ''])));
    setSelectedTone(tone);
  }, [questionnaire, tone]);

  return (
    <div className="space-y-3">
      <div>
        <label className="input-label">Tono de las respuestas</label>
        <select className="input-select w-full" value={selectedTone} onChange={(e) => setSelectedTone(Number(e.target.value))}>
          <option value={1}>Cercano: tutea al cliente y usa algún emoji</option>
          <option value={2}>Formal: trata al cliente de usted, sin emojis</option>
        </select>
      </div>
      {QUESTIONS.map((question) => (
        <div key={question.key}>
          <label className="input-label">{question.label}</label>
          <textarea className="input w-full" rows={question.rows} maxLength={question.max}
            placeholder={`Ej.: ${isRestaurant && question.restaurantExample ? question.restaurantExample : question.example}`}
            value={answers[question.key] ?? ''} onChange={(e) => setAnswers({ ...answers, [question.key]: e.target.value })} />
          <div className="text-xs text-text-muted text-right">{(answers[question.key] ?? '').length}/{question.max}</div>
        </div>
      ))}
      <div className="flex justify-end">
        <Button preset={saving ? Preset.saving : Preset.save} text="Guardar respuestas" disabled={saving}
          onClick={() => onSave({ ...answers, tone: selectedTone })} />
      </div>
    </div>
  );
}
