import { PagePlaceholder } from '@/shared/ui/page-placeholder/PagePlaceholder';

export default function NotFoundPage() {
  return (
    <PagePlaceholder
      eyebrow="404"
      title="Страница не найдена"
      description="Такого раздела пока нет. Проверьте адрес или вернитесь на главную."
    />
  );
}
