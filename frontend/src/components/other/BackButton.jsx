import React from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button onClick={handleGoBack}
      className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors duration-200 hover:text-gray-800 hover:cursor-pointer sm:text-sm"
    >
      <MdArrowBack className="text-base sm:text-lg" />
      Back
    </button>
  );
};

export default BackButton;
