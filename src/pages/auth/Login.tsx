import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Users } from 'lucide-react';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';
import { fakeFetch } from '../../utils/mockApi';

export default function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: 'Email is required' }));
      return;
    }
    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: 'Password is required' }));
      return;
    }

    setLoading(true);
    await fakeFetch({ success: true }, 1000);
    setLoading(false);

    showToast('Successfully logged in!', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-mint-50 to-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-mint-600 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-mint-900">Wait.ly</h1>
          </Link>
          <h2 className="text-2xl font-semibold text-mint-900 mb-2">Welcome Back</h2>
          <p className="text-mint-900/70">Sign in to your account</p>
        </div>

        <Card glass>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
            />

            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              icon={<Lock className="w-5 h-5" />}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-mint-600 border-mint-600/20 rounded focus:ring-mint-600"
                />
                <span className="text-sm text-mint-900/70">Remember me</span>
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-sm text-mint-600 hover:text-mint-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Sign In
            </Button>

            <p className="text-center text-mint-900/70">
              Don't have an account?{' '}
              <Link to="/auth/signup" className="text-mint-600 hover:text-mint-700 font-medium">
                Sign up
              </Link>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
