import { memo } from "react";
import Link from "next/link";
import Logo from "../svg_Icon/Logo";

const LogoLink = ({ onClick }) => {
    return (
        <Link href="/#top" aria-label="Vers home page " className="logo-link" onClick={onClick}>
            <Logo />
        </Link>
    );
};

export default memo(LogoLink);
