import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';

export default function Embed() {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'inline' | 'popup' | 'slide-in'>('inline');
  const [config, setConfig] = useState({
    heading: 'Join Our Waitlist',
    buttonText: 'Join Now',
    successMessage: 'Thanks for joining!',
    primaryColor: '#059669',
    showPosition: true,
  });

  const embedCode = `<script src="https://waitly.app/embed.js"></script>
<div data-waitly-widget="${activeTab}"
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-mint-900 mb-2">Embed Generator</h1>
        <p className="text-mint-900/70">Customize and embed your waitlist anywhere</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <h3 className="text-xl font-semibold text-mint-900 mb-4">Configuration</h3>

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
                label="Heading"
                value={config.heading}
                onChange={(e) => setConfig({ ...config, heading: e.target.value })}
              />

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

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-mint-900">Embed Code</h3>
              <Button onClick={handleCopy} variant="secondary">
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

        <div>
          <Card className="sticky top-6">
            <h3 className="text-xl font-semibold text-mint-900 mb-4">Live Preview</h3>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-2 border-mint-600/20 rounded-2xl p-8"
            >
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-mint-900 mb-4 text-center">
                  {config.heading}
                </h3>
                <p className="text-mint-900/70 text-center mb-6">
                  Be the first to know when we launch. Join our exclusive waitlist!
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-mint-50 border-2 border-mint-600/20 rounded-xl text-mint-900 placeholder-mint-900/40 focus:outline-none focus:border-mint-600"
                    style={{ borderColor: `${config.primaryColor}33` }}
                  />
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
                <strong>Tip:</strong> Customize the colors and text to match your brand, then copy the
                embed code and paste it into your website.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
