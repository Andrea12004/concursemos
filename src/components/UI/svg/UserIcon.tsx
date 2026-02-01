import React from "react";

interface UserIconProps {
  onClick?: () => void;
  className?: string;
  width?: number;
  height?: number;
}

export const UserIcon: React.FC<UserIconProps> = ({
  onClick,
  className = "",
  width = 23,
  height = 23,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 23 23"
      fill="none"
      className={className}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      <g clipPath="url(#clip0_7_411)">
        <path
          d="M11.5 0.449219C5.39152 0.449219 0.449219 5.39242 0.449219 11.5C0.449219 17.5975 5.38326 22.5508 11.5 22.5508C17.6442 22.5508 22.5508 17.5682 22.5508 11.5C22.5508 5.39152 17.6076 0.449219 11.5 0.449219Z"
          fill="#134E9D"
        />
        <path
          d="M18.2075 20.2854V20.2858C16.3482 21.7071 14.0235 22.5508 11.4998 22.5508C8.9765 22.5508 6.6518 21.7071 4.79248 20.2858C5.11816 16.8682 7.99676 14.1953 11.4998 14.1953C15.0028 14.1953 17.8809 16.8677 18.2075 20.2854Z"
          fill="#ECF2F3"
        />
        <path
          d="M11.5 12.3984C13.4848 12.3984 15.0938 10.7895 15.0938 8.80469C15.0938 6.81991 13.4848 5.21094 11.5 5.21094C9.51523 5.21094 7.90625 6.81991 7.90625 8.80469C7.90625 10.7895 9.51523 12.3984 11.5 12.3984Z"
          fill="#ECF2F3"
        />
      </g>
      <defs>
        <clipPath id="clip0_7_411">
          <rect width="23" height="23" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default UserIcon;