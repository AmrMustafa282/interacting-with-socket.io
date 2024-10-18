import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
 user: { id: number; username: string } | null;
 login: (token: string) => void;
 logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
 children,
}) => {
 const [user, setUser] = useState<{ id: number; username: string } | null>(
  null
 );

 const login = (token: string) => {
  const decoded: any = jwtDecode(token);
  setUser({ id: decoded.userId, username: decoded.username });
  localStorage.setItem("token", token);
  localStorage.setItem(
   "user",
   JSON.stringify({ id: decoded.userId, username: decoded.username })
  );
 };

 const logout = () => {
  setUser(null);
  localStorage.removeItem("token");
 };

 useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) login(token);
 }, []);

 return (
  <AuthContext.Provider value={{ user, login, logout }}>
   {children}
  </AuthContext.Provider>
 );
};

export const useAuth = () => {
 const context = useContext(AuthContext);
 if (!context) throw new Error("useAuth must be used within an AuthProvider");
 return context;
};
