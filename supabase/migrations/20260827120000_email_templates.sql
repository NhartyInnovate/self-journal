CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_type VARCHAR(50) UNIQUE NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body_content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Allow read access to anyone (so the webhook can read it without service role, though webhook uses service role anyway)
CREATE POLICY "Allow read access to anyone" ON public.email_templates FOR SELECT USING (true);
-- We won't allow updates via anon key, only via service role (admin API)

-- Seed default templates
INSERT INTO public.email_templates (template_type, subject, body_content) VALUES
(
  'preorder_confirmation',
  'Your Preorder is Confirmed - {{bookTitle}}',
  'Dear {{name}},

Thank you for securing your preorder. Your payment has been successfully processed, and your copy is reserved.

Your guided reflection bonuses have been secured. The expected release date is {{releaseDate}}. We will notify you via email as soon as your copy is ready.'
),
(
  'copy_ready',
  'YOUR COPY IS READY: {{bookTitle}}',
  'Dear {{name}},

Great news! Your preordered copy of {{bookTitle}} is now ready and available.

We will be in touch shortly with further instructions on how to access your copy.'
),
(
  'release_notification',
  'OFFICIAL RELEASE: {{bookTitle}}',
  'Dear {{name}},

The wait is over. {{bookTitle}} is officially released today!

Because you secured a preorder, your copy is guaranteed. We will contact you directly with instructions on how to access your copy.

Thank you for your early support.'
)
ON CONFLICT (template_type) DO NOTHING;
