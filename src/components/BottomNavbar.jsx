import { NavLink } from 'react-router-dom';
import {
  ShoppingCart,
  FileText,
  Package,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Kasir', href: '/pos', icon: ShoppingCart },
  { name: 'Transaksi', href: '/transactions', icon: FileText },
  { name: 'Produk', href: '/products', icon: Package, adminOnly: true },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

export default function BottomNavbar() {
  const { isAdmin } = useAuth();

  const filteredNav = navigation.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="glass-card-dark mx-4 mb-4 rounded-2xl">
        <div className="flex items-center justify-around py-2">
          {filteredNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                isActive
                  ? 'nav-item-glass-active'
                  : 'nav-item-glass'
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-6 h-6 ${isActive ? 'text-white' : ''}`} />
                  <span className="text-xs font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
