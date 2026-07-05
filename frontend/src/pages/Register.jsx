import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import BrandLogo from "../components/BrandLogo";

import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {
      const data = await register(name, email, password);
      navigate(data.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-emerald-50 to-slate-200 p-4 sm:p-6">
      <Card className="w-full max-w-sm rounded-3xl border-0 bg-white/90 p-6 shadow-2xl backdrop-blur-xl sm:max-w-md sm:p-10">
        <BrandLogo />

        <div className="mt-6 text-center sm:mt-8">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Create Account
          </h2>

          <p className="mt-2 text-slate-500">
            Start your financial journey with Sanchay.
          </p>
        </div>

        <form onSubmit={handleRegister} className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
          <div>
            <Label htmlFor="name">Full Name</Label>

            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              className="mt-2 h-10 sm:h-11"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>

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
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              className="mt-2 h-10 sm:h-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">
              Confirm Password
            </Label>

            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="mt-2 h-10 sm:h-11"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            className="h-10 w-full rounded-xl bg-emerald-600 text-sm hover:bg-emerald-700 sm:h-11 sm:text-base"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 sm:mt-8">
          Already have an account?{" "}

          <span
            onClick={() => navigate("/")}
            className="cursor-pointer font-semibold text-emerald-600 hover:underline"
          >
            Sign In
          </span>
        </p>
      </Card>
    </div>
  );
};

export default Register;
