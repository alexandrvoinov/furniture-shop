import { apiRequest } from '@/shared/api';
import { API_BASE_URL } from '@/shared/api/config';

import type { SiteContent, SiteMedia } from './types';

export const siteContentApi = {
  async get() {
    const content = await apiRequest<SiteContent>('/site-content', {
      cache: 'no-store',
    });

    return normalizeSiteContent(content);
  },
};

export function findFirstImage(content: SiteContent) {
  return (
    firstMedia(
      content.projects.flatMap((project) => project.media ?? []),
      'image',
    ) ??
    resolveMediaUrl(content.hero) ??
    '/images/logo.jpg'
  );
}

export function findHeroVideo(content: SiteContent): SiteMedia | undefined {
  return content.production
    .flatMap((block) => block.media ?? [])
    .find((media) => media.kind === 'video');
}

export function resolveMediaUrl(url?: null | string) {
  if (!url) {
    return undefined;
  }

  try {
    return new URL(url, normalizedApiBaseUrl()).toString();
  } catch {
    return url;
  }
}

function normalizeSiteContent(content: SiteContent): SiteContent {
  return {
    ...content,
    hero: resolveMediaUrl(content.hero) ?? null,
    logo: resolveMediaUrl(content.logo) ?? null,
    production: content.production.map((block) => ({
      ...block,
      media: normalizeMedia(block.media),
    })),
    projects: content.projects.map((project) => ({
      ...project,
      media: normalizeMedia(project.media),
    })),
  };
}

function normalizeMedia(media?: SiteMedia[]) {
  return (media ?? []).map((item) => ({
    ...item,
    poster: resolveMediaUrl(item.poster),
    url: resolveMediaUrl(item.url) ?? item.url,
  }));
}

function firstMedia(media: SiteMedia[], kind: SiteMedia['kind']) {
  return media.find((item) => item.kind === kind)?.url;
}

function normalizedApiBaseUrl() {
  return API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
}
