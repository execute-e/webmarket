const ArrowIcon = ({ direction }: { direction: 'left' | 'right' }) => {
  if (direction === 'left') {
    return (
      <svg
        width="14"
        height="22"
        viewBox="0 0 14 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable={false}
        >
        <path
          d="M12.4375 1.00003L1.37932 9.75442C0.889361 10.1423 0.871225 10.8795 1.34152 11.291L12.4375 21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="14" height="22" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 1.00003L12.0582 9.75442C12.5481 10.1423 12.5663 10.8795 12.096 11.291L1 21"
        stroke="#currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default ArrowIcon;
