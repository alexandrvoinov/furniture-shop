export type ToastVariant = 'error' | 'success';

export type ToastPayload = {
  id: string;
  message: string;
  title?: string;
  variant: ToastVariant;
};

export type ToastInput = Omit<ToastPayload, 'id'>;

export const TOAST_EVENT_NAME = 'mebel-shop:toast';

export function showToast(input: ToastInput) {
  if (typeof window === 'undefined') {
    return;
  }

  const toast: ToastPayload = {
    ...input,
    id: createToastId(),
  };

  window.dispatchEvent(new CustomEvent<ToastPayload>(TOAST_EVENT_NAME, { detail: toast }));
}

function createToastId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
