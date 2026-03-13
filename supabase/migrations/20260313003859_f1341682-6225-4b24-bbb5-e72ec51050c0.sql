
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings são visíveis por todos" ON public.site_settings
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins podem inserir settings" ON public.site_settings
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem atualizar settings" ON public.site_settings
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar settings" ON public.site_settings
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed default values
INSERT INTO public.site_settings (key, value) VALUES
  ('whatsapp', '5500000000000'),
  ('phone', '5500000000000'),
  ('email', 'contato@prospera.com.br');
