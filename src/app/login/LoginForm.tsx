'use client';

import { LockKeyhole, LogIn, Mail } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AuthRequestError, login } from '@/entities/auth';

import styles from './LoginPage.module.scss';

type LoginFormProps = {
  defaultEmail: string;
  demoPassword?: string;
  redirectTo: string;
};

export function LoginForm({ defaultEmail, demoPassword, redirectTo }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(demoPassword ?? '');
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsPending(true);

    try {
      await login({ email, password });
      router.replace(redirectTo);
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof AuthRequestError
          ? requestError.message
          : 'Не удалось войти в кабинет',
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>Email</span>
        <span className={styles.inputWrap}>
          <Mail size={18} strokeWidth={1.7} aria-hidden="true" />
          <input
            autoComplete="email"
            disabled={isPending}
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@mebel.kz"
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
            autoComplete="current-password"
            disabled={isPending}
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Введите пароль"
            required
            type="password"
            value={password}
          />
        </span>
      </label>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <button className={styles.submitButton} disabled={isPending} type="submit">
        <LogIn size={18} strokeWidth={1.8} aria-hidden="true" />
        {isPending ? 'Входим...' : 'Войти'}
      </button>
    </form>
  );
}
