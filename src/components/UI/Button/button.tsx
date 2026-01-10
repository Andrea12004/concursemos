import React from "react";
import "./css/button.css";

// Allow native button attributes (style, disabled, aria-*, etc.) and still keep our custom props
type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "className" | "children"
>;

interface CustomButtonProps extends NativeButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  color?: string;          
  size?: "sm" | "md" | "lg"; 
  className?: string;       
  fullWidth?: boolean;  
  height?: string | number;     
}

const Button: React.FC<CustomButtonProps> = ({
  children,
  type = "button",
  color = "primary", 
  size = "md",
  className = "",
  fullWidth = false,
  height,
  ...rest
}) => {
  // Merge height with any incoming style prop so both color/style and height are preserved
  const { style, ...nativeRest } = rest as NativeButtonProps;
  const mergedStyle: React.CSSProperties = {
    ...(style as React.CSSProperties),
    height: height,
  };

  return (
    <button
      type={type}
      className={`button-ingresar ${color} ${size} ${fullWidth ? "full" : ""} ${className}`}
      style={mergedStyle}
      {...(nativeRest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};

export default Button;
