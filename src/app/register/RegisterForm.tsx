'use client';

import { LockKeyhole, Mail, Phone, UserRound, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AuthRequestError, register } from '@/entities/auth';
import { getDefaultRouteByRole } from '@/shared/lib/auth';
import { routes } from '@/shared/lib/routes';

import styles from '../login/LoginPage.module.scss';

type RegisterFormProps = {
  redirectTo: string;
};

export function RegisterForm({ redirectTo }: RegisterFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (password.length < 10) {
      setError('Пароль должен быть не короче 10 символов.');
      return;
    }

    if (password !== passwordRepeat) {
      setError('Пароли не совпадают.');
      return;
    }

    setIsPending(true);

    try {
      const session = await register({ email, name, password, phone });
      router.replace(
        redirectTo === routes.cabinet ? getDefaultRouteByRole(session.user.role) : redirectTo,
      );
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof AuthRequestError
          ? requestError.message
          : 'Не удалось создать аккаунт',
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>Имя</span>
        <span className={styles.inputWrap}>
          <UserRound size={18} strokeWidth={1.7} aria-hidden="true" />
          <input
            autoComplete="name"
            disabled={isPending}
            name="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Например, Айгерим"
            required
            value={name}
          />
        </span>
      </label>

      <label className={styles.field}>
        <span>Телефон</span>
        <span className={styles.inputWrap}>
          <Phone size={18} strokeWidth={1.7} aria-hidden="true" />
          <input
            autoComplete="tel"
            disabled={isPending}
            name="phone"
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+7 700 000 00 00"
            required
            type="tel"
            value={phone}
          />
        </span>
      </label>

      <label className={styles.field}>
        <span>Email</span>
        <span className={styles.inputWrap}>
          <Mail size={18} strokeWidth={1.7} aria-hidden="true" />
          <input
            autoComplete="email"
            disabled={isPending}
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            required
            type="email"
            value={email}
          />
        </span>
      </label>

      <label className={styles.field}>
        <span>Пароль</span>
        <span className={styles.inputWrap}>
          <LockKeyhole size={18} strokeWidth={1.7} aria-hidden="true" />
          <input
            autoComplete="new-password"
            disabled={isPending}
            minLength={10}
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Минимум 10 символов"
            required
            type="password"
            value={password}
          />
        </span>
      </label>

      <label className={styles.field}>
        <span>Повторите пароль</span>
        <span className={styles.inputWrap}>
          <LockKeyhole size={18} strokeWidth={1.7} aria-hidden="true" />
          <input
            autoComplete="new-password"
            disabled={isPending}
            minLength={10}
            name="passwordRepeat"
            onChange={(event) => setPasswordRepeat(event.target.value)}
            placeholder="Еще раз пароль"
            required
            type="password"
            value={passwordRepeat}
          />
        </span>
      </label>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <button className={styles.submitButton} disabled={isPending} type="submit">
        <UserPlus size={18} strokeWidth={1.8} aria-hidden="true" />
        {isPending ? 'Создаем аккаунт...' : 'Зарегистрироваться'}
      </button>

      <p className={styles.switchText}>
        Уже есть аккаунт? <Link href={routes.login}>Войти</Link>
      </p>
    </form>
  );
}
