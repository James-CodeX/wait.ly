import { motion } from 'framer-motion';
import { Plus, Mail, Eye, Send, Trash2, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import EmailEditor from '../components/EmailEditor';
import { emailService, EmailCampaign, EmailTemplate } from '../services/email';
import { useToast } from '../components/ui/Toast';

type View = 'list' | 'editor';

export default function Emails() {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [view, setView] = useState<View>('list');
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
    templateId: '',
    recipientFilter: 'all',
    triggerType: 'manual' as 'manual' | 'automatic',
    triggerEvent: 'on_join',
  });
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);

  const projectId = searchParams.get('project') || localStorage.getItem('selectedProjectId') || '';

  useEffect(() => {
    if (projectId) {
      loadData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [campaignsData, templatesData] = await Promise.all([
        emailService.getCampaigns(projectId),
        emailService.getTemplates(projectId),
      ]);
      setCampaigns(campaignsData);
      setTemplates(templatesData);
    } catch (error) {
      console.error('Failed to load email data:', error);
      showToast('Failed to load email data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    if (!formData.name.trim() || !formData.subject.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setCreating(true);
    try {
      // Get template body if template selected
      let body = formData.body;
      if (formData.templateId) {
        const template = templates.find(t => t.id === formData.templateId);
        if (template) {
          body = template.body;
        }
      }

      const newCampaign = await emailService.createCampaign(projectId, {
        name: formData.name,
        subject: formData.subject,
        body: body || 'Email content here...',
        template_id: formData.templateId || undefined,
        trigger_type: formData.triggerType,
        trigger_event: formData.triggerType === 'automatic' ? formData.triggerEvent : null,
        is_active: formData.triggerType === 'automatic',
        recipient_filter: { type: formData.recipientFilter },
      });

      setCampaigns([newCampaign, ...campaigns]);
      setShowCreateModal(false);
      setFormData({ name: '', subject: '', body: '', templateId: '', recipientFilter: 'all', triggerType: 'manual', triggerEvent: 'on_join' });
      showToast('Campaign created successfully!', 'success');
    } catch (error) {
      console.error('Failed to create campaign:', error);
      showToast('Failed to create campaign', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    setSending(true);
    try {
      const updatedCampaign = await emailService.sendCampaign(campaignId);
      setCampaigns(campaigns.map(c => c.id === campaignId ? updatedCampaign : c));
      showToast('Campaign sent successfully!', 'success');
    } catch (error) {
      console.error('Failed to send campaign:', error);
      showToast('Failed to send campaign', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await emailService.deleteCampaign(campaignId);
      setCampaigns(campaigns.filter(c => c.id !== campaignId));
      showToast('Campaign deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      showToast('Failed to delete campaign', 'error');
    }
  };

  const handleSendTest = async () => {
    if (!selectedCampaign) return;

    const testEmail = prompt('Enter email address to send test to:');
    if (!testEmail) return;

    try {
      await emailService.sendTestEmail(selectedCampaign.id, testEmail);
      showToast(`Test email sent to ${testEmail}!`, 'success');
    } catch (error) {
      console.error('Failed to send test email:', error);
      showToast('Failed to send test email', 'error');
    }
  };

  const handleOpenEditor = (campaign: EmailCampaign) => {
    setSelectedCampaign(campaign);
    setView('editor');
  };

  const handleSaveEditor = async () => {
    if (!selectedCampaign) return;

    try {
      const updated = await emailService.updateCampaign(selectedCampaign.id, {
        subject: selectedCampaign.subject,
        body: selectedCampaign.body,
      });
      setCampaigns(campaigns.map(c => c.id === updated.id ? updated : c));
      setView('list');
      setSelectedCampaign(null);
      showToast('Campaign updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update campaign:', error);
      showToast('Failed to update campaign', 'error');
    }
  };

  const handleCloseEditor = () => {
    setView('list');
    setSelectedCampaign(null);
  };

  if (!projectId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-mint-900 dark:text-dark-text mb-4">No Project Selected</h2>
          <p className="text-mint-900/70 dark:text-dark-text-muted mb-6">
            Please select a project from the Projects page to manage email campaigns.
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-mint-50 dark:bg-dark-card rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (view === 'editor' && selectedCampaign) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={handleCloseEditor}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Campaigns
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-mint-900 dark:text-dark-text mb-2">
                {selectedCampaign.status === 'sent' ? 'View Campaign' : 'Edit Campaign'}
              </h1>
              <p className="text-mint-900/70 dark:text-dark-text-muted">{selectedCampaign.name}</p>
            </div>
          </div>
          <div className="flex gap-3">
            {selectedCampaign.status !== 'sent' && (
              <>
                <Button variant="secondary" onClick={handleSendTest}>
                  Send Test
                </Button>
                <Button onClick={handleSaveEditor}>
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        <EmailEditor
          subject={selectedCampaign.subject}
          body={selectedCampaign.body}
          onSubjectChange={(subject) => setSelectedCampaign({ ...selectedCampaign, subject })}
          onBodyChange={(body) => setSelectedCampaign({ ...selectedCampaign, body })}
          disabled={selectedCampaign.status === 'sent'}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-mint-900 dark:text-dark-text mb-2">Email Campaigns</h1>
          <p className="text-mint-900/70 dark:text-dark-text-muted">Create and manage email campaigns</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          New Campaign
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Mail className="w-16 h-16 text-mint-600 dark:text-mint-400 mx-auto mb-4" />
            <p className="text-mint-900/70 dark:text-dark-text-muted">No email campaigns yet. Create your first one!</p>
          </div>
        ) : (
          campaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-mint-600 dark:bg-mint-500 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      campaign.status === 'sent'
                        ? 'bg-mint-600 dark:bg-mint-500 text-white'
                        : 'bg-mint-50 dark:bg-dark-hover text-mint-900 dark:text-dark-text'
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-mint-900 dark:text-dark-text mb-2">{campaign.name}</h3>
                <p className="text-mint-900/70 dark:text-dark-text-muted mb-2">{campaign.subject}</p>

                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    campaign.trigger_type === 'automatic'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}>
                    {campaign.trigger_type === 'automatic' ? '⚡ Automatic' : '✋ Manual'}
                  </span>
                  {campaign.trigger_type === 'automatic' && campaign.is_active && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      Active
                    </span>
                  )}
                </div>

                {campaign.status === 'sent' && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-mint-900/70 dark:text-dark-text-muted">Sent</p>
                      <p className="text-lg font-semibold text-mint-900 dark:text-dark-text">{campaign.total_sent}</p>
                    </div>
                    <div>
                      <p className="text-sm text-mint-900/70 dark:text-dark-text-muted">Opened</p>
                      <p className="text-lg font-semibold text-mint-900 dark:text-dark-text">{campaign.total_opened}</p>
                    </div>
                    <div>
                      <p className="text-sm text-mint-900/70 dark:text-dark-text-muted">Clicked</p>
                      <p className="text-lg font-semibold text-mint-900 dark:text-dark-text">{campaign.total_clicked}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => handleOpenEditor(campaign)}
                  >
                    <Eye className="w-4 h-4" />
                    {campaign.status === 'sent' ? 'View' : 'Edit'}
                  </Button>
                  {campaign.status === 'draft' && (
                    <Button 
                      className="flex-1"
                      onClick={() => handleSendCampaign(campaign.id)}
                      loading={sending}
                      disabled={sending}
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </Button>
                  )}
                  {campaign.status === 'draft' && (
                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-mint-900 dark:text-dark-text mb-4">Email Templates</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {templates.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-mint-900/70 dark:text-dark-text-muted">No templates yet</p>
            </div>
          ) : (
            templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card hover>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-mint-900 dark:text-dark-text">{template.name}</h3>
                    {template.is_system && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-mint-100 dark:bg-mint-900/30 text-mint-700 dark:text-mint-300">
                        System
                      </span>
                    )}
                  </div>
                  <p className="text-mint-900/70 dark:text-dark-text-muted mb-4">{template.subject}</p>
                  <div className="bg-mint-50 dark:bg-dark-hover p-4 rounded-xl mb-4">
                    <pre className="text-sm text-mint-900 dark:text-dark-text whitespace-pre-wrap line-clamp-4">{template.body}</pre>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        templateId: template.id,
                        subject: template.subject,
                        body: template.body,
                        triggerType: template.type === 'welcome' ? 'automatic' : 'manual',
                        triggerEvent: template.type === 'welcome' ? 'on_join' : 'on_join',
                      });
                      setShowCreateModal(true);
                    }}
                  >
                    Use Template
                  </Button>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Campaign"
      >
        <div className="space-y-4">
          <Input 
            label="Campaign Name" 
            placeholder="e.g., Welcome Series"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input 
            label="Subject Line" 
            placeholder="Welcome to our waitlist!"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-mint-900 dark:text-dark-text mb-2">Template</label>
            <select 
              className="w-full px-4 py-3 bg-mint-50 dark:bg-dark-card border-2 border-mint-600/20 dark:border-dark-border rounded-xl text-mint-900 dark:text-dark-text focus:outline-none focus:border-mint-600 dark:focus:border-mint-500"
              value={formData.templateId}
              onChange={(e) => {
                const template = templates.find(t => t.id === e.target.value);
                if (template) {
                  setFormData({ 
                    ...formData, 
                    templateId: e.target.value,
                    subject: template.subject,
                    body: template.body
                  });
                } else {
                  setFormData({ ...formData, templateId: '' });
                }
              }}
            >
              <option value="">None - Start from scratch</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-mint-900 dark:text-dark-text mb-2">Campaign Type</label>
            <select
              className="w-full px-4 py-3 bg-mint-50 dark:bg-dark-card border-2 border-mint-600/20 dark:border-dark-border rounded-xl text-mint-900 dark:text-dark-text focus:outline-none focus:border-mint-600 dark:focus:border-mint-500"
              value={formData.triggerType}
              onChange={(e) => setFormData({ ...formData, triggerType: e.target.value as 'manual' | 'automatic' })}
            >
              <option value="manual">Manual - Send when ready</option>
              <option value="automatic">Automatic - Send on trigger</option>
            </select>
            {formData.triggerType === 'automatic' && (
              <p className="text-xs text-mint-900/70 dark:text-dark-text-muted mt-2">
                Automatic campaigns will be sent immediately when the trigger event occurs
              </p>
            )}
          </div>

          {formData.triggerType === 'automatic' && (
            <div>
              <label className="block text-sm font-medium text-mint-900 dark:text-dark-text mb-2">Trigger Event</label>
              <select
                className="w-full px-4 py-3 bg-mint-50 dark:bg-dark-card border-2 border-mint-600/20 dark:border-dark-border rounded-xl text-mint-900 dark:text-dark-text focus:outline-none focus:border-mint-600 dark:focus:border-mint-500"
                value={formData.triggerEvent}
                onChange={(e) => setFormData({ ...formData, triggerEvent: e.target.value })}
              >
                <option value="on_join">When user joins waitlist</option>
                <option value="on_position_change">When position changes</option>
                <option value="on_milestone">When reaching milestone position</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-mint-900 dark:text-dark-text mb-2">Recipients</label>
            <select
              className="w-full px-4 py-3 bg-mint-50 dark:bg-dark-card border-2 border-mint-600/20 dark:border-dark-border rounded-xl text-mint-900 dark:text-dark-text focus:outline-none focus:border-mint-600 dark:focus:border-mint-500"
              value={formData.recipientFilter}
              onChange={(e) => setFormData({ ...formData, recipientFilter: e.target.value })}
            >
              <option value="all">All waitlist members</option>
              <option value="week">New signups this week</option>
              <option value="top100">Top 100 positions</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign} loading={creating} disabled={creating} className="flex-1">
              Create Campaign
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
