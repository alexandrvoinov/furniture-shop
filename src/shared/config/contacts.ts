export const contactConfig = {
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? 'Казахстан',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'hello@veema.kz',
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://www.instagram.com/veema__astana/',
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? '+7 778 652 68 72',
  phoneHref: `tel:+${(process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? '+77786526872').replace(/\D/g, '')}`,
  whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL ?? 'https://wa.me/77786526872',
} as const;

export function createWhatsappLink(message: string) {
  const separator = contactConfig.whatsappUrl.includes('?') ? '&' : '?';

  return `${contactConfig.whatsappUrl}${separator}text=${encodeURIComponent(message)}`;
}
