import { supabase } from '../lib/supabase';

export interface WaitlistEntry {
  id: string;
  project_id: string;
  name: string;
  email: string;
  position: number;
  status: string;
  custom_fields: Record<string, any> | null;
  referral_code: string | null;
  referred_by: string | null;
  created_at: string;
  updated_at: string;
}

export const waitlistService = {
  async getEntries(
    projectId: string,
    limit: number = 10,
    offset: number = 0,
    searchQuery?: string
  ): Promise<{ entries: WaitlistEntry[]; total: number }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let query = supabase
      .from('waitlist_entries')
      .select('*', { count: 'exact' })
      .eq('project_id', projectId)
      .order('position', { ascending: true })
      .range(offset, offset + limit - 1);

    // Apply search filter if provided
    if (searchQuery && searchQuery.trim()) {
      query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      entries: data || [],
      total: count || 0,
    };
  },

  async deleteEntry(entryId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('waitlist_entries')
      .delete()
      .eq('id', entryId);

    if (error) throw error;
  },

  async updateEntry(
    entryId: string,
    updates: {
      name?: string;
      email?: string;
      status?: string;
      custom_fields?: Record<string, any>;
    }
  ): Promise<WaitlistEntry> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('waitlist_entries')
      .update(updates)
      .eq('id', entryId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAllEntries(projectId: string): Promise<WaitlistEntry[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('waitlist_entries')
      .select('*')
      .eq('project_id', projectId)
      .order('position', { ascending: true });

    if (error) throw error;
    return data || [];
  },
};
