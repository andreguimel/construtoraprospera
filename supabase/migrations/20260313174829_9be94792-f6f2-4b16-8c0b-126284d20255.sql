
-- Add is_public column with default true (all existing settings are public content)
ALTER TABLE public.site_settings ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT true;

-- Drop the old permissive SELECT policy
DROP POLICY IF EXISTS "Settings são visíveis por todos" ON public.site_settings;

-- Create new SELECT policy: public can only see is_public=true, admins see all
CREATE POLICY "Settings públicos visíveis por todos"
  ON public.site_settings FOR SELECT TO public
  USING (is_public = true);

CREATE POLICY "Admins podem ver todos os settings"
  ON public.site_settings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
