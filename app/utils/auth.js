// Simple auth utility functions
export const getUser = () => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };
  
  export const setUser = (user) => {
    if (typeof window === "undefined") return;
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };
  
  export const isAuthenticated = () => {
    return getUser() !== null;
  };
  
  export const logout = () => {
    setUser(null);
  };
  