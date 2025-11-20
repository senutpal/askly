import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`
        text-transparent bg-clip-text inline-block 
        ${disabled ? "" : "animate-shine"} 
        ${className}
        /* LIGHT MODE COLORS: Dark text (#000) with a lighter shine (#888) */
        [--shiny-text-base:#525252] [--shiny-text-shine:#000000] 
        /* DARK MODE COLORS: Light text (#b5b5b5) with a white shine (#fff) */
        dark:[--shiny-text-base:#b5b5b5] dark:[--shiny-text-shine:#ffffff]
      `}
      style={{
        backgroundImage:
          "linear-gradient(120deg, var(--shiny-text-base) 40%, var(--shiny-text-shine) 50%, var(--shiny-text-base) 60%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animationDuration: animationDuration,
      }}
    >
      {text}
    </div>
  );
};

export default ShinyText;