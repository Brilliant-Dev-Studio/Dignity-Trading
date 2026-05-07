"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function AnimatedCoin({
  src,
  alt,
  sizeClassName,
  width = 130,
}: {
  src: string;
  alt: string;
  sizeClassName: string;
  width?: number;
}) {
  return (
    <motion.div
      className="shrink-0"
      initial={{ y: 0, rotate: -2 }}
      animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 3.6, ease: "easeInOut", repeat: Infinity }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={width}
        className={`${sizeClassName} rounded-full object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]`}
        priority={false}
      />
    </motion.div>
  );
}

