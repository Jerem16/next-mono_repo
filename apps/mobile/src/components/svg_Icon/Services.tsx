import { memo, type FC } from "react";

const Services: FC = () => (
    <div className="nav-icon">
        <svg fill="none" aria-hidden="true" viewBox="0 0 18 18">
            <path
                d="M2.1 11.7H0C0.45 15.45 1.35 18 5.4 18H11.85C15.9 18 17.25 15.9 17.55 14.85C17.85 13.8 17.25 12.9 16.2 12.9H14.4C10.05 12.9 6.15 11.1 2.1 11.7Z"
                className="icon-color"
            />
            <path
                d="M12.75 4.95C12.3 4.95 11.85 5.1 11.4 5.25C11.1 4.8 10.65 4.5 10.05 4.5C9.6 4.5 9.15 4.65 8.85 4.95C7.95 4.2 6.6 4.2 5.7 4.95C4.05 6.15 3.75 8.25 4.95 9.9C6.45 11.85 9.75 12.45 9.9 12.45C10.05 12.45 13.5 11.85 15 9.9C15.75 8.85 15.75 7.5 15.15 6.45C14.55 5.55 13.65 4.95 12.75 4.95Z"
                className="icon-color"
            />
        </svg>
    </div>
);

export default memo(Services);
