import { supabase } from '../lib/supabase';

export interface EmbedConfiguration {
  id: string;
  project_id: string;
  heading: string;
  description: string | null;
  button_text: string;
  success_message: string;
  primary_color: string;
  secondary_color: string | null;
  show_position: boolean;
  show_logo: boolean;
  logo_url: string | null;
  custom_css: string | null;
  widget_type: string;
  created_at: string;
  updated_at: string;
}

export interface CustomField {
  id: string;
  project_id: string;
  name: string;
  type: string;
  placeholder: string | null;
  required: boolean;
  enabled: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export const embedService = {
  async getConfiguration(projectId: string): Promise<EmbedConfiguration | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('embed_configurations')
      .select('*')
      .eq('project_id', projectId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async upsertConfiguration(
    projectId: string,
    config: Partial<Omit<EmbedConfiguration, 'id' | 'project_id' | 'created_at' | 'updated_at'>>
  ): Promise<EmbedConfiguration> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

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
  },

  async getCustomFields(projectId: string): Promise<CustomField[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('custom_fields')
      .select('*')
      .eq('project_id', projectId)
      .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async addCustomField(
    projectId: string,
    field: {
      name: string;
      type: string;
      placeholder?: string;
      required?: boolean;
      enabled?: boolean;
    }
  ): Promise<CustomField> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get max order value
    const { data: existingFields } = await supabase
      .from('custom_fields')
      .select('order')
      .eq('project_id', projectId)
      .order('order', { ascending: false })
      .limit(1);

    const maxOrder = existingFields?.[0]?.order ?? -1;

    const { data, error } = await supabase
      .from('custom_fields')
      .insert([
        {
          project_id: projectId,
          name: field.name,
          type: field.type,
          placeholder: field.placeholder || null,
          required: field.required ?? false,
          enabled: field.enabled ?? true,
          order: maxOrder + 1,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCustomField(
    fieldId: string,
    updates: {
      name?: string;
      type?: string;
      placeholder?: string;
      required?: boolean;
      enabled?: boolean;
      order?: number;
    }
  ): Promise<CustomField> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('custom_fields')
      .update(updates)
      .eq('id', fieldId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCustomField(fieldId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('custom_fields')
      .delete()
      .eq('id', fieldId);

    if (error) throw error;
  },
};
