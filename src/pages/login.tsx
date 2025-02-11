import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginRequest } from "../api/authentication";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authenticationApi } from "../api/apiConfigration";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const loginRequest: LoginRequest = { emailOrUsername, password };
      const response = await authenticationApi.login(loginRequest);
      if (response.data.challenge === "2fa") {
        toast.success(response.data.message);
        navigate("/verify-otp", { state: { userId: response.data.userId } });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <ToastContainer />
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg w-96 border border-gray-700">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">Login</h2>
        <input
          type="text"
          placeholder="Email or Username"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          className="mb-4 p-3 w-full rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-3 w-full rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleLogin}
          className={`w-full p-3 rounded-lg bg-blue-500 text-white font-semibold ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600 transition"}`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
