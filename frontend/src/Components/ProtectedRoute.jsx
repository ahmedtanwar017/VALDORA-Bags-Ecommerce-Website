import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // ya redux/context se user state

  if (!token) {
    return <Navigate to="/login" replace />; // redirect to login if not logged in
  }

  return children;
};

export default ProtectedRoute;
