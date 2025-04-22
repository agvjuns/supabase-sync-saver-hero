
import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";

const Signup: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 relative overflow-hidden">
      <AuthForm type="signup" />
    </div>
  );
};

export default Signup;
