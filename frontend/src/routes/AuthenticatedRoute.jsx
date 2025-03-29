// routes/AuthenticatedRoute.jsx
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { tokenState } from "@/store/auth";

const AuthenticatedRoute = ({ children }) => {
  const token = useRecoilValue(tokenState);
  const localToken = localStorage.getItem("token");

  const isAuthenticated = token || localToken;
  console.log("AuthenticatedRoute - Token from Recoil:", token);
  console.log("AuthenticatedRoute - Token from localStorage:", localToken);
  console.log("AuthenticatedRoute - isAuthenticated:", isAuthenticated);

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthenticatedRoute;