import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";

const Auth: React.FC = () => {
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const [isRegister, setIsRegister] = useState(false);
 const { login } = useAuth();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const endpoint = isRegister ? "/api/register" : "/api/login";

  try {
   const { data } = await axios.post(endpoint, { username, password });
   login(data.token);
   location.assign("/");
  } catch (error) {
   console.error("Authentication failed:", error);
  }
 };

 return (
  <form onSubmit={handleSubmit}>
   <h2>{isRegister ? "Register" : "Login"}</h2>
   <input
    type="text"
    placeholder="Username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
   />
   <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
   />
   <button type="submit">{isRegister ? "Register" : "Login"}</button>
   <p onClick={() => setIsRegister(!isRegister)}>
    {isRegister ? "Already have an account? Login" : "New here? Register"}
   </p>
  </form>
 );
};

export default Auth;
