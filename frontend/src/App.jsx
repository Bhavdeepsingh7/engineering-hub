import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { useTheme } from "./hooks/useTheme";

function ThemeProvider({ children }) {
  useTheme(); // initializes theme on mount
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
}
