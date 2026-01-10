import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "primary",
  size = "md",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-gradient-to-br from-indigo-500 to-teal-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40",
    secondary: "bg-slate-900 text-white hover:bg-slate-800",
    outline:
      "bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50",
  };

  const sizeStyles = {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
};

export default Button;
