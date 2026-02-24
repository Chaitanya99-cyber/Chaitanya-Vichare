-- Enable authenticated users to manage all data
-- Update RLS policies to allow authenticated users full CRUD access

-- Products table policies
DROP POLICY IF EXISTS "Allow public read access to active products" ON public.products;

CREATE POLICY "Allow public read access to active products" 
ON public.products 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Allow authenticated users full access to products" 
ON public.products 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Profile info policies
DROP POLICY IF EXISTS "Allow public read access to profile info" ON public.profile_info;

CREATE POLICY "Allow public read access to profile info" 
ON public.profile_info 
FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated users full access to profile info" 
ON public.profile_info 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Contact messages policies  
CREATE POLICY "Allow authenticated users full access to contact messages" 
ON public.contact_messages 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Skills policies
CREATE POLICY "Allow authenticated users full access to skills" 
ON public.skills 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Work experience policies
CREATE POLICY "Allow authenticated users full access to work experience" 
ON public.work_experience 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Certifications policies
CREATE POLICY "Allow authenticated users full access to certifications" 
ON public.certifications 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Qualifications policies
CREATE POLICY "Allow authenticated users full access to qualifications" 
ON public.qualifications 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Product categories policies
CREATE POLICY "Allow authenticated users full access to product categories" 
ON public.product_categories 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);