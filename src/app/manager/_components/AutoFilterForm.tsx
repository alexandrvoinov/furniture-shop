'use client';

import { FormEvent, ReactNode, useEffect, useRef, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type AutoFilterFormProps = {
  children: ReactNode;
  className?: string;
  debounceMs?: number;
};

export function AutoFilterForm({ children, className, debounceMs = 350 }: AutoFilterFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  function applyFilters() {
    const form = formRef.current;

    if (!form) {
      return;
    }

    if (!pathname) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams?.toString() ?? '');
    const fieldNames = getNamedFormFields(form);

    fieldNames.forEach((name) => nextParams.delete(name));

    new FormData(form).forEach((value, key) => {
      const normalizedValue = String(value).trim();

      if (normalizedValue) {
        nextParams.append(key, normalizedValue);
      }
    });

    const query = nextParams.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  }

  function scheduleFiltersUpdate() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(applyFilters, debounceMs);
  }

  function handleInput() {
    scheduleFiltersUpdate();
  }

  function handleChange(event: FormEvent<HTMLFormElement>) {
    if (event.target instanceof HTMLSelectElement) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      applyFilters();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    applyFilters();
  }

  return (
    <form
      className={className}
      onChange={handleChange}
      onInput={handleInput}
      onSubmit={handleSubmit}
      ref={formRef}
    >
      {children}
    </form>
  );
}

function getNamedFormFields(form: HTMLFormElement) {
  const names = new Set<string>();

  Array.from(form.elements).forEach((element) => {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement
    ) {
      if (element.name) {
        names.add(element.name);
      }
    }
  });

  return names;
}
