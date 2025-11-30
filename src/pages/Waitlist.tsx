import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, X, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { waitlistService, WaitlistEntry } from '../services/waitlist';
import { useToast } from '../components/ui/Toast';
import { exportToExcel } from '../utils/exportToExcel';

export default function Waitlist() {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; entry: WaitlistEntry | null }>({
    isOpen: false,
    entry: null,
  });
  const [deleting, setDeleting] = useState(false);

  const projectId = searchParams.get('project') || localStorage.getItem('selectedProjectId') || '';
  const LIMIT = 10;

  useEffect(() => {
    if (projectId) {
      loadEntries(true);
    } else {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (projectId) {
        loadEntries(true);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadEntries = async (reset: boolean = false) => {
    if (!projectId) return;

    if (reset) {
      setLoading(true);
      setOffset(0);
    } else {
      setLoadingMore(true);
    }

    try {
      const newOffset = reset ? 0 : offset;
      const { entries: newEntries, total: totalCount } = await waitlistService.getEntries(
        projectId,
        LIMIT,
        newOffset,
        searchQuery
      );

      if (reset) {
        setEntries(newEntries);
      } else {
        setEntries([...entries, ...newEntries]);
      }
      
      setTotal(totalCount);
      if (!reset) {
        setOffset(newOffset + LIMIT);
      }
    } catch (error) {
      console.error('Failed to load entries:', error);
      showToast('Failed to load waitlist entries', 'error');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    setOffset(offset + LIMIT);
    loadEntries(false);
  };

  const handleDelete = async () => {
    if (!deleteModal.entry) return;
    
    setDeleting(true);
    try {
      await waitlistService.deleteEntry(deleteModal.entry.id);
      setEntries(entries.filter(e => e.id !== deleteModal.entry!.id));
      setTotal(total - 1);
      setDeleteModal({ isOpen: false, entry: null });
      showToast('Entry deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete entry:', error);
      showToast('Failed to delete entry', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    if (!projectId) {
      showToast('No project selected', 'error');
      return;
    }

    try {
      const allEntries = await waitlistService.getAllEntries(projectId);
      if (allEntries.length === 0) {
        showToast('No entries to export', 'info');
        return;
      }
      exportToExcel(allEntries, `waitlist-export-${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast('Waitlist exported successfully!', 'success');
    } catch (error) {
      console.error('Failed to export:', error);
      showToast('Failed to export waitlist', 'error');
    }
  };

  if (!projectId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-mint-900 dark:text-dark-text mb-4">No Project Selected</h2>
          <p className="text-mint-900/70 dark:text-dark-text-muted mb-6">
            Please select a project from the Projects page to view the waitlist.
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
      <div className="space-y-6">
        <div className="h-8 w-48 bg-mint-50 dark:bg-dark-card rounded animate-pulse" />
        <div className="h-96 bg-mint-50 dark:bg-dark-card rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-mint-900 dark:text-dark-text mb-2">Waitlist</h1>
          <p className="text-mint-900/70 dark:text-dark-text-muted">Manage your waitlist entries</p>
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
              className="w-full pl-10 pr-10 py-3 bg-mint-50 dark:bg-dark-card border-2 border-mint-600/20 dark:border-dark-border rounded-xl text-mint-900 dark:text-dark-text placeholder-mint-900/40 dark:placeholder-dark-text-muted focus:outline-none focus:border-mint-600 dark:focus:border-mint-500 focus:ring-4 focus:ring-mint-600/10 dark:focus:ring-mint-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mint-600 dark:text-mint-400 hover:bg-mint-50 dark:hover:bg-dark-hover p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-mint-600/10 dark:border-dark-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-mint-900 dark:text-dark-text">Position</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-mint-900 dark:text-dark-text">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-mint-900 dark:text-dark-text">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-mint-900 dark:text-dark-text">Date</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-mint-900 dark:text-dark-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-mint-900/70 dark:text-dark-text-muted">
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
                    className="border-b border-mint-600/10 dark:border-dark-border hover:bg-mint-50 dark:hover:bg-dark-hover transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-mint-600 dark:bg-mint-500 text-white rounded-lg text-sm font-semibold">
                        {entry.position}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-mint-600 dark:bg-mint-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {entry.name.charAt(0)}
                        </div>
                        <span className="font-medium text-mint-900 dark:text-dark-text">{entry.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-mint-900/70 dark:text-dark-text-muted">{entry.email}</td>
                    <td className="py-4 px-4 text-mint-900/70 dark:text-dark-text-muted">
                      {new Date(entry.created_at).toLocaleDateString()}
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

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-mint-900/70 dark:text-dark-text-muted">
            Showing {entries.length} of {total} entries
          </p>
          
          {entries.length < total && (
            <Button
              variant="secondary"
              onClick={handleLoadMore}
              loading={loadingMore}
              disabled={loadingMore}
            >
              Load More
            </Button>
          )}
        </div>
      </Card>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, entry: null })}
        title="Delete Entry"
      >
        <div className="space-y-6">
          <p className="text-mint-900/70 dark:text-dark-text-muted">
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
