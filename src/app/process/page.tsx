import { CheckCircle2, ClipboardList, Factory, PencilRuler, Ruler, Truck } from 'lucide-react';
import Image from 'next/image';

import { siteContentApi } from '@/entities/site-content';
import { createWhatsappLink } from '@/shared/config/contacts';

import styles from './ProcessPage.module.scss';

const steps = [
  {
    description: 'Выезжаем на объект, снимаем размеры и смотрим привязки под будущую мебель.',
    icon: Ruler,
    title: 'Замер',
  },
  {
    description: 'Рисуем эскиз, обсуждаем решение и утверждаем его с заказчиком.',
    icon: PencilRuler,
    title: 'Эскиз',
  },
  {
    description: 'После согласования фиксируем условия, сроки и состав работ в договоре.',
    icon: ClipboardList,
    title: 'Договор',
  },
  {
    description: 'Технолог готовит технический проект для производства и сборки.',
    icon: Factory,
    title: 'Техпроект',
  },
  {
    description: 'Листы уходят на распил, дальше детали проходят нужную обработку в цехе.',
    icon: CheckCircle2,
    title: 'Распил',
  },
  {
    description: 'Готовые изделия везём на объект и собираем мебель на месте.',
    icon: Truck,
    title: 'Монтаж',
  },
];

const facadeStages = [
  'Сначала детали отправляются на распил.',
  'После распила фасады проходят первую шлифовку.',
  'Затем наносится праймер.',
  'После праймера поверхность снова шлифуется.',
  'Дальше наносится грунт.',
  'После грунта фасады снова шлифуются перед покраской.',
  'Затем наносится краска.',
  'После покраски фасады сушатся и упаковываются.',
];

const veneerStages = [
  'Сначала детали отправляются на распил.',
  'Потом собирается рубашка из шпона.',
  'Затем наносится клей, и деталь отправляется в пресс.',
  'После пресса на кромкозакатывающем станке наклеивается кромка.',
  'Дальше поверхность шлифуется.',
  'После шлифовки наносится морилка.',
  'Затем наносится грунт.',
  'После грунта поверхность снова шлифуется.',
  'Дальше наносится лак.',
  'После лака изделие сушится и упаковывается.',
];

const projectStages = [
  'Выезжаем на замер.',
  'Потом рисуем эскиз и утверждаем его с заказчиком.',
  'Подписываем договор.',
  'Технолог делает технический проект.',
  'Отправляем листы на распил.',
  'Потом везём все готовые изделия на объект, и там уже проходит монтаж.',
];

export default async function ProcessPage() {
  const media = await loadProcessMedia();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>Как мы работаем</p>
          <h1>От первого сообщения в WhatsApp до установленной мебели в интерьере</h1>
          <p>
            Вся коммуникация идёт напрямую: вы присылаете фото, размеры или идею, а дальше мы
            договариваемся о замере и ведём проект по понятным этапам.
          </p>
          <a
            className={styles.primaryButton}
            href={createWhatsappLink(
              'Здравствуйте! Хочу обсудить мебель на заказ и договориться о замере.',
            )}
            rel="noreferrer"
            target="_blank"
          >
            Написать в WhatsApp
          </a>
        </div>
      </section>

      <section className={styles.stepsSection}>
        <div className="container">
          <div className={styles.steps}>
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article className={styles.step} key={step.title}>
                  <span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <Icon size={28} strokeWidth={1.6} aria-hidden="true" />
                  <h2>{step.title}</h2>
                  <p>{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.mediaSection}>
        <div className={`container ${styles.mediaGrid}`}>
          <article className={styles.largeMedia}>
            <Image
              alt="Производственный цех мебели"
              fill
              sizes="(max-width: 900px) 100vw, 58vw"
              src={media.primary}
            />
            <div>
              <span>Фото цеха</span>
              <h2>Собственное производство</h2>
            </div>
          </article>
          <div className={styles.mediaStack}>
            <article className={styles.mediaCard}>
              <Image
                alt="Готовая мебель после установки"
                fill
                sizes="(max-width: 900px) 100vw, 34vw"
                src={media.secondary}
              />
              <div>
                <span>Монтаж</span>
                <h3>Готовый интерьер</h3>
              </div>
            </article>
            {media.video ? (
              <article className={`${styles.videoCard} ${styles.videoCardMedia}`}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={media.video.poster}
                  src={media.video.url}
                />
                <div>
                  <span>Видео</span>
                  <h3>{media.video.caption || 'Процесс в цехе'}</h3>
                </div>
              </article>
            ) : (
              <article className={styles.videoCard}>
                <Factory size={34} strokeWidth={1.4} aria-hidden="true" />
                <h3>Видео процесса</h3>
                <p>Видео появится здесь автоматически после добавления в backend.</p>
              </article>
            )}
          </div>
        </div>
      </section>

      <section className={styles.productionDetails}>
        <div className="container">
          <div className={styles.detailsHeader}>
            <p className={styles.eyebrow}>Производство</p>
            <h2>Кратко о том, что происходит в цехе</h2>
          </div>
          <div className={styles.detailsGrid}>
            <article className={styles.detailCard}>
              <h3>От замера до монтажа</h3>
              <ol>
                {projectStages.map((stage, index) => (
                  <li key={`${stage}-${index}`}>{stage}</li>
                ))}
              </ol>
            </article>
            <article className={styles.detailCard}>
              <h3>Фасады под покраску</h3>
              <ol>
                {facadeStages.map((stage, index) => (
                  <li key={`${stage}-${index}`}>{stage}</li>
                ))}
              </ol>
            </article>
            <article className={styles.detailCard}>
              <h3>Шпон</h3>
              <ol>
                {veneerStages.map((stage, index) => (
                  <li key={`${stage}-${index}`}>{stage}</li>
                ))}
              </ol>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={`container ${styles.ctaInner}`}>
          <div>
            <p className={styles.eyebrow}>Следующий шаг</p>
            <h2>Пришлите фото помещения или референс прямо в WhatsApp</h2>
          </div>
          <div className={styles.ctaActions}>
            <a
              className={styles.primaryButton}
              href={createWhatsappLink(
                'Здравствуйте! Хочу обсудить мебель на заказ и отправить фото помещения.',
              )}
              rel="noreferrer"
              target="_blank"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className={styles.quality}>
        <div className="container">
          <ul>
            <li>
              <CheckCircle2 size={20} aria-hidden="true" />
              Согласование материалов до запуска производства
            </li>
            <li>
              <CheckCircle2 size={20} aria-hidden="true" />
              Контроль размеров и привязок после замера
            </li>
            <li>
              <CheckCircle2 size={20} aria-hidden="true" />
              Установка командой, которая понимает проект
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}

async function loadProcessMedia() {
  const content = await siteContentApi.get().catch(() => null);
  const productionMedia = content?.production.flatMap((block) => block.media ?? []) ?? [];
  const images = productionMedia.filter((media) => media.kind === 'image');
  const videos = productionMedia.filter((media) => media.kind === 'video');
  const primary = images[0]?.url ?? videos[0]?.poster ?? '/images/logo.jpg';

  return {
    primary,
    secondary: images[1]?.url ?? primary,
    video: videos[0],
  };
}
