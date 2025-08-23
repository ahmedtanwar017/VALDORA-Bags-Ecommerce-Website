import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api"; // axios instance with baseURL: /users
import Spinner from "../Components/Spinner";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const logoutUser = async () => {
      try {
        // Call correct backend logout route
        await api.get("/users/logout");

        // Remove local storage data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (isMounted) {
          toast.success("👋 Logged out successfully!");
          setTimeout(() => navigate("/login", { replace: true }), 1500);
        }
      } catch (err) {
        if (isMounted) {
          toast.error(err.response?.data?.message || "Logout failed");
          setTimeout(() => navigate("/login", { replace: true }), 1500);
        }
      }
    };

    logoutUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Spinner />
      <p className="ml-3 text-gray-600">Logging you out...</p>
    </div>
  );
};

export default Logout;
