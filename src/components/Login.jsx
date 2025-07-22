// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("username", username);
    navigate("/home");
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 rounded"
      />
      <button
        onClick={handleLogin}
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={!username}
      >
        Anmelden
      </button>
    </div>
  );
}
