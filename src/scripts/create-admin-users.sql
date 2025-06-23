-- Después de crear un usuario en Supabase Auth Dashboard, 
-- actualizar su rol a admin con este script:
-- Reemplaza 'admin@farmacia.com' con el email del usuario que quieres hacer admin

UPDATE public.user_profiles 
SET role = 'admin', full_name = 'Administrador Principal'
WHERE email = 'admin@farmacia.com';

-- Verificar que el usuario fue actualizado correctamente
SELECT id, email, role, full_name, created_at 
FROM public.user_profiles 
WHERE role = 'admin';
