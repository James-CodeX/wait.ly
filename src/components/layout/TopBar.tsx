import { Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TopBar() {
  return (
    <header className="bg-white border-b border-mint-600/10 px-6 py-4 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mint-600" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-mint-50 border border-mint-600/20 rounded-xl text-mint-900 placeholder-mint-900/40 focus:outline-none focus:border-mint-600 focus:ring-4 focus:ring-mint-600/10 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 text-mint-600 hover:bg-mint-50 rounded-lg transition-colors"
        >
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-mint-600 rounded-full" />
        </motion.button>
      </div>
    </header>
  );
}
