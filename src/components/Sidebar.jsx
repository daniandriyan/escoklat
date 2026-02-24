import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Package,
  LogOut,
  User,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Kasir', href: '/pos', icon: ShoppingCart },
  { name: 'Transaksi', href: '/transactions', icon: FileText },
  { name: 'Produk', href: '/products', icon: Package, adminOnly: true },
];

export default function Sidebar() {
  const { profile, signOut, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const filteredNav = navigation.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 glass-card-dark rounded-xl"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 glass-card-dark lg:glass-card transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gradient">Es Coklat</h1>
              <p className="text-sm text-white/60">Varian Rasa</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-chocolate-500/50 to-transparent text-white border-l-4 border-cream-400'
                    : 'flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all'
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cream-400 to-cream-600 flex items-center justify-center">
                <User className="w-5 h-5 text-chocolate-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-white/60 capitalize">
                  {profile?.role || 'kasir'}
                </p>
              </div>
            </div>
            
            <Button
              variant="danger"
              size="sm"
              onClick={() => signOut()}
              fullWidth
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
