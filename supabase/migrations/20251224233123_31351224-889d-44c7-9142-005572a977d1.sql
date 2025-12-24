-- Create assessments table for syncing offline data
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  risk_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
  symptoms JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Enable Row Level Security
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert assessments (for offline sync)
CREATE POLICY "Allow public insert" ON public.assessments
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read assessments (for health workers)
CREATE POLICY "Allow public read" ON public.assessments
  FOR SELECT
  USING (true);

-- Create index for faster queries
CREATE INDEX idx_assessments_created_at ON public.assessments(created_at DESC);
CREATE INDEX idx_assessments_risk_level ON public.assessments(risk_level);