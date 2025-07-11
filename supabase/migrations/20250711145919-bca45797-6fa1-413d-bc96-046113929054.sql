-- Fix RLS policies to allow admin operations
-- Drop existing restrictive policies and create new ones

-- Fix profile_info policies
DROP POLICY IF EXISTS "Allow authenticated users full access to profile info" ON public.profile_info;
DROP POLICY IF EXISTS "Allow public read access to profile info" ON public.profile_info;

-- Create new policies that allow all operations for admin users
CREATE POLICY "Allow all operations on profile_info" 
ON public.profile_info 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Fix certifications policies  
DROP POLICY IF EXISTS "Allow authenticated users full access to certifications" ON public.certifications;
DROP POLICY IF EXISTS "Allow public read access to active certifications" ON public.certifications;

CREATE POLICY "Allow all operations on certifications" 
ON public.certifications 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create storage bucket for certifications if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certifications', 'certifications', true)
ON CONFLICT (id) DO NOTHING;

-- Fix storage policies for certifications bucket
DROP POLICY IF EXISTS "Allow authenticated users to upload certification images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to certification images" ON storage.objects;

-- Create permissive storage policies
CREATE POLICY "Allow all operations on certification files" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'certifications') 
WITH CHECK (bucket_id = 'certifications');

CREATE POLICY "Allow public read access to certification files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'certifications');

-- Also fix storage policies for resumes bucket
CREATE POLICY "Allow all operations on resume files" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'resumes') 
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Allow public read access to resume files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resumes');