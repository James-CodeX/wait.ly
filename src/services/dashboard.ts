import { supabase } from '../lib/supabase';

export interface DashboardStats {
  totalSignups: number;
  todaySignups: number;
  weekSignups: number;
}

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

export const dashboardService = {
  async getStats(projectId: string): Promise<DashboardStats> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get total signups
    const { count: totalSignups, error: totalError } = await supabase
      .from('waitlist_entries')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId);

    if (totalError) throw totalError;

    // Get today's signups
    const { count: todaySignups, error: todayError } = await supabase
      .from('waitlist_entries')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .gte('created_at', todayStart.toISOString());

    if (todayError) throw todayError;

    // Get this week's signups
    const { count: weekSignups, error: weekError } = await supabase
      .from('waitlist_entries')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .gte('created_at', weekStart.toISOString());

    if (weekError) throw weekError;

    return {
      totalSignups: totalSignups || 0,
      todaySignups: todaySignups || 0,
      weekSignups: weekSignups || 0,
    };
  },

  async getRecentEntries(projectId: string, limit: number = 10): Promise<WaitlistEntry[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('waitlist_entries')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },
};
