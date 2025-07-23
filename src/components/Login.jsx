import { useState } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.user.username);
        localStorage.setItem("email", res.data.user.email);
        navigate("/home");
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Fehler beim Login!");
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-[0_6px_32px_0_rgba(100,100,100,0.18)] px-3 py-8 md:px-8 mt-10 border border-neutral-light flex flex-col items-center">
        <h1 className="text-xl md:text-2xl font-headline mb-4 text-primary-dark text-center">
          Anmeldung
        </h1>
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <input
            className="border border-hf-green rounded px-3 py-2 w-full text-lg focus:outline-none focus:border-primary transition"
            placeholder="E-Mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            type="email"
          />
          <input
            className="border border-hf-green rounded px-3 py-2 w-full text-lg focus:outline-none focus:border-primary transition"
            placeholder="Passwort"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <p className="text-red-600 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary-dark transition"
          >
            Anmelden
          </button>
        </form>
        {/* Link zur Registrierung */}
        <p className="text-center text-sm mt-4">
          Noch kein Account?{" "}
          <a href="/register" className="text-primary-dark underline">
            Jetzt registrieren
          </a>
        </p>
      </div>
    </Layout>
  );
}
