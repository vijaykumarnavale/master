import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faPhone, faLock, faUserTag, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const themeColors = {
  background: "bg-gray-50",
  card: "bg-white shadow-lg border border-gray-300",
  text: "text-gray-900",
  input: "border-gray-400 bg-gray-100 text-gray-800",
  button: "bg-blue-700 hover:bg-blue-800",
  accent: "text-blue-600 hover:text-blue-700",
};

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(false);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const apiBaseUrl = process.env.REACT_APP_NODE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      full_name: fullName,
      email,
      contact_number: contactNumber,
      password,
      role,
    };

    try {
      const response = await axios.post(`${apiBaseUrl}/register`, userData);
      notifySuccess(response.data.message);
      setFullName("");
      setEmail("");
      setContactNumber("");
      setPassword("");
      setRole("User");
    } catch (err) {
      notifyError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className={`flex justify-center items-center min-h-screen ${themeColors.background} p-6`}>
      <motion.div className={`w-full max-w-md ${themeColors.card} rounded-2xl p-8`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", value: fullName, setValue: setFullName, icon: faUser, type: "text", placeholder: "Enter Full name" },
            { label: "Email", value: email, setValue: setEmail, icon: faEnvelope, type: "email", placeholder: "example@mail.com" },
            { label: "Contact Number", value: contactNumber, setValue: setContactNumber, icon: faPhone, type: "text", placeholder: "123-456-7890" },
            { label: "Password", value: password, setValue: setPassword, icon: faLock, type: "password", placeholder: "Enter password" },
          ].map(({ label, value, setValue, icon, type, placeholder }, index) => (
            <motion.div key={index} className="relative">
              <label className={`block text-sm font-medium ${themeColors.text} mb-1`}>{label}</label>
              <div className={`flex items-center border rounded-md shadow-sm py-2 px-3 ${themeColors.input}`}>
                <FontAwesomeIcon icon={icon} className="text-gray-500 mr-3" />
                <input
                  type={type}
                  className="w-full bg-transparent outline-none text-base"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={placeholder}
                  required
                />
              </div>
            </motion.div>
          ))}

          <motion.div className="relative">
            <label className={`block text-sm font-medium ${themeColors.text} mb-1`}>Role</label>
            <div className={`flex items-center border rounded-md shadow-sm py-2 px-3 ${themeColors.input}`}>
              <FontAwesomeIcon icon={faUserTag} className="text-gray-500 mr-3" />
              <select
                className="w-full bg-transparent outline-none text-base"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full ${themeColors.button} text-white py-2.5 rounded-md font-semibold flex justify-center items-center gap-2 transition-transform hover:shadow-md disabled:opacity-50 text-base`}
            disabled={loading}
          >
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faUserTag} />}
            {loading ? "Signing Up..." : "Register"}
          </motion.button>
        </form>
        <ToastContainer />
      </motion.div>
    </motion.div>
  );
};

export default Signup;
