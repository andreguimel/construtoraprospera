-- Criar tabela de imóveis
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  neighborhood TEXT,
  property_type TEXT NOT NULL DEFAULT 'casa',
  transaction_type TEXT NOT NULL DEFAULT 'venda',
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  area DECIMAL(10,2),
  garage_spots INTEGER DEFAULT 0,
  condominium_fee DECIMAL(10,2),
  iptu DECIMAL(10,2),
  accepts_pets BOOLEAN DEFAULT false,
  furnished BOOLEAN DEFAULT false,
  image_url TEXT,
  images TEXT[],
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Imóveis são visíveis por todos"
  ON public.properties
  FOR SELECT
  USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();