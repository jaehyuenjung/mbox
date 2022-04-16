import type { NextPage } from "next";
import { motion } from "framer-motion";

type kindProps = "upping" | "fading" | "bluring" | "scaling";

interface TextEffectProps {
    text: string;
    kind: kindProps;
    beforeColor?: string;
    afterColor?: string;
    blurWeight?: number;
    scale?: number;
}

const TextEffect = ({
    text,
    kind,
    beforeColor,
    afterColor,
    blurWeight,
    scale,
}: TextEffectProps) => {
    const wordVariants = {
        hidden: {
            y: kind === "upping" ? 200 : 0,
            opacity: ["fading", "scaling"].includes(kind) ? 0 : 1,
            color: beforeColor,
            filter: kind === "bluring" ? `blur(${blurWeight}px)` : "blur(0px)",
            scale: kind === "scaling" ? scale : 1,
        },
        visible: {
            y: kind === "upping" ? 0 : 0,
            opacity: 1,
            filter: "blur(0px)",
            color: afterColor,
            scale: 1,
        },
    };

    const splitWords = text.split(" ");

    const words = [] as string[][];

    for (let i = 0; i < splitWords.length; i++) {
        words.push(splitWords[i].split(""));
    }

    words.map((word) => {
        return word.push("\u00A0");
    });

    return (
        <>
            {words.map((word, index) => {
                return (
                    <span key={index} className="whitespace-nowrap select-none">
                        {words[index].flat().map((element, index) => {
                            return (
                                <span
                                    key={index}
                                    className="overflow-hidden inline-block"
                                >
                                    <motion.span
                                        variants={wordVariants}
                                        transition={{
                                            default: {
                                                ease: [
                                                    0.455, 0.03, 0.515, 0.955,
                                                ],

                                                duration: 2,
                                            },
                                            color: {
                                                ease: "easeIn",

                                                duration: 5,
                                            },
                                        }}
                                        className="inline-block overflow-hidden"
                                    >
                                        {element}
                                    </motion.span>
                                </span>
                            );
                        })}
                    </span>
                );
            })}
        </>
    );
};

interface AnimationTextProps {
    text: string;
    kind: kindProps;
    isStroke?: boolean;
    strokeColor?: string;
    staggerTime?: number;
    beforeColor?: string;
    afterColor?: string;
    blurWeight?: number;
    scale?: number;
    [key: string]: any;
}

const AnimationText: NextPage<AnimationTextProps> = ({
    text,
    kind,
    isStroke = false,
    strokeColor,
    staggerTime = 0.05,
    beforeColor,
    afterColor,
    blurWeight = 0,
    scale = 1,
    ...rest
}) => {
    const containerVariants = {
        visible: {
            transition: {
                staggerChildren: staggerTime,
                delayChildren: 1.8,
            },
        },
    };

    return (
        <motion.div
            style={{
                textShadow: isStroke
                    ? `-1px 0px ${strokeColor}, 0px 1px ${strokeColor}, 1px 0px ${strokeColor}, 0px -1px ${strokeColor}`
                    : "none",
            }}
            {...rest}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <TextEffect
                text={text}
                kind={kind}
                beforeColor={beforeColor}
                afterColor={afterColor}
                blurWeight={blurWeight}
                scale={scale}
            />
        </motion.div>
    );
};

export default AnimationText;
