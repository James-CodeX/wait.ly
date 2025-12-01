import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Mail, BarChart3, Code2, CheckCircle, Zap, Shield, ArrowRight, Sparkles, TrendingUp, Globe } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useTheme } from '../contexts/ThemeContext';

const features = [
  {
    icon: Users,
    title: 'Smart Waitlist Management',
    description: 'Organize and engage your audience with intelligent position tracking and automated notifications.',
  },
  {
    icon: Mail,
    title: 'Automated Email Campaigns',
    description: 'Keep your waitlist engaged with beautiful, personalized email campaigns that convert.',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Track every metric that matters with comprehensive analytics and actionable insights.',
  },
  {
    icon: Code2,
    title: 'Seamless Integration',
    description: 'Embed anywhere with our customizable widget. Works with any platform in minutes.',
  },
  {
    icon: Zap,
    title: 'Lightning Performance',
    description: 'Built for speed with modern tech. Your users will love the instant experience.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and security. Your data is protected with industry standards.',
  },
];

const stats = [
  { value: '50K+', label: 'Active Waitlists' },
  { value: '2M+', label: 'Signups Managed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'User Rating' },
];

const pricing = [
  {
    name: 'Starter',
    price: 0,
    description: 'Perfect for side projects',
    features: ['Up to 100 signups', 'Basic analytics', 'Email support', 'Custom branding', '1 project'],
  },
  {
    name: 'Pro',
    price: 29,
    description: 'For growing businesses',
    features: ['Unlimited signups', 'Advanced analytics', 'Priority support', 'Custom domain', 'Email campaigns', 'API access', 'Unlimited projects', 'Webhooks'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 99,
    description: 'For large organizations',
    features: ['Everything in Pro', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'Advanced security', 'White-label', 'Team collaboration', 'Custom contracts'],
  },
];

export default function Landing() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-mint border-b border-mint-600/10 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-mint-600 to-mint-500 rounded-xl flex items-center justify-center shadow-lg shadow-mint-600/20">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-mint-600 to-mint-500 bg-clip-text text-transparent">Wait.ly</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth/signup">
              <Button className="shadow-lg shadow-mint-600/20">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-mint-50 via-white to-mint-50/50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-mint-500/20 to-transparent dark:from-mint-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative">
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
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white dark:bg-dark-card border border-mint-600/20 dark:border-dark-border rounded-full text-mint-600 dark:text-mint-400 font-medium shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              The Modern Waitlist Platform
            </motion.div>
            
            <h2 className="text-5xl md:text-7xl font-bold text-mint-900 dark:text-dark-text mb-6 leading-tight">
              Build <span className="bg-gradient-to-r from-mint-600 to-mint-500 bg-clip-text text-transparent">Hype</span> Before You Launch
            </h2>
            
            <p className="text-xl md:text-2xl text-mint-900/70 dark:text-dark-text-muted mb-10 leading-relaxed max-w-3xl mx-auto">
              Create stunning waitlists, engage your audience, and build unstoppable momentum for your next big launch.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/auth/signup">
                <Button className="text-lg px-8 py-4 shadow-xl shadow-mint-600/20 hover:shadow-2xl hover:shadow-mint-600/30 transition-all">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="secondary" className="text-lg px-8 py-4">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-mint-600 dark:text-mint-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-mint-900/70 dark:text-dark-text-muted">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-mint-500/20 to-transparent dark:from-mint-500/10 blur-3xl" />
            <Card glass className="overflow-hidden border-2 border-mint-600/20 dark:border-dark-border shadow-2xl relative">
              <div className="aspect-video bg-gradient-to-br from-mint-50 to-white dark:from-dark-card dark:to-dark-bg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-mint-600 to-mint-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-mint-900/70 dark:text-dark-text-muted">Dashboard Preview</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-mint-50/50 to-white dark:from-dark-bg dark:via-dark-card/50 dark:to-dark-bg" />
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-mint-600/10 dark:bg-mint-500/10 rounded-full text-mint-600 dark:text-mint-400 font-medium">
              <Zap className="w-4 h-4" />
              Powerful Features
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-mint-900 dark:text-dark-text mb-4">
              Everything You Need to Succeed
            </h3>
            <p className="text-xl text-mint-900/70 dark:text-dark-text-muted max-w-2xl mx-auto">
              Built with the tools and features that modern teams need to grow
            </p>
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
                <Card hover className="h-full bg-white dark:bg-dark-card border border-mint-600/10 dark:border-dark-border group">
                  <div className="w-14 h-14 bg-gradient-to-br from-mint-600 to-mint-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-mint-600/20 group-hover:shadow-xl group-hover:shadow-mint-600/30 transition-all">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-mint-900 dark:text-dark-text mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-mint-900/70 dark:text-dark-text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-5xl mx-auto relative">
          <Card className="bg-gradient-to-br from-mint-600 to-mint-500 dark:from-mint-500 dark:to-mint-600 border-0 shadow-2xl shadow-mint-600/20 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
            
            <div className="relative text-center py-16 px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Globe className="w-16 h-16 text-white/80 mx-auto mb-6" />
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Build Your Waitlist?
                </h3>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Join thousands of companies using Wait.ly to grow their audience
                </p>
                <Link to="/auth/signup">
                  <Button className="bg-white text-mint-600 hover:bg-white/90 text-lg px-8 py-4 shadow-xl">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-white to-mint-50/50 dark:from-dark-bg dark:to-dark-card/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-mint-600/10 dark:bg-mint-500/10 rounded-full text-mint-600 dark:text-mint-400 font-medium">
              <TrendingUp className="w-4 h-4" />
              Simple Pricing
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-mint-900 dark:text-dark-text mb-4">
              Choose Your Plan
            </h3>
            <p className="text-xl text-mint-900/70 dark:text-dark-text-muted">
              Start free, upgrade as you grow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                  className={`h-full relative ${
                    plan.popular
                      ? 'border-2 border-mint-600 dark:border-mint-500 bg-white dark:bg-dark-card shadow-xl shadow-mint-600/10'
                      : 'bg-white dark:bg-dark-card border border-mint-600/10 dark:border-dark-border'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-block px-4 py-1 bg-gradient-to-r from-mint-600 to-mint-500 text-white text-sm font-medium rounded-full shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h4 className="text-2xl font-bold text-mint-900 dark:text-dark-text mb-2">
                      {plan.name}
                    </h4>
                    <p className="text-mint-900/70 dark:text-dark-text-muted text-sm">
                      {plan.description}
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <span className="text-5xl font-bold text-mint-900 dark:text-dark-text">
                      ${plan.price}
                    </span>
                    <span className="text-mint-900/70 dark:text-dark-text-muted">/month</span>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-mint-600 dark:text-mint-400 flex-shrink-0 mt-0.5" />
                        <span className="text-mint-900/70 dark:text-dark-text-muted">{feature}</span>
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

      {/* Footer */}
      <footer className="py-16 px-6 bg-mint-50 dark:bg-dark-card border-t border-mint-600/10 dark:border-dark-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-mint-600 to-mint-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-mint-600 to-mint-500 bg-clip-text text-transparent">
                  Wait.ly
                </h1>
              </div>
              <p className="text-mint-900/70 dark:text-dark-text-muted mb-4 max-w-sm">
                The modern waitlist platform for growing products. Build hype, engage your audience, and launch with momentum.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold text-mint-900 dark:text-dark-text mb-4">Product</h5>
              <ul className="space-y-2 text-mint-900/70 dark:text-dark-text-muted">
                <li><a href="#" className="hover:text-mint-600 dark:hover:text-mint-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-mint-600 dark:hover:text-mint-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-mint-600 dark:hover:text-mint-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-mint-600 dark:hover:text-mint-400 transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-mint-900 dark:text-dark-text mb-4">Company</h5>
              <ul className="space-y-2 text-mint-900/70 dark:text-dark-text-muted">
                <li><a href="#" className="hover:text-mint-600 dark:hover:text-mint-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-mint-600 dark:hover:text-mint-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-mint-600 dark:hover:text-mint-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-mint-600 dark:hover:text-mint-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-mint-600/10 dark:border-dark-border text-center">
            <p className="text-sm text-mint-900/50 dark:text-dark-text-muted">
              © 2025 Wait.ly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
