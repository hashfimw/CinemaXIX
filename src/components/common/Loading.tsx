import React from "react";

interface LoadingSpinnerProps {
  /**
   * Tinggi container loading
   * @default "h-64"
   */
  containerHeight?: string;

  /**
   * Ukuran spinner
   * @default "w-12 h-12"
   */
  spinnerSize?: string;

  /**
   * Warna border spinner
   * @default "border-tmdb-blue"
   */
  color?: string;

  /**
   * Warna border transparan (bagian atas)
   * @default "border-t-transparent"
   */
  transparentColor?: string;

  /**
   * Kelas tambahan untuk container
   */
  className?: string;

  /**
   * Ketebalan border
   * @default "border-4"
   */
  borderWidth?: string;

  /**
   * Apakah spinner mengambil seluruh tinggi layar
   * @default false
   */
  fullHeight?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  containerHeight = "h-64",
  spinnerSize = "w-12 h-12",
  color = "border-tmdb-blue",
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
