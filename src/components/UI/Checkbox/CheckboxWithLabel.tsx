import React from "react";

import './styles.css';


interface CheckboxWithLabelProps {
  id: string;
  name?: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = ({
  id,
  name,
  label,
  checked,
  onChange,
  className = "",
}) => {
  return (
    <label className={`label-check-login ${className}`}>
      <div className="checkbox-wrapper-19">
        <input 
          id={id}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
        />
        <label className="check-box" htmlFor={id}></label>
      </div>
      {label}
    </label>
  );
};

export default CheckboxWithLabel;
