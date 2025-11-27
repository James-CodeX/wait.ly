import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Download, MoreVertical, X } from 'lucide-react';
import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { mockWaitlistEntries } from '../utils/mockApi';
import { useToast } from '../components/ui/Toast';

export default function Waitlist() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<typeof mockWaitlistEntries[0] | null>(null);

  const filteredEntries = mockWaitlistEntries.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedEntries.length === filteredEntries.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(filteredEntries.map((e) => e.id));
    }
  };

  const handleSelectEntry = (id: string) => {
    if (selectedEntries.includes(id)) {
      setSelectedEntries(selectedEntries.filter((e) => e !== id));
    } else {
      setSelectedEntries([...selectedEntries, id]);
    }
  };

  const handleExport = () => {
    showToast('Exporting waitlist data...', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-mint-900 mb-2">Waitlist</h1>
          <p className="text-mint-900/70">Manage your waitlist entries</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
          </div>
          <Button variant="secondary">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {selectedEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-mint-600 text-white rounded-xl flex items-center justify-between"
          >
            <span className="font-medium">
              {selectedEntries.length} selected
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" className="text-mint-600">
                Send Email
              </Button>
              <Button variant="secondary" className="text-mint-600">
                Export Selected
              </Button>
            </div>
          </motion.div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-mint-600/10">
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedEntries.length === filteredEntries.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-mint-600 border-mint-600/20 rounded focus:ring-mint-600"
                  />
                </th>
                <th className="text-left p-4 font-semibold text-mint-900">Name</th>
                <th className="text-left p-4 font-semibold text-mint-900">Email</th>
                <th className="text-left p-4 font-semibold text-mint-900">Position</th>
                <th className="text-left p-4 font-semibold text-mint-900">Referrals</th>
                <th className="text-left p-4 font-semibold text-mint-900">Signup Date</th>
                <th className="text-left p-4 font-semibold text-mint-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry, index) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-mint-600/10 hover:bg-mint-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedEntries.includes(entry.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectEntry(entry.id);
                      }}
                      className="w-4 h-4 text-mint-600 border-mint-600/20 rounded focus:ring-mint-600"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-mint-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {entry.name.charAt(0)}
                      </div>
                      <span className="font-medium text-mint-900">{entry.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-mint-900/70">{entry.email}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-3 py-1 bg-mint-600 text-white text-sm font-medium rounded-full">
                      #{entry.position}
                    </span>
                  </td>
                  <td className="p-4 text-mint-900/70">{entry.referrals}</td>
                  <td className="p-4 text-mint-900/70">{entry.signupDate}</td>
                  <td className="p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEntry(entry);
                      }}
                      className="p-2 hover:bg-mint-100 rounded-lg transition-colors text-mint-600"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-mint-900/70">
            Showing {filteredEntries.length} of {mockWaitlistEntries.length} entries
          </p>
          <div className="flex gap-2">
            <Button variant="secondary">Previous</Button>
            <Button variant="secondary">Next</Button>
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {selectedEntry && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEntry(null)}
              className="fixed inset-0 bg-mint-900/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-mint-lg z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-mint-900">Entry Details</h3>
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="p-2 hover:bg-mint-50 rounded-lg transition-colors text-mint-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-mint-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                      {selectedEntry.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-mint-900">{selectedEntry.name}</h4>
                      <p className="text-mint-900/70">{selectedEntry.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <p className="text-sm text-mint-900/70 mb-1">Position</p>
                      <p className="text-2xl font-bold text-mint-900">#{selectedEntry.position}</p>
                    </Card>
                    <Card>
                      <p className="text-sm text-mint-900/70 mb-1">Referrals</p>
                      <p className="text-2xl font-bold text-mint-900">{selectedEntry.referrals}</p>
                    </Card>
                  </div>

                  <Card>
                    <p className="text-sm text-mint-900/70 mb-2">Signup Date</p>
                    <p className="font-medium text-mint-900">{selectedEntry.signupDate}</p>
                  </Card>

                  <Card>
                    <p className="text-sm text-mint-900/70 mb-2">Status</p>
                    <span className="inline-flex items-center px-3 py-1 bg-mint-600 text-white text-sm font-medium rounded-full">
                      {selectedEntry.status}
                    </span>
                  </Card>

                  <div className="space-y-3">
                    <Button className="w-full">Send Email</Button>
                    <Button variant="secondary" className="w-full">Move Position</Button>
                    <Button variant="secondary" className="w-full text-red-500 border-red-500 hover:bg-red-50">
                      Remove from Waitlist
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
