import { supabase } from '../lib/supabase';

async function triggerWelcomeEmail(entryId: string): Promise<void> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const response = await fetch(`${supabaseUrl}/functions/v1/send-welcome-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ entryId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to trigger welcome email');
  }
}

export interface WaitlistEntry {
  id: string;
  project_id: string;
  name: string;
  email: string;
  position: number;
  status: string;
  custom_fields: Record<string, string> | null;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  description: string | null;
  total_signups: number;
}

export const publicWaitlistService = {
  async getProjectInfo(projectId: string): Promise<ProjectInfo | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name, description, total_signups')
      .eq('id', projectId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching project:', error);
      return null;
    }
    return data;
  },

  async joinWaitlist(
    projectId: string,
    name: string,
    email: string,
    customFields?: Record<string, string>,
    referralCode?: string
  ): Promise<WaitlistEntry> {
    // Check if email already exists for this project
    const { data: existing } = await supabase
      .from('waitlist_entries')
      .select('id')
      .eq('project_id', projectId)
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      throw new Error('Email already registered');
    }

    // Find referred_by user if referral code provided
    let referredBy = null;
    if (referralCode) {
      const { data: referrer } = await supabase
        .from('waitlist_entries')
        .select('id')
        .eq('project_id', projectId)
        .eq('referral_code', referralCode)
        .maybeSingle();

      if (referrer) {
        referredBy = referrer.id;
      }
    }

    // Get next position
    const { count } = await supabase
      .from('waitlist_entries')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId);

    const position = (count || 0) + 1;

    // Generate unique referral code
    const generateCode = () => {
      return Math.random().toString(36).substring(2, 10).toUpperCase();
    };

    let referralCodeUnique = generateCode();
    let codeExists = true;

    // Ensure unique referral code
    while (codeExists) {
      const { data } = await supabase
        .from('waitlist_entries')
        .select('id')
        .eq('referral_code', referralCodeUnique)
        .maybeSingle();

      if (!data) {
        codeExists = false;
      } else {
        referralCodeUnique = generateCode();
      }
    }

    // Create entry
    const { data, error } = await supabase
      .from('waitlist_entries')
      .insert({
        project_id: projectId,
        name,
        email,
        position,
        custom_fields: customFields || null,
        referral_code: referralCodeUnique,
        referred_by: referredBy,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating entry:', error);
      throw error;
    }

    // Trigger welcome email asynchronously (don't wait for it)
    triggerWelcomeEmail(data.id).catch(err => {
      console.error('Failed to trigger welcome email:', err);
    });

    return data;
  },

  async getEmbedConfig(projectId: string) {
    const { data, error } = await supabase
      .from('embed_configurations')
      .select('*')
      .eq('project_id', projectId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching embed config:', error);
      return null;
    }
    return data;
  },

  async getCustomFields(projectId: string) {
    const { data, error } = await supabase
      .from('custom_fields')
      .select('*')
      .eq('project_id', projectId)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching custom fields:', error);
      return [];
    }
    return data || [];
  },
};
