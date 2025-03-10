import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faUnlockAlt,
  faSignInAlt,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const theme = "dark";

const themes = {
  dark: {
    background: "bg-gray-900",
    card: "bg-gray-800 shadow-2xl",
    text: "text-gray-100",
    input: "border-gray-700 bg-gray-700 text-gray-300",
    button: "bg-blue-500 hover:bg-blue-600",
    accent: "text-blue-400",
  },
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();

  const apiBaseUrl = process.env.REACT_APP_NODE_API_URL;
  const colors = themes[theme];

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${apiBaseUrl}/login`, {
        email,
        password,
      });
      toast.success(response.data.message);
      setLoading(false);
      const { role } = response.data;
      if (role === "Admin") navigate("/admin-dashboard");
      else if (role === "User") navigate("/user-dashboard");
      else toast.error("Role not found or invalid.");
    } catch (err) {
      setLoading(false);
      toast.error(
        err.response ? err.response.data.message : "Login failed, please try again"
      );
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${apiBaseUrl}/forgot-password`, {
        email: forgotPasswordEmail,
      });
      toast.success(response.data.message);
      setForgotPasswordEmail("");
      setIsForgotPassword(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(
        err.response ? err.response.data.message : "An error occurred while trying to reset your password"
      );
    }
  };

  return (
    <div className={`flex justify-center items-center min-h-screen ${colors.background} pt-0`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`w-full max-w-md ${colors.card} rounded-3xl p-8 pt-12 transform transition duration-300 hover:shadow-xl`}
      >
        <h2 className={`text-center text-3xl font-bold ${colors.text} mb-6`}>
          {isForgotPassword ? "Reset Password" : "Welcome Back!"}
        </h2>

        {!isForgotPassword ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-6">
              <label className={`block font-medium ${colors.text} mb-1`}>Email</label>
              <div className="relative flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 text-gray-500" />
                <input
                  type="email"
                  className={`w-full pl-12 p-3 border rounded-xl focus:ring-2 focus:ring-opacity-50 focus:outline-none transition duration-300 hover:shadow-md ${colors.input}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label className={`block font-medium ${colors.text} mb-1`}>Password</label>
              <div className="relative flex items-center">
                <FontAwesomeIcon icon={faLock} className="absolute left-4 text-gray-500" />
                <input
                  type="password"
                  className={`w-full pl-12 p-3 border rounded-xl focus:ring-2 focus:ring-opacity-50 focus:outline-none transition duration-300 hover:shadow-md ${colors.input}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <p className={`${colors.accent} text-sm cursor-pointer mb-6 hover:underline`} onClick={() => setIsForgotPassword(true)}>
              <FontAwesomeIcon icon={faUnlockAlt} className="mr-1" /> Forgot password?
            </p>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              className={`w-full ${colors.button} text-white py-3 rounded-xl font-bold transition duration-300 disabled:bg-gray-400 flex items-center justify-center`}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2" /> {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handleForgotPasswordSubmit}>
            <div className="mb-6">
              <label className={`block font-medium ${colors.text} mb-1`}>Email</label>
              <div className="relative flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 text-gray-500" />
                <input
                  type="email"
                  className={`w-full pl-12 p-3 border rounded-xl focus:ring-2 focus:ring-opacity-50 focus:outline-none transition duration-300 hover:shadow-md ${colors.input}`}
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              className={`w-full ${colors.button} text-white py-3 rounded-xl font-bold transition duration-300 disabled:bg-gray-400`}
              disabled={loading}
            >
              {loading ? "Sending Reset Link..." : "Send Reset Link"}
            </motion.button>
            <p className={`${colors.accent} text-sm cursor-pointer mt-6 hover:underline`} onClick={() => setIsForgotPassword(false)}>
              <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Back to Login
            </p>
          </form>
        )}
        <ToastContainer />
      </motion.div>
    </div>
  );
};

export default Login;
