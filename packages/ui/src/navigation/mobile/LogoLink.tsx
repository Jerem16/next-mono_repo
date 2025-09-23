import { memo } from "react";
import type { MouseEventHandler } from "react";
import Link from "next/link";
import { Logo } from "./icons";

type LogoLinkProps = {
    onClick?: MouseEventHandler<HTMLAnchorElement>;
};

const LogoLink = ({ onClick }: LogoLinkProps) => {
    return (
        <Link href="/#top" aria-label="Vers home page " className="logo-link" onClick={onClick}>
            <Logo />
        </Link>
    );
};

export default memo(LogoLink);
