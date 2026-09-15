'use client';

import { ShoppingBag } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { addCartItem } from '@/entities/cart';
import { showToast } from '@/shared/ui/toast';

type AddToCartButtonProps = {
  addedLabel?: string;
  className?: string;
  label?: string;
  productId: string;
  productName: string;
  showIcon?: boolean;
};

export function AddToCartButton({
  addedLabel = 'Добавлено',
  className,
  label = 'Добавить в корзину',
  productId,
  productName,
  showIcon = true,
}: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  function handleClick() {
    try {
      addCartItem(productId);
      setIsAdded(true);
      showToast({
        message: `Товар ${productName} успешно добавлен`,
        title: 'Корзина',
        variant: 'success',
      });
    } catch (error) {
      showToast({
        message: getErrorMessage(error),
        title: 'Не удалось добавить товар',
        variant: 'error',
      });
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => setIsAdded(false), 1400);
  }

  return (
    <button className={className} onClick={handleClick} type="button">
      {showIcon ? <ShoppingBag size={17} strokeWidth={1.8} aria-hidden="true" /> : null}
      {isAdded ? addedLabel : label}
    </button>
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Произошла ошибка при добавлении товара в корзину';
}
