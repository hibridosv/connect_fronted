import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

let echoInstance: Echo<'reverb'> | null = null;

async function getEchoInstance(): Promise<Echo<'reverb'>> {
  if (!echoInstance) {
    window.Pusher = Pusher;
    echoInstance = new Echo({
      broadcaster: 'reverb',
      key: process.env.NEXT_PUBLIC_REVERB_KEY!,
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST!,
      wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT),
      wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT),
      forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
      enabledTransports: ['ws', 'wss'],
    });
  }
  return echoInstance;
}

// Cuantos componentes escuchan cada canal: solo se sale del canal cuando el ultimo se desmonta,
// para no cortarle los eventos a los demas (p. ej. el Navbar y la pagina de pagos en -channel-pay)
const channelSubscribers = new Map<string, number>();

const useReverb = (channelName: string, eventName: string, status = false) => {
  const [data, setData] = useState<any>(null);
  const [random, setRandom] = useState(0);

  useEffect(() => {
    if (!status) return;

    let cancelled = false;
    let channel: any = null;
    const callback = (eventData: any) => {
      setRandom(Math.random());
      setData(eventData);
    };

    const subscribe = async () => {
      try {
        const echo = await getEchoInstance();
        if (cancelled) return;

        channel = echo.channel(channelName);
        channelSubscribers.set(channelName, (channelSubscribers.get(channelName) ?? 0) + 1);
        channel.listen(eventName, callback);
      } catch (error) {
        console.error('Error al conectar con Reverb:', error);
      }
    };

    subscribe();

    return () => {
      cancelled = true;
      if (!channel) return;

      // quita solo el callback de este componente
      channel.stopListening(eventName, callback);
      const remaining = (channelSubscribers.get(channelName) ?? 1) - 1;
      if (remaining > 0) {
        channelSubscribers.set(channelName, remaining);
      } else {
        channelSubscribers.delete(channelName);
        echoInstance?.leave(channelName);
      }
    };
  }, [channelName, eventName, status]);

  return { data, random };
};

export default useReverb;
