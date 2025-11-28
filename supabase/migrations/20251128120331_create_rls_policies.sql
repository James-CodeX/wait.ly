/*
  # Row Level Security Policies

  ## Security Model
  This migration creates comprehensive RLS policies for all tables following the principle of least privilege.

  ## Policy Overview
  1. **profiles** - Users can read/update their own profile
  2. **projects** - Users can CRUD their own projects
  3. **waitlist_entries** - Public can create, owners can manage
  4. **embed_configurations** - Public read, owners manage
  5. **custom_fields** - Public read enabled, owners manage
  6. **email_templates** - Owners only
  7. **email_campaigns** - Owners only
  8. **email_events** - Owners read, system creates
  9. **analytics_events** - Public create, owners read
  10. **webhooks** - Owners only
  11. **api_keys** - Owners only
*/

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- PROJECTS POLICIES
-- =====================================================

CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- =====================================================
-- WAITLIST ENTRIES POLICIES
-- =====================================================

CREATE POLICY "Anyone can create waitlist entries"
  ON waitlist_entries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Project owners can view their entries"
  ON waitlist_entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = waitlist_entries.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can update their entries"
  ON waitlist_entries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = waitlist_entries.project_id
      AND projects.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = waitlist_entries.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can delete their entries"
  ON waitlist_entries FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = waitlist_entries.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- =====================================================
-- EMBED CONFIGURATIONS POLICIES
-- =====================================================

CREATE POLICY "Anyone can view embed configurations"
  ON embed_configurations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Project owners can create embed config"
  ON embed_configurations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = embed_configurations.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can update embed config"
  ON embed_configurations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = embed_configurations.project_id
      AND projects.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = embed_configurations.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can delete embed config"
  ON embed_configurations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = embed_configurations.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- =====================================================
-- CUSTOM FIELDS POLICIES
-- =====================================================

CREATE POLICY "Anyone can view enabled custom fields"
  ON custom_fields FOR SELECT
  TO anon, authenticated
  USING (enabled = true);

CREATE POLICY "Project owners can view all their custom fields"
  ON custom_fields FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = custom_fields.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can create custom fields"
  ON custom_fields FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = custom_fields.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can update custom fields"
  ON custom_fields FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = custom_fields.project_id
      AND projects.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = custom_fields.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can delete custom fields"
  ON custom_fields FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = custom_fields.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- =====================================================
-- EMAIL TEMPLATES POLICIES
-- =====================================================

CREATE POLICY "Project owners can view their templates"
  ON email_templates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_templates.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can create templates"
  ON email_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_templates.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can update templates"
  ON email_templates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_templates.project_id
      AND projects.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_templates.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can delete non-system templates"
  ON email_templates FOR DELETE
  TO authenticated
  USING (
    is_system = false
    AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_templates.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- =====================================================
-- EMAIL CAMPAIGNS POLICIES
-- =====================================================

CREATE POLICY "Project owners can view their campaigns"
  ON email_campaigns FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_campaigns.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can create campaigns"
  ON email_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_campaigns.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can update campaigns"
  ON email_campaigns FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_campaigns.project_id
      AND projects.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_campaigns.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can delete campaigns"
  ON email_campaigns FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_campaigns.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- =====================================================
-- EMAIL EVENTS POLICIES
-- =====================================================

CREATE POLICY "Project owners can view email events"
  ON email_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM email_campaigns
      JOIN projects ON projects.id = email_campaigns.project_id
      WHERE email_campaigns.id = email_events.campaign_id
      AND projects.owner_id = auth.uid()
    )
  );

-- =====================================================
-- ANALYTICS EVENTS POLICIES
-- =====================================================

CREATE POLICY "Anyone can create analytics events"
  ON analytics_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Project owners can view their analytics"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = analytics_events.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- =====================================================
-- WEBHOOKS POLICIES
-- =====================================================

CREATE POLICY "Project owners can view their webhooks"
  ON webhooks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = webhooks.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can create webhooks"
  ON webhooks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = webhooks.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can update webhooks"
  ON webhooks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = webhooks.project_id
      AND projects.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = webhooks.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can delete webhooks"
  ON webhooks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = webhooks.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- =====================================================
-- API KEYS POLICIES
-- =====================================================

CREATE POLICY "Project owners can view their API keys"
  ON api_keys FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = api_keys.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can create API keys"
  ON api_keys FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = api_keys.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can delete API keys"
  ON api_keys FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = api_keys.project_id
      AND projects.owner_id = auth.uid()
    )
  );