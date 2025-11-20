import { IProductDto } from '@/shared/api/queryClient';
import React from 'react';
import s from './index.module.scss';
import AccentButton from '@/components/ui/AccentButton/AccentButton';
import Picture from '@/utils/Picture';

import exampleWebp from '../../Catalog/images/phone.webp';
import exampleFallback from '../../Catalog/images/phone.png';
import { LikeButton } from '@/components/ui/SquareButton/SquareButton';

type TSaleDto = Pick<
  IProductDto,
  'id' | 'name' | 'fallbackSrc' | 'isInStock' | 'isLiked' | 'price' | 'salePercent' | 'webpSrc'
>;

interface IProps extends React.HTMLAttributes<HTMLElement> {
  data: TSaleDto;
}

const SalesCard = ({ data }: IProps) => {
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
        <div className={s.sale}>-{(data.salePercent ?? 0) * 100}%</div>
      </div>
      <h3 className={s.name}>{data.name}</h3>
      <div className={s.prices}>
        <h4 className={s.currentPrice}>{data.price - data.price * (data.salePercent ?? 0)}₽</h4>
        <s className={s.previousPrice}>{data.price}₽</s>
      </div>
      <div className={s.actions}>
        <span className={data.isInStock ? s.inStock : s.notInStock}>
          {data.isInStock ? 'В наличии' : 'Нет в наличии'}
        </span>
        <LikeButton
          role="switch"
          aria-label={data.isLiked ? 'Убрать из избранного' : 'Добавить в избранное'}
          isLiked={data.isLiked}
        />
      </div>
      <AccentButton>В корзину</AccentButton>
    </article>
  );
};

export default SalesCard;
