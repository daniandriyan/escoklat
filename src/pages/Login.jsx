import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components';
import { hapticSuccess } from '../utils/helpers';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      hapticSuccess();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Gagal login. Periksa email dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-chocolate-900 via-chocolate-800 to-chocolate-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-chocolate-500 to-chocolate-700 rounded-3xl shadow-2xl mb-4">
            <Coffee className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">Es Coklat</h1>
          <p className="text-white/60 mt-1">Varian Rasa</p>
          <p className="text-sm text-white/40 mt-4">Premium POS System</p>
        </div>

        {/* Login Card */}
        <div className="glass-card-dark p-8 rounded-3xl">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Masuk
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              required
              icon={Mail}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              icon={Lock}
            />

            <Button
              type="submit"
              loading={loading}
              variant="accent"
              size="lg"
              fullWidth
            >
              Masuk
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl">
            <p className="text-sm font-medium text-white/80 mb-2">
              Demo Login:
            </p>
            <div className="text-xs text-white/60 space-y-1 font-mono">
              <p>Admin: admin@escoklat.com / admin123</p>
              <p>Kasir: kasir@escoklat.com / kasir123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-white/40 mt-6">
          © 2024 Es Coklat Varian Rasa
        </p>
      </div>
    </div>
  );
}
