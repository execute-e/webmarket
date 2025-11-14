import ArrowIcon from "./icons/ArrowIcon";

interface IProps {
    direction: 'left' | 'right';
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    ariaLabel?: string;
}

const ArrowButton = ({direction, onClick, disabled, className, ariaLabel}: IProps) => {
    return (
        <button type="button" onClick={onClick} disabled={disabled} className={className} aria-label={ariaLabel}>
            <ArrowIcon direction={direction}/>
        </button>
    );
};

export default ArrowButton;