import { motion } from 'framer-motion';
import { Save, Upload, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';

type Tab = 'general' | 'branding' | 'fields' | 'email' | 'integrations' | 'danger';

export default function Settings() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'branding', label: 'Branding' },
    { id: 'fields', label: 'Custom Fields' },
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
            {activeTab === 'general' && (
              <Card>
                <h2 className="text-2xl font-bold text-mint-900 mb-6">General Settings</h2>
                <div className="space-y-6">
                  <Input label="Waitlist Name" value="My Product Launch" />
                  <div>
                    <label className="block text-sm font-medium text-mint-900 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      defaultValue="Join our exclusive waitlist for early access!"
                      className="w-full px-4 py-3 bg-mint-50 border-2 border-mint-600/20 rounded-xl text-mint-900 focus:outline-none focus:border-mint-600 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mint-900 mb-2">
                      Logo
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-mint-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                        W
                      </div>
                      <Button variant="secondary">
                        <Upload className="w-4 h-4" />
                        Upload Logo
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'branding' && (
              <Card>
                <h2 className="text-2xl font-bold text-mint-900 mb-6">Branding</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-mint-900 mb-2">
                      Primary Color
                    </label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        defaultValue="#059669"
                        className="w-16 h-12 rounded-xl cursor-pointer border-2 border-mint-600/20"
                      />
                      <Input value="#059669" className="flex-1" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mint-900 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        defaultValue="#ECFDF5"
                        className="w-16 h-12 rounded-xl cursor-pointer border-2 border-mint-600/20"
                      />
                      <Input value="#ECFDF5" className="flex-1" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mint-900 mb-2">
                      Custom CSS
                    </label>
                    <textarea
                      rows={8}
                      placeholder=".waitlist-form { /* Your custom styles */ }"
                      className="w-full px-4 py-3 bg-mint-900 text-mint-100 border-2 border-mint-600/20 rounded-xl focus:outline-none focus:border-mint-600 resize-none font-mono text-sm"
                    />
                  </div>

                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'fields' && (
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-mint-900">Custom Fields</h2>
                  <Button>
                    <Plus className="w-4 h-4" />
                    Add Field
                  </Button>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Company', type: 'Text', required: false },
                    { name: 'Phone Number', type: 'Phone', required: false },
                    { name: 'Referral Code', type: 'Text', required: false },
                  ].map((field, index) => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-mint-50 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-mint-900">{field.name}</p>
                        <p className="text-sm text-mint-900/70">
                          {field.type} • {field.required ? 'Required' : 'Optional'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary" className="text-sm">
                          Edit
                        </Button>
                        <Button variant="secondary" className="text-sm text-red-500 border-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}

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
