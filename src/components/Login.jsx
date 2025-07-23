import { useState } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Bitte Benutzername und Passwort eingeben!");
      return;
    }
    // Hier: Authentifizierung gegen das Backend aufbauen!
    // Für Demo speichern wir nur Name ins LocalStorage:
    localStorage.setItem("username", username);
    setError("");
    navigate("/home");
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
            placeholder="Benutzername"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
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
