'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import type { ProductCategory } from '@/entities/product';
import { routes } from '@/shared/lib/routes';

import { initialFormState, type ManagerFormState } from '../../_actions/formState';
import styles from '../../ManagerPage.module.scss';

type ProductFormAction = (state: ManagerFormState, formData: FormData) => Promise<ManagerFormState>;

type ProductFormProps = {
  action: ProductFormAction;
  categories: ProductCategory[];
};

const defaultImageUrl = '/images/hero-interior.png';

export function ProductForm({ action, categories }: ProductFormProps) {
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className={styles.form} noValidate>
      {state.message ? <p className={styles.formMessage}>{state.message}</p> : null}

      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span>Название</span>
          <input
            aria-invalid={Boolean(state.errors?.name)}
            name="name"
            placeholder="Кухня Alba"
            required
          />
          <FieldError text={state.errors?.name} />
        </label>

        <label className={styles.field}>
          <span>Категория</span>
          <select aria-invalid={Boolean(state.errors?.category)} name="category" required>
            <option value="">Выберите категорию</option>
            {categories.map((category) => (
              <option key={category.id} value={category.title}>
                {category.title}
              </option>
            ))}
          </select>
          <FieldError text={state.errors?.category} />
        </label>

        <label className={styles.field}>
          <span>Цена, ₸</span>
          <input
            aria-invalid={Boolean(state.errors?.price)}
            inputMode="decimal"
            name="price"
            placeholder="590000"
            required
          />
          <FieldError text={state.errors?.price} />
        </label>

        <label className={styles.field}>
          <span>Старая цена, ₸</span>
          <input inputMode="decimal" name="oldPrice" placeholder="680000" />
        </label>

        <label className={styles.field}>
          <span>Материалы</span>
          <input
            aria-invalid={Boolean(state.errors?.materials)}
            name="materials"
            placeholder="МДФ эмаль, шпон дуба, кварц"
            required
          />
          <FieldError text={state.errors?.materials} />
        </label>

        <label className={styles.field}>
          <span>Срок изготовления</span>
          <input
            aria-invalid={Boolean(state.errors?.term)}
            name="term"
            placeholder="45 дней"
            required
          />
          <FieldError text={state.errors?.term} />
        </label>

        <label className={styles.field}>
          <span>Размеры</span>
          <input
            aria-invalid={Boolean(state.errors?.dimensions)}
            name="dimensions"
            placeholder="от 8 м²"
            required
          />
          <FieldError text={state.errors?.dimensions} />
        </label>

        <label className={styles.field}>
          <span>Статус</span>
          <select defaultValue="true" name="isAvailable">
            <option value="true">Доступен</option>
            <option value="false">Скрыт</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Бейдж</span>
          <input name="badge" placeholder="Хит, На заказ, Новинка" />
        </label>

        <label className={styles.field}>
          <span>Slug</span>
          <input
            aria-invalid={Boolean(state.errors?.slug)}
            name="slug"
            placeholder="kitchen-alba"
          />
          <span className={styles.fieldHint}>
            Можно оставить пустым, значение создастся автоматически.
          </span>
          <FieldError text={state.errors?.slug} />
        </label>

        <label className={styles.field}>
          <span>Изображение</span>
          <input name="imageUrl" placeholder={defaultImageUrl} />
        </label>

        <label className={styles.field}>
          <span>Позиция изображения</span>
          <input name="imagePosition" placeholder="50% 50%" />
        </label>

        <label className={`${styles.field} ${styles.fieldWide}`}>
          <span>Описание</span>
          <textarea
            aria-invalid={Boolean(state.errors?.description)}
            name="description"
            placeholder="Коротко опишите товар, сценарий использования и особенности."
            required
          />
          <FieldError text={state.errors?.description} />
        </label>
      </div>

      <div className={styles.formActions}>
        <SubmitButton />
        <Link className={styles.secondaryLink} href={routes.managerProducts}>
          Отмена
        </Link>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit">
      {pending ? 'Сохраняем...' : 'Сохранить товар'}
    </button>
  );
}

function FieldError({ text }: { text?: string }) {
  return text ? <small className={styles.fieldError}>{text}</small> : null;
}
