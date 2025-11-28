import { motion } from 'framer-motion';
import { Users, TrendingUp, Calendar } from 'lucide-react';
import Card from '../components/ui/Card';
import { useEffect, useState } from 'react';
import { mockApi, WaitlistEntry } from '../utils/mockApi';

interface Stats {
  totalSignups: number;
  todaySignups: number;
  weekSignups: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ totalSignups: 0, todaySignups: 0, weekSignups: 0 });
  const [recentEntries, setRecentEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [statsData, entries] = await Promise.all([
        mockApi.getStats(),
        mockApi.getRecentEntries(10),
      ]);
      setStats(statsData);
      setRecentEntries(entries);
      setLoading(false);
    };
    loadData();
  }, []);

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
      <div className="space-y-6">
        <div className="h-8 w-48 bg-mint-50 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-mint-50 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-mint-900 mb-2">Dashboard</h1>
        <p className="text-mint-900/70">Welcome back! Here's your waitlist overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-mint-900/70 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-mint-900">{stat.value}</p>
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
          <div className="space-y-3">
            {recentEntries.length === 0 ? (
              <p className="text-center py-8 text-mint-900/70">No signups yet</p>
            ) : (
              recentEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center gap-3 p-4 bg-white hover:bg-mint-50 rounded-xl transition-colors border border-mint-600/10"
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
  );
}
