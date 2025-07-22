import Header from "./Header";
import logo from "../assets/symbol_weiss.png";

export default function Layout({ children }) {
  const username = localStorage.getItem("username") || "";
  return (
    <div className="min-h-screen bg-hf-bg font-body relative">
      <Header username={username} />
      <div className="flex flex-col items-center justify-center min-h-screen pt-20">
        {children}
      </div>
      {/* Weißes Logo unten rechts */}
      <img
        src={logo}
        alt="hochfrequenz logo"
        className="absolute right-6 bottom-6 w-16 drop-shadow-lg"
        style={{ zIndex: 10 }}
      />
    </div>
  );
}
