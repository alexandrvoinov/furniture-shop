import { MessageCircle } from 'lucide-react';

import { createWhatsappLink } from '@/shared/config/contacts';

import styles from './WhatsAppFloat.module.scss';

export function WhatsAppFloat() {
  return (
    <a
      aria-label="Написать в WhatsApp"
      className={styles.root}
      href={createWhatsappLink('Здравствуйте! Хочу обсудить мебель на заказ.')}
      rel="noreferrer"
      target="_blank"
    >
      <MessageCircle size={24} strokeWidth={2} aria-hidden="true" />
    </a>
  );
}
