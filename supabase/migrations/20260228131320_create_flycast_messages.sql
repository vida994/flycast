-- Create flycast_messages table
CREATE TABLE flycast_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL CHECK (length(trim(text)) > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE flycast_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies: allow anon for SELECT, INSERT, UPDATE
CREATE POLICY "flycast_allow_public_read" ON flycast_messages
  FOR SELECT TO anon USING (true);

CREATE POLICY "flycast_allow_public_insert" ON flycast_messages
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "flycast_allow_public_update" ON flycast_messages
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Enable Realtime for INSERT and UPDATE
ALTER PUBLICATION supabase_realtime ADD TABLE flycast_messages;

-- Trigger to auto-update updated_at on row change
CREATE OR REPLACE FUNCTION flycast_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER flycast_messages_updated_at
  BEFORE UPDATE ON flycast_messages
  FOR EACH ROW
  EXECUTE FUNCTION flycast_update_updated_at();
