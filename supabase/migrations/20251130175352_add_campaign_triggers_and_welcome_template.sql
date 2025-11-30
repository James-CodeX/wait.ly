/*
  # Add Campaign Triggers and Welcome Template
  
  ## Description
  Add support for automatic/manual campaign triggers and create a default welcome template.
  
  ## Changes
  
  ### 1. Email Campaigns Table Updates
    - Add `trigger_type` column: 'manual' or 'automatic'
    - Add `trigger_event` column: which event triggers the campaign (e.g., 'on_join', 'on_position_change')
    - Add `is_active` column: whether automatic campaigns are enabled
  
  ### 2. Email Templates Table Updates
    - Make project_id nullable for system templates
  
  ### 3. System Templates
    - Create a default welcome template available to all projects
  
  ## Security
    - Maintain existing RLS policies
    - System templates are read-only for users
*/

-- Add new columns to email_campaigns
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'email_campaigns' AND column_name = 'trigger_type'
  ) THEN
    ALTER TABLE email_campaigns 
    ADD COLUMN trigger_type varchar(20) NOT NULL DEFAULT 'manual',
    ADD COLUMN trigger_event varchar(50),
    ADD COLUMN is_active boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Add index for active automatic campaigns
CREATE INDEX IF NOT EXISTS email_campaigns_trigger_type_idx ON email_campaigns(trigger_type, is_active) 
WHERE trigger_type = 'automatic' AND is_active = true;

-- Make project_id nullable in email_templates for system templates
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'email_templates' 
    AND column_name = 'project_id' 
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE email_templates 
    ALTER COLUMN project_id DROP NOT NULL;
  END IF;
END $$;

-- Create a system welcome template (global, not tied to any project)
-- This will be available as a starting template for all users
INSERT INTO email_templates (
  id,
  project_id,
  name,
  subject,
  body,
  type,
  is_system
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  NULL,
  'Welcome to Waitlist',
  'Welcome to {{waitlist_name}} - You''re #{{position}}!',
  'Hi {{name}},

Thank you for joining {{waitlist_name}}!

We''re excited to have you on board. You''re currently at position #{{position}} on our waitlist.

We''ll keep you updated on your progress and notify you as soon as we''re ready to welcome you.

What happens next?
• We''ll send you updates as your position moves up
• You''ll be among the first to know when we launch
• You can refer friends to move up faster

Stay tuned for more updates!

Best regards,
The {{waitlist_name}} Team',
  'welcome',
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  subject = EXCLUDED.subject,
  body = EXCLUDED.body,
  type = EXCLUDED.type,
  is_system = EXCLUDED.is_system;

-- Update RLS policies for email_templates to allow reading system templates
DROP POLICY IF EXISTS "Users can view templates for owned projects" ON email_templates;

CREATE POLICY "Users can view templates for owned projects"
  ON email_templates
  FOR SELECT
  TO authenticated
  USING (
    is_system = true OR
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
    )
  );

-- Users cannot modify system templates
DROP POLICY IF EXISTS "Users can update templates for owned projects" ON email_templates;

CREATE POLICY "Users can update templates for owned projects"
  ON email_templates
  FOR UPDATE
  TO authenticated
  USING (
    is_system = false AND
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
    )
  );

-- Add comments for documentation
COMMENT ON COLUMN email_campaigns.trigger_type IS 'Type of campaign trigger: manual or automatic';
COMMENT ON COLUMN email_campaigns.trigger_event IS 'Event that triggers automatic campaigns: on_join, on_position_change, etc.';
COMMENT ON COLUMN email_campaigns.is_active IS 'Whether automatic campaign is currently active';
COMMENT ON COLUMN email_templates.is_system IS 'System-provided templates available to all users (read-only)';
