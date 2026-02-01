import React from "react";
import { Select } from "antd";
import { LEVELS } from "@/lib/constants/levels";
import "./css/style.css";

interface LevelSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="level-select-wrapper">

        <img src="/svg/iconos/filter.svg" alt="Filtrar" className="w-4 h-4" />

      <Select
        value={value || undefined}
        onChange={onChange}
        placeholder="Niveles"
        className="level-select textos-peques"
        allowClear
        options={LEVELS.map((level) => ({
          value: level.value,
          label: (
            <span className="text-black textos-peques">
              <img
                src={`/images/niveles/${level.label}.png`}
                alt={level.label}
                className="inline w-4 h-4 mr-2"
              />
              {level.label}
            </span>
          ),
        }))}
      />
    </div>
  );
};
