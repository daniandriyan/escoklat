import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar, BottomNavbar, Header, LoadingPage } from '../components';
import { useAuth } from '../context/AuthContext';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/pos': 'Kasir',
  '/transactions': 'Riwayat Transaksi',
  '/products': 'Manajemen Produk',
};

export default function Layout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const pathname = window.location.pathname;
  const title = pageTitles[pathname] || 'Es Coklat POS';

  return (
    <div className="min-h-screen bg-gradient-to-br from-chocolate-900 via-chocolate-800 to-chocolate-950">
      <Sidebar />
      
      <div className="lg:pl-72">
        <Header title={title} />
        
        <main className="">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <BottomNavbar />
    </div>
  );
}
