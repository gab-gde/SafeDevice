-- ============================================
-- SafeDevice — Module Sinistres
-- À coller dans le SQL Editor de Supabase
-- ============================================

-- Table claims (sinistres)
CREATE TABLE public.claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  -- Infos sinistre
  type TEXT NOT NULL DEFAULT 'casse', -- casse, oxydation, vol
  description TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  -- Statut du dossier
  status TEXT NOT NULL DEFAULT 'déclaré', -- déclaré, en_cours, traité
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX idx_claims_user_id ON public.claims(user_id);
CREATE INDEX idx_claims_device_id ON public.claims(device_id);

-- RLS
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own claims"
  ON public.claims FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own claims"
  ON public.claims FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own claims"
  ON public.claims FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own claims"
  ON public.claims FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger updated_at
CREATE TRIGGER set_claims_updated_at
  BEFORE UPDATE ON public.claims
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Storage bucket pour les photos de sinistres
INSERT INTO storage.buckets (id, name, public)
VALUES ('claims', 'claims', true);

-- Policy : un user ne peut upload que dans son propre dossier
CREATE POLICY "Users can upload claim photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'claims' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view claim photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'claims');
