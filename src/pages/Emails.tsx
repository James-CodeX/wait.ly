import { motion } from 'framer-motion';
import { Plus, Mail, Eye, Send } from 'lucide-react';
import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { mockEmailCampaigns, mockEmailTemplates } from '../utils/mockApi';
import { useToast } from '../components/ui/Toast';

export default function Emails() {
  const { showToast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(mockEmailTemplates[0]);

  const handleCreateCampaign = () => {
    setShowCreateModal(false);
    showToast('Campaign created successfully!', 'success');
  };

  const handleSendTest = () => {
    showToast('Test email sent!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-mint-900 mb-2">Email Campaigns</h1>
          <p className="text-mint-900/70">Create and manage email campaigns</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          New Campaign
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEmailCampaigns.map((campaign, index) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-mint-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    campaign.status === 'sent'
                      ? 'bg-mint-600 text-white'
                      : 'bg-mint-50 text-mint-900'
                  }`}
                >
                  {campaign.status}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-mint-900 mb-2">{campaign.name}</h3>
              <p className="text-mint-900/70 mb-4">{campaign.subject}</p>

              {campaign.status === 'sent' && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-mint-900/70">Sent</p>
                    <p className="text-lg font-semibold text-mint-900">{campaign.sent}</p>
                  </div>
                  <div>
                    <p className="text-sm text-mint-900/70">Opened</p>
                    <p className="text-lg font-semibold text-mint-900">{campaign.opened}</p>
                  </div>
                  <div>
                    <p className="text-sm text-mint-900/70">Clicked</p>
                    <p className="text-lg font-semibold text-mint-900">{campaign.clicked}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowEditorModal(true)}
                >
                  <Eye className="w-4 h-4" />
                  {campaign.status === 'sent' ? 'View' : 'Edit'}
                </Button>
                {campaign.status === 'draft' && (
                  <Button className="flex-1">
                    <Send className="w-4 h-4" />
                    Send
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-mint-900 mb-4">Email Templates</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {mockEmailTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card hover>
                <h3 className="text-xl font-semibold text-mint-900 mb-2">{template.name}</h3>
                <p className="text-mint-900/70 mb-4">{template.subject}</p>
                <div className="bg-mint-50 p-4 rounded-xl mb-4">
                  <pre className="text-sm text-mint-900 whitespace-pre-wrap">{template.body}</pre>
                </div>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowEditorModal(true);
                  }}
                >
                  Use Template
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Campaign"
      >
        <div className="space-y-4">
          <Input label="Campaign Name" placeholder="e.g., Welcome Series" />
          <Input label="Subject Line" placeholder="Welcome to our waitlist!" />

          <div>
            <label className="block text-sm font-medium text-mint-900 mb-2">Template</label>
            <select className="w-full px-4 py-3 bg-mint-50 border-2 border-mint-600/20 rounded-xl text-mint-900 focus:outline-none focus:border-mint-600">
              {mockEmailTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-mint-900 mb-2">Recipients</label>
            <select className="w-full px-4 py-3 bg-mint-50 border-2 border-mint-600/20 rounded-xl text-mint-900 focus:outline-none focus:border-mint-600">
              <option>All waitlist members</option>
              <option>New signups this week</option>
              <option>Top 100 positions</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign} className="flex-1">
              Create Campaign
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showEditorModal}
        onClose={() => setShowEditorModal(false)}
        title="Email Editor"
        size="lg"
      >
        <div className="space-y-4">
          <Input label="Subject" value={selectedTemplate.subject} />

          <div>
            <label className="block text-sm font-medium text-mint-900 mb-2">Message</label>
            <textarea
              rows={10}
              value={selectedTemplate.body}
              className="w-full px-4 py-3 bg-mint-50 border-2 border-mint-600/20 rounded-xl text-mint-900 focus:outline-none focus:border-mint-600 resize-none"
            />
          </div>

          <div className="bg-mint-50 p-4 rounded-xl">
            <p className="text-sm text-mint-900/70">
              <strong>Available variables:</strong> {'{'}
              {'{'}name{'}'}
              {'}'}, {'{'}
              {'{'}position{'}'}
              {'}'}, {'{'}
              {'{'}waitlist_name{'}'}
              {'}'}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={handleSendTest} className="flex-1">
              Send Test
            </Button>
            <Button onClick={() => setShowEditorModal(false)} className="flex-1">
              Save & Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
