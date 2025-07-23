import { useState } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({ email: "", username: "", pw: "", pw2: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.username || !form.pw || !form.pw2) {
      setError("Bitte alles ausfüllen!");
      return;
    }
    if (form.pw !== form.pw2) {
      setError("Passwörter stimmen nicht überein!");
      return;
    }
    try {
      const res = await api.post("/auth/register", {
        email: form.email,
        username: form.username,
        password: form.pw,
      });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.user.username);
        localStorage.setItem("email", res.data.user.email);
        navigate("/home");
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Fehler bei der Registrierung!");
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow px-3 py-8 md:px-8 mt-10 border border-neutral-light flex flex-col items-center">
        <h1 className="text-xl md:text-2xl font-headline mb-4 text-primary-dark text-center">
          Registrierung
        </h1>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="E-Mail"
            className="border border-hf-green rounded px-3 py-2 w-full"
            value={form.email}
            onChange={handleChange}
            type="email"
          />
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
