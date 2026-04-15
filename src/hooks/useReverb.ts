import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

type ReverbConfig = {
  host: string;
  port: string;
  scheme: string;
  key: string;
};

let echoInstance: Echo<'reverb'> | null = null;
let reverbConfig: ReverbConfig | null = null;

async function getReverbConfig(): Promise<ReverbConfig> {
  if (reverbConfig) return reverbConfig;
  const res = await fetch('/api/reverb-config');
  if (!res.ok) throw new Error('No se pudo obtener configuración de Reverb');
  reverbConfig = await res.json();
  return reverbConfig!;
}

async function getEchoInstance(): Promise<Echo<'reverb'>> {
  if (!echoInstance) {
    const config = await getReverbConfig();
    window.Pusher = Pusher;
    echoInstance = new Echo({
      broadcaster: 'reverb',
      key: config.key,
      wsHost: config.host,
      wsPort: Number(config.port),
      wssPort: Number(config.port),
      forceTLS: (config.scheme ?? 'https') === 'https',
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
