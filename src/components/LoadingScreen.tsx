
import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default LoadingScreen;
