import { motion } from 'framer-motion';
import { Users, TrendingUp, Mail, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../components/ui/Card';
import { mockAnalytics, mockWaitlistEntries } from '../utils/mockApi';

const stats = [
  {
    icon: Users,
    label: 'Total Signups',
    value: mockAnalytics.totalSignups,
    change: '+12.5%',
    positive: true,
  },
  {
    icon: TrendingUp,
    label: 'This Week',
    value: mockAnalytics.thisWeek,
    change: '+8.2%',
    positive: true,
  },
  {
    icon: Target,
    label: 'Conversion Rate',
    value: `${mockAnalytics.conversionRate}%`,
    change: '+2.1%',
    positive: true,
  },
  {
    icon: Mail,
    label: 'Referral Rate',
    value: `${mockAnalytics.referralRate}%`,
    change: '-1.5%',
    positive: false,
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-mint-900 mb-2">Dashboard</h1>
        <p className="text-mint-900/70">Welcome back! Here's your waitlist overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
                <span
                  className={`text-sm font-medium ${
                    stat.positive ? 'text-mint-600' : 'text-red-500'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-mint-900/70 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-mint-900">{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <h3 className="text-xl font-semibold text-mint-900 mb-6">Signups Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockAnalytics.signupsOverTime}>
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
                <Line
                  type="monotone"
                  dataKey="signups"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ fill: '#059669', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full">
            <h3 className="text-xl font-semibold text-mint-900 mb-6">Recent Signups</h3>
            <div className="space-y-4">
              {mockWaitlistEntries.slice(0, 5).map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-mint-50 transition-colors"
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
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
