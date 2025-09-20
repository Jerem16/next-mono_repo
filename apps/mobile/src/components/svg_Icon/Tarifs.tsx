import { memo, type FC } from "react";

const Tarifs: FC = () => (
    <div className="nav-icon">
        <svg fill="none" aria-hidden="true" viewBox="0 0 18 18">
            <path
                d="M13.95 18H4.05C1.35 18 0 16.65 0 13.95V4.05C0 1.35 1.35 0 4.05 0H13.95C16.65 0 18 1.35 18 4.05V13.95C18 16.65 16.65 18 13.95 18ZM4.05 1.95C2.4 1.95 1.95 2.4 1.95 4.05V13.95C1.95 15.6 2.4 16.05 4.05 16.05H13.95C15.6 16.05 16.05 15.6 16.05 13.95V4.05C16.05 2.4 15.6 1.95 13.95 1.95H4.05Z"
                className="icon-color"
            />
            <path
                d="M6 12.9H7.65C8.4 12.9 9 12.3 9 11.55V6.45C9 5.7 8.4 5.1 7.65 5.1H6C5.25 5.1 4.65 5.7 4.65 6.45V11.55C4.65 12.3 5.25 12.9 6 12.9Z"
                className="icon-color"
            />
            <path
                d="M10.35 12.9H12C12.75 12.9 13.35 12.3 13.35 11.55V6.45C13.35 5.7 12.75 5.1 12 5.1H10.35C9.6 5.1 9 5.7 9 6.45V11.55C9 12.3 9.6 12.9 10.35 12.9Z"
                className="icon-color"
            />
        </svg>
    </div>
);

export default memo(Tarifs);
