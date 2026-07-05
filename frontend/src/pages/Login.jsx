import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import BrandLogo from "../components/Brandlogo";

import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");

    try {
      const data = await login(email, password);
      navigate(data.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-emerald-50 to-slate-200 p-6">
      <Card className="w-full max-w-md rounded-3xl border-0 bg-white/90 p-10 shadow-2xl backdrop-blur-xl">
        <BrandLogo />

        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Welcome Back
          </h2>

          <p className="mt-2 text-slate-500">
            Sign in to continue managing your finances.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-2 h-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mt-2 h-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-500">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl bg-emerald-600 text-base hover:bg-emerald-700"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          New here?{" "}

          <span
            onClick={() => navigate("/register")}
            className="cursor-pointer font-semibold text-emerald-600 hover:underline"
          >
            Create an account
          </span>
        </p>
      </Card>
    </div>
  );
};

export default Login;
