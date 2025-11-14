interface IProps {
  webp: string;
  fallback: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
}

const Picture = ({
  webp,
  fallback,
  width,
  height,
  alt = '',
  className = '',
  ...imgProps
}: IProps) => {
  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      <img
        src={fallback}
        width={width}
        height={height}
        alt={alt}
        className={className}
        {...imgProps}
      />
    </picture>
  );
};

export default Picture;
