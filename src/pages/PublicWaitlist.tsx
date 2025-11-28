import { motion } from 'framer-motion';
import { Mail, Users, CheckCircle, User } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { mockApi } from '../utils/mockApi';
import { useToast } from '../components/ui/Toast';

export default function PublicWaitlist() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [position, setPosition] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!name) {
      setErrors(prev => ({ ...prev, name: 'Name is required' }));
      return;
    }
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return;
    }

    setLoading(true);
    try {
      const entry = await mockApi.addEntry(name, email);
      setPosition(entry.position);
      setSubmitted(true);
      showToast('Successfully joined the waitlist!', 'success');
    } catch (error) {
      showToast('Failed to join waitlist', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-mint-50 to-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <Card glass className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-mint-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-mint-900 mb-4"
            >
              You're on the list!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-mint-900/70 mb-6"
            >
              Thanks for joining, {name}!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-mint-600 text-white rounded-2xl mb-6"
            >
              <Users className="w-6 h-6" />
              <div className="text-left">
                <p className="text-sm opacity-90">Your Position</p>
                <p className="text-3xl font-bold">#{position}</p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-mint-900/70 mb-6"
            >
              We've sent a confirmation email to <strong>{email}</strong>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-6 bg-mint-50 rounded-xl"
            >
              <h3 className="font-semibold text-mint-900 mb-2">
                Move up the list faster!
              </h3>
              <p className="text-sm text-mint-900/70 mb-4">
                Share your unique referral link and get priority access
              </p>
              <div className="flex gap-2">
                <Input value="https://waitly.app/ref/abc123" readOnly className="flex-1" />
                <Button>Copy Link</Button>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-mint-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-16 h-16 bg-mint-600 rounded-2xl flex items-center justify-center">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-mint-900">Wait.ly</h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-mint-900 mb-4"
          >
            Join Our Exclusive Waitlist
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-mint-900/70"
          >
            Be the first to know when we launch. Get early access and exclusive perks!
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card glass>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                icon={<User className="w-5 h-5" />}
              />

              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                icon={<Mail className="w-5 h-5" />}
              />

              <Button type="submit" loading={loading} className="w-full text-lg py-4">
                Join Waitlist
              </Button>

              <p className="text-center text-sm text-mint-900/70">
                Join <strong>1,247</strong> others already on the list
              </p>
            </form>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid md:grid-cols-3 gap-6"
        >
          {[
            { icon: CheckCircle, text: 'Early Access' },
            { icon: Users, text: 'Exclusive Community' },
            { icon: Mail, text: 'Priority Support' },
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <Card className="text-center bg-white">
                <div className="w-12 h-12 bg-mint-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-mint-900">{feature.text}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
