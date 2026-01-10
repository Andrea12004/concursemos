import React from "react";

import './css/style.css'

interface Option {
  value: string | number;
  label: string;
}

interface SelectFieldProps {
  name: string;
  value: string | number;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

const Select: React.FC<SelectFieldProps> = ({
  name,
  value,
  options,
  onChange,
  className = "",
}) => {
  return (
    <select
      className={`select-negro ${className}`}
      name={name}
      value={value}
      onChange={onChange}
    >
      {options.map((opt, index) => (
        <option key={index} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
