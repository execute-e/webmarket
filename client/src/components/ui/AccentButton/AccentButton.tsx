import React from 'react';
import s from './index.module.scss';

const AccentButton = ({
  type = 'button',
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button type={type} className={`${s.button} ${className ?? ''}`} {...props}>
      {children}
    </button>
  );
};

export default AccentButton;
