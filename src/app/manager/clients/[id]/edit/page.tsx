import { notFound } from 'next/navigation';

import { workshopApi } from '@/entities/workshop';

import { updateClientAction } from '../../../_actions/clientActions';
import { ClientForm } from '../../../_components/ClientForm';
import { PageTitle, PanelTitle } from '../../../_components/ManagerUi';
import styles from '../../../ManagerPage.module.scss';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type EditClientPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditClientPage({ params }: EditClientPageProps) {
  const clientId = Number((await params).id);

  if (!Number.isInteger(clientId) || clientId <= 0) {
    notFound();
  }

  const client = await getClientOrNotFound(clientId);

  return (
    <main className={styles.page}>
      <PageTitle eyebrow="Редактирование" title={`Клиент #${client.id}`} />

      <section className={styles.panel}>
        <PanelTitle eyebrow="Карточка" title="Данные клиента" />
        <ClientForm
          action={updateClientAction}
          defaultValues={{
            id: client.id,
            name: client.name,
            phone: client.phone,
          }}
          submitLabel="Сохранить клиента"
        />
      </section>
    </main>
  );
}

async function getClientOrNotFound(clientId: number) {
  try {
    return await workshopApi.getClient(clientId);
  } catch {
    notFound();
  }
}
