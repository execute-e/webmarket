import { IProductDto } from '@/shared/api/queryClient';
import React, { useMemo } from 'react';
import s from './index.module.scss';
import AccentButton from '@/components/ui/AccentButton/AccentButton';
import Picture from '@/utils/Picture';
import { LikeButton } from '@/components/ui/SquareButton/SquareButton';

import exampleWebp from './images/example.webp';
import exampleFallback from './images/example.jpg';

type TProductDto = Pick<
  IProductDto,
  'id' | 'name' | 'fallbackSrc' | 'isInStock' | 'isLiked' | 'price' | 'salePercent' | 'webpSrc'
>;

interface IProps extends React.HTMLAttributes<HTMLElement> {
  data: TProductDto;
}

const ProductCard = ({ data }: IProps) => {
  const currentPrice = useMemo(() => {
    if (data.salePercent) {
      return data.price - data.price * data.salePercent;
    }
    return data.price;
  }, [data.price, data.salePercent]);

  return (
    <article className={s.card}>
      <div className={s.wrapper}>
        <Picture
          webp={data.webpSrc ?? exampleWebp}
          fallback={data.fallbackSrc ?? exampleFallback}
          width={170}
          height={210}
          alt={data.name}
          className={s.image}
        />
        {data.salePercent && <div className={s.sale}>-{data.salePercent * 100}%</div>}
      </div>
      <h3 className={s.name}>{data.name}</h3>
      <div className={s.prices}>
        <h4 className={s.currentPrice}>{currentPrice}₽</h4>
        {data.salePercent && (
          <s aria-label={`Старая цена: ${data.price} рублей`} className={s.previousPrice}>
            {data.price}₽
          </s>
        )}
      </div>
      <div className={s.actions}>
        <span className={data.isInStock ? s.inStock : s.notInStock}>
          {data.isInStock ? 'В наличии' : 'Нет в наличии'}
        </span>
        <LikeButton
          role="switch"
          aria-checked={data.isLiked}
          aria-label={data.isLiked ? 'Убрать из избранного' : 'Добавить в избранное'}
          isLiked={data.isLiked}
          type="button"
        />
      </div>
      <AccentButton type="button">В корзину</AccentButton>
    </article>
  );
};

export default ProductCard;
