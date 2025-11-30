import { supabase } from '../lib/supabase';

export interface EmailTemplate {
  id: string;
  project_id: string | null;
  name: string;
  subject: string;
  body: string;
  type: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailCampaign {
  id: string;
  project_id: string;
  template_id: string | null;
  name: string;
  subject: string;
  body: string;
  status: string;
  trigger_type: 'manual' | 'automatic';
  trigger_event: string | null;
  is_active: boolean;
  recipient_filter: any | null;
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export const emailService = {
  // Email Templates
  async getTemplates(projectId: string): Promise<EmailTemplate[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .or(`project_id.eq.${projectId},is_system.eq.true`)
      .order('is_system', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createTemplate(
    projectId: string,
    template: {
      name: string;
      subject: string;
      body: string;
      type: string;
    }
  ): Promise<EmailTemplate> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('email_templates')
      .insert([
        {
          project_id: projectId,
          name: template.name,
          subject: template.subject,
          body: template.body,
          type: template.type,
          is_system: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTemplate(
    templateId: string,
    updates: {
      name?: string;
      subject?: string;
      body?: string;
      type?: string;
    }
  ): Promise<EmailTemplate> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('email_templates')
      .update(updates)
      .eq('id', templateId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTemplate(templateId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', templateId);

    if (error) throw error;
  },

  // Email Campaigns
  async getCampaigns(projectId: string): Promise<EmailCampaign[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createCampaign(
    projectId: string,
    campaign: {
      name: string;
      subject: string;
      body: string;
      template_id?: string;
      trigger_type?: 'manual' | 'automatic';
      trigger_event?: string;
      is_active?: boolean;
      recipient_filter?: any;
      scheduled_at?: string;
    }
  ): Promise<EmailCampaign> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('email_campaigns')
      .insert([
        {
          project_id: projectId,
          name: campaign.name,
          subject: campaign.subject,
          body: campaign.body,
          template_id: campaign.template_id || null,
          trigger_type: campaign.trigger_type || 'manual',
          trigger_event: campaign.trigger_event || null,
          is_active: campaign.is_active || false,
          recipient_filter: campaign.recipient_filter || null,
          scheduled_at: campaign.scheduled_at || null,
          status: 'draft',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCampaign(
    campaignId: string,
    updates: {
      name?: string;
      subject?: string;
      body?: string;
      status?: string;
      trigger_type?: 'manual' | 'automatic';
      trigger_event?: string;
      is_active?: boolean;
      recipient_filter?: any;
      scheduled_at?: string;
    }
  ): Promise<EmailCampaign> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('email_campaigns')
      .update(updates)
      .eq('id', campaignId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCampaign(campaignId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('email_campaigns')
      .delete()
      .eq('id', campaignId);

    if (error) throw error;
  },

  async sendCampaign(campaignId: string): Promise<EmailCampaign> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('email_campaigns')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', campaignId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
