const SortIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="18"
      height="16"
      viewBox="0 0 18 16"
      fill="none"
      className={className}
      aria-hidden
      focusable="false"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 13.8349V1.8349M4 13.8349L1 9.21952M4 13.8349L7 9.21952"
        stroke="#454545"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M14 1.8349V13.8349M14 1.8349L11 6.45028M14 1.8349L17 6.45028"
        stroke="#454545"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  );
};

export default SortIcon;
