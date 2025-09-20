import { memo, type FC, type MouseEventHandler } from "react";
import Link from "next/link";
import Logo from "../svg_Icon/Logo";

type LogoLinkProps = {
    readonly onClick?: MouseEventHandler<HTMLAnchorElement>;
};

const LogoLink: FC<LogoLinkProps> = ({ onClick }) => (
    <Link
        href="/#top"
        aria-label="Vers home page "
        className="logo-link"
        {...(onClick ? { onClick } : {})}
    >
        <Logo />
    </Link>
);

export default memo(LogoLink);
