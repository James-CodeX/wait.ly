import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Mail, BarChart3, Code2, CheckCircle, Zap, Shield } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const features = [
  {
    icon: Users,
    title: 'Waitlist Management',
    description: 'Easily manage your waitlist with powerful tools for organizing and engaging users.',
  },
  {
    icon: Mail,
    title: 'Email Campaigns',
    description: 'Send beautiful, automated emails to keep your waitlist engaged and informed.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track signups, conversions, and user behavior with detailed analytics.',
  },
  {
    icon: Code2,
    title: 'Easy Integration',
    description: 'Embed your waitlist anywhere with our simple, customizable widget.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built for speed and performance, ensuring the best experience for your users.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security to keep your data safe and protected.',
  },
];

const pricing = [
  {
    name: 'Starter',
    price: 0,
    features: ['Up to 100 signups', 'Basic analytics', 'Email support', 'Custom branding'],
  },
  {
    name: 'Pro',
    price: 29,
    features: ['Unlimited signups', 'Advanced analytics', 'Priority support', 'Custom domain', 'Email campaigns', 'API access'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 99,
    features: ['Everything in Pro', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'Advanced security', 'White-label'],
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-mint border-b border-mint-600/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-mint-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-mint-900">Wait.ly</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-4 px-4 py-2 bg-mint-50 border border-mint-600/20 rounded-full text-mint-600 font-medium"
            >
              The Modern Waitlist Platform
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold text-mint-900 mb-6 leading-tight">
              Build Hype Before You Launch
            </h2>
            <p className="text-xl text-mint-900/70 mb-8 leading-relaxed">
              Create beautiful waitlists, engage your audience, and build momentum for your next big launch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/signup">
                <Button className="text-lg px-8 py-4">
                  Start Free Trial
                </Button>
              </Link>
              <Button variant="secondary" className="text-lg px-8 py-4">
                Watch Demo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16"
          >
            <Card glass className="overflow-hidden">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Dashboard Preview"
                className="w-full h-auto rounded-xl"
              />
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 bg-mint-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold text-mint-900 mb-4">Everything You Need</h3>
            <p className="text-xl text-mint-900/70">Powerful features to grow your waitlist</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full bg-white">
                  <div className="w-12 h-12 bg-mint-600 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-mint-900 mb-2">{feature.title}</h4>
                  <p className="text-mint-900/70">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold text-mint-900 mb-4">Simple Pricing</h3>
            <p className="text-xl text-mint-900/70">Choose the plan that fits your needs</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  hover
                  className={`h-full ${plan.popular ? 'border-2 border-mint-600 bg-white' : 'bg-mint-50'}`}
                >
                  {plan.popular && (
                    <div className="text-center mb-4">
                      <span className="inline-block px-3 py-1 bg-mint-600 text-white text-sm font-medium rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h4 className="text-2xl font-bold text-mint-900 mb-2">{plan.name}</h4>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-mint-900">${plan.price}</span>
                    <span className="text-mint-900/70">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-mint-600 flex-shrink-0 mt-0.5" />
                        <span className="text-mint-900/70">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth/signup">
                    <Button
                      variant={plan.popular ? 'primary' : 'secondary'}
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 bg-mint-50 border-t border-mint-600/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-mint-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-mint-900">Wait.ly</h1>
          </div>
          <p className="text-mint-900/70 mb-4">
            The modern waitlist platform for growing products
          </p>
          <p className="text-sm text-mint-900/50">
            © 2024 Wait.ly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
