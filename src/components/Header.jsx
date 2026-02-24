import { Bell } from 'lucide-react';

export default function Header({ title }) {
  return (
    <header className="sticky top-0 z-30 glass-card-dark lg:glass-card mx-4 mt-4 rounded-2xl px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white lg:text-xl">{title}</h1>
          <p className="text-xs text-white/60 mt-0.5">
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        
        <button className="p-2 hover:bg-white/10 rounded-xl transition-colors relative">
          <Bell className="w-5 h-5 text-white/70" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
