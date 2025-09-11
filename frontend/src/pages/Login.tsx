import { useState } from "react";
import api from "../services/api";
import { useAuthStore } from "../store/auth.store";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setToken = useAuthStore((s) => s.setToken);

  const handleLogin = async () => {
    const { data } = await api.post("/auth/login", { email, password });
    if (data.success) setToken(data.token);
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl mb-4">Login</h1>
      <input className="border p-2 w-full mb-2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="border p-2 w-full mb-2" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button className="bg-blue-500 text-white p-2 rounded w-full" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
