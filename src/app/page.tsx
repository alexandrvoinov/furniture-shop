import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Factory,
  MessageCircle,
  Ruler,
  Sparkles,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { ProductCard, productCategories, type Product } from '@/entities/product';
import { productApi } from '@/entities/product/api';
import {
  findFirstImage,
  findHeroVideo,
  siteContentApi,
  type SiteContent,
} from '@/entities/site-content';
import { createWhatsappLink } from '@/shared/config/contacts';
import { routes } from '@/shared/lib/routes';
import { MediaCarousel } from '@/widgets/media-carousel';

import styles from './HomePage.module.scss';

const benefits = [
  {
    description: 'Проектируем кухни, шкафы и гардеробные под реальные размеры помещения.',
    icon: Ruler,
    title: 'Точно под пространство',
  },
  {
    description: 'В WhatsApp быстро обсуждаем задачу, материалы, сроки и примерный бюджет.',
    icon: Sparkles,
    title: 'Простой старт',
  },
  {
    description: 'Собственный цех помогает контролировать качество, геометрию и сроки.',
    icon: Factory,
    title: 'Свое производство',
  },
  {
    description: 'Доставляем, собираем и сдаём готовую мебель без лишней суеты для клиента.',
    icon: Truck,
    title: 'Монтаж под ключ',
  },
];

const processShort = ['Замер', 'Эскиз', 'Договор', 'Техпроект', 'Распил', 'Монтаж'];

export default async function HomePage() {
  const siteContent = await loadSiteContent();
  const featuredProjects = await loadFeaturedProjects();
  const heroVideo = siteContent ? findHeroVideo(siteContent) : undefined;
  const heroImageUrl = siteContent
    ? findFirstImage(siteContent)
    : (featuredProjects[0]?.imageUrl ?? '/images/logo.jpg');
  const heroPoster = heroVideo?.poster ?? heroImageUrl;
  const workshopImages = getCarouselImages(siteContent, featuredProjects, heroImageUrl);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        {heroVideo ? (
          <video
            aria-hidden="true"
            autoPlay
            className={styles.heroVideo}
            loop
            muted
            playsInline
            poster={heroPoster}
          >
            <source src={heroVideo.url} type="video/mp4" />
          </video>
        ) : (
          <Image
            alt="Готовая кухня и встроенная мебель в современном интерьере"
            className={styles.heroImage}
            fill
            priority
            sizes="100vw"
            src={heroImageUrl}
          />
        )}
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Мебель на заказ в Казахстане</p>
            <h1>Кухни, шкафы и гардеробные, которые выглядят как часть интерьера</h1>
            <p className={styles.heroLead}>
              Делаем мебель по индивидуальным размерам: от первой идеи и замера до производства,
              доставки и аккуратного монтажа.
            </p>
            <div className={styles.heroActions}>
              <a
                className={styles.primaryButton}
                href={createWhatsappLink(
                  'Здравствуйте! Хочу обсудить мебель на заказ. Могу отправить фото и размеры.',
                )}
                rel="noreferrer"
                target="_blank"
              >
                Обсудить проект
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a
                className={styles.secondaryButton}
                href={createWhatsappLink('Здравствуйте! Хочу отправить фото помещения для мебели.')}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Отправить фото
              </a>
            </div>
            <dl className={styles.heroStats}>
              <div>
                <dt>6 этапов</dt>
                <dd>От замера до установки</dd>
              </div>
              <div>
                <dt>Свой цех</dt>
                <dd>Производство без посредников</dd>
              </div>
              <div>
                <dt>На заказ</dt>
                <dd>Размеры, цвет и наполнение под вас</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className={styles.benefits}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Что делаем</p>
            <h2>Помогаем превратить неудобные углы, ниши и стены в продуманное хранение</h2>
            <p>
              Мы не продаём готовые коробки. Каждый проект собирается вокруг помещения, привычек
              семьи, техники, цвета стен и бюджета.
            </p>
          </div>

          <div className={styles.benefitGrid}>
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article className={styles.benefitCard} key={benefit.title}>
                  <Icon size={28} strokeWidth={1.6} aria-hidden="true" />
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.directions}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Направления</p>
            <h2>Кухни, шкафы, гардеробные и встроенные решения</h2>
          </div>

          <div className={styles.categoryGrid}>
            {productCategories.map((category) => (
              <Link className={styles.categoryCard} href={category.href} key={category.id}>
                <span className={styles.categoryImage}>
                  <Image
                    alt={category.title}
                    fill
                    sizes="(max-width: 760px) 100vw, 33vw"
                    src={getCategoryImage(featuredProjects, category.title, heroImageUrl)}
                  />
                </span>
                <span className={styles.categoryTitle}>{category.title}</span>
                <span className={styles.categoryDescription}>{category.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.featured}>
        <div className="container">
          <div className={styles.featuredHeader}>
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Наши работы</p>
              <h2>Реальные проекты вместо абстрактного каталога</h2>
              <p>
                В карточках показываем фото, тип мебели, материал, размеры, срок изготовления и
                примерную стоимость похожих работ.
              </p>
            </div>
            <Link className={styles.textButton} href={routes.works}>
              Все работы
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

          {featuredProjects.length > 0 ? (
            <div className={styles.productGrid}>
              {featuredProjects.map((project) => (
                <ProductCard key={project.id} product={project} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyBlock}>
              <Camera size={26} strokeWidth={1.6} aria-hidden="true" />
              <h3>Работы появятся после добавления проектов в backend</h3>
              <p>
                Сейчас страница уже готова к данным backend: проекты подтянутся автоматически вместе
                с фото, материалами, размерами и стоимостью.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className={styles.processPreview}>
        <div className={`container ${styles.processPreviewInner}`}>
          <div>
            <p className={styles.eyebrow}>Как мы работаем</p>
            <h2>Замер → эскиз → договор → техпроект → распил → монтаж</h2>
          </div>
          <div className={styles.processLine}>
            {processShort.map((step, index) => (
              <span key={step}>
                <strong>{index + 1}</strong>
                {step}
              </span>
            ))}
          </div>
          <Link className={styles.lightButton} href={routes.process}>
            Посмотреть процесс
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className={styles.workshop}>
        <div className={`container ${styles.workshopInner}`}>
          <div className={styles.workshopImageWrap}>
            <MediaCarousel alt="Готовые проекты мебели VEEMA ASTANA" images={workshopImages} />
          </div>

          <div className={styles.workshopContent}>
            <p className={styles.eyebrow}>Производство</p>
            <h2>Материалы, распил, сборка и монтаж в одной цепочке</h2>
            <p>
              Мы показываем производство и готовые интерьеры, чтобы клиент понимал, кто делает его
              мебель и как она будет выглядеть после установки.
            </p>
            <ul className={styles.factList}>
              <li>
                <BadgeCheck size={20} strokeWidth={1.7} aria-hidden="true" />
                Подбираем материалы под нагрузку, стиль и бюджет
              </li>
              <li>
                <BadgeCheck size={20} strokeWidth={1.7} aria-hidden="true" />
                Согласуем цвет, фурнитуру и внутреннее наполнение
              </li>
              <li>
                <BadgeCheck size={20} strokeWidth={1.7} aria-hidden="true" />
                После обсуждения выезжаем на замер и готовим понятный следующий шаг
              </li>
            </ul>
            <a
              className={styles.primaryButton}
              href={createWhatsappLink(
                'Здравствуйте! Хочу обсудить мебель на заказ и договориться о замере.',
              )}
              rel="noreferrer"
              target="_blank"
            >
              Обсудить проект в WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

async function loadFeaturedProjects(): Promise<Product[]> {
  const projects = await productApi.list({ limit: 3, offset: 0 }).catch(() => []);

  return projects.slice(0, 3);
}

async function loadSiteContent(): Promise<SiteContent | null> {
  return siteContentApi.get().catch(() => null);
}

function getCategoryImage(projects: Product[], category: string, fallback: string) {
  return projects.find((project) => project.category === category)?.imageUrl ?? fallback;
}

function getCarouselImages(content: SiteContent | null, projects: Product[], fallback: string) {
  const contentImages =
    content?.projects
      .flatMap((project) => project.media ?? [])
      .filter((media) => media.kind === 'image')
      .map((media) => media.url) ?? [];

  const projectImages = projects.map((project) => project.imageUrl);
  const images = [...contentImages, ...projectImages, fallback];

  return [...new Set(images)].filter(Boolean).slice(0, 8);
}
