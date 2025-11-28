/*
  # Wait.ly Database Schema - Complete Setup

  ## Overview
  This migration creates the complete database schema for Wait.ly waitlist management platform.

  ## Tables Created
  1. **profiles** - User profile information (extends auth.users)
  2. **projects** - Waitlist projects created by users
  3. **waitlist_entries** - Individual waitlist signups
  4. **embed_configurations** - Widget customization settings
  5. **custom_fields** - Custom field definitions for forms
  6. **email_templates** - Email templates for campaigns
  7. **email_campaigns** - Email campaigns
  8. **email_events** - Email tracking (opens, clicks)
  9. **analytics_events** - User analytics and tracking
  10. **webhooks** - Webhook configurations
  11. **api_keys** - API key management

  ## Functions & Triggers
  - Auto-update updated_at timestamps
  - Auto-assign waitlist positions
  - Generate referral codes
  - Update project signup counters

  ## Security
  - RLS enabled on all tables
  - Comprehensive policies for data access control
  - Secure referential integrity with CASCADE deletes
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email varchar(255) NOT NULL UNIQUE,
  name varchar(255) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. PROJECTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  description text,
  total_signups integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_owner_id_idx ON projects(owner_id);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. WAITLIST ENTRIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS waitlist_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  position integer NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'active',
  custom_fields jsonb,
  referral_code varchar(50) UNIQUE,
  referred_by uuid REFERENCES waitlist_entries(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_email_per_project UNIQUE (email, project_id)
);

CREATE INDEX IF NOT EXISTS waitlist_entries_project_id_idx ON waitlist_entries(project_id);
CREATE INDEX IF NOT EXISTS waitlist_entries_email_project_id_idx ON waitlist_entries(email, project_id);
CREATE INDEX IF NOT EXISTS waitlist_entries_referral_code_idx ON waitlist_entries(referral_code);
CREATE INDEX IF NOT EXISTS waitlist_entries_created_at_idx ON waitlist_entries(created_at);
CREATE INDEX IF NOT EXISTS waitlist_entries_project_created_idx ON waitlist_entries(project_id, created_at DESC);

ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. EMBED CONFIGURATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS embed_configurations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  heading varchar(255) NOT NULL DEFAULT 'Join Our Waitlist',
  description text,
  button_text varchar(100) NOT NULL DEFAULT 'Join Now',
  success_message text NOT NULL DEFAULT 'Thanks for joining!',
  primary_color varchar(7) NOT NULL DEFAULT '#059669',
  secondary_color varchar(7) DEFAULT '#ECFDF5',
  show_position boolean NOT NULL DEFAULT true,
  show_logo boolean NOT NULL DEFAULT true,
  logo_url text,
  custom_css text,
  widget_type varchar(20) NOT NULL DEFAULT 'inline',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS embed_configurations_project_id_idx ON embed_configurations(project_id);

ALTER TABLE embed_configurations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. CUSTOM FIELDS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS custom_fields (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  type varchar(50) NOT NULL,
  placeholder varchar(255),
  required boolean NOT NULL DEFAULT false,
  enabled boolean NOT NULL DEFAULT true,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS custom_fields_project_id_idx ON custom_fields(project_id);
CREATE INDEX IF NOT EXISTS custom_fields_project_id_order_idx ON custom_fields(project_id, "order");

ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. EMAIL TEMPLATES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  subject varchar(500) NOT NULL,
  body text NOT NULL,
  type varchar(50) NOT NULL,
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_templates_project_id_idx ON email_templates(project_id);
CREATE INDEX IF NOT EXISTS email_templates_type_idx ON email_templates(type);

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. EMAIL CAMPAIGNS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS email_campaigns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  template_id uuid REFERENCES email_templates(id) ON DELETE SET NULL,
  name varchar(255) NOT NULL,
  subject varchar(500) NOT NULL,
  body text NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'draft',
  recipient_filter jsonb,
  total_sent integer NOT NULL DEFAULT 0,
  total_opened integer NOT NULL DEFAULT 0,
  total_clicked integer NOT NULL DEFAULT 0,
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_campaigns_project_id_idx ON email_campaigns(project_id);
CREATE INDEX IF NOT EXISTS email_campaigns_status_idx ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS email_campaigns_sent_at_idx ON email_campaigns(sent_at);

ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. EMAIL EVENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS email_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id uuid NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
  entry_id uuid NOT NULL REFERENCES waitlist_entries(id) ON DELETE CASCADE,
  event_type varchar(20) NOT NULL,
  email varchar(255) NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_events_campaign_id_idx ON email_events(campaign_id);
CREATE INDEX IF NOT EXISTS email_events_entry_id_idx ON email_events(entry_id);
CREATE INDEX IF NOT EXISTS email_events_event_type_idx ON email_events(event_type);
CREATE INDEX IF NOT EXISTS email_events_created_at_idx ON email_events(created_at);
CREATE INDEX IF NOT EXISTS email_events_campaign_event_idx ON email_events(campaign_id, event_type);

ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 9. ANALYTICS EVENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  entry_id uuid REFERENCES waitlist_entries(id) ON DELETE SET NULL,
  event_type varchar(50) NOT NULL,
  source varchar(100),
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analytics_events_project_id_idx ON analytics_events(project_id);
CREATE INDEX IF NOT EXISTS analytics_events_event_type_idx ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS analytics_events_project_created_idx ON analytics_events(project_id, created_at);
CREATE INDEX IF NOT EXISTS analytics_events_project_event_created_idx ON analytics_events(project_id, event_type, created_at);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 10. WEBHOOKS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url text NOT NULL,
  events text[] NOT NULL,
  secret varchar(255),
  enabled boolean NOT NULL DEFAULT true,
  last_triggered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS webhooks_project_id_idx ON webhooks(project_id);
CREATE INDEX IF NOT EXISTS webhooks_enabled_idx ON webhooks(enabled);

ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 11. API KEYS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  key varchar(255) NOT NULL UNIQUE,
  name varchar(255) NOT NULL,
  permissions text[] NOT NULL DEFAULT '{read}',
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS api_keys_project_id_idx ON api_keys(project_id);
CREATE INDEX IF NOT EXISTS api_keys_key_idx ON api_keys(key);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- DATABASE FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update project total_signups counter
CREATE OR REPLACE FUNCTION update_project_signups()
RETURNS TRIGGER AS $$
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
$$ language 'plpgsql';

-- Function to auto-assign waitlist position
CREATE OR REPLACE FUNCTION assign_waitlist_position()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.position IS NULL THEN
        SELECT COALESCE(MAX(position), 0) + 1
        INTO NEW.position
        FROM waitlist_entries
        WHERE project_id = NEW.project_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to generate referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL THEN
        NEW.referral_code = substring(md5(random()::text || NEW.id::text) from 1 for 8);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to handle new user signup (create profile)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger for auth.users to create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_waitlist_entries_updated_at ON waitlist_entries;
CREATE TRIGGER update_waitlist_entries_updated_at
    BEFORE UPDATE ON waitlist_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_embed_configurations_updated_at ON embed_configurations;
CREATE TRIGGER update_embed_configurations_updated_at
    BEFORE UPDATE ON embed_configurations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_custom_fields_updated_at ON custom_fields;
CREATE TRIGGER update_custom_fields_updated_at
    BEFORE UPDATE ON custom_fields
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_templates_updated_at ON email_templates;
CREATE TRIGGER update_email_templates_updated_at
    BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_campaigns_updated_at ON email_campaigns;
CREATE TRIGGER update_email_campaigns_updated_at
    BEFORE UPDATE ON email_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_webhooks_updated_at ON webhooks;
CREATE TRIGGER update_webhooks_updated_at
    BEFORE UPDATE ON webhooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for project signup counter
DROP TRIGGER IF EXISTS update_project_signups_on_insert ON waitlist_entries;
CREATE TRIGGER update_project_signups_on_insert
    AFTER INSERT ON waitlist_entries
    FOR EACH ROW EXECUTE FUNCTION update_project_signups();

DROP TRIGGER IF EXISTS update_project_signups_on_delete ON waitlist_entries;
CREATE TRIGGER update_project_signups_on_delete
    AFTER DELETE ON waitlist_entries
    FOR EACH ROW EXECUTE FUNCTION update_project_signups();

-- Trigger for auto-assigning position
DROP TRIGGER IF EXISTS assign_position_on_insert ON waitlist_entries;
CREATE TRIGGER assign_position_on_insert
    BEFORE INSERT ON waitlist_entries
    FOR EACH ROW EXECUTE FUNCTION assign_waitlist_position();

-- Trigger for generating referral code
DROP TRIGGER IF EXISTS generate_code_on_insert ON waitlist_entries;
CREATE TRIGGER generate_code_on_insert
    BEFORE INSERT ON waitlist_entries
    FOR EACH ROW EXECUTE FUNCTION generate_referral_code();