import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { toast } from "react-toastify";
import api from "../api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/store", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("⚠ Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/users/login", formData);

      if (data.token) localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user || {}));

      toast.success("✅ Login successful!");
      navigate("/store", { replace: true }); // <-- Fixed navigation here
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 px-4">
      {/* Logo */}
      <h1 className="text-4xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-400 drop-shadow-lg mb-6">
        VALDORA
      </h1>

      {/* Login Form */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign in</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border px-4 py-3 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border px-4 py-3 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-left">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-10 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-500 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <Spinner /> : "Continue"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-sm text-center mt-6">
          New to VALDORA?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Create your account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
