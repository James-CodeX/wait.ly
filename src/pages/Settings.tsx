import { motion } from 'framer-motion';
import { Save, Trash2, AlertTriangle, Copy, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { settingsService, ApiKey, Webhook } from '../services/settings';

type Tab = 'integrations' | 'danger';

export default function Settings() {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('project');
  
  const [activeTab, setActiveTab] = useState<Tab>('integrations');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  
  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newGeneratedKey, setNewGeneratedKey] = useState<ApiKey | null>(null);
  
  // Webhooks state
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['user.signup']);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'integrations', label: 'Integrations' },
    { id: 'danger', label: 'Danger Zone' },
  ];

  useEffect(() => {
    if (projectId) {
      loadSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const loadSettings = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const [keysData, webhooksData] = await Promise.all([
        settingsService.getApiKeys(projectId),
        settingsService.getWebhooks(projectId),
      ]);
      
      setApiKeys(keysData);
      setWebhooks(webhooksData);
    } catch (error) {
      console.error('Error loading settings:', error);
      showToast('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApiKey = async () => {
    if (!projectId || !newKeyName.trim()) return;
    
    try {
      const newKey = await settingsService.createApiKey(projectId, newKeyName);
      setApiKeys([newKey, ...apiKeys]);
      setNewGeneratedKey(newKey);
      setNewKeyName('');
      setShowNewKeyModal(false);
      showToast('API key created successfully!', 'success');
    } catch (error) {
      console.error('Error creating API key:', error);
      showToast('Failed to create API key', 'error');
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    try {
      await settingsService.deleteApiKey(id);
      setApiKeys(apiKeys.filter(k => k.id !== id));
      showToast('API key deleted', 'success');
    } catch (error) {
      console.error('Error deleting API key:', error);
      showToast('Failed to delete API key', 'error');
    }
  };

  const handleCreateWebhook = async () => {
    if (!projectId || !webhookUrl.trim()) return;
    
    try {
      const newWebhook = await settingsService.createWebhook(projectId, webhookUrl, selectedEvents);
      setWebhooks([newWebhook, ...webhooks]);
      setWebhookUrl('');
      setSelectedEvents(['user.signup']);
      setShowWebhookModal(false);
      showToast('Webhook created successfully!', 'success');
    } catch (error) {
      console.error('Error creating webhook:', error);
      showToast('Failed to create webhook', 'error');
    }
  };

  const handleToggleWebhook = async (id: string, enabled: boolean) => {
    try {
      await settingsService.updateWebhook(id, { enabled });
      setWebhooks(webhooks.map(w => w.id === id ? { ...w, enabled } : w));
      showToast(`Webhook ${enabled ? 'enabled' : 'disabled'}`, 'success');
    } catch (error) {
      console.error('Error toggling webhook:', error);
      showToast('Failed to update webhook', 'error');
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
      await settingsService.deleteWebhook(id);
      setWebhooks(webhooks.filter(w => w.id !== id));
      showToast('Webhook deleted', 'success');
    } catch (error) {
      console.error('Error deleting webhook:', error);
      showToast('Failed to delete webhook', 'error');
    }
  };

  const handleClearAllEntries = async () => {
    if (!projectId) return;
    
    try {
      await settingsService.clearAllEntries(projectId);
      showToast('All entries cleared successfully', 'success');
    } catch (error) {
      console.error('Error clearing entries:', error);
      showToast('Failed to clear entries', 'error');
    }
  };

  const handleDeleteProject = async () => {
    if (!projectId || deleteConfirmation !== 'DELETE') return;
    
    try {
      await settingsService.deleteProject(projectId);
      showToast('Project deleted successfully', 'success');
      navigate('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      showToast('Failed to delete project', 'error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
  };

  const availableEvents = [
    { id: 'user.signup', label: 'New user joins waitlist' },
    { id: 'user.position_change', label: 'User position updates' },
    { id: 'user.referral', label: 'User refers someone' },
  ];

  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-mint-900/70">No project selected</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-mint-900/70">Loading settings...</p>
      </div>
    );
  }

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
            {activeTab === 'integrations' && (
              <Card>
                <h2 className="text-2xl font-bold text-mint-900 mb-6">Integrations</h2>
                
                {/* API Keys Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-mint-900">API Keys</h3>
                      <p className="text-sm text-mint-900/70">Manage API keys for programmatic access</p>
                    </div>
                    <Button onClick={() => setShowNewKeyModal(true)}>
                      <Plus className="w-4 h-4" />
                      New Key
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {apiKeys.length === 0 ? (
                      <div className="p-6 bg-mint-50 rounded-xl text-center">
                        <p className="text-mint-900/70">No API keys yet. Create one to get started.</p>
                      </div>
                    ) : (
                      apiKeys.map((key) => (
                        <div key={key.id} className="flex items-center justify-between p-4 bg-mint-50 rounded-xl">
                          <div className="flex-1">
                            <p className="font-medium text-mint-900">{key.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="text-sm text-mint-900/70 bg-white px-2 py-1 rounded">
                                {key.key.substring(0, 20)}...
                              </code>
                              <button
                                onClick={() => copyToClipboard(key.key)}
                                className="text-mint-600 hover:text-mint-700"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-mint-900/50 mt-1">
                              Created {new Date(key.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="secondary"
                            onClick={() => handleDeleteApiKey(key.id)}
                            className="text-red-500 border-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Webhooks Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-mint-900">Webhooks</h3>
                      <p className="text-sm text-mint-900/70">Receive real-time notifications</p>
                    </div>
                    <Button onClick={() => setShowWebhookModal(true)}>
                      <Plus className="w-4 h-4" />
                      New Webhook
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {webhooks.length === 0 ? (
                      <div className="p-6 bg-mint-50 rounded-xl text-center">
                        <p className="text-mint-900/70">No webhooks configured.</p>
                      </div>
                    ) : (
                      webhooks.map((webhook) => (
                        <div key={webhook.id} className="p-4 bg-mint-50 rounded-xl">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <code className="text-sm text-mint-900 bg-white px-2 py-1 rounded">
                                {webhook.url}
                              </code>
                              <div className="flex items-center gap-2 mt-2">
                                {webhook.events.map((event) => (
                                  <span
                                    key={event}
                                    className="text-xs bg-mint-600 text-white px-2 py-1 rounded"
                                  >
                                    {event}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={webhook.enabled}
                                  onChange={(e) => handleToggleWebhook(webhook.id, e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mint-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mint-600"></div>
                              </label>
                              <Button
                                variant="secondary"
                                onClick={() => handleDeleteWebhook(webhook.id)}
                                className="text-red-500 border-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          {webhook.secret && (
                            <div className="flex items-center gap-2">
                              <code className="text-xs text-mint-900/70 bg-white px-2 py-1 rounded">
                                Secret: {webhook.secret.substring(0, 15)}...
                              </code>
                              <button
                                onClick={() => copyToClipboard(webhook.secret!)}
                                className="text-mint-600 hover:text-mint-700"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-4 bg-mint-50 rounded-xl mt-4">
                    <h4 className="font-semibold text-mint-900 mb-2">Available Events</h4>
                    <ul className="space-y-2 text-sm text-mint-900/70">
                      {availableEvents.map((event) => (
                        <li key={event.id}>• {event.id} - {event.label}</li>
                      ))}
                    </ul>
                  </div>
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
                      Remove all waitlist entries while keeping your project configuration
                    </p>
                    <Button
                      variant="secondary"
                      onClick={handleClearAllEntries}
                      className="text-red-500 border-red-500 hover:bg-red-50"
                    >
                      Clear All Entries
                    </Button>
                  </div>

                  <div className="p-4 bg-red-50 border border-red-500/20 rounded-xl">
                    <h3 className="font-semibold text-mint-900 mb-2">Delete Project</h3>
                    <p className="text-sm text-mint-900/70 mb-4">
                      Permanently delete this project and all associated data
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => setShowDeleteModal(true)}
                      className="text-red-500 border-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Project
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
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirmation('');
        }}
        title="Delete Project"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <p className="text-mint-900">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>

          <Input
            label="Type 'DELETE' to confirm"
            placeholder="DELETE"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmation('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteProject}
              disabled={deleteConfirmation !== 'DELETE'}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>

      {/* New API Key Modal */}
      <Modal
        isOpen={showNewKeyModal}
        onClose={() => {
          setShowNewKeyModal(false);
          setNewKeyName('');
        }}
        title="Create API Key"
      >
        <div className="space-y-4">
          <Input
            label="Key Name"
            placeholder="Production API Key"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowNewKeyModal(false);
                setNewKeyName('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateApiKey}
              disabled={!newKeyName.trim()}
              className="flex-1"
            >
              Create Key
            </Button>
          </div>
        </div>
      </Modal>

      {/* Show Generated Key Modal */}
      <Modal
        isOpen={!!newGeneratedKey}
        onClose={() => setNewGeneratedKey(null)}
        title="API Key Created"
      >
        <div className="space-y-4">
          <div className="p-4 bg-mint-50 rounded-xl">
            <p className="text-sm text-mint-900 mb-2">
              Make sure to copy your API key now. You won't be able to see it again!
            </p>
            <div className="flex items-center gap-2 mt-3">
              <code className="flex-1 text-sm text-mint-900 bg-white px-3 py-2 rounded border border-mint-200">
                {newGeneratedKey?.key}
              </code>
              <Button
                variant="secondary"
                onClick={() => copyToClipboard(newGeneratedKey?.key || '')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button onClick={() => setNewGeneratedKey(null)} className="w-full">
            Done
          </Button>
        </div>
      </Modal>

      {/* New Webhook Modal */}
      <Modal
        isOpen={showWebhookModal}
        onClose={() => {
          setShowWebhookModal(false);
          setWebhookUrl('');
          setSelectedEvents(['user.signup']);
        }}
        title="Create Webhook"
      >
        <div className="space-y-4">
          <Input
            label="Webhook URL"
            placeholder="https://your-api.com/webhooks/waitly"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-mint-900 mb-2">
              Events
            </label>
            <div className="space-y-2">
              {availableEvents.map((event) => (
                <label key={event.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEvents([...selectedEvents, event.id]);
                      } else {
                        setSelectedEvents(selectedEvents.filter((id) => id !== event.id));
                      }
                    }}
                    className="w-5 h-5 text-mint-600 border-mint-600/20 rounded focus:ring-mint-600"
                  />
                  <div>
                    <p className="font-medium text-mint-900">{event.id}</p>
                    <p className="text-sm text-mint-900/70">{event.label}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowWebhookModal(false);
                setWebhookUrl('');
                setSelectedEvents(['user.signup']);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateWebhook}
              disabled={!webhookUrl.trim() || selectedEvents.length === 0}
              className="flex-1"
            >
              Create Webhook
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
