export default function Header({ username }) {
    return (
      <header className="w-full flex items-center justify-between bg-white/90 backdrop-blur-md shadow-sm fixed top-0 left-0 z-30 h-16 px-8">
        {/* Leere linke Seite für symmetrischen Abstand */}
        <div className="w-10" /> 
        {/* Zentrierter App-Titel */}
        <div className="flex-1 flex justify-center">
          <span className="font-headline text-3xl font-bold text-primary-dark tracking-wide">
            HF Mitfahrer APP
          </span>
        </div>
        {/* Username rechts */}
        <div className="min-w-[120px] flex justify-end">
          <span className="text-hf-green font-semibold text-base">{username}</span>
        </div>
      </header>
    );
  }
  