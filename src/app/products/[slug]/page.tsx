import {
  ArrowRight,
  BadgeCheck,
  Clock,
  Layers,
  MessageCircle,
  Ruler,
  ShieldCheck,
} from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { productApi } from '@/entities/product/api';
import { createWhatsappLink } from '@/shared/config/contacts';
import { formatPrice } from '@/shared/lib/formatters';

import styles from './ProductPage.module.scss';

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await loadProject(slug);

  if (!project) {
    notFound();
  }

  const galleryMedia = project.media?.filter((media) => media.kind === 'image') ?? [];

  return (
    <main className={styles.page}>
      <section className={`container ${styles.product}`}>
        <div className={styles.gallery}>
          <Image
            alt={project.name}
            className={styles.image}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 54vw"
            src={project.imageUrl}
          />
        </div>

        <div className={styles.info}>
          <p className={styles.eyebrow}>{project.category}</p>
          <h1>{project.name}</h1>
          <p className={styles.description}>{project.description}</p>

          <div className={styles.priceBlock}>
            <span className={styles.price}>
              {project.price ? `От ${formatPrice(project.price)}` : 'Стоимость по запросу'}
            </span>
            {project.oldPrice ? (
              <span className={styles.oldPrice}>{formatPrice(project.oldPrice)}</span>
            ) : null}
          </div>

          <div className={styles.actions}>
            <a
              className={styles.primaryButton}
              href={createWhatsappLink(
                `Здравствуйте! Хочу обсудить похожий проект мебели: ${project.name}.`,
              )}
              rel="noreferrer"
              target="_blank"
            >
              Обсудить похожий проект
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a
              className={styles.secondaryButton}
              href={createWhatsappLink(`Здравствуйте! Хочу обсудить проект: ${project.name}.`)}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />
              WhatsApp
            </a>
          </div>

          <dl className={styles.specs}>
            <div>
              <Ruler size={20} strokeWidth={1.6} aria-hidden="true" />
              <dt>Размер</dt>
              <dd>{project.dimensions || 'По замеру'}</dd>
            </div>
            <div>
              <Clock size={20} strokeWidth={1.6} aria-hidden="true" />
              <dt>Срок изготовления</dt>
              <dd>{project.term || 'После согласования'}</dd>
            </div>
            <div>
              <Layers size={20} strokeWidth={1.6} aria-hidden="true" />
              <dt>Материалы</dt>
              <dd>{project.materials || 'Подбираются под проект'}</dd>
            </div>
          </dl>
        </div>
      </section>

      {galleryMedia.length > 1 ? (
        <section className={styles.projectMedia}>
          <div className="container">
            <p className={styles.eyebrow}>Фото проекта</p>
            <div className={styles.mediaGrid}>
              {galleryMedia.map((media) => (
                <figure className={styles.mediaItem} key={media.url}>
                  <Image
                    alt={media.caption || project.name}
                    fill
                    sizes="(max-width: 760px) 100vw, 33vw"
                    src={media.url}
                  />
                  {media.caption ? <figcaption>{media.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={styles.service}>
        <div className={`container ${styles.serviceInner}`}>
          <article>
            <ShieldCheck size={28} strokeWidth={1.5} aria-hidden="true" />
            <h2>Стоимость ориентировочная</h2>
            <p>
              Финальная цена зависит от замера, фурнитуры, фасадов, наполнения, доставки и монтажа.
            </p>
          </article>
          <article>
            <BadgeCheck size={28} strokeWidth={1.5} aria-hidden="true" />
            <h2>Можно повторить в вашем размере</h2>
            <p>
              Возьмём этот проект как референс и адаптируем под помещение, цвет, материал и бюджет.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

async function loadProject(slug: string) {
  return productApi.getBySlug(slug).catch(() => null);
}
