'use client';

import type { InputHTMLAttributes } from 'react';

import styles from './Input.module.scss';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  const inputClassName = className ? `${styles.root} ${className}` : styles.root;

  return <input className={inputClassName} {...props} />;
}
