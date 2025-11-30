/*
  # Enable Public Access for Waitlist Forms

  ## Purpose
  Allow anonymous users to:
  - View project information (name, description, signup count)
  - View embed configurations (styling, customization)
  - View enabled custom fields
  - Create waitlist entries (join waitlist)

  ## Security
  - Only SELECT access for anon on projects, embed_configurations, custom_fields
  - Only INSERT access for anon on waitlist_entries
  - No UPDATE or DELETE permissions for anon
  - Authenticated users maintain full control over their projects
*/

-- =====================================================
-- PUBLIC READ ACCESS FOR PROJECTS
-- =====================================================

-- Allow anonymous users to read basic project info
CREATE POLICY "Anyone can view project info for public waitlists"
  ON projects FOR SELECT
  TO anon
  USING (true);

-- =====================================================
-- PUBLIC READ ACCESS FOR EMBED CONFIGURATIONS
-- =====================================================

-- Policy already exists and allows anon read access
-- No changes needed

-- =====================================================
-- PUBLIC READ ACCESS FOR CUSTOM FIELDS
-- =====================================================

-- Policy already exists for viewing enabled fields
-- No changes needed

-- =====================================================
-- PUBLIC INSERT ACCESS FOR WAITLIST ENTRIES
-- =====================================================

-- Policy already exists allowing anon to insert
-- No changes needed

-- =====================================================
-- NOTES
-- =====================================================

-- The following tables now have appropriate public access:
-- 1. projects: anon can SELECT (read project name, description, signup count)
-- 2. embed_configurations: anon can SELECT (already had this policy)
-- 3. custom_fields: anon can SELECT enabled fields only (already had this policy)
-- 4. waitlist_entries: anon can INSERT only (already had this policy)

-- Project owners maintain full CRUD on their own data through existing policies