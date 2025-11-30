import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Mail, Target } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { analyticsService, AnalyticsStats, SignupDataPoint, SourceData, DailySignup } from '../services/analytics';

const COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7'];

export default function Analytics() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week');
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState<AnalyticsStats>({
    totalSignups: 0,
    thisWeek: 0,
    conversionRate: 0,
    referralRate: 0,
  });
  const [signupsOverTime, setSignupsOverTime] = useState<SignupDataPoint[]>([]);
  const [dailySignups, setDailySignups] = useState<DailySignup[]>([]);
  const [trafficSources, setTrafficSources] = useState<SourceData[]>([]);

  useEffect(() => {
    if (projectId) {
      loadAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, timeFilter]);

  const loadAnalytics = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const [statsData, signupsData, dailyData, sourcesData] = await Promise.all([
        analyticsService.getStats(projectId, timeFilter),
        analyticsService.getSignupsOverTime(projectId, timeFilter),
        analyticsService.getDailySignups(projectId, timeFilter === 'week' ? 7 : 30),
        analyticsService.getTrafficSources(projectId),
      ]);

      setStats(statsData);
      setSignupsOverTime(signupsData);
      setDailySignups(dailyData);
      setTrafficSources(sourcesData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-mint-900/70 dark:text-dark-text-muted">No project selected</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-mint-900/70 dark:text-dark-text-muted">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-mint-900 dark:text-dark-text mb-2">Analytics</h1>
          <p className="text-mint-900/70 dark:text-dark-text-muted">Track your waitlist performance</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={timeFilter === 'week' ? 'primary' : 'secondary'}
            onClick={() => setTimeFilter('week')}
          >
            Last 7 Days
          </Button>
          <Button 
            variant={timeFilter === 'month' ? 'primary' : 'secondary'}
            onClick={() => setTimeFilter('month')}
          >
            Last 30 Days
          </Button>
          <Button 
            variant={timeFilter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setTimeFilter('all')}
          >
            All Time
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: Users,
            label: 'Total Signups',
            value: stats.totalSignups,
            change: '+12.5%',
          },
          {
            icon: TrendingUp,
            label: 'This Week',
            value: stats.thisWeek,
            change: '+8.2%',
          },
          {
            icon: Target,
            label: 'Conversion Rate',
            value: `${stats.conversionRate.toFixed(1)}%`,
            change: '+2.1%',
          },
          {
            icon: Mail,
            label: 'Referral Rate',
            value: `${stats.referralRate.toFixed(1)}%`,
            change: '+5.3%',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-mint-600 dark:bg-mint-500 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-mint-600 dark:text-mint-400">{stat.change}</span>
              </div>
              <p className="text-sm text-mint-900/70 dark:text-dark-text-muted mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-mint-900 dark:text-dark-text">{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h3 className="text-xl font-semibold text-mint-900 dark:text-dark-text mb-6">Signups Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={signupsOverTime}>
                <defs>
                  <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-mint-600/10 dark:stroke-dark-border" />
                <XAxis dataKey="date" className="fill-mint-900 dark:fill-dark-text" stroke="currentColor" />
                <YAxis className="fill-mint-900 dark:fill-dark-text" stroke="currentColor" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tooltip-bg)',
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '12px',
                    color: 'var(--tooltip-text)',
                  }}
                  wrapperClassName="[--tooltip-bg:#ECFDF5] dark:[--tooltip-bg:#1E293B] [--tooltip-border:rgba(6,78,59,0.1)] dark:[--tooltip-border:#334155] [--tooltip-text:#064E3B] dark:[--tooltip-text:#F1F5F9]"
                />
                <Area
                  type="monotone"
                  dataKey="signups"
                  stroke="#059669"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSignups)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h3 className="text-xl font-semibold text-mint-900 dark:text-dark-text mb-6">Daily Signups</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailySignups}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-mint-600/10 dark:stroke-dark-border" />
                <XAxis dataKey="day" className="fill-mint-900 dark:fill-dark-text" stroke="currentColor" />
                <YAxis className="fill-mint-900 dark:fill-dark-text" stroke="currentColor" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tooltip-bg)',
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '12px',
                    color: 'var(--tooltip-text)',
                  }}
                  wrapperClassName="[--tooltip-bg:#ECFDF5] dark:[--tooltip-bg:#1E293B] [--tooltip-border:rgba(6,78,59,0.1)] dark:[--tooltip-border:#334155] [--tooltip-text:#064E3B] dark:[--tooltip-text:#F1F5F9]"
                />
                <Bar dataKey="count" fill="#059669" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <h3 className="text-xl font-semibold text-mint-900 dark:text-dark-text mb-6">Traffic Sources</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2"
        >
          <Card>
            <h3 className="text-xl font-semibold text-mint-900 dark:text-dark-text mb-6">Key Metrics</h3>
            <div className="space-y-6">
              {[
                { label: 'Average Position Change', value: '+2.3', description: 'Per day' },
                { label: 'Email Open Rate', value: '71.5%', description: 'Last 30 days' },
                { label: 'Click-through Rate', value: '36.2%', description: 'Last 30 days' },
                { label: 'Referrals per User', value: '1.8', description: 'Average' },
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-mint-50 dark:bg-dark-hover rounded-xl"
                >
                  <div>
                    <p className="font-medium text-mint-900 dark:text-dark-text">{metric.label}</p>
                    <p className="text-sm text-mint-900/70 dark:text-dark-text-muted">{metric.description}</p>
                  </div>
                  <div className="text-2xl font-bold text-mint-600 dark:text-mint-400">{metric.value}</div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
