import React from "react";
import "./styles.css";

interface CustomButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  color?: string;          
  size?: "sm" | "md" | "lg"; 
  className?: string;       
  fullWidth?: boolean;  
  height?: string | number;     
  onClick?: () => void;
}

const Button: React.FC<CustomButtonProps> = ({
  children,
  type = "button",
  color = "primary", 
  size = "md",
  className = "",
  fullWidth = false,
  height,
  onClick,
}) => {
  return (
    <button
      type={type}
      className={`button-ingresar ${color} ${size} ${fullWidth ? "full" : ""} ${className}`}
      style={{
        height: height, 
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
