interface BrandConfig {
  name: string;
  logo: string;
  logoSize: string;
  subtitle: string;
  footer: string;
  colors: {
    panel: string;
    panelGradient: string;
    accent: string;
    accentGlow: string;
  };
}

const brands: Record<string, BrandConfig> = {
  hibrido: {
    name: 'Hibrido',
    logo: 'H',
    logoSize: 'text-6xl',
    subtitle: 'Sistema integral de gestión empresarial',
    footer: 'Hibrido · Gestión Empresarial',
    colors: {
      panel: '',
      panelGradient: '',
      accent: '',
      accentGlow: '',
    },
  },
  latampos: {
    name: 'Latam POS',
    logo: 'LP',
    logoSize: 'text-6xl',
    subtitle: 'Plataforma de gestión comercial',
    footer: 'Latam POS · Gestión Comercial',
    colors: {
      panel: '#0C381F',
      panelGradient: 'linear-gradient(to bottom right, #0C381F, #145A30, #0C381F)',
      accent: '#34D399',
      accentGlow: 'rgba(52, 211, 153, 0.2)',
    },
  },
};

export const defaultBrand = brands.hibrido;

export function getBrand(): BrandConfig {
  if (typeof window === 'undefined') return brands.hibrido;
  const host = window.location.hostname;
  if (host.includes('latam-pos')) return brands.latampos;
  if (host.includes('localhost')) return brands.latampos;
  return brands.hibrido;
}

export function isCustomBrand(brand: BrandConfig): boolean {
  return brand.colors.panel !== '';
}

export type { BrandConfig };

