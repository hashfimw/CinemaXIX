import React from "react";

interface LoadingSpinnerProps {
  containerHeight?: string;
  spinnerSize?: string;
  color?: string;
  transparentColor?: string;
  className?: string;
  borderWidth?: string;
  fullHeight?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  containerHeight = "h-64",
  spinnerSize = "w-12 h-12",
  color = "border-gray-300",
  transparentColor = "border-t-transparent",
  className = "",
  borderWidth = "border-4",
  fullHeight = false,
}) => {
  const containerClass = fullHeight ? "min-h-screen" : containerHeight;

  return (
    <div
      className={`flex justify-center items-center ${containerClass} ${className}`}
    >
      <div
        className={`${spinnerSize} ${borderWidth} ${color} ${transparentColor} rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
