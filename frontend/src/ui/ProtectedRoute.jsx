import { useEffect } from "react";
import useUser from "../features/authentication/useUser";
import { useNavigate } from "react-router-dom";
import FullPage from "./FullPage";
import SpinnerUI from "./SpinnerUI";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/login");
  }, [isLoading, navigate, isAuthenticated]);

  if (isLoading) return <SpinnerUI isLoading={isLoading} fullscreen={true} />;

  if (isAuthenticated) return children;
  return null;
};

export default ProtectedRoute;
