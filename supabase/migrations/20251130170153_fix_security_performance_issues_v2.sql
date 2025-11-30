/*
  # Fix Security and Performance Issues

  ## Issues Addressed
  1. Add missing indexes on foreign keys
  2. Optimize RLS policies to use (select auth.uid()) instead of auth.uid()
  3. Fix function search paths
  4. Fix multiple permissive policies on custom_fields

  ## Changes
  - Add indexes for analytics_events.entry_id, email_campaigns.template_id, waitlist_entries.referred_by
  - Recreate all RLS policies with optimized auth function calls
  - Set search_path on all functions to prevent security issues
*/

-- =====================================================
-- ADD MISSING INDEXES ON FOREIGN KEYS
-- =====================================================

CREATE INDEX IF NOT EXISTS analytics_events_entry_id_idx ON analytics_events(entry_id);
CREATE INDEX IF NOT EXISTS email_campaigns_template_id_idx ON email_campaigns(template_id);
CREATE INDEX IF NOT EXISTS waitlist_entries_referred_by_idx ON waitlist_entries(referred_by);

-- =====================================================
-- FIX FUNCTION SEARCH PATHS
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_project_signups()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE projects
        SET total_signups = total_signups + 1
        WHERE id = NEW.project_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE projects
        SET total_signups = total_signups - 1
        WHERE id = OLD.project_id;
    END IF;
    RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_waitlist_position()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.position IS NULL THEN
        SELECT COALESCE(MAX(position), 0) + 1
        INTO NEW.position
        FROM waitlist_entries
        WHERE project_id = NEW.project_id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.referral_code IS NULL THEN
        NEW.referral_code = substring(md5(random()::text || NEW.id::text) from 1 for 8);
    END IF;
    RETURN NEW;
END;
$$;

-- =====================================================
-- DROP ALL EXISTING RLS POLICIES
-- =====================================================

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Projects
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

-- Waitlist Entries
DROP POLICY IF EXISTS "Anyone can create waitlist entries" ON waitlist_entries;
DROP POLICY IF EXISTS "Project owners can view their entries" ON waitlist_entries;
DROP POLICY IF EXISTS "Project owners can update their entries" ON waitlist_entries;
DROP POLICY IF EXISTS "Project owners can delete their entries" ON waitlist_entries;

-- Embed Configurations
DROP POLICY IF EXISTS "Anyone can view embed configurations" ON embed_configurations;
DROP POLICY IF EXISTS "Project owners can create embed config" ON embed_configurations;
DROP POLICY IF EXISTS "Project owners can update embed config" ON embed_configurations;
DROP POLICY IF EXISTS "Project owners can delete embed config" ON embed_configurations;

-- Custom Fields
DROP POLICY IF EXISTS "Anyone can view enabled custom fields" ON custom_fields;
DROP POLICY IF EXISTS "Project owners can view all their custom fields" ON custom_fields;
DROP POLICY IF EXISTS "Project owners can create custom fields" ON custom_fields;
DROP POLICY IF EXISTS "Project owners can update custom fields" ON custom_fields;
DROP POLICY IF EXISTS "Project owners can delete custom fields" ON custom_fields;

-- Email Templates
DROP POLICY IF EXISTS "Project owners can view their templates" ON email_templates;
DROP POLICY IF EXISTS "Project owners can create templates" ON email_templates;
DROP POLICY IF EXISTS "Project owners can update templates" ON email_templates;
DROP POLICY IF EXISTS "Project owners can delete non-system templates" ON email_templates;

-- Email Campaigns
DROP POLICY IF EXISTS "Project owners can view their campaigns" ON email_campaigns;
DROP POLICY IF EXISTS "Project owners can create campaigns" ON email_campaigns;
DROP POLICY IF EXISTS "Project owners can update campaigns" ON email_campaigns;
DROP POLICY IF EXISTS "Project owners can delete campaigns" ON email_campaigns;

-- Email Events
DROP POLICY IF EXISTS "Project owners can view email events" ON email_events;

-- Analytics Events
DROP POLICY IF EXISTS "Anyone can create analytics events" ON analytics_events;
DROP POLICY IF EXISTS "Project owners can view their analytics" ON analytics_events;

-- Webhooks
DROP POLICY IF EXISTS "Project owners can view their webhooks" ON webhooks;
DROP POLICY IF EXISTS "Project owners can create webhooks" ON webhooks;
DROP POLICY IF EXISTS "Project owners can update webhooks" ON webhooks;
DROP POLICY IF EXISTS "Project owners can delete webhooks" ON webhooks;

-- API Keys
DROP POLICY IF EXISTS "Project owners can view their API keys" ON api_keys;
DROP POLICY IF EXISTS "Project owners can create API keys" ON api_keys;
DROP POLICY IF EXISTS "Project owners can delete API keys" ON api_keys;

-- =====================================================
-- CREATE OPTIMIZED RLS POLICIES
-- =====================================================

-- PROFILES
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- PROJECTS
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = owner_id);

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = owner_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = owner_id)
  WITH CHECK ((select auth.uid()) = owner_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = owner_id);

-- WAITLIST ENTRIES
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
      AND projects.owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Project owners can update their entries"
  ON waitlist_entries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = waitlist_entries.project_id
      AND projects.owner_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = waitlist_entries.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Project owners can delete their entries"
  ON waitlist_entries FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = waitlist_entries.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );

-- EMBED CONFIGURATIONS
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
      AND projects.owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Project owners can update embed config"
  ON embed_configurations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = embed_configurations.project_id
      AND projects.owner_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = embed_configurations.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Project owners can delete embed config"
  ON embed_configurations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = embed_configurations.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );

-- CUSTOM FIELDS (Fixed: Combined policy for authenticated users)
CREATE POLICY "Project owners can manage custom fields"
  ON custom_fields FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = custom_fields.project_id
      AND projects.owner_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = custom_fields.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Anyone can view enabled custom fields"
  ON custom_fields FOR SELECT
  TO anon
  USING (enabled = true);

-- EMAIL TEMPLATES
CREATE POLICY "Project owners can view templates"
  ON email_templates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_templates.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Project owners can create templates"
  ON email_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_templates.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Project owners can update templates"
  ON email_templates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_templates.project_id
      AND projects.owner_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_templates.project_id
      AND projects.owner_id = (select auth.uid())
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
      AND projects.owner_id = (select auth.uid())
    )
  );

-- EMAIL CAMPAIGNS
CREATE POLICY "Project owners can view campaigns"
  ON email_campaigns FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_campaigns.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Project owners can create campaigns"
  ON email_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_campaigns.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Project owners can update campaigns"
  ON email_campaigns FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_campaigns.project_id
      AND projects.owner_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_campaigns.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Project owners can delete campaigns"
  ON email_campaigns FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = email_campaigns.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );

-- EMAIL EVENTS
CREATE POLICY "Project owners can view email events"
  ON email_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM email_campaigns
      JOIN projects ON projects.id = email_campaigns.project_id
      WHERE email_campaigns.id = email_events.campaign_id
      AND projects.owner_id = (select auth.uid())
    )
  );

-- ANALYTICS EVENTS
CREATE POLICY "Anyone can create analytics events"
  ON analytics_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Project owners can view analytics"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = analytics_events.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );

-- WEBHOOKS
CREATE POLICY "Project owners can view webhooks"
  ON webhooks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = webhooks.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Project owners can create webhooks"
  ON webhooks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = webhooks.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Project owners can update webhooks"
  ON webhooks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = webhooks.project_id
      AND projects.owner_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = webhooks.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Project owners can delete webhooks"
  ON webhooks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = webhooks.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );

-- API KEYS
CREATE POLICY "Project owners can view API keys"
  ON api_keys FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = api_keys.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Project owners can create API keys"
  ON api_keys FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = api_keys.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Project owners can delete API keys"
  ON api_keys FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = api_keys.project_id
      AND projects.owner_id = (select auth.uid())
    )
  );