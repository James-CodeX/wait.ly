import { motion } from 'framer-motion';
import { Users, TrendingUp, Calendar, Code, Copy, Check, ExternalLink } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { dashboardService, DashboardStats, WaitlistEntry } from '../services/dashboard';
import { useToast } from '../components/ui/Toast';

export default function Dashboard() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({ totalSignups: 0, todaySignups: 0, weekSignups: 0 });
  const [recentEntries, setRecentEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Get project ID from URL query params or localStorage
  const projectId = searchParams.get('project') || localStorage.getItem('selectedProjectId') || '';
  const embedUrl = `${window.location.origin}/public/${projectId}`;
  
  const embedCode = `<!-- Add this iframe to your website -->
<iframe 
  src="${embedUrl}"
  width="100%" 
  height="600"
  frameborder="0"
  style="border: none; border-radius: 12px;"
></iframe>`;

  const reactCode = `// React/Next.js Component Example
function WaitlistEmbed() {
  return (
    <iframe 
      src="${embedUrl}"
      width="100%" 
      height="600"
      frameBorder="0"
      style={{ border: 'none', borderRadius: '12px' }}
    />
  );
}`;

  useEffect(() => {
    const loadData = async () => {
      if (!projectId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [statsData, entries] = await Promise.all([
          dashboardService.getStats(projectId),
          dashboardService.getRecentEntries(projectId, 10),
        ]);
        setStats(statsData);
        setRecentEntries(entries);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        showToast('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [projectId, location.state, showToast]);

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
      bg: 'bg-gradient-to-br from-mint-600 to-mint-500',
      change: '+12.5%',
      changeType: 'positive' as const,
    },
    {
      icon: TrendingUp,
      label: 'Signups Today',
      value: stats.todaySignups,
      bg: 'bg-gradient-to-br from-blue-600 to-blue-500',
      change: '+8.2%',
      changeType: 'positive' as const,
    },
    {
      icon: Calendar,
      label: 'This Week',
      value: stats.weekSignups,
      bg: 'bg-gradient-to-br from-purple-600 to-purple-500',
      change: '+15.3%',
      changeType: 'positive' as const,
    },
  ];

  if (!projectId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-mint-900 dark:text-dark-text mb-4">No Project Selected</h2>
          <p className="text-mint-900/70 dark:text-dark-text-muted mb-6">
            Please select a project from the Projects page to view your dashboard.
          </p>
          <Button onClick={() => window.location.href = '/projects'}>
            Go to Projects
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="h-8 w-48 bg-mint-50 dark:bg-dark-card rounded animate-pulse" />
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-mint-50 dark:bg-dark-card rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
        <div className="h-96 bg-mint-50 dark:bg-dark-card rounded-2xl animate-pulse" />
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Stats & Recent Signups */}
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-mint-900 dark:text-dark-text mb-2">Dashboard</h1>
          <p className="text-lg text-mint-900/70 dark:text-dark-text-muted">Welcome back! Here's your waitlist overview.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="border border-mint-600/10 dark:border-dark-border overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-16 -mt-16" />
                <div className="flex items-center justify-between relative">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 ${stat.bg} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-mint-900/70 dark:text-dark-text-muted mb-1">{stat.label}</p>
                      <p className="text-4xl font-bold text-mint-900 dark:text-dark-text">{stat.value}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      stat.changeType === 'positive' 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                        : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    }`}>
                      {stat.change}
                    </span>
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
          <Card className="border border-mint-600/10 dark:border-dark-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-mint-900 dark:text-dark-text">Recent Signups</h3>
              <span className="px-3 py-1 bg-mint-100 dark:bg-mint-900/20 text-mint-700 dark:text-mint-400 rounded-full text-sm font-medium">
                {recentEntries.length} new
              </span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentEntries.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-mint-600/20 dark:text-mint-400/20 mx-auto mb-4" />
                  <p className="text-mint-900/70 dark:text-dark-text-muted">No signups yet</p>
                </div>
              ) : (
                recentEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-mint-50/50 to-transparent dark:from-dark-hover/50 hover:from-mint-50 dark:hover:from-dark-hover rounded-xl transition-all border border-mint-600/10 dark:border-dark-border group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-mint-600 to-mint-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                      {entry.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-mint-900 dark:text-dark-text truncate">{entry.name}</p>
                      <p className="text-sm text-mint-900/70 dark:text-dark-text-muted truncate">{entry.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="px-3 py-1 bg-mint-600 dark:bg-mint-500 text-white rounded-lg text-sm font-bold mb-1">
                        #{entry.position}
                      </div>
                      <p className="text-xs text-mint-900/50 dark:text-dark-text-muted">
                        {new Date(entry.created_at).toLocaleDateString()}
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
          <Card glass className="border border-mint-600/10 dark:border-dark-border">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-mint-600 to-mint-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Code className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-mint-900 dark:text-dark-text">Quick Start</h2>
                <p className="text-mint-900/70 dark:text-dark-text-muted">Get up and running in minutes</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Step 1: Public Page */}
              <div className="border-l-4 border-mint-600 dark:border-mint-500 pl-6 py-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 bg-mint-600 dark:bg-mint-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <h3 className="font-bold text-lg text-mint-900 dark:text-dark-text">Share Your Public Page</h3>
                </div>
                <p className="text-sm text-mint-900/70 dark:text-dark-text-muted mb-4">
                  The easiest way - just share this link with your audience
                </p>
                <div className="bg-mint-900 dark:bg-dark-bg p-4 rounded-xl flex items-center justify-between gap-3 border border-mint-600/20 dark:border-dark-border">
                  <code className="text-sm text-mint-50 dark:text-dark-text flex-1 overflow-x-auto font-mono">{embedUrl}</code>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(embedUrl, 'url')}
                    className="flex-shrink-0 shadow-lg"
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
                  className="inline-flex items-center gap-2 text-sm text-mint-600 dark:text-mint-400 hover:text-mint-700 dark:hover:text-mint-300 mt-3 font-medium"
                >
                  Preview page <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Step 2: Embed */}
              <div className="border-l-4 border-mint-600 dark:border-mint-500 pl-6 py-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 bg-mint-600 dark:bg-mint-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <h3 className="font-bold text-lg text-mint-900 dark:text-dark-text">Embed on Your Website</h3>
                </div>
                <p className="text-sm text-mint-900/70 dark:text-dark-text-muted mb-4">
                  Add this iframe code anywhere on your site
                </p>
                <div className="bg-mint-900 dark:bg-dark-bg p-4 rounded-xl border border-mint-600/20 dark:border-dark-border">
                  <div className="flex items-start justify-between gap-3">
                    <code className="text-xs text-mint-50 dark:text-dark-text flex-1 overflow-x-auto whitespace-pre font-mono">
                      {embedCode}
                    </code>
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(embedCode, 'embed')}
                      className="flex-shrink-0 shadow-lg"
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
              <div className="border-l-4 border-mint-600 dark:border-mint-500 pl-6 py-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 bg-mint-600 dark:bg-mint-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <h3 className="font-bold text-lg text-mint-900 dark:text-dark-text">Custom Integration</h3>
                </div>
                <p className="text-sm text-mint-900/70 dark:text-dark-text-muted mb-4">
                  Build your own form and connect via API
                </p>
                <div className="bg-mint-900 dark:bg-dark-bg p-4 rounded-xl border border-mint-600/20 dark:border-dark-border">
                  <div className="flex items-start justify-between gap-3">
                    <code className="text-xs text-mint-50 dark:text-dark-text flex-1 overflow-x-auto whitespace-pre font-mono leading-relaxed">
                      {reactCode}
                    </code>
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(reactCode, 'react')}
                      className="flex-shrink-0 shadow-lg"
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
              <div className="bg-mint-50 dark:bg-dark-hover border-2 border-mint-600/20 dark:border-dark-border rounded-xl p-4">
                <p className="text-sm text-mint-900/70 dark:text-dark-text-muted">
                  <span className="font-semibold text-mint-900 dark:text-dark-text">Need help?</span> Check out the{' '}
                  <a href="/embed" className="text-mint-600 dark:text-mint-400 hover:text-mint-700 dark:hover:text-mint-300 font-medium">
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
