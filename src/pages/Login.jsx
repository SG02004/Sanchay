import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import BrandLogo from "../components/BrandLogo";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

const Login = () => {
  const navigate = useNavigate();

  
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");


  useEffect(() => {
    const isLoggedIn = localStorage.getItem("login");

    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [navigate]);

  

  const handleLogin = (e) => {
    e.preventDefault();


    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }


    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }


    setError("");


    localStorage.setItem("login", "true");
    localStorage.setItem("userEmail", email);

    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-emerald-50 to-slate-200 p-4 sm:p-6">

      <Card className="w-full max-w-sm rounded-3xl border-0 bg-white/90 p-6 shadow-2xl backdrop-blur-xl sm:max-w-md sm:p-10">

        <BrandLogo />

        <div className="mt-6 text-center sm:mt-8">

          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Welcome Back 👋
          </h2>

          <p className="mt-2 text-slate-500">
            Sign in to continue managing your finances.
          </p>

        </div>

        {/* Login Form */}

        <form onSubmit={handleLogin} className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">


          <div>

            <Label htmlFor="email">
              Email
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-2 h-10 sm:h-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>


          <div>

            <Label htmlFor="password">
              Password
            </Label>

            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mt-2 h-10 sm:h-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>


          {error && (
            <p className="text-sm font-medium text-red-500">
              {error}
            </p>
          )}


          <div className="flex justify-end">

            <button
              type="button"
              className="text-sm text-emerald-600 hover:underline"
            >
              Forgot Password?
            </button>

          </div>


          <Button
            type="submit"
            className="h-10 w-full rounded-xl bg-emerald-600 text-sm hover:bg-emerald-700 sm:h-11 sm:text-base"
          >
            Sign In
          </Button>

        </form>


        <p className="mt-6 text-center text-sm text-slate-500 sm:mt-8">

          Don't have an account?{" "}

          <span
            onClick={() => navigate("/register")}
            className="cursor-pointer font-semibold text-emerald-600 hover:underline"
          >
            Create Account
          </span>

        </p>

      </Card>

    </div>
  );
};

export default Login;
