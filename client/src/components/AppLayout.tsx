import { jwtDecode } from "jwt-decode";

import { Navigate, Outlet } from "react-router-dom";
import Header from "./Header";

export default function AppLayout() {
 const auth = (() => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
   const { exp } = jwtDecode<{ exp: number }>(token);
   if (Date.now() >= exp * 1000) {
    localStorage.removeItem("token");
    return false;
   }
   return true;
  } catch (e) {
   localStorage.removeItem("token");
   return false;
  }
 })();

 if (!auth) return <Navigate to={"/login"} replace />;

 return (
  <div className="container mx-auto flex flex-col h-screen max-h-screen">
   <Header />
   <main className="flex-1  max-h-[90vh]  ">
    <Outlet />
   </main>
  </div>
 );
}
