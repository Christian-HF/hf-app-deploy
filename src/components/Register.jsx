import { useState } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", pw: "", pw2: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.username || !form.pw || !form.pw2) {
      setError("Bitte alles ausfüllen!");
      return;
    }
    if (form.pw !== form.pw2) {
      setError("Passwörter stimmen nicht überein!");
      return;
    }
    // Hier: Backend call für Registrierung
    localStorage.setItem("username", form.username);
    navigate("/home");
  };

  return (
    <Layout>
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow px-3 py-8 md:px-8 mt-10 border border-neutral-light flex flex-col items-center">
        <h1 className="text-xl md:text-2xl font-headline mb-4 text-primary-dark text-center">
          Registrierung
        </h1>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Benutzername"
            className="border border-hf-green rounded px-3 py-2 w-full"
            value={form.username}
            onChange={handleChange}
          />
          <input
            name="pw"
            type="password"
            placeholder="Passwort"
            className="border border-hf-green rounded px-3 py-2 w-full"
            value={form.pw}
            onChange={handleChange}
          />
          <input
            name="pw2"
            type="password"
            placeholder="Passwort wiederholen"
            className="border border-hf-green rounded px-3 py-2 w-full"
            value={form.pw2}
            onChange={handleChange}
          />
          {error && <p className="text-red-600">{error}</p>}
          <button type="submit" className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary-dark transition">
            Registrieren
          </button>
        </form>
      </div>
    </Layout>
  );
}
