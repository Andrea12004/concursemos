import React from "react";

interface StyledCheckboxProps {
  id: string;
  label: string;
  name?: string;
  checked?: boolean;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  className?: string;
}

const StyledCheckbox: React.FC<StyledCheckboxProps> = ({
  id,
  label,
  name,
  checked,
  onClick,
  className = "",
}) => {
  return (
    <div className={`checkbox-wrapper-4 ${className}`}>
      <input
        className="inp-cbx"
        id={id}
        type="checkbox"
        name={name}
        checked={checked}
        onClick={onClick}
        readOnly={false}
      />

      <label className="cbx" htmlFor={id}>
        <span>
          <svg width="12px" height="10px"></svg>
        </span>
        <span>{label}</span>
      </label>

      <svg className="inline-svg">
        <symbol id="check-4" viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </symbol>
      </svg>
    </div>
  );
};

export default StyledCheckbox;
