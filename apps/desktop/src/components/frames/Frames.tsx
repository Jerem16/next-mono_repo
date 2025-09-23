// src/components/frames/Frames.tsx
import type { HTMLAttributes, ReactNode } from "react";

type FramesProps = HTMLAttributes<HTMLElement> & {
    children?: ReactNode;
};

const Frames = ({ className, id, children, ...rest }: FramesProps) => {
    return (
        <section className={className} id={id} {...rest}>
            {children}
        </section>
    );
};

export default Frames;
