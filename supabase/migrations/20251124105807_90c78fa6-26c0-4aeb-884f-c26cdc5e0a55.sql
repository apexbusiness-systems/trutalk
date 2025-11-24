-- Production Security Hardening: Fix RLS Policies for Data Protection

-- 1. CRITICAL: Restrict profiles table to authenticated users only
-- Remove the overly permissive "Users can view all profiles" policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create more restrictive policies for profiles
CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- 2. CRITICAL: Restrict community posts to authenticated users only
DROP POLICY IF EXISTS "Anyone can view community posts" ON public.community_posts;

CREATE POLICY "Authenticated users can view community posts"
  ON public.community_posts
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Restrict challenges to authenticated users (optional based on business requirements)
DROP POLICY IF EXISTS "Anyone can view challenges" ON public.challenges;

CREATE POLICY "Authenticated users can view challenges"
  ON public.challenges
  FOR SELECT
  TO authenticated
  USING (true);

-- 4. Add database indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON public.profiles(display_name);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_post_type ON public.community_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON public.matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_matched_user_id ON public.matches(matched_user_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_voice_clips_user_id ON public.voice_clips(user_id);
CREATE INDEX IF NOT EXISTS idx_call_history_caller_id ON public.call_history(caller_id);
CREATE INDEX IF NOT EXISTS idx_call_history_receiver_id ON public.call_history(receiver_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON public.user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge_id ON public.user_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON public.streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_last_active_date ON public.streaks(last_active_date);

-- 5. Add updated_at trigger to profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Add updated_at trigger to community_posts table
DROP TRIGGER IF EXISTS update_community_posts_updated_at ON public.community_posts;
CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();