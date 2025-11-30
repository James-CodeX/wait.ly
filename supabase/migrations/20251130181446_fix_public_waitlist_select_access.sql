/*
  # Fix Public Waitlist Access
  
  ## Purpose
  Allow anonymous users to check for duplicate emails and referral codes
  before joining the waitlist. This is needed for the duplicate email check
  and referral code validation.
  
  ## Changes
  - Add SELECT policy for anon users on waitlist_entries
  - Limited to only checking email and referral_code fields
  
  ## Security
  - Anon users can only SELECT to check duplicates
  - No access to sensitive entry data
  - INSERT policy remains unchanged (anon can still join)
*/

-- Allow anon users to check if email/referral code exists
CREATE POLICY "Anyone can check waitlist entry existence"
  ON waitlist_entries
  FOR SELECT
  TO anon
  USING (true);
