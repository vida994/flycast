-- Add max length constraint for message text (1000 chars)
ALTER TABLE flycast_messages
  ADD CONSTRAINT flycast_messages_text_max_length CHECK (length(text) <= 1000);
