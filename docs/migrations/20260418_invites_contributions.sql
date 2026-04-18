-- ==========================================
-- Migration: Invite links + Contributions
-- Date: 2026-04-18
-- Apply: paste toàn bộ vào Supabase SQL Editor rồi Run.
-- ==========================================

-- ===== INVITE LINKS =====
CREATE TABLE IF NOT EXISTS public.invite_links (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code       TEXT UNIQUE NOT NULL,
  role       public.user_role_enum NOT NULL,
  max_uses   INT NOT NULL DEFAULT 1 CHECK (max_uses > 0),
  used_count INT NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invite_links_code ON public.invite_links(code);

ALTER TABLE public.invite_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage invite_links" ON public.invite_links;
CREATE POLICY "Admins manage invite_links" ON public.invite_links
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ===== CONTRIBUTIONS =====
DO $$ BEGIN
  CREATE TYPE public.contribution_status AS ENUM ('pending','approved','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.contribution_field AS ENUM (
    'full_name','other_names','gender',
    'birth_year','birth_month','birth_day',
    'death_year','death_month','death_day',
    'is_deceased','generation','is_in_law',
    'note','avatar_url'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.contributions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id            UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
  field                public.contribution_field NOT NULL,
  new_value            TEXT,
  note                 TEXT,
  status               public.contribution_status NOT NULL DEFAULT 'pending',
  contributor_user_id  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  contributor_name     TEXT,
  contributor_email    TEXT,
  reviewed_by          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at          TIMESTAMPTZ,
  review_note          TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contributions_status   ON public.contributions(status);
CREATE INDEX IF NOT EXISTS idx_contributions_person   ON public.contributions(person_id);
CREATE INDEX IF NOT EXISTS idx_contributions_created  ON public.contributions(created_at DESC);

-- updated_at trigger
DROP TRIGGER IF EXISTS tr_contributions_updated_at ON public.contributions;
CREATE TRIGGER tr_contributions_updated_at
  BEFORE UPDATE ON public.contributions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

-- Logged-in users can submit (the code path uses service_role for anonymous contributors)
DROP POLICY IF EXISTS "Authenticated can submit contributions" ON public.contributions;
CREATE POLICY "Authenticated can submit contributions" ON public.contributions
  FOR INSERT TO authenticated
  WITH CHECK (contributor_user_id = auth.uid());

-- Only admin can read / modify
DROP POLICY IF EXISTS "Admins read contributions" ON public.contributions;
CREATE POLICY "Admins read contributions" ON public.contributions
  FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins update contributions" ON public.contributions;
CREATE POLICY "Admins update contributions" ON public.contributions
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins delete contributions" ON public.contributions;
CREATE POLICY "Admins delete contributions" ON public.contributions
  FOR DELETE TO authenticated USING (public.is_admin());

-- ===== Reload PostgREST cache =====
NOTIFY pgrst, 'reload schema';

-- ===== Verify =====
SELECT 'invite_links'  AS tbl, COUNT(*) FROM pg_policies WHERE tablename='invite_links'
UNION ALL
SELECT 'contributions', COUNT(*) FROM pg_policies WHERE tablename='contributions';
