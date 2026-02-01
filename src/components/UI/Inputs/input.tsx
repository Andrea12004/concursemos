import React from "react";
import './css/input.css';

type InputType = "text" | "email" | "number" | "password";


type NativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "name" | "value" | "onChange"
>;

interface InputProps extends NativeInputProps {
  type?: InputType;
  placeholder?: string;
  name?: string; 
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  showPassword?: boolean;
  width?: string | number;   
  height?: string | number;  
  noFocusRing?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder = "",
  name,
  value,
  onChange,
  onKeyDown,
  className = "",
  showPassword,
  width,
  height,
  noFocusRing = false,
  ...rest
}) => {

  const computedType =
    type === "password" && showPassword ? "text" : type;

  const focusClasses = noFocusRing 
    ? "" 
    : "focus:ring-1 focus:ring-blue-700 focus:outline-none";

  return (
    <input
      type={computedType}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={`${className} ${focusClasses}`}
      style={{
        width: width,
        height: height,
      }}
      {...rest}
    />
  );
};