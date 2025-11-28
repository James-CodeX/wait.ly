import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Users } from 'lucide-react';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';
import { mockApi } from '../../utils/mockApi';

export default function Signup() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.name) {
      setErrors((prev) => ({ ...prev, name: 'Name is required' }));
      return;
    }
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: 'Email is required' }));
      return;
    }
    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: 'Password is required' }));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return;
    }

    setLoading(true);
    try {
      await mockApi.signup(formData.name, formData.email, formData.password);
      showToast('Account created successfully!', 'success');
      navigate('/projects');
    } catch (error) {
      showToast('Failed to create account', 'error');
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-2xl font-semibold text-mint-900 mb-2">Create Account</h2>
          <p className="text-mint-900/70">Start managing your waitlist today</p>
        </div>

        <Card glass>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              icon={<User className="w-5 h-5" />}
            />

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

            <Input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              icon={<Lock className="w-5 h-5" />}
            />

            <Button type="submit" loading={loading} className="w-full">
              Create Account
            </Button>

            <p className="text-center text-mint-900/70">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-mint-600 hover:text-mint-700 font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
