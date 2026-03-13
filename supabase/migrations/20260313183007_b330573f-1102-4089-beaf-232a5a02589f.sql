-- Assign admin role to andreguimel@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('15530c3a-cdaa-4b9c-8750-47798a742606', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Create trigger to auto-assign admin to first user if no admin exists
CREATE OR REPLACE FUNCTION public.handle_first_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_first_admin_assignment
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_first_admin();