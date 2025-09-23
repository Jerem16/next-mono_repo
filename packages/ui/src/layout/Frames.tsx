import React from "react";

interface FramesProps extends React.HTMLAttributes<HTMLElement> {
    id?: string;
    className?: string;
    children?: React.ReactNode;
}

const Frames: React.FC<FramesProps> = ({ className, id, children, ...rest }) => {
    return (
        <section className={className} id={id} {...rest}>
            {children}
        </section>
    );
};

export default Frames;
