import { motion } from 'framer-motion';
import { Mail, Users, CheckCircle, User, Building2, Phone, Briefcase, Hash, Link2, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useToast } from '../components/ui/Toast';
import { publicWaitlistService, WaitlistEntry, ProjectInfo } from '../services/publicWaitlist';
import { EmbedConfiguration, CustomField } from '../services/embed';

const getFieldIcon = (fieldName: string, fieldType: string) => {
  const name = fieldName.toLowerCase();
  
  // Match by field name
  if (name.includes('company')) return <Building2 className="w-5 h-5" />;
  if (name.includes('phone')) return <Phone className="w-5 h-5" />;
  if (name.includes('job') || name.includes('title') || name.includes('role')) return <Briefcase className="w-5 h-5" />;
  if (name.includes('referral') || name.includes('code')) return <Hash className="w-5 h-5" />;
  if (name.includes('linkedin') || name.includes('url') || name.includes('website')) return <Link2 className="w-5 h-5" />;
  
  // Match by field type
  if (fieldType === 'tel') return <Phone className="w-5 h-5" />;
  if (fieldType === 'url') return <Link2 className="w-5 h-5" />;
  
  // Default icon
  return <FileText className="w-5 h-5" />;
};

export default function PublicWaitlist() {
  const { waitlistId } = useParams<{ waitlistId: string }>();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');
  const { showToast } = useToast();
  
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [embedConfig, setEmbedConfig] = useState<EmbedConfiguration | null>(null);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [entry, setEntry] = useState<WaitlistEntry | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pageLoading, setPageLoading] = useState(true);
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    // Detect if we're in an iframe
    setIsEmbedded(window.self !== window.top);
    loadProjectInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitlistId]);

  const loadProjectInfo = async () => {
    if (!waitlistId) return;
    
    setPageLoading(true);
    try {
      const [info, config, fields] = await Promise.all([
        publicWaitlistService.getProjectInfo(waitlistId),
        publicWaitlistService.getEmbedConfig(waitlistId),
        publicWaitlistService.getCustomFields(waitlistId),
      ]);
      setProjectInfo(info);
      setEmbedConfig(config);
      setCustomFields(fields.filter(f => f.enabled));
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setPageLoading(false);
    }
  };

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

    // Validate required custom fields
    for (const field of customFields) {
      if (field.required && !customFieldValues[field.id]) {
        setErrors(prev => ({ ...prev, [field.id]: `${field.name} is required` }));
        return;
      }
    }

    if (!waitlistId) {
      showToast('Invalid waitlist', 'error');
      return;
    }

    setLoading(true);
    try {
      const newEntry = await publicWaitlistService.joinWaitlist(
        waitlistId,
        name,
        email,
        Object.keys(customFieldValues).length > 0 ? customFieldValues : undefined,
        referralCode || undefined
      );
      setEntry(newEntry);
      setSubmitted(true);
      showToast(embedConfig?.success_message || 'Successfully joined the waitlist!', 'success');
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

  const copyReferralLink = () => {
    if (!entry) return;
    const link = `${window.location.origin}/public/${waitlistId}?ref=${entry.referral_code}`;
    navigator.clipboard.writeText(link);
    showToast('Referral link copied!', 'success');
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-mint-50 to-white dark:from-gray-900 dark:to-gray-800">
        <p className="text-mint-900/70 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!projectInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-mint-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Card className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-mint-900 dark:text-gray-100 mb-2">Waitlist Not Found</h2>
          <p className="text-mint-900/70 dark:text-gray-400 mb-4">
            This waitlist does not exist or has been removed.
          </p>
          {waitlistId && (
            <div className="bg-mint-50 dark:bg-gray-800 rounded-lg p-4 text-left">
              <p className="text-sm text-mint-900/70 dark:text-gray-400 mb-2">
                <strong className="text-mint-900 dark:text-gray-100">Project ID:</strong>
              </p>
              <code className="text-xs text-mint-600 dark:text-mint-400 break-all">{waitlistId}</code>
            </div>
          )}
          <p className="text-sm text-mint-900/70 dark:text-gray-400 mt-4">
            If you're the owner, make sure you've created a project and are using the correct embed URL from your dashboard.
          </p>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-mint-50 to-white dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <Card glass className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-mint-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-mint-900 dark:text-gray-100 mb-4"
            >
              {embedConfig?.success_message || "You're on the list!"}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-mint-900/70 dark:text-gray-300 mb-6"
            >
              Thanks for joining, {name}!
            </motion.p>

            {embedConfig?.show_position !== false && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl mb-6 text-white"
                style={{ backgroundColor: embedConfig?.primary_color || '#059669' }}
              >
                <Users className="w-6 h-6" />
                <div className="text-left">
                  <p className="text-sm opacity-90">Your Position</p>
                  <p className="text-3xl font-bold">#{entry?.position || 0}</p>
                </div>
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-mint-900/70 dark:text-gray-300 mb-6"
            >
              We've sent a confirmation email to <strong>{email}</strong>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-6 bg-mint-50 dark:bg-gray-700 rounded-xl"
            >
              <h3 className="font-semibold text-mint-900 dark:text-gray-100 mb-2">
                Move up the list faster!
              </h3>
              <p className="text-sm text-mint-900/70 dark:text-gray-300 mb-4">
                Share your unique referral link and get priority access
              </p>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/public/${waitlistId}?ref=${entry?.referral_code}`}
                  readOnly
                  className="flex-1"
                />
                <Button onClick={copyReferralLink}>Copy Link</Button>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={isEmbedded ? "p-6 bg-gradient-to-br from-mint-50 to-white dark:from-gray-900 dark:to-gray-800" : "min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-mint-50 to-white dark:from-gray-900 dark:to-gray-800"}>
      {embedConfig?.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: embedConfig.custom_css }} />
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={isEmbedded ? "w-full max-w-md mx-auto" : "w-full max-w-2xl"}
      >
        <div className={isEmbedded ? "text-center mb-4" : "text-center mb-8"}>
          {!isEmbedded && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="inline-flex items-center gap-3 mb-6"
            >
              {embedConfig?.show_logo && embedConfig?.logo_url ? (
                <img 
                  src={embedConfig.logo_url} 
                  alt={projectInfo.name}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
              ) : (
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: embedConfig?.primary_color || '#059669' }}
                >
                  <Users className="w-10 h-10 text-white" />
                </div>
              )}
              <h1 className="text-4xl font-bold text-mint-900 dark:text-gray-100">{projectInfo.name}</h1>
            </motion.div>
          )}

          {isEmbedded && embedConfig?.show_logo && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="flex justify-center mb-3"
            >
              {embedConfig?.logo_url ? (
                <img 
                  src={embedConfig.logo_url} 
                  alt={projectInfo.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
              ) : (
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: embedConfig?.primary_color || '#059669' }}
                >
                  <Users className="w-7 h-7 text-white" />
                </div>
              )}
            </motion.div>
          )}

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={isEmbedded ? "text-xl font-bold text-mint-900 dark:text-gray-100 mb-2" : "text-3xl md:text-4xl font-bold text-mint-900 dark:text-gray-100 mb-4"}
          >
            {embedConfig?.heading || projectInfo.description || 'Join Our Waitlist'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={isEmbedded ? "text-sm text-mint-900/70 dark:text-gray-300" : "text-xl text-mint-900/70 dark:text-gray-300"}
          >
            {embedConfig?.description || 'Be the first to know when we launch. Join our exclusive waitlist!'}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card glass>
            <form onSubmit={handleSubmit} className={isEmbedded ? "space-y-3" : "space-y-6"}>
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                icon={<User className="w-5 h-5" />}
              />

              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                icon={<Mail className="w-5 h-5" />}
              />

              {customFields.map((field) => (
                <Input
                  key={field.id}
                  type={field.type}
                  placeholder={field.placeholder || field.name}
                  value={customFieldValues[field.id] || ''}
                  onChange={(e) => setCustomFieldValues({ ...customFieldValues, [field.id]: e.target.value })}
                  error={errors[field.id]}
                  required={field.required}
                  icon={getFieldIcon(field.name, field.type)}
                />
              ))}

              <Button 
                type="submit" 
                loading={loading} 
                className="w-full text-lg py-4"
                style={{ backgroundColor: embedConfig?.primary_color || '#059669' }}
              >
                {embedConfig?.button_text || 'Join Waitlist'}
              </Button>

              {embedConfig?.show_position && (
                <p className="text-sm text-center text-mint-900/70 dark:text-gray-400">
                  You'll be #{(projectInfo.total_signups + 1).toLocaleString()} on the list
                </p>
              )}

              <p className="text-center text-sm text-mint-900/70 dark:text-gray-400">
                Join <strong>{projectInfo.total_signups.toLocaleString()}</strong> others already on the list
              </p>
            </form>
          </Card>
        </motion.div>

        {!isEmbedded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 grid md:grid-cols-3 gap-6"
          >
          {[
            { icon: CheckCircle, text: 'Early Access' },
            { icon: Users, text: 'Exclusive Community' },
            { icon: Mail, text: 'Priority Support' },
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <Card className="text-center bg-white dark:bg-gray-800">
                <div className="w-12 h-12 bg-mint-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-mint-900 dark:text-gray-100">{feature.text}</p>
              </Card>
            </motion.div>
          ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
