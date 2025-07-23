export default function Header({ username }) {
  return (
    <header className="w-full flex flex-col md:flex-row items-center justify-between bg-white/90 backdrop-blur-md shadow-sm fixed top-0 left-0 z-30 h-16 px-2 md:px-8">
      {/* Titel immer zentriert */}
      <div className="flex-1 flex justify-center">
        <span className="font-headline text-xl md:text-3xl font-bold text-primary-dark tracking-wide text-center">
          HF Mitfahrer APP
        </span>
      </div>
      {/* Username rechts auf großem Screen, auf Mobile darunter */}
      <div className="mt-1 md:mt-0 min-w-[100px] flex justify-end">
        <span className="text-hf-green font-semibold text-sm md:text-base">{username}</span>
      </div>
    </header>
  );
}
