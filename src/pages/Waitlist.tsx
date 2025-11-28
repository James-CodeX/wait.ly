import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, X, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { mockApi, WaitlistEntry } from '../utils/mockApi';
import { useToast } from '../components/ui/Toast';
import { exportToExcel } from '../utils/exportToExcel';

export default function Waitlist() {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; entry: WaitlistEntry | null }>({
    isOpen: false,
    entry: null,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    const data = await mockApi.getEntries(searchQuery);
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEntries();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async () => {
    if (!deleteModal.entry) return;
    
    setDeleting(true);
    await mockApi.deleteEntry(deleteModal.entry.id);
    setEntries(entries.filter(e => e.id !== deleteModal.entry!.id));
    setDeleting(false);
    setDeleteModal({ isOpen: false, entry: null });
    showToast('Entry deleted successfully', 'success');
  };

  const handleExport = () => {
    if (entries.length === 0) {
      showToast('No entries to export', 'info');
      return;
    }
    exportToExcel(entries, `waitlist-export-${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('Waitlist exported successfully!', 'success');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-mint-50 rounded animate-pulse" />
        <div className="h-96 bg-mint-50 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-mint-900 mb-2">Waitlist</h1>
          <p className="text-mint-900/70">Manage your waitlist entries</p>
        </div>
        <Button onClick={handleExport} variant="secondary">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      <Card>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mint-600" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-mint-50 border-2 border-mint-600/20 rounded-xl text-mint-900 placeholder-mint-900/40 focus:outline-none focus:border-mint-600 focus:ring-4 focus:ring-mint-600/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mint-600 hover:bg-mint-50 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-mint-600/10">
                <th className="text-left py-3 px-4 text-sm font-semibold text-mint-900">Position</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-mint-900">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-mint-900">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-mint-900">Date</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-mint-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-mint-900/70">
                    {searchQuery ? 'No entries found' : 'No entries yet'}
                  </td>
                </tr>
              ) : (
                entries.map((entry, index) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-mint-600/10 hover:bg-mint-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-mint-600 text-white rounded-lg text-sm font-semibold">
                        {entry.position}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-mint-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {entry.name.charAt(0)}
                        </div>
                        <span className="font-medium text-mint-900">{entry.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-mint-900/70">{entry.email}</td>
                    <td className="py-4 px-4 text-mint-900/70">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDeleteModal({ isOpen: true, entry })}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-mint-900/70">
          <p>Showing {entries.length} entries</p>
        </div>
      </Card>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, entry: null })}
        title="Delete Entry"
      >
        <div className="space-y-6">
          <p className="text-mint-900/70">
            Are you sure you want to delete <strong>{deleteModal.entry?.name}</strong>? This cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ isOpen: false, entry: null })}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              loading={deleting}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
