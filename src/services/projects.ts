import { supabase } from '../lib/supabase';

export interface Project {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  total_signups: number;
  created_at: string;
  updated_at: string;
}

export const projectsService = {
  // Get all projects for the current user
  async getProjects(): Promise<Project[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },

  // Get a single project by ID
  async getProject(projectId: string): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Create a new project
  async createProject(name: string, description: string): Promise<Project> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        owner_id: user.id,
        name,
        description,
        total_signups: 0,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Create default embed configuration
    await supabase
      .from('embed_configurations')
      .insert({
        project_id: data.id,
        heading: 'Join Our Waitlist',
        description: 'Be the first to know when we launch. Join our exclusive waitlist!',
        button_text: 'Join Waitlist',
        success_message: 'Successfully joined the waitlist!',
        primary_color: '#059669',
        secondary_color: '#ECFDF5',
        show_position: true,
        show_logo: true,
        logo_url: null,
        custom_css: null,
        widget_type: 'inline',
      });

    return data;
  },

  // Update a project
  async updateProject(projectId: string, updates: Partial<Pick<Project, 'name' | 'description'>>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Delete a project
  async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      throw error;
    }
  },
};
