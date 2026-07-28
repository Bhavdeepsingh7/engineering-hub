import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { useTheme } from "./hooks/useTheme";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { setAuthTokenGetter } from "./services/api";

function ThemeProvider({ children }) {
  useTheme(); // initializes theme on mount
  return children;
}

export default function App() {
  const { getToken } = useAuth();
  useEffect(() => setAuthTokenGetter(getToken), [getToken]);
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
}
