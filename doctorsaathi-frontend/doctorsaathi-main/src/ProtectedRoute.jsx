// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, children, redirectPath = "/auth" }) => {
  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

export default ProtectedRoute;
