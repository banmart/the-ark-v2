-- Make the media bucket public for direct access
UPDATE storage.buckets 
SET public = true 
WHERE id = 'media';

-- Create RLS policies for public read access to media files
CREATE POLICY "Public read access for media files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'media');

-- Allow authenticated users to upload media files (optional, for future admin use)
CREATE POLICY "Authenticated users can upload media files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');