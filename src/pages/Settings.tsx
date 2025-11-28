import { motion } from 'framer-motion';
import { Save, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';

type Tab = 'email' | 'integrations' | 'danger';

export default function Settings() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('email');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'email', label: 'Email Config' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'danger', label: 'Danger Zone' },
  ];

  const handleSave = () => {
    showToast('Settings saved successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-mint-900 mb-2">Settings</h1>
        <p className="text-mint-900/70">Manage your waitlist configuration</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-mint-600 text-white shadow-mint'
                    : 'text-mint-900 hover:bg-mint-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>

        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {activeTab === 'email' && (
              <Card>
                <h2 className="text-2xl font-bold text-mint-900 mb-6">Email Configuration</h2>
                <div className="space-y-6">
                  <Input label="From Name" value="Wait.ly Team" />
                  <Input label="From Email" value="noreply@waitly.app" />
                  <Input label="Reply-To Email" value="support@waitly.app" />

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 text-mint-600 border-mint-600/20 rounded focus:ring-mint-600"
                      />
                      <div>
                        <p className="font-medium text-mint-900">Send Welcome Email</p>
                        <p className="text-sm text-mint-900/70">
                          Automatically send welcome email to new signups
                        </p>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 text-mint-600 border-mint-600/20 rounded focus:ring-mint-600"
                      />
                      <div>
                        <p className="font-medium text-mint-900">Position Updates</p>
                        <p className="text-sm text-mint-900/70">
                          Notify users when their position changes
                        </p>
                      </div>
                    </label>
                  </div>

                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'integrations' && (
              <Card>
                <h2 className="text-2xl font-bold text-mint-900 mb-6">Integrations</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-mint-900 mb-2">
                      API Key
                    </label>
                    <div className="flex gap-2">
                      <Input value="wl_1234567890abcdef" readOnly className="flex-1" />
                      <Button variant="secondary">Regenerate</Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mint-900 mb-2">
                      Webhook URL
                    </label>
                    <Input placeholder="https://your-api.com/webhooks/waitly" />
                    <p className="text-sm text-mint-900/70 mt-2">
                      Receive notifications when new users join your waitlist
                    </p>
                  </div>

                  <div className="p-4 bg-mint-50 rounded-xl">
                    <h3 className="font-semibold text-mint-900 mb-2">Available Events</h3>
                    <ul className="space-y-2 text-sm text-mint-900/70">
                      <li>• user.signup - New user joins waitlist</li>
                      <li>• user.position_change - User position updates</li>
                      <li>• user.referral - User refers someone</li>
                    </ul>
                  </div>

                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'danger' && (
              <Card className="border-2 border-red-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <h2 className="text-2xl font-bold text-mint-900">Danger Zone</h2>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-500/20 rounded-xl">
                    <h3 className="font-semibold text-mint-900 mb-2">Clear All Data</h3>
                    <p className="text-sm text-mint-900/70 mb-4">
                      Remove all waitlist entries while keeping your configuration
                    </p>
                    <Button
                      variant="secondary"
                      className="text-red-500 border-red-500 hover:bg-red-50"
                    >
                      Clear All Entries
                    </Button>
                  </div>

                  <div className="p-4 bg-red-50 border border-red-500/20 rounded-xl">
                    <h3 className="font-semibold text-mint-900 mb-2">Delete Waitlist</h3>
                    <p className="text-sm text-mint-900/70 mb-4">
                      Permanently delete your waitlist and all associated data
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => setShowDeleteModal(true)}
                      className="text-red-500 border-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Waitlist
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Waitlist"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <p className="text-mint-900">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>

          <Input label="Type 'DELETE' to confirm" placeholder="DELETE" />

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button className="flex-1 bg-red-500 hover:bg-red-600">
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
