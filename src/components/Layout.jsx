import logo from "../assets/symbol_weiss.png";
import Header from "./Header";


export default function Layout({ children }) {
  const username = localStorage.getItem("username") || "";
  return (
    <div className="min-h-screen bg-hf-bg font-body relative">
      <Header username={username} />
      {/* Padding je nach Gerät, Abstand nach oben für den Header */}
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-2 md:px-0">
        {children}
      </div>
      {/* Logo immer unten rechts, auf Mobile etwas kleiner */}
      <img
        src={logo}
        alt="hochfrequenz logo"
        className="fixed right-3 bottom-3 w-12 md:w-16 drop-shadow-lg pointer-events-none"
        style={{ zIndex: 10 }}
      />
    </div>
  );
}
