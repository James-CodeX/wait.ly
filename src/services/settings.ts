import { supabase } from '../lib/supabase';

export interface ApiKey {
  id: string;
  project_id: string;
  key: string;
  name: string;
  permissions: string[];
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface Webhook {
  id: string;
  project_id: string;
  url: string;
  events: string[];
  secret: string | null;
  enabled: boolean;
  last_triggered_at: string | null;
  created_at: string;
  updated_at: string;
}

export const settingsService = {
  // API Keys Management
  async getApiKeys(projectId: string): Promise<ApiKey[]> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createApiKey(projectId: string, name: string): Promise<ApiKey> {
    const key = `wl_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        project_id: projectId,
        key,
        name,
        permissions: ['read', 'write'],
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteApiKey(id: string): Promise<void> {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Webhooks Management
  async getWebhooks(projectId: string): Promise<Webhook[]> {
    const { data, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createWebhook(projectId: string, url: string, events: string[]): Promise<Webhook> {
    const secret = `whsec_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    const { data, error } = await supabase
      .from('webhooks')
      .insert({
        project_id: projectId,
        url,
        events,
        secret,
        enabled: true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateWebhook(id: string, updates: { url?: string; events?: string[]; enabled?: boolean }): Promise<void> {
    const { error } = await supabase
      .from('webhooks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  },

  async deleteWebhook(id: string): Promise<void> {
    const { error } = await supabase
      .from('webhooks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Project Danger Zone
  async clearAllEntries(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('waitlist_entries')
      .delete()
      .eq('project_id', projectId);

    if (error) throw error;

    // Reset total_signups counter
    const { error: updateError } = await supabase
      .from('projects')
      .update({ total_signups: 0 })
      .eq('id', projectId);

    if (updateError) throw updateError;
  },

  async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  },
};
