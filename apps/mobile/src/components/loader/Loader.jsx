import { memo } from "react";
import Image from "next/image";

const Loader = () => {
    return (
        <div className="loader">
            <div className="ld-circleBG"></div>
            <div className="ld-frame">
                <Image src="/img/retroviseur.svg" alt="loader" width={225} height={225} />
                <span className="ld-dot2"></span>
                <span className="ld-dot1"></span>
                <span className="ld-dot"></span>
            </div>
        </div>
    );
};

export default memo(Loader);
