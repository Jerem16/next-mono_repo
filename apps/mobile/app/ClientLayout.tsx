import dynamic from "next/dynamic";
const LazyClientLayout = dynamic(() => import("./ClientLayout2"));

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
    return <LazyClientLayout>{children}</LazyClientLayout>;
};

export default ClientLayout;
