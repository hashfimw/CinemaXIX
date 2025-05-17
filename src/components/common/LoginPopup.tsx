import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface LoginPopupProps {
  onClose: () => void;
  onLogin: () => void;
  message: string;
}

const LoginPopup: React.FC<LoginPopupProps> = ({
  onClose,
  onLogin,
  message,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-lg w-80 p-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white hover:bg-zinc-900 bg-zinc-700 "
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <img
            src="/tmdblogo.jpg"
            alt="TMDB Logo"
            className="w-24 h-24 object-contain"
          />
        </div>

        <p className="text-center mb-4 text-gray-800">{message}</p>

        <button
          onClick={onLogin}
          className="w-full bg-zinc-700 text-white py-2 px-4 rounded-md hover:bg-cinema-blue transition-colors"
        >
          Login with TMDB
        </button>
      </div>
    </div>
  );
};

export default LoginPopup;
