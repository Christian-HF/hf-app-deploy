import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/symbol_weiss.png"; // Pfad ggf. anpassen

export default function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("username", username);
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-hf-bg font-body">
      <img src={logo} alt="hochfrequenz logo" className="w-24 mb-4 drop-shadow-xl" />
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-[0_6px_32px_0_rgba(100,100,100,0.18)] p-8 border border-neutral-light flex flex-col items-center">
        <h2 className="font-bold text-2xl text-hf-green mb-2">hochfrequenz</h2>
        <input
          type="text"
          placeholder="Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-hf-green rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-hf-green transition"
          autoFocus
        />
        <button
          onClick={handleLogin}
          className="w-full py-2 rounded border border-hf-green text-hf-green font-semibold hover:bg-hf-green hover:text-white transition"
          disabled={!username}
        >
          Anmelden
        </button>
      </div>
    </div>
  );
}
