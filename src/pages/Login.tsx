
import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 relative overflow-hidden">
      <AuthForm type="login" />
    </div>
  );
};

export default Login;
