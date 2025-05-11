import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const baseStyles =
  "font-semibold rounded focus:outline-none focus:ring transition duration-200";
const variantStyles = {
  primary: "bg-blue-600 text-white hover:bg-blue-100 focus:ring-blue-300",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300",
};
const sizeStyles = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  return (
    <button className={classes} {...props}>
      {children}
      <span className="text-red-500">Sample....</span>
    </button>
  );
};
