export type SiteMedia = {
  caption?: string;
  kind: 'image' | 'video';
  poster?: string;
  url: string;
};

export type SiteProject = {
  approximate_price?: number | string | null;
  color?: string | null;
  currency?: string;
  description?: string;
  dimensions?: string | null;
  furniture_type?: string | null;
  id?: number;
  material?: string | null;
  media?: SiteMedia[];
  production_time?: string | null;
  title: string;
};

export type SiteProductionBlock = {
  description?: string;
  media?: SiteMedia[];
  title: string;
};

export type SiteContent = {
  brand: string;
  hero?: string | null;
  logo?: string | null;
  production: SiteProductionBlock[];
  projects: SiteProject[];
  socials: {
    instagram?: string | null;
    threads?: string | null;
    whatsapp?: string | null;
  };
};
