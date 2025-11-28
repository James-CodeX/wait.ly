import { motion } from 'framer-motion';
import { Copy, Check, Upload, Plus, Trash2, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { embedService, CustomField } from '../services/embed';

export default function Embed() {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'inline' | 'popup' | 'slide-in'>('inline');
  const [config, setConfig] = useState({
    heading: 'Join Our Waitlist',
    description: 'Be the first to know when we launch. Join our exclusive waitlist!',
    buttonText: 'Join Now',
    successMessage: 'Thanks for joining!',
    primaryColor: '#059669',
    secondaryColor: '#ECFDF5',
    showPosition: true,
    showLogo: true,
    logoUrl: null as string | null,
    customCss: null as string | null,
  });

  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  
  const [showCustomFieldInput, setShowCustomFieldInput] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');

  const projectId = searchParams.get('project') || localStorage.getItem('selectedProjectId') || '';

  const presetFields = [
    { name: 'Company', type: 'text', placeholder: 'Company name' },
    { name: 'Phone Number', type: 'tel', placeholder: 'Phone number' },
    { name: 'Job Title', type: 'text', placeholder: 'Your role' },
    { name: 'Company Size', type: 'select', placeholder: 'Select size' },
    { name: 'Referral Code', type: 'text', placeholder: 'Referral code' },
    { name: 'LinkedIn URL', type: 'url', placeholder: 'LinkedIn profile' },
  ];

  useEffect(() => {
    if (projectId) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [projectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [embedConfig, fields] = await Promise.all([
        embedService.getConfiguration(projectId),
        embedService.getCustomFields(projectId),
      ]);

      if (embedConfig) {
        setConfig({
          heading: embedConfig.heading,
          description: embedConfig.description || '',
          buttonText: embedConfig.button_text,
          successMessage: embedConfig.success_message,
          primaryColor: embedConfig.primary_color,
          secondaryColor: embedConfig.secondary_color || '#ECFDF5',
          showPosition: embedConfig.show_position,
          showLogo: embedConfig.show_logo,
          logoUrl: embedConfig.logo_url,
          customCss: embedConfig.custom_css,
        });
        setActiveTab(embedConfig.widget_type as 'inline' | 'popup' | 'slide-in');
      }

      setCustomFields(fields);
    } catch (error) {
      console.error('Failed to load embed configuration:', error);
      showToast('Failed to load configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const embedCode = `<script src="https://waitly.app/embed.js"></script>
<div data-waitly-widget="${activeTab}"
     data-project="${projectId}"
     data-heading="${config.heading}"
     data-button="${config.buttonText}"
     data-color="${config.primaryColor}">
</div>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    showToast('Code copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!projectId) {
      showToast('No project selected', 'error');
      return;
    }

    setSaving(true);
    try {
      await embedService.upsertConfiguration(projectId, {
        heading: config.heading,
        description: config.description,
        button_text: config.buttonText,
        success_message: config.successMessage,
        primary_color: config.primaryColor,
        secondary_color: config.secondaryColor,
        show_position: config.showPosition,
        show_logo: config.showLogo,
        logo_url: config.logoUrl,
        custom_css: config.customCss,
        widget_type: activeTab,
      });
      showToast('Configuration saved successfully!', 'success');
    } catch (error) {
      console.error('Failed to save configuration:', error);
      showToast('Failed to save configuration', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePresetField = async (fieldName: string) => {
    if (!projectId) {
      showToast('No project selected', 'error');
      return;
    }

    const preset = presetFields.find(f => f.name === fieldName);
    if (!preset) return;

    const existingField = customFields.find(f => f.name === fieldName);
    
    if (existingField) {
      // Remove field
      try {
        await embedService.deleteCustomField(existingField.id);
        setCustomFields(customFields.filter(f => f.name !== fieldName));
        showToast(`${fieldName} removed`, 'success');
      } catch (error) {
        console.error('Failed to remove field:', error);
        showToast('Failed to remove field', 'error');
      }
    } else {
      // Add field
      try {
        const newField = await embedService.addCustomField(projectId, {
          name: preset.name,
          type: preset.type,
          placeholder: preset.placeholder,
          required: false,
          enabled: true,
        });
        setCustomFields([...customFields, newField]);
        showToast(`${fieldName} added`, 'success');
      } catch (error) {
        console.error('Failed to add field:', error);
        showToast('Failed to add field', 'error');
      }
    }
  };

  const handleAddCustomField = async () => {
    if (!projectId) {
      showToast('No project selected', 'error');
      return;
    }

    if (!newFieldName.trim()) {
      showToast('Please enter a field name', 'error');
      return;
    }

    try {
      const newField = await embedService.addCustomField(projectId, {
        name: newFieldName,
        type: 'text',
        required: false,
        enabled: true,
      });
      setCustomFields([...customFields, newField]);
      setNewFieldName('');
      setShowCustomFieldInput(false);
      showToast('Custom field added', 'success');
    } catch (error) {
      console.error('Failed to add custom field:', error);
      showToast('Failed to add custom field', 'error');
    }
  };

  const handleDeleteField = async (id: string) => {
    try {
      await embedService.deleteCustomField(id);
      setCustomFields(customFields.filter(f => f.id !== id));
      showToast('Field removed', 'success');
    } catch (error) {
      console.error('Failed to delete field:', error);
      showToast('Failed to delete field', 'error');
    }
  };

  const isFieldActive = (fieldName: string) => {
    return customFields.some(f => f.name === fieldName);
  };

  if (!projectId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-mint-900 mb-4">No Project Selected</h2>
          <p className="text-mint-900/70 mb-6">
            Please select a project from the Projects page to customize your embed widget.
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
        <div className="h-8 w-48 bg-mint-50 rounded animate-pulse" />
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="h-96 bg-mint-50 rounded-2xl animate-pulse" />
            <div className="h-96 bg-mint-50 rounded-2xl animate-pulse" />
          </div>
          <div className="h-96 bg-mint-50 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-mint-900 mb-2">Embed & Customize</h1>
        <p className="text-mint-900/70">Design your waitlist form and embed it anywhere</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Branding */}
          <Card>
            <h3 className="text-xl font-semibold text-mint-900 mb-4">Branding</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-mint-900 mb-2">
                  Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-mint-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                    W
                  </div>
                  <Button variant="secondary" size="sm">
                    <Upload className="w-4 h-4" />
                    Upload
                  </Button>
                </div>
              </div>

              <Input
                label="Heading"
                value={config.heading}
                onChange={(e) => setConfig({ ...config, heading: e.target.value })}
              />

              <div>
                <label className="block text-sm font-medium text-mint-900 mb-2">
                  Description
                </label>
                <textarea
                  value={config.description}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-mint-50 border-2 border-mint-600/20 rounded-xl text-mint-900 placeholder-mint-900/40 focus:outline-none focus:border-mint-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mint-900 mb-2">
                  Primary Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="w-16 h-12 rounded-xl cursor-pointer border-2 border-mint-600/20"
                  />
                  <Input
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-mint-900 mb-2">
                  Custom CSS
                </label>
                <textarea
                  rows={4}
                  value={config.customCss || ''}
                  onChange={(e) => setConfig({ ...config, customCss: e.target.value })}
                  placeholder=".waitlist-form { /* Your custom styles */ }"
                  className="w-full px-4 py-3 bg-mint-900 text-mint-100 border-2 border-mint-600/20 rounded-xl focus:outline-none focus:border-mint-600 resize-none font-mono text-sm"
                />
              </div>
            </div>
          </Card>

          {/* Form Configuration */}
          <Card>
            <h3 className="text-xl font-semibold text-mint-900 mb-4">Form Configuration</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-mint-900 mb-2">
                  Widget Type
                </label>
                <div className="flex gap-2">
                  {(['inline', 'popup', 'slide-in'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveTab(type)}
                      className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
                        activeTab === type
                          ? 'bg-mint-600 text-white shadow-mint'
                          : 'bg-mint-50 text-mint-900 hover:bg-mint-100'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Button Text"
                value={config.buttonText}
                onChange={(e) => setConfig({ ...config, buttonText: e.target.value })}
              />

              <Input
                label="Success Message"
                value={config.successMessage}
                onChange={(e) => setConfig({ ...config, successMessage: e.target.value })}
              />

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showPosition}
                  onChange={(e) => setConfig({ ...config, showPosition: e.target.checked })}
                  className="w-5 h-5 text-mint-600 border-mint-600/20 rounded focus:ring-mint-600"
                />
                <span className="font-medium text-mint-900">Show waitlist position</span>
              </label>
            </div>
          </Card>

          {/* Custom Fields */}
          <Card>
            <h3 className="text-xl font-semibold text-mint-900 mb-4">Custom Fields</h3>
            
            {/* Quick Select Presets */}
            <div className="mb-6">
              <p className="text-sm font-medium text-mint-900 mb-3">Quick Add</p>
              <div className="grid grid-cols-2 gap-2">
                {presetFields.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleTogglePresetField(preset.name)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isFieldActive(preset.name)
                        ? 'bg-mint-600 text-white shadow-mint'
                        : 'bg-mint-50 text-mint-900 hover:bg-mint-100 border border-mint-600/20'
                    }`}
                  >
                    {isFieldActive(preset.name) && <Check className="w-3 h-3 inline mr-1" />}
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Field Input */}
            <div className="mb-4">
              {!showCustomFieldInput ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowCustomFieldInput(true)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4" />
                  Add Custom Field
                </Button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    placeholder="Field name (e.g., Industry)"
                    className="flex-1 px-3 py-2 bg-mint-50 border-2 border-mint-600/20 rounded-lg text-sm text-mint-900 placeholder-mint-900/40 focus:outline-none focus:border-mint-600"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomField()}
                  />
                  <Button size="sm" onClick={handleAddCustomField}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setShowCustomFieldInput(false);
                      setNewFieldName('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Active Fields List */}
            {customFields.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-mint-600/10">
                <p className="text-sm font-medium text-mint-900 mb-2">Active Fields ({customFields.length})</p>
                {customFields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-3 bg-mint-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-mint-900 text-sm">{field.name}</p>
                      <p className="text-xs text-mint-900/70">
                        {field.type} • {field.required ? 'Required' : 'Optional'}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeleteField(field.id)}
                      className="text-red-500 border-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Button onClick={handleSave} className="w-full" loading={saving} disabled={saving}>
            <Save className="w-4 h-4" />
            Save Configuration
          </Button>

          {/* Embed Code */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-mint-900">Embed Code</h3>
              <Button onClick={handleCopy} variant="secondary" size="sm">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="bg-mint-900 text-mint-100 p-4 rounded-xl overflow-x-auto">
              <pre className="text-sm">
                <code>{embedCode}</code>
              </pre>
            </div>
          </Card>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
          <Card>
            <h3 className="text-xl font-semibold text-mint-900 mb-4">Live Preview</h3>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-2 border-mint-600/20 rounded-2xl p-8"
            >
              <div className="max-w-md mx-auto">
                {config.showLogo && (
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-mint-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                      W
                    </div>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-mint-900 mb-3 text-center">
                  {config.heading}
                </h3>
                <p className="text-mint-900/70 text-center mb-6">
                  {config.description}
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-4 py-3 bg-mint-50 border-2 border-mint-600/20 rounded-xl text-mint-900 placeholder-mint-900/40 focus:outline-none focus:border-mint-600"
                    style={{ borderColor: `${config.primaryColor}33` }}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-mint-50 border-2 border-mint-600/20 rounded-xl text-mint-900 placeholder-mint-900/40 focus:outline-none focus:border-mint-600"
                    style={{ borderColor: `${config.primaryColor}33` }}
                  />
                  {customFields.map((field) => (
                    <input
                      key={field.id}
                      type="text"
                      placeholder={field.name}
                      className="w-full px-4 py-3 bg-mint-50 border-2 border-mint-600/20 rounded-xl text-mint-900 placeholder-mint-900/40 focus:outline-none focus:border-mint-600"
                      style={{ borderColor: `${config.primaryColor}33` }}
                    />
                  ))}
                  <button
                    className="w-full px-6 py-3 rounded-xl font-medium text-white shadow-mint"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    {config.buttonText}
                  </button>
                </div>
                {config.showPosition && (
                  <p className="text-sm text-center mt-4 text-mint-900/70">
                    You'll be #1,247 on the list
                  </p>
                )}
              </div>
            </motion.div>

            <div className="mt-4 p-4 bg-mint-50 rounded-xl">
              <p className="text-sm text-mint-900/70">
                <strong>Tip:</strong> All changes update in real-time. Customize everything to match your brand, then copy the embed code.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
