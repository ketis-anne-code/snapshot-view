
-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_type TEXT NOT NULL CHECK (group_type IN ('expert', 'manager')),
  target_n INTEGER NOT NULL CHECK (target_n >= 1 AND target_n <= 25),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Surveys table (one per order)
CREATE TABLE public.surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  share_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex') UNIQUE,
  closes_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

-- Order access: links auth users to orders they can manage
CREATE TABLE public.order_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(order_id, user_id)
);

ALTER TABLE public.order_access ENABLE ROW LEVEL SECURITY;

-- Responses table (anonymous, no user_id link to admin)
CREATE TABLE public.responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- RLS: order_access - users can see their own access records
CREATE POLICY "Users can view their own order access"
  ON public.order_access FOR SELECT
  USING (auth.uid() = user_id);

-- RLS: orders - users can view orders they have access to
CREATE POLICY "Users can view orders they have access to"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.order_access
      WHERE order_access.order_id = orders.id
      AND order_access.user_id = auth.uid()
    )
  );

-- RLS: surveys - users can view surveys for their orders
CREATE POLICY "Users can view surveys for their orders"
  ON public.surveys FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.order_access
      WHERE order_access.order_id = surveys.order_id
      AND order_access.user_id = auth.uid()
    )
  );

-- RLS: responses - public INSERT (anonymous respondents), no SELECT for regular users
CREATE POLICY "Anyone can submit responses"
  ON public.responses FOR INSERT
  WITH CHECK (true);

-- NO select policy on responses for anon/authenticated role = admins can't read individual rows

-- RPC: get aggregated response count for an order (safe, no individual data)
CREATE OR REPLACE FUNCTION public.get_admin_response_count(p_order_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(COUNT(*)::integer, 0)
  FROM responses r
  JOIN surveys s ON s.id = r.survey_id
  WHERE s.order_id = p_order_id;
$$;
