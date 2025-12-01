import { Mail, User, Building2, Phone, Briefcase, Hash, Link2, FileText } from 'lucide-react';
import { useState } from 'react';
import { useToast } from './ui/Toast';
import { publicWaitlistService, ProjectInfo } from '../services/publicWaitlist';
import { EmbedConfiguration, CustomField } from '../services/embed';

const getFieldIcon = (fieldName: string, fieldType: string) => {
  const name = fieldName.toLowerCase();
  
  if (name.includes('company')) return <Building2 className="w-5 h-5" />;
  if (name.includes('phone')) return <Phone className="w-5 h-5" />;
  if (name.includes('job') || name.includes('title') || name.includes('role')) return <Briefcase className="w-5 h-5" />;
  if (name.includes('referral') || name.includes('code')) return <Hash className="w-5 h-5" />;
  if (name.includes('linkedin') || name.includes('url') || name.includes('website')) return <Link2 className="w-5 h-5" />;
  
  if (fieldType === 'tel') return <Phone className="w-5 h-5" />;
  if (fieldType === 'url') return <Link2 className="w-5 h-5" />;
  
  return <FileText className="w-5 h-5" />;
};

interface EmbedWaitlistFormProps {
  projectInfo: ProjectInfo;
  embedConfig: EmbedConfiguration | null;
  customFields: CustomField[];
  waitlistId: string;
  referralCode?: string | null;
}

export default function EmbedWaitlistForm({ 
  projectInfo, 
  embedConfig, 
  customFields, 
  waitlistId,
  referralCode 
}: EmbedWaitlistFormProps) {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!name) {
      setErrors(prev => ({ ...prev, name: 'Name is required' }));
      return;
    }
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return;
    }

    for (const field of customFields) {
      if (field.required && !customFieldValues[field.id]) {
        setErrors(prev => ({ ...prev, [field.id]: `${field.name} is required` }));
        return;
      }
    }

    setLoading(true);
    try {
      await publicWaitlistService.joinWaitlist(
        waitlistId,
        name,
        email,
        Object.keys(customFieldValues).length > 0 ? customFieldValues : undefined,
        referralCode || undefined
      );
      showToast(embedConfig?.success_message || 'Successfully joined the waitlist!', 'success');
      
      // Reset form
      setName('');
      setEmail('');
      setCustomFieldValues({});
    } catch (error) {
      if (error instanceof Error && error.message === 'Email already registered') {
        setErrors({ email: 'This email is already registered' });
        showToast('Email already registered', 'error');
      } else {
        showToast('Failed to join waitlist', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const primaryColor = embedConfig?.primary_color || '#059669';

  return (
    <div className="bg-white dark:bg-dark-bg border-2 border-mint-600/20 dark:border-dark-border rounded-2xl p-8">
      {embedConfig?.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: embedConfig.custom_css }} />
      )}
      <div className="max-w-md mx-auto">
        {embedConfig?.show_logo && (
          <div className="flex justify-center mb-4">
            {embedConfig?.logo_url ? (
              <img 
                src={embedConfig.logo_url} 
                alt={projectInfo.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: primaryColor }}
              >
                W
              </div>
            )}
          </div>
        )}

        <h3 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-3 text-center">
          {embedConfig?.heading || projectInfo.description || 'Join Our Waitlist'}
        </h3>
        
        <p className="text-gray-600 dark:text-dark-text-muted text-center mb-6">
          {embedConfig?.description || 'Be the first to know when we launch. Join our exclusive waitlist!'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-text-muted">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-mint-50 dark:bg-dark-card border-2 border-mint-600/20 dark:border-dark-border rounded-xl text-gray-900 dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-text-muted focus:outline-none"
              style={{ borderColor: errors.name ? '#ef4444' : undefined }}
              onFocus={(e) => !errors.name && (e.currentTarget.style.borderColor = primaryColor)}
              onBlur={(e) => !errors.name && (e.currentTarget.style.borderColor = '')}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-text-muted">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-mint-50 dark:bg-dark-card border-2 border-mint-600/20 dark:border-dark-border rounded-xl text-gray-900 dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-text-muted focus:outline-none"
              style={{ borderColor: errors.email ? '#ef4444' : undefined }}
              onFocus={(e) => !errors.email && (e.currentTarget.style.borderColor = primaryColor)}
              onBlur={(e) => !errors.email && (e.currentTarget.style.borderColor = '')}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {customFields.map((field) => (
            <div key={field.id} className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-text-muted">
                {getFieldIcon(field.name, field.type)}
              </div>
              <input
                type={field.type}
                placeholder={field.placeholder || field.name}
                value={customFieldValues[field.id] || ''}
                onChange={(e) => setCustomFieldValues({ ...customFieldValues, [field.id]: e.target.value })}
                required={field.required}
                className="w-full pl-12 pr-4 py-3 bg-mint-50 dark:bg-dark-card border-2 border-mint-600/20 dark:border-dark-border rounded-xl text-gray-900 dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-text-muted focus:outline-none"
                style={{ borderColor: errors[field.id] ? '#ef4444' : undefined }}
                onFocus={(e) => !errors[field.id] && (e.currentTarget.style.borderColor = primaryColor)}
                onBlur={(e) => !errors[field.id] && (e.currentTarget.style.borderColor = '')}
              />
              {errors[field.id] && <p className="text-xs text-red-500 mt-1">{errors[field.id]}</p>}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            {loading ? 'Joining...' : embedConfig?.button_text || 'Join Waitlist'}
          </button>

          {embedConfig?.show_position && (
            <p className="text-sm text-center mt-4 text-gray-600 dark:text-dark-text-muted">
              You'll be #{(projectInfo.total_signups + 1).toLocaleString()} on the list
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
