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
import { mockAnalytics } from '../utils/mockApi';

const COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7'];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-mint-900 mb-2">Analytics</h1>
          <p className="text-mint-900/70">Track your waitlist performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Last 7 Days</Button>
          <Button variant="secondary">Last 30 Days</Button>
          <Button variant="secondary">All Time</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: Users,
            label: 'Total Signups',
            value: mockAnalytics.totalSignups,
            change: '+12.5%',
          },
          {
            icon: TrendingUp,
            label: 'This Week',
            value: mockAnalytics.thisWeek,
            change: '+8.2%',
          },
          {
            icon: Target,
            label: 'Conversion Rate',
            value: `${mockAnalytics.conversionRate}%`,
            change: '+2.1%',
          },
          {
            icon: Mail,
            label: 'Referral Rate',
            value: `${mockAnalytics.referralRate}%`,
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
                <div className="w-12 h-12 bg-mint-600 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-mint-600">{stat.change}</span>
              </div>
              <p className="text-sm text-mint-900/70 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-mint-900">{stat.value}</p>
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
            <h3 className="text-xl font-semibold text-mint-900 mb-6">Signups Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockAnalytics.signupsOverTime}>
                <defs>
                  <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 78, 59, 0.1)" />
                <XAxis dataKey="date" stroke="#064E3B" />
                <YAxis stroke="#064E3B" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ECFDF5',
                    border: '1px solid rgba(6, 78, 59, 0.1)',
                    borderRadius: '12px',
                    color: '#064E3B',
                  }}
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
            <h3 className="text-xl font-semibold text-mint-900 mb-6">Daily Signups</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockAnalytics.dailySignups}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 78, 59, 0.1)" />
                <XAxis dataKey="day" stroke="#064E3B" />
                <YAxis stroke="#064E3B" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ECFDF5',
                    border: '1px solid rgba(6, 78, 59, 0.1)',
                    borderRadius: '12px',
                    color: '#064E3B',
                  }}
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
            <h3 className="text-xl font-semibold text-mint-900 mb-6">Traffic Sources</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockAnalytics.trafficSources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockAnalytics.trafficSources.map((entry, index) => (
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
            <h3 className="text-xl font-semibold text-mint-900 mb-6">Key Metrics</h3>
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
                  className="flex items-center justify-between p-4 bg-mint-50 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-mint-900">{metric.label}</p>
                    <p className="text-sm text-mint-900/70">{metric.description}</p>
                  </div>
                  <div className="text-2xl font-bold text-mint-600">{metric.value}</div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
