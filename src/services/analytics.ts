import { supabase } from '../lib/supabase';

export interface AnalyticsStats {
  totalSignups: number;
  thisWeek: number;
  conversionRate: number;
  referralRate: number;
}

export interface SignupDataPoint {
  date: string;
  signups: number;
}

export interface SourceData {
  name: string;
  value: number;
}

export interface DailySignup {
  day: string;
  count: number;
}

export const analyticsService = {
  async getStats(projectId: string, timeFilter: 'week' | 'month' | 'all'): Promise<AnalyticsStats> {
    const now = new Date();
    let dateFilter = '';

    if (timeFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = weekAgo.toISOString();
    } else if (timeFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = monthAgo.toISOString();
    }

    // Get total signups
    const totalQuery = supabase
      .from('waitlist_entries')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId);

    if (dateFilter) {
      totalQuery.gte('created_at', dateFilter);
    }

    const { count: totalSignups } = await totalQuery;

    // Get this week signups
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const { count: thisWeek } = await supabase
      .from('waitlist_entries')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .gte('created_at', weekAgo.toISOString());

    // Get entries with referrals
    const { count: totalEntries } = await supabase
      .from('waitlist_entries')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId);

    const { count: referredEntries } = await supabase
      .from('waitlist_entries')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .not('referred_by', 'is', null);

    const referralRate = totalEntries ? ((referredEntries || 0) / totalEntries) * 100 : 0;

    // Calculate conversion rate (entries that opened emails)
    const { data: campaigns } = await supabase
      .from('email_campaigns')
      .select('id')
      .eq('project_id', projectId);

    const campaignIds = campaigns?.map(c => c.id) || [];
    
    const { count: emailOpens } = await supabase
      .from('email_events')
      .select('id', { count: 'exact', head: true })
      .eq('event_type', 'opened')
      .in('campaign_id', campaignIds);

    const conversionRate = totalSignups ? ((emailOpens || 0) / (totalSignups || 1)) * 100 : 0;

    return {
      totalSignups: totalSignups || 0,
      thisWeek: thisWeek || 0,
      conversionRate: Math.min(conversionRate, 100),
      referralRate: Math.min(referralRate, 100),
    };
  },

  async getSignupsOverTime(projectId: string, timeFilter: 'week' | 'month' | 'all'): Promise<SignupDataPoint[]> {
    const now = new Date();
    let startDate: Date;
    let days: number;

    if (timeFilter === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      days = 7;
    } else if (timeFilter === 'month') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      days = 30;
    } else {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      days = 90;
    }

    const { data: entries } = await supabase
      .from('waitlist_entries')
      .select('created_at')
      .eq('project_id', projectId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Group by date
    const dateMap = new Map<string, number>();
    
    // Initialize all dates with 0
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, 0);
    }

    // Count signups per date
    entries?.forEach((entry: { created_at: string }) => {
      const dateStr = entry.created_at.split('T')[0];
      dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
    });

    // Convert to array and format
    return Array.from(dateMap.entries())
      .map(([date, signups]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        signups,
      }))
      .slice(-days);
  },

  async getDailySignups(projectId: string, days: number = 7): Promise<DailySignup[]> {
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const { data: entries } = await supabase
      .from('waitlist_entries')
      .select('created_at')
      .eq('project_id', projectId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Group by day of week
    const dayMap = new Map<string, number>();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Initialize all days
    dayNames.forEach(day => dayMap.set(day, 0));

    // Count by day
    entries?.forEach((entry: { created_at: string }) => {
      const date = new Date(entry.created_at);
      const dayName = dayNames[date.getDay()];
      dayMap.set(dayName, (dayMap.get(dayName) || 0) + 1);
    });

    return dayNames.map(day => ({
      day,
      count: dayMap.get(day) || 0,
    }));
  },

  async getTrafficSources(projectId: string): Promise<SourceData[]> {
    const { data: events } = await supabase
      .from('analytics_events')
      .select('source')
      .eq('project_id', projectId)
      .eq('event_type', 'signup')
      .not('source', 'is', null);

    const sourceMap = new Map<string, number>();

    // Count by source
    events?.forEach((event: { source?: string | null }) => {
      const source = event.source || 'Direct';
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
    });

    // If no analytics events, return default/empty
    if (sourceMap.size === 0) {
      return [{ name: 'Direct', value: 1 }];
    }

    return Array.from(sourceMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 sources
  },
};
