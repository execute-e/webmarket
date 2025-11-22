const GridIcon = ({ className }: { className?: string }) => {
  return (
    <svg width="24" height="22" viewBox="0 0 24 22" fill="none" className={className} aria-hidden focusable="false" xmlns="http://www.w3.org/2000/svg">
      <rect width="11" height="10" rx="1" fill="currentColor" />
      <rect x="13" width="11" height="10" rx="1" fill="currentColor" />
      <rect y="12" width="11" height="10" rx="1" fill="currentColor" />
      <rect x="13" y="12" width="11" height="10" rx="1" fill="currentColor" />
    </svg>
  );
};

export default GridIcon;
