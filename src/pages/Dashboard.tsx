import { motion } from 'framer-motion';
import { Users, TrendingUp, Calendar, Code, Copy, Check, ExternalLink } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { mockApi, WaitlistEntry } from '../utils/mockApi';

interface Stats {
  totalSignups: number;
  todaySignups: number;
  weekSignups: number;
}

export default function Dashboard() {
  const location = useLocation();
  const [stats, setStats] = useState<Stats>({ totalSignups: 0, todaySignups: 0, weekSignups: 0 });
  const [recentEntries, setRecentEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const projectId = mockApi.getCurrentProject() || 'project-1';
  const embedUrl = `${window.location.origin}/public/${projectId}`;
  
  const embedCode = `<!-- Add this to your website -->
<iframe 
  src="${embedUrl}"
  width="100%" 
  height="600"
  frameborder="0"
></iframe>`;

  const reactCode = `import { useState } from 'react';

function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('YOUR_API_ENDPOINT', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    // Handle response
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Join Waitlist</button>
    </form>
  );
}`;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [statsData, entries] = await Promise.all([
        mockApi.getStats(),
        mockApi.getRecentEntries(10),
      ]);
      setStats(statsData);
      setRecentEntries(entries);
      setLoading(false);
    };
    loadData();
  }, [location.state]);

  const copyToClipboard = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const statCards = [
    {
      icon: Users,
      label: 'Total Signups',
      value: stats.totalSignups,
      bg: 'bg-mint-600',
    },
    {
      icon: TrendingUp,
      label: 'Signups Today',
      value: stats.todaySignups,
      bg: 'bg-mint-600',
    },
    {
      icon: Calendar,
      label: 'This Week',
      value: stats.weekSignups,
      bg: 'bg-mint-600',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="h-8 w-48 bg-mint-50 rounded animate-pulse" />
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-mint-50 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
        <div className="h-96 bg-mint-50 rounded-2xl animate-pulse" />
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Stats & Recent Signups */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-mint-900 mb-2">Dashboard</h1>
          <p className="text-mint-900/70">Welcome back! Here's your waitlist overview.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-mint-900/70">{stat.label}</p>
                    <p className="text-3xl font-bold text-mint-900">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <h3 className="text-xl font-semibold text-mint-900 mb-6">Recent Signups</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentEntries.length === 0 ? (
                <p className="text-center py-8 text-mint-900/70">No signups yet</p>
              ) : (
                recentEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-white hover:bg-mint-50 rounded-xl transition-colors border border-mint-600/10"
                  >
                    <div className="w-10 h-10 bg-mint-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {entry.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-mint-900 truncate">{entry.name}</p>
                      <p className="text-sm text-mint-900/70 truncate">{entry.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-mint-600">#{entry.position}</p>
                      <p className="text-xs text-mint-900/50">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Right Column - Quick Start Guide */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card glass>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-mint-600 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-mint-900">Quick Start</h2>
                <p className="text-mint-900/70">Get up and running in minutes</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Step 1: Public Page */}
              <div className="border-l-4 border-mint-600 pl-4">
                <h3 className="font-semibold text-mint-900 mb-2">1. Share Your Public Page</h3>
                <p className="text-sm text-mint-900/70 mb-3">
                  The easiest way - just share this link with your audience
                </p>
                <div className="bg-mint-900 p-3 rounded-lg flex items-center justify-between gap-2">
                  <code className="text-xs text-mint-50 flex-1 overflow-x-auto">{embedUrl}</code>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(embedUrl, 'url')}
                    className="flex-shrink-0"
                  >
                    {copiedCode === 'url' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <a
                  href={embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-mint-600 hover:text-mint-700 mt-2 font-medium"
                >
                  Preview page <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Step 2: Embed */}
              <div className="border-l-4 border-mint-600 pl-4">
                <h3 className="font-semibold text-mint-900 mb-2">2. Embed on Your Website</h3>
                <p className="text-sm text-mint-900/70 mb-3">
                  Add this iframe code anywhere on your site
                </p>
                <div className="bg-mint-900 p-3 rounded-lg">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <code className="text-xs text-mint-50 flex-1 overflow-x-auto whitespace-pre">
                      {embedCode}
                    </code>
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(embedCode, 'embed')}
                      className="flex-shrink-0"
                    >
                      {copiedCode === 'embed' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Step 3: Custom Integration */}
              <div className="border-l-4 border-mint-600 pl-4">
                <h3 className="font-semibold text-mint-900 mb-2">3. Custom Integration</h3>
                <p className="text-sm text-mint-900/70 mb-3">
                  Build your own form and connect via API
                </p>
                <div className="bg-mint-900 p-3 rounded-lg">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <code className="text-xs text-mint-50 flex-1 overflow-x-auto whitespace-pre font-mono">
                      {reactCode}
                    </code>
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(reactCode, 'react')}
                      className="flex-shrink-0"
                    >
                      {copiedCode === 'react' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Help Box */}
              <div className="bg-mint-50 border-2 border-mint-600/20 rounded-xl p-4">
                <p className="text-sm text-mint-900/70">
                  <span className="font-semibold text-mint-900">Need help?</span> Check out the{' '}
                  <a href="/embed" className="text-mint-600 hover:text-mint-700 font-medium">
                    Embed
                  </a>{' '}
                  page for more customization options and detailed documentation.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
