import { UserPlus } from 'lucide-react';

import { createClientAction } from '../../_actions/clientActions';
import { ClientForm } from '../../_components/ClientForm';
import { PageTitle, PanelTitle } from '../../_components/ManagerUi';
import styles from '../../ManagerPage.module.scss';

export default function NewClientPage() {
  return (
    <main className={styles.page}>
      <PageTitle eyebrow="Новый контакт" title="Добавить клиента" />

      <section className={styles.panel}>
        <PanelTitle
          eyebrow="Карточка"
          title="Данные клиента"
          action={<UserPlus size={20} strokeWidth={1.7} aria-hidden="true" />}
        />
        <ClientForm action={createClientAction} submitLabel="Создать клиента" />
      </section>
    </main>
  );
}
