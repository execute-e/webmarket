import React from 'react';
import ArrowIcon from './icons/ArrowIcon';
import s from './index.module.scss';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: 'left' | 'right';
}

const ArrowButton = ({ direction, className, ...props }: IProps) => {
  return (
    <button type="button" className={s.button + ' ' + className} {...props}>
      <ArrowIcon direction={direction} />
    </button>
  );
};

export default React.memo(ArrowButton);
