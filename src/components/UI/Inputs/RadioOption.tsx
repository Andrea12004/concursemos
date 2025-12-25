import React from "react";
import './css/radio.css';

interface RadioOptionProps {
  id: string;
  name: string;
  value: string | number;
  checked: boolean;
  label: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioOption: React.FC<RadioOptionProps> = ({
  id,
  name,
  value,
  checked,
  label,
  className = "",
  onChange,
}) => {
  return (
    <div className={`radio-button ${className}`}>
      <input
        type="radio"
        id={id}
        className="radio-button__input"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />

      <label className="radio-button__label" htmlFor={id}>
        <span className="radio-button__custom"></span>
        {label}
      </label>
    </div>
  );
};

export default RadioOption;
