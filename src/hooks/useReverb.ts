import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useEffect, useRef, useState } from 'react';

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

const useReverb = (channelName: string, eventName: string, status = false) => {
  const [data, setData] = useState<any>(null);
  const [random, setRandom] = useState(0);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!status) return;

    let cancelled = false;

    const subscribe = async () => {
      try {
        const echo = await getEchoInstance();
        if (cancelled) return;

        const channel = echo.channel(channelName);
        channelRef.current = channel;

        channel.listen(eventName, (eventData: any) => {
          setRandom(Math.random());
          setData(eventData);
        });
      } catch (error) {
        console.error('Error al conectar con Reverb:', error);
      }
    };

    subscribe();

    return () => {
      cancelled = true;
      if (channelRef.current) {
        channelRef.current.stopListening(eventName);
        if (echoInstance) echoInstance.leave(channelName);
        channelRef.current = null;
      }
    };
  }, [channelName, eventName, status]);

  return { data, random };
};

export default useReverb;
