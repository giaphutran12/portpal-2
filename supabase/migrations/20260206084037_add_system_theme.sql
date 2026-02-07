-- Add 'system' to theme_preference CHECK constraint
ALTER TABLE public.users DROP CONSTRAINT users_theme_preference_check;
ALTER TABLE public.users ADD CONSTRAINT users_theme_preference_check CHECK (theme_preference IN ('dark', 'light', 'system'));
