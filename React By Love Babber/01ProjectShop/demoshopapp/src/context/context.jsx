import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  const value = {
    theme,
    setTheme,
    loading,
    setLoading,
  };

  // step 2 : context provide karna
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
