'use client';

import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { TOAST_EVENT_NAME, type ToastPayload } from './toastEvents';
import styles from './ToastViewport.module.scss';

const TOAST_LIMIT = 4;
const TOAST_DURATION_MS = 3600;

export function ToastViewport() {
  const [toasts, setToasts] = useState<ToastPayload[]>([]);
  const timeoutRefs = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismissToast = useCallback((id: string) => {
    const timeout = timeoutRefs.current.get(id);

    if (timeout) {
      clearTimeout(timeout);
      timeoutRefs.current.delete(id);
    }

    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    const timeouts = timeoutRefs.current;

    function handleToast(event: Event) {
      if (!(event instanceof CustomEvent)) {
        return;
      }

      const toast = event.detail as ToastPayload;

      setToasts((currentToasts) => [toast, ...currentToasts].slice(0, TOAST_LIMIT));

      const timeout = setTimeout(() => {
        dismissToast(toast.id);
      }, TOAST_DURATION_MS);

      timeouts.set(toast.id, timeout);
    }

    window.addEventListener(TOAST_EVENT_NAME, handleToast);

    return () => {
      window.removeEventListener(TOAST_EVENT_NAME, handleToast);
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
    };
  }, [dismissToast]);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.viewport} aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div
          className={
            toast.variant === 'error'
              ? `${styles.toast} ${styles.toastError}`
              : `${styles.toast} ${styles.toastSuccess}`
          }
          key={toast.id}
          role="status"
        >
          <div>
            {toast.title ? <strong>{toast.title}</strong> : null}
            <p>{toast.message}</p>
          </div>
          <button
            aria-label="Закрыть уведомление"
            onClick={() => dismissToast(toast.id)}
            type="button"
          >
            <X size={16} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
