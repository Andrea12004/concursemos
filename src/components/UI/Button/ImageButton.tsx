import React from "react";
import "./css/image-button.css";

interface ImageButtonProps {
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const ImageButton: React.FC<ImageButtonProps> = ({
  type = "button",
  className = "",
  onClick,
  children,
}) => {
  return (
    <button type={type} className={`image-button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default ImageButton;
