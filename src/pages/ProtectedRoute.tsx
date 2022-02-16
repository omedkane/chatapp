import { Route } from "react-router-dom";
import { isAuthenticated } from "../services/helpers/auth.helper";
import { AuthenticationScreen } from "./authentication/authentication";

interface PrivateRouteProps {
  element: JSX.Element;
}
export const PrivateRoute = ({ element }: PrivateRouteProps) => {
  const authenticated = isAuthenticated();

  return <Route element={authenticated ? element : <AuthenticationScreen />} />;
};
