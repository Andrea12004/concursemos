import React from "react";

interface PasswordConditionProps {
  valid: boolean;
  text: string;
}

export const PasswordCondition: React.FC<PasswordConditionProps> = ({ valid, text }) => {
  
  const getSVG = (type: 'check' | 'error') => {
    if (type === 'check') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
          <g clipPath="url(#clip0_7_183)">
            <path d="M5.00012 10C7.76155 10 10.0001 7.76142 10.0001 5C10.0001 2.23858 7.76155 0 5.00012 0C2.2387 0 0.00012207 2.23858 0.00012207 5C0.00012207 7.76142 2.2387 10 5.00012 10Z" fill="#134E9D"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M3.43883 7.43852L1.61017 5.48132C1.35981 5.21337 1.37418 4.78943 1.64213 4.53908C1.91009 4.28872 2.33402 4.30313 2.58438 4.57104L3.99493 6.08073L6.22765 3.99463C6.24772 3.97585 6.26871 3.95864 6.2904 3.94282L7.34036 2.96183C7.60832 2.71148 8.03229 2.72589 8.28261 2.99384C8.53296 3.26175 8.51855 3.68573 8.25064 3.93608L5.04379 6.93234L5.04036 6.92868L3.93107 7.96514L3.43883 7.43829V7.43852Z" fill="white"/>
          </g>
          <defs>
            <clipPath id="clip0_7_183">
              <rect width="10" height="10" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      );
    } 
    
    if (type === 'error') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
          <g clipPath="url(#clip0_7_180)">
            <path fillRule="evenodd" clipRule="evenodd" d="M5.00012 0C7.76111 0 10.0001 2.23902 10.0001 5C10.0001 7.76098 7.76111 10 5.00012 10C2.23914 10 0.00012207 7.76098 0.00012207 5C0.00012207 2.23902 2.23914 0 5.00012 0ZM2.47296 6.8098L4.28276 5L2.47296 3.1902C2.36914 3.08634 2.36914 2.91693 2.47296 2.81311L2.81323 2.47283C2.91705 2.36902 3.08646 2.36902 3.19032 2.47283L5.00012 4.28264L6.80993 2.47283C6.91378 2.36902 7.08319 2.36902 7.18701 2.47283L7.52729 2.81311C7.63111 2.91693 7.63111 3.08634 7.52729 3.1902L5.71748 5L7.52729 6.8098C7.63111 6.91366 7.63111 7.08307 7.52729 7.18689L7.18701 7.52717C7.08319 7.63098 6.91378 7.63098 6.80993 7.52717L5.00012 5.71736L3.19032 7.52717C3.08646 7.63098 2.91705 7.63098 2.81323 7.52717L2.47296 7.18689C2.36914 7.08307 2.36914 6.91366 2.47296 6.8098Z" fill="#FF914C"/>
          </g>
          <defs>
            <clipPath id="clip0_7_180">
              <rect width="10" height="10" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      );
    }

    return null;
  };

  return (
    <p className={`p-register ${valid ? 'valid' : 'invalid'}`}>
      {valid ? getSVG('check') : getSVG('error')} {text}
    </p>
  );
};

export default PasswordCondition;
