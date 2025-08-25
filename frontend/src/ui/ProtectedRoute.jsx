import { Navigate } from "react-router-dom";
import useUser from "../features/authentication/useUser";
import SpinnerUI from "./SpinnerUI";

const ProtectedRoute = ({ children }) => {
  const { isLoading, isAuthenticated, isError } = useUser();

  if (isLoading) return <SpinnerUI isLoading={isLoading} fullscreen={true} />;

  if (isError || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (isAuthenticated) return children;
  return null;
};

export default ProtectedRoute;
