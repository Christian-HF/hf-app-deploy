import { useState } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

export default function Profil() {
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";

  const logout = () => {
    localStorage.removeItem("username");
    // ggf. mehr (Token o.ä.) löschen
    navigate("/");
  };

  const pwChange = (e) => {
    e.preventDefault();
    // In echt: API-Call zum Passwort ändern!
    setMsg("Passwort geändert (Demo).");
    setPw("");
  };

  return (
    <Layout>
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow px-3 py-8 md:px-8 mt-10 border border-neutral-light flex flex-col items-center">
        <h2 className="text-xl md:text-2xl font-headline mb-4 text-primary-dark">Profil</h2>
        <p className="mb-4"><b>Benutzer:</b> {username}</p>
        <form className="flex flex-col gap-4 w-full" onSubmit={pwChange}>
          <input
            className="border border-hf-green rounded px-3 py-2 w-full"
            placeholder="Neues Passwort"
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
          />
          <button type="submit" className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary-dark transition">Passwort ändern</button>
        </form>
        <button onClick={logout} className="w-full mt-4 bg-red-100 text-red-600 py-2 rounded hover:bg-red-200">Abmelden</button>
        {msg && <p className="text-green-700 mt-2">{msg}</p>}
      </div>
    </Layout>
  );
}
