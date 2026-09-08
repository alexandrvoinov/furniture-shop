import {
  ArrowRight,
  Armchair,
  BadgeCheck,
  Drill,
  Factory,
  Hammer,
  PackageCheck,
  PanelsTopLeft,
  Ruler,
  Sofa,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { ProductCard, productCategories, products } from '@/entities/product';
import { routes } from '@/shared/lib/routes';

import styles from './HomePage.module.scss';

const categoryIcons: Record<string, LucideIcon> = {
  kitchens: PanelsTopLeft,
  storage: Armchair,
  wardrobes: Sofa,
};

const processSteps = [
  {
    description: 'Приезжаем на объект, фиксируем размеры, коммуникации и особенности помещения.',
    icon: Ruler,
    title: 'Замер',
  },
  {
    description: 'Собираем проект под сценарии жизни, материалы, бюджет и сроки изготовления.',
    icon: PanelsTopLeft,
    title: 'Проект',
  },
  {
    description: 'Делаем корпуса, фасады и детали в собственном цехе с контролем геометрии.',
    icon: Factory,
    title: 'Изготовление',
  },
  {
    description: 'Доставляем мебель, аккуратно собираем на месте и сдаем готовый интерьер.',
    icon: Truck,
    title: 'Монтаж',
  },
];

const workshopFacts = [
  'Свой цех и понятный контроль сроков',
  'Материалы подбираются под проект и нагрузку',
  'Кухни, шкафы и гардеробные делаются по размерам помещения',
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          alt="Светлый интерьер с кухней и встроенным шкафом"
          className={styles.heroImage}
          fill
          priority
          sizes="100vw"
          src="/images/hero-interior.png"
        />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Мебель на заказ</p>
            <h1>Кухни, шкафы и гардеробные под ваш интерьер</h1>
            <p className={styles.heroLead}>
              Проектируем, производим, доставляем и монтируем мебель по индивидуальным размерам.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href={routes.catalog}>
                Смотреть каталог
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a className={styles.secondaryButton} href="#process">
                Как работаем
              </a>
            </div>
            <dl className={styles.heroStats}>
              <div>
                <dt>4 этапа</dt>
                <dd>от замера до монтажа</dd>
              </div>
              <div>
                <dt>свой цех</dt>
                <dd>без лишних посредников</dd>
              </div>
              <div>
                <dt>1 проект</dt>
                <dd>под размеры дома</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className={styles.directions}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Направления</p>
            <h2>Главный фокус - встроенная мебель и точное хранение</h2>
            <p>
              Подбираем фасады, фурнитуру, наполнение и материалы под комнату, а не под готовый
              стандартный размер.
            </p>
          </div>

          <div className={styles.categoryGrid}>
            {productCategories.map((category) => {
              const Icon = categoryIcons[category.id] ?? Armchair;

              return (
                <Link className={styles.categoryCard} href={category.href} key={category.id}>
                  <span className={styles.iconBubble}>
                    <Icon size={28} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span className={styles.categoryImage}>
                    <Image
                      alt={category.title}
                      fill
                      sizes="(max-width: 760px) 100vw, 33vw"
                      src="/images/hero-interior.png"
                      style={{ objectPosition: category.imagePosition }}
                    />
                  </span>
                  <span className={styles.categoryTitle}>{category.title}</span>
                  <span className={styles.categoryDescription}>{category.description}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.featured}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Подборка</p>
            <h2>Популярные решения для квартиры и дома</h2>
            <p>Спокойные формы, точная посадка по стенам и материалы, которые выдерживают быт.</p>
          </div>
          <div className={styles.productGrid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.process} id="process">
        <div className="container">
          <div className={styles.processHeader}>
            <p className={styles.eyebrow}>Процесс</p>
            <h2>Замер → изготовление → доставка → монтаж</h2>
          </div>
          <div className={styles.steps}>
            {processSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article className={styles.step} key={step.title}>
                  <span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <Icon size={30} strokeWidth={1.5} aria-hidden="true" />
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.workshop}>
        <div className={`container ${styles.workshopInner}`}>
          <div className={styles.workshopImageWrap}>
            <Image
              alt="Цех с мебельными деталями и материалами"
              className={styles.workshopImage}
              fill
              sizes="(max-width: 900px) 100vw, 48vw"
              src="/images/workshop.png"
            />
          </div>

          <div className={styles.workshopContent}>
            <p className={styles.eyebrow}>Собственное производство</p>
            <h2>Цех, материалы и монтажная команда в одной цепочке</h2>
            <p>
              Один маршрут проекта помогает держать качество на каждом этапе: от первого замера до
              аккуратной установки у клиента.
            </p>
            <ul className={styles.factList}>
              {workshopFacts.map((fact) => (
                <li key={fact}>
                  <BadgeCheck size={20} strokeWidth={1.7} aria-hidden="true" />
                  {fact}
                </li>
              ))}
            </ul>
            <div className={styles.toolLine} aria-hidden="true">
              <Hammer size={26} strokeWidth={1.4} />
              <Drill size={26} strokeWidth={1.4} />
              <PackageCheck size={26} strokeWidth={1.4} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
