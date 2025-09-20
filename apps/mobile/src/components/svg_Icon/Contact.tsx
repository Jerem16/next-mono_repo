import { memo, type FC } from "react";

const Contact: FC = () => (
    <div className="nav-icon">
        <svg fill="none" aria-hidden="true" viewBox="0 0 18 18">
            <path
                d="M15.75 15.45H14.25V14.4C14.25 13.05 13.2 12 11.85 12H6.15C4.8 12 3.75 13.05 3.75 14.4V15.45H2.25C1.35 15.45 0.75 14.85 0.75 13.95V3.9C0.75 3 1.35 2.4 2.25 2.4H15.75C16.65 2.4 17.25 3 17.25 3.9V13.95C17.25 14.85 16.65 15.45 15.75 15.45Z"
                className="icon-color"
            />
            <path
                d="M5.25 4.65C4.5 4.65 3.9 5.25 3.9 6C3.9 6.75 4.5 7.35 5.25 7.35C6 7.35 6.6 6.75 6.6 6C6.6 5.25 6 4.65 5.25 4.65ZM11.25 8.1C9.9 8.1 8.55 8.55 7.5 9.45C7.95 10.2 8.85 10.8 9.9 10.8H12.6C13.65 10.8 14.55 10.05 14.85 9.15C13.8 8.4 12.6 8.1 11.25 8.1Z"
                className="icon-color"
            />
        </svg>
    </div>
);

export default memo(Contact);
