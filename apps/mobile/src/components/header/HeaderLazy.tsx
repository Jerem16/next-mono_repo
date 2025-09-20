"use client";
import dynamic from "next/dynamic";
import type { FC } from "react";

const Header = dynamic(() => import("./Header"), { ssr: false });

const HeaderLazy: FC = () => <Header />;

export default HeaderLazy;
