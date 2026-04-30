import React from "react";
import styles from "./StarBorder.module.css";

export type StarBorderProps<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    className?: string;
    children?: React.ReactNode;
    color?: string;
    speed?: React.CSSProperties["animationDuration"];
    thickness?: number;
  };

const StarBorder = <T extends React.ElementType = "button">({
  as,
  className = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || "button";
  const { style, ...restProps } = rest as React.ComponentPropsWithoutRef<T>;

  return (
    <Component
      className={`${styles.starBorderContainer} ${className}`}
      {...restProps}
      style={{
        padding: `${thickness}px 0`,
        ...(style ?? {}),
      }}
    >
      <div
        className={styles.borderGradientBottom}
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className={styles.borderGradientTop}
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div className={styles.innerContent}>{children}</div>
    </Component>
  );
};

export default StarBorder;

