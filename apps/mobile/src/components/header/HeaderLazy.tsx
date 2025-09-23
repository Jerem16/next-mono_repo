"use client";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("./Header"), { ssr: false });

const HeaderLazy = () => {
    return <Header />;
};

export default HeaderLazy;
