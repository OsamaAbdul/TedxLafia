CREATE TABLE public.speakers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  bio text NOT NULL DEFAULT '',
  talk_title text,
  photo_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.speakers TO anon, authenticated;
GRANT ALL ON public.speakers TO service_role;
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published speakers" ON public.speakers FOR SELECT TO anon, authenticated USING (is_published = true);

CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tier text NOT NULL DEFAULT 'community',
  logo_url text,
  website_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.partners TO anon, authenticated;
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published partners" ON public.partners FOR SELECT TO anon, authenticated USING (is_published = true);

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  theme text,
  starts_at timestamptz NOT NULL,
  venue text NOT NULL,
  description text NOT NULL DEFAULT '',
  ticket_url text,
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon, authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published events" ON public.events FOR SELECT TO anon, authenticated USING (is_published = true);

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT '',
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a contact message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (length(name) BETWEEN 1 AND 120 AND length(email) BETWEEN 3 AND 254 AND length(message) BETWEEN 1 AND 4000 AND length(subject) <= 200);

CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source text NOT NULL DEFAULT 'website',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (length(email) BETWEEN 3 AND 254);

INSERT INTO public.speakers (name, title, bio, talk_title, sort_order) VALUES
('Amina Yusuf', 'Agri-tech Founder, Nasarawa', 'Amina builds low-cost irrigation systems for smallholder farmers across the Middle Belt.', 'Farming the Future From a Small Plot', 1),
('Daniel Okoro', 'Neurosurgeon & Educator', 'Daniel trains the next generation of surgeons and champions rural health access.', 'What the Brain Teaches Us About Community', 2),
('Halima Bello', 'Poet & Cultural Historian', 'Halima preserves Eggon and Alago oral traditions through spoken word.', 'The Stories That Refuse to Die', 3),
('Emeka Nwachukwu', 'Renewable Energy Engineer', 'Emeka designs solar micro-grids powering schools and clinics in northern Nigeria.', 'Light Where the Grid Ends', 4),
('Ruth Adamu', 'Youth Advocate', 'Ruth mobilises young people in Lafia around civic participation and skills.', 'A Generation Not Waiting to Be Asked', 5),
('Ibrahim Musa', 'Architect & Urbanist', 'Ibrahim reimagines fast-growing Nigerian towns with climate-conscious design.', 'Building Cities That Breathe', 6);

INSERT INTO public.partners (name, tier, website_url, sort_order) VALUES
('Nasarawa State University', 'title', 'https://nsuk.edu.ng', 1),
('Lafia Innovation Hub', 'gold', NULL, 2),
('Middle Belt Media', 'gold', NULL, 3),
('Savannah Coffee Co.', 'community', NULL, 4),
('BrightPath Foundation', 'community', NULL, 5),
('Konga Creative Studio', 'community', NULL, 6);

INSERT INTO public.events (title, theme, starts_at, venue, description, ticket_url, is_featured) VALUES
('TEDxLafia 2026', 'Ideas Worth Spreading', '2026-11-14T09:00:00+01:00', 'Nasarawa State University Auditorium, Lafia', 'A full day of talks, performances and conversations from voices shaping the Middle Belt and beyond.', 'https://example.com/register', true);