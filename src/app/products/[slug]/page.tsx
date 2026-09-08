import { PagePlaceholder } from '@/shared/ui/page-placeholder/PagePlaceholder';

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <PagePlaceholder
      eyebrow="Товар"
      title="Страница товара"
      description={`Карточка товара "${slug}" будет подключаться к API и наполняться деталями продукта.`}
    />
  );
}
