
-- Create project_status enum
CREATE TYPE public.project_status AS ENUM ('planejado', 'em_andamento', 'concluido');

-- Create project_type enum
CREATE TYPE public.project_type AS ENUM ('residencial', 'comercial', 'misto');

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status project_status NOT NULL DEFAULT 'planejado',
  project_type project_type NOT NULL DEFAULT 'residencial',
  location TEXT,
  city TEXT,
  state TEXT,
  year INTEGER,
  built_area NUMERIC,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public can view active projects
CREATE POLICY "Projetos são visíveis por todos"
  ON public.projects FOR SELECT TO public
  USING (true);

-- Admins can insert
CREATE POLICY "Admins podem inserir projetos"
  ON public.projects FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update
CREATE POLICY "Admins podem atualizar projetos"
  ON public.projects FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete
CREATE POLICY "Admins podem deletar projetos"
  ON public.projects FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Add realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
