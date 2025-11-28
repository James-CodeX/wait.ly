import { supabase } from '../lib/supabase';

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
      .single();

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
      .single();

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
        .single();

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
        .single();

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

    return data;
  },

  async getEmbedConfig(projectId: string) {
    const { data, error } = await supabase
      .from('embed_configurations')
      .select('*')
      .eq('project_id', projectId)
      .single();

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
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching custom fields:', error);
      return [];
    }
    return data || [];
  },
};
