import React, { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import Auth from "./components/Auth";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AppLayout from "./components/AppLayout";

const App: React.FC = () => {
 return (
  <BrowserRouter>
   <AuthProvider>
    <Routes>
     <Route element={<AppLayout />}>
      <Route path="/" element={<HomePage />} />
     </Route>
     <Route path="/login" element={<Auth />} />
     <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
   </AuthProvider>
  </BrowserRouter>
 );
};

export default App;
