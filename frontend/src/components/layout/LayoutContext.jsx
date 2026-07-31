import { createContext, useContext } from "react";

export const LayoutContext = createContext({ openNavigation: () => {} });

export const useLayout = () => useContext(LayoutContext);
