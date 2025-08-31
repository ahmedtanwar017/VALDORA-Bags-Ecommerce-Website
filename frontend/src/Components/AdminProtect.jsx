// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import api from "../api"; 
// import Spinner from "../Components/Spinner";

// const AdminProtectedRoute = ({ children }) => {
//   const [loading, setLoading] = useState(true);
//   const [authorized, setAuthorized] = useState(false);

//   useEffect(() => {
//     const checkAdmin = async () => {
//       try {
//         await api.get("/users/adminp", { withCredentials: true });
//         setAuthorized(true);
//       } catch (err) {
//         setAuthorized(false);
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkAdmin();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <Spinner />
//         <p className="ml-3 text-gray-600">Checking admin session...</p>
//       </div>
//     );
//   }

//   return authorized ? children : <Navigate to="/login" replace />;
// };

// export default AdminProtectedRoute;
