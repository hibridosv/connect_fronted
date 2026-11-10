import type { Metadata } from "next";

const fallback: Metadata = {
  title: "Haz tu pedido",
  description: "Elige tus platillos, si es para llevar o a domicilio y cómo pagas.",
};

/**
 * Vista previa del enlace (Open Graph) cuando el bot lo manda como texto: nombre y logo del negocio. Solo lee
 * los datos publicos del enlace; si vencio o no responde a tiempo queda la vista previa generica.
 */
export async function generateMetadata({ params }: { params: { token: string } }): Promise<Metadata> {
  try {
    const route = await fetch(`${process.env.NEXT_PUBLIC_URL_API}order-links/${params.token}`, { cache: 'no-store', signal: AbortSignal.timeout(3000) });
    if (!route.ok) return fallback;
    const url = (await route.json())?.data?.url;
    const response = await fetch(`${url}/api/v2/public/orders/${params.token}`, { cache: 'no-store', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(3000) });
    if (!response.ok) return fallback;
    const business = (await response.json())?.data?.business;
    const title = business?.name ? `Haz tu pedido en ${business.name}` : fallback.title as string;
    return {
      title,
      description: fallback.description,
      openGraph: { title, description: fallback.description as string, images: business?.logo_url ? [business.logo_url] : [] },
    };
  } catch (e) {
    return fallback;
  }
}

export default function PedidoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
