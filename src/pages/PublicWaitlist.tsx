import { motion } from 'framer-motion';
import { Mail, Users, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router';
import Card from '../components/ui/Card';
import { publicWaitlistService, ProjectInfo } from '../services/publicWaitlist';
import { EmbedConfiguration, CustomField } from '../services/embed';
import EmbedWaitlistForm from '../components/EmbedWaitlistForm';

export default function PublicWaitlist() {
  const { waitlistId } = useParams<{ waitlistId: string }>();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');
  
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [embedConfig, setEmbedConfig] = useState<EmbedConfiguration | null>(null);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
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



  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-mint-50 to-white dark:from-dark-bg dark:to-dark-card">
        <p className="text-gray-600 dark:text-dark-text-muted">Loading...</p>
      </div>
    );
  }

  if (!projectInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-mint-50 to-white dark:from-dark-bg dark:to-dark-card">
        <Card className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-2">Waitlist Not Found</h2>
          <p className="text-gray-600 dark:text-dark-text-muted mb-4">
            This waitlist does not exist or has been removed.
          </p>
          {waitlistId && (
            <div className="bg-mint-50 dark:bg-dark-card rounded-lg p-4 text-left">
              <p className="text-sm text-gray-600 dark:text-dark-text-muted mb-2">
                <strong className="text-gray-900 dark:text-dark-text">Project ID:</strong>
              </p>
              <code className="text-xs text-mint-600 dark:text-mint-400 break-all">{waitlistId}</code>
            </div>
          )}
          <p className="text-sm text-gray-600 dark:text-dark-text-muted mt-4">
            If you're the owner, make sure you've created a project and are using the correct embed URL from your dashboard.
          </p>
        </Card>
      </div>
    );
  }

  // If embedded, show only the form component
  if (isEmbedded && projectInfo) {
    return (
      <EmbedWaitlistForm 
        projectInfo={projectInfo}
        embedConfig={embedConfig}
        customFields={customFields}
        waitlistId={waitlistId!}
        referralCode={referralCode}
      />
    );
  }

  // Full public page with features
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-mint-50 to-white dark:from-dark-bg dark:to-dark-card">
      {embedConfig?.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: embedConfig.custom_css }} />
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
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
            ) : embedConfig ? (
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: embedConfig.primary_color }}
              >
                <Users className="w-10 h-10 text-white" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-mint-600 flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
            )}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-dark-text">{projectInfo.name}</h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-dark-text mb-4"
          >
            {embedConfig?.heading || projectInfo.description || 'Join Our Waitlist'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 dark:text-dark-text-muted"
          >
            {embedConfig?.description || 'Be the first to know when we launch. Join our exclusive waitlist!'}
          </motion.p>
        </div>

        <EmbedWaitlistForm 
          projectInfo={projectInfo}
          embedConfig={embedConfig}
          customFields={customFields}
          waitlistId={waitlistId!}
          referralCode={referralCode}
        />

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
              <Card className="text-center bg-white dark:bg-dark-card">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: embedConfig?.primary_color || '#059669' }}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-gray-900 dark:text-dark-text">{feature.text}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
