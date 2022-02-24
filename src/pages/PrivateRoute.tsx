import { Outlet } from "react-router-dom";
import authHelper from "../services/helpers/auth.helper";
import { AuthenticationScreen } from "./authentication/authentication";

export const PrivateRoute = () => {
  const authenticated = authHelper.isAuthenticated();

  return authenticated ? <Outlet /> : <AuthenticationScreen />;
};
