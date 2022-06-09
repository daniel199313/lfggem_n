import React from "react";
import clsx from "clsx";

const Button = ({ children, className, ...rest }) => {
  return (
    <button
      className={clsx(
        " bg-blue-200 border-none rounded-md px-5 py-1 text-blue-900 hover:bg-blue-500 hover:text-white transition-all",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
