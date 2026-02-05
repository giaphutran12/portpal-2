-- PortPal Initial Schema



-- Users Table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  ilwu_local TEXT CHECK (ilwu_local IN ('500', '502', 'Other')),
  board TEXT CHECK (board IN ('A BOARD', 'B BOARD', 'C BOARD', 'T BOARD', '00 BOARD', 'R BOARD', 'UNION')),
  theme_preference TEXT DEFAULT 'light' CHECK (theme_preference IN ('dark', 'light')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  subscription_billing TEXT CHECK (subscription_billing IN ('monthly', 'annually')),
  
  sick_days_available INTEGER DEFAULT 10,
  sick_days_used INTEGER DEFAULT 0,
  sick_leave_start DATE,
  sick_leave_end DATE,
  personal_leave_available INTEGER DEFAULT 10,
  personal_leave_used INTEGER DEFAULT 0,
  personal_leave_start DATE,
  personal_leave_end DATE,
  
  xp INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  
  onboarding_completed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs Table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  differential_class TEXT NOT NULL CHECK (differential_class IN ('BASE', 'CLASS_1', 'CLASS_2', 'CLASS_3', 'CLASS_4')),
  differential_amount DECIMAL(4,2) NOT NULL,
  has_subjobs BOOLEAN DEFAULT FALSE
);

-- Subjobs Table
CREATE TABLE public.subjobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL
);

-- Locations Table
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

-- Holidays Table
CREATE TABLE public.holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date DATE NOT NULL,
  qualifying_start DATE NOT NULL,
  qualifying_end DATE NOT NULL,
  qualifying_days_required INTEGER DEFAULT 15,
  year INTEGER NOT NULL
);

-- Pay Overrides Table (PAYDIFFS)
CREATE TABLE public.pay_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job TEXT NOT NULL,
  subjob TEXT,
  location TEXT NOT NULL,
  shift_type TEXT NOT NULL CHECK (shift_type IN ('DAY', 'NIGHT', 'GRAVEYARD')),
  hours DECIMAL(4,2) NOT NULL,
  overtime_hours DECIMAL(4,2) DEFAULT 0,
  UNIQUE(job, subjob, location, shift_type)
);

-- Shifts Table
CREATE TABLE public.shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('worked', 'leave', 'vacation', 'standby', 'stat_holiday', 'day_off')),
  date DATE NOT NULL,
  
  job TEXT,
  subjob TEXT,
  location TEXT,
  shift_type TEXT CHECK (shift_type IN ('day', 'night', 'graveyard')),
  hours DECIMAL(4,2),
  rate DECIMAL(6,2),
  overtime_hours DECIMAL(4,2) DEFAULT 0,
  overtime_rate DECIMAL(6,2),
  travel_hours DECIMAL(4,2) DEFAULT 0,
  meal BOOLEAN DEFAULT FALSE,
  foreman TEXT,
  vessel TEXT,
  total_pay DECIMAL(10,2),
  
  leave_type TEXT CHECK (leave_type IN ('sick_leave', 'personal_leave', 'parental_leave')),
  will_receive_paystub BOOLEAN DEFAULT FALSE,
  
  holiday TEXT,
  qualifying_days INTEGER,
  
  notes TEXT,
  attachments TEXT[],
  points_earned INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals Table
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('weekly', 'monthly', 'yearly')),
  kind TEXT NOT NULL CHECK (kind IN ('earnings', 'hours', 'shifts', 'pension')),
  target DECIMAL(12,2) NOT NULL,
  current_value DECIMAL(12,2) DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts Table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT TRUE
);

-- Feedback Table
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  ilwu_local TEXT,
  content TEXT NOT NULL,
  images TEXT[],
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_shifts_user_id ON public.shifts(user_id);
CREATE INDEX idx_shifts_date ON public.shifts(date);
CREATE INDEX idx_shifts_user_date ON public.shifts(user_id, date);
CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_pay_overrides_lookup ON public.pay_overrides(job, subjob, location, shift_type);

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pay_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Users: own profile only
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Shifts: own shifts only
CREATE POLICY "Users can view own shifts" ON public.shifts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own shifts" ON public.shifts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own shifts" ON public.shifts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own shifts" ON public.shifts FOR DELETE USING (auth.uid() = user_id);

-- Goals: own goals only
CREATE POLICY "Users can view own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- Reference tables: read-only for authenticated
CREATE POLICY "Jobs readable" ON public.jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Subjobs readable" ON public.subjobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Locations readable" ON public.locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Holidays readable" ON public.holidays FOR SELECT TO authenticated USING (true);
CREATE POLICY "Pay overrides readable" ON public.pay_overrides FOR SELECT TO authenticated USING (true);

-- Posts: read-only published
CREATE POLICY "Posts readable" ON public.posts FOR SELECT TO authenticated USING (is_published = true);

-- Feedback
CREATE POLICY "Users can create feedback" ON public.feedback FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR is_anonymous = true);
CREATE POLICY "Users can view own feedback" ON public.feedback FOR SELECT USING (auth.uid() = user_id);

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON public.shifts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
