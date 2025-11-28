import { supabase } from '../lib/supabase';

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProject(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createProject(name: string, description?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        owner_id: user.id,
        name,
        description,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(id: string, updates: { name?: string; description?: string }) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getWaitlistEntries(projectId: string) {
  const { data, error } = await supabase
    .from('waitlist_entries')
    .select('*')
    .eq('project_id', projectId)
    .order('position', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createWaitlistEntry(
  projectId: string,
  name: string,
  email: string,
  customFields?: Record<string, any>
) {
  const { data, error } = await supabase
    .from('waitlist_entries')
    .insert([
      {
        project_id: projectId,
        name,
        email,
        custom_fields: customFields,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateWaitlistEntry(
  id: string,
  updates: {
    name?: string;
    email?: string;
    position?: number;
    status?: string;
    custom_fields?: Record<string, any>;
  }
) {
  const { data, error } = await supabase
    .from('waitlist_entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteWaitlistEntry(id: string) {
  const { error } = await supabase
    .from('waitlist_entries')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getAnalyticsEvents(projectId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('analytics_events')
    .select('*')
    .eq('project_id', projectId)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createAnalyticsEvent(
  projectId: string,
  eventType: string,
  source?: string,
  metadata?: Record<string, any>,
  entryId?: string
) {
  const { data, error } = await supabase
    .from('analytics_events')
    .insert([
      {
        project_id: projectId,
        entry_id: entryId,
        event_type: eventType,
        source,
        metadata,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getEmbedConfiguration(projectId: string) {
  const { data, error } = await supabase
    .from('embed_configurations')
    .select('*')
    .eq('project_id', projectId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertEmbedConfiguration(
  projectId: string,
  config: {
    heading?: string;
    description?: string;
    button_text?: string;
    success_message?: string;
    primary_color?: string;
    secondary_color?: string;
    show_position?: boolean;
    show_logo?: boolean;
    logo_url?: string;
    custom_css?: string;
    widget_type?: string;
  }
) {
  const { data, error } = await supabase
    .from('embed_configurations')
    .upsert(
      {
        project_id: projectId,
        ...config,
      },
      {
        onConflict: 'project_id',
      }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateProfile(updates: { name?: string; email?: string }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
