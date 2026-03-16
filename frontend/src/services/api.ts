/**
 * API Service Layer
 * Handles all communication with the FastAPI backend
 */

const API_BASE_URL = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || '';

// Token management
const TOKEN_KEY = 'auth_token';

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// ==================== AUTHENTICATION ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
  };
}

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiCall<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setAuthToken(response.access_token);
    return response;
  },

  logout: () => {
    clearAuthToken();
    sessionStorage.removeItem('admin_authenticated');
  },

  verifyToken: async () => {
    return apiCall('/auth/verify');
  },
};

// ==================== PRODUCTS ====================

export interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  price: number;
  original_price?: number;
  product_type: string;
  image_url?: string;
  file_url?: string;
  preview_url?: string;
  features?: string[];
  requirements?: string[];
  tags?: string[];
  is_active: boolean;
  is_featured: boolean;
  slug: string;
  display_order?: number;
  download_count: number;
  rating?: number;
  review_count: number;
  gallery_images?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  name: string;
  description: string;
  short_description?: string;
  price: number;
  original_price?: number;
  product_type: string;
  image_url?: string;
  file_url?: string;
  preview_url?: string;
  features?: string[];
  requirements?: string[];
  tags?: string[];
  is_active?: boolean;
  is_featured?: boolean;
  slug: string;
  display_order?: number;
}

export const productsAPI = {
  getAll: (isActive?: boolean) => {
    const params = isActive !== undefined ? `?is_active=${isActive}` : '';
    return apiCall<Product[]>(`/products${params}`);
  },

  getById: (id: string) => {
    return apiCall<Product>(`/products/${id}`);
  },

  create: (product: ProductCreate) => {
    return apiCall<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  update: (id: string, product: Partial<ProductCreate>) => {
    return apiCall<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  delete: (id: string) => {
    return apiCall(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== CERTIFICATIONS ====================

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  credential_id?: string;
  credential_url?: string;
  issue_date?: string;
  expiry_date?: string;
  image_url?: string;
  is_active: boolean;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

export interface CertificationCreate {
  name: string;
  issuer: string;
  credential_id?: string;
  credential_url?: string;
  issue_date?: string;
  expiry_date?: string;
  image_url?: string;
  is_active?: boolean;
  display_order?: number;
}

export const certificationsAPI = {
  getAll: (isActive?: boolean) => {
    const params = isActive !== undefined ? `?is_active=${isActive}` : '';
    return apiCall<Certification[]>(`/certifications${params}`);
  },

  getById: (id: string) => {
    return apiCall<Certification>(`/certifications/${id}`);
  },

  create: (certification: CertificationCreate) => {
    return apiCall<Certification>('/certifications', {
      method: 'POST',
      body: JSON.stringify(certification),
    });
  },

  update: (id: string, certification: Partial<CertificationCreate>) => {
    return apiCall<Certification>(`/certifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(certification),
    });
  },

  delete: (id: string) => {
    return apiCall(`/certifications/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== CONTACT MESSAGES ====================

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  subject?: string;
  is_read: boolean;
  replied_at?: string;
  created_at: string;
}

export interface ContactMessageCreate {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  subject?: string;
}

export const contactAPI = {
  getAll: () => {
    return apiCall<ContactMessage[]>('/contact-messages');
  },

  create: (message: ContactMessageCreate) => {
    return apiCall<ContactMessage>('/contact-messages', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  },

  delete: (id: string) => {
    return apiCall(`/contact-messages/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== PROFILE ====================

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  profile_image_url?: string;
  resume_url?: string;
  experience_years: number;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  name?: string;
  title?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  profile_image_url?: string;
  resume_url?: string;
  experience_years?: number;
}

export const profileAPI = {
  get: () => {
    return apiCall<Profile>('/profile');
  },

  update: (profile: ProfileUpdate) => {
    return apiCall<Profile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },
};

// ==================== CONTENT SECTIONS ====================

export interface ContentSection {
  id?: string;
  section_name: string;
  content: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export const contentAPI = {
  get: (sectionName: string) => {
    return apiCall<ContentSection>(`/content/${sectionName}`);
  },

  update: (sectionName: string, content: Record<string, any>) => {
    return apiCall<ContentSection>(`/content/${sectionName}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },
};

// ==================== FILE UPLOAD ====================

export interface UploadResponse {
  filename: string;
  url: string;
  original_filename: string;
}

export const uploadAPI = {
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return response.json();
  },
};

// Health check
export const healthCheck = () => {
  return apiCall('/health');
};

// ==================== WEBSITE CONTENT API ====================

export interface WebsiteContent {
  id: string;
  hero: HeroContent;
  about: AboutContent;
  experience: ExperienceContent;
  skills: SkillsContent;
  resume: ResumeContent;
  settings: SiteSettings;
  created_at: string;
  updated_at: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  cta_text: string;
  cta_link: string;
  background_image?: string;
  profile_image?: string;
}

export interface AboutContent {
  heading: string;
  subheading: string;
  bio: string;
  description: string;
  image_url?: string;
  stats: Array<{ label: string; value: string }>;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  display_order: number;
}

export interface ExperienceContent {
  heading: string;
  subheading: string;
  experiences: ExperienceItem[];
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
  icon?: string;
  display_order: number;
}

export interface SkillsContent {
  heading: string;
  subheading: string;
  categories: SkillCategory[];
}

export interface ResumeContent {
  heading: string;
  subheading: string;
  description: string;
  resume_url?: string;
  show_section: boolean;
}

export interface SiteSettings {
  site_title: string;
  site_description: string;
  favicon_url?: string;
  logo_url?: string;
  primary_color: string;
  accent_color: string;
  footer_text: string;
  show_products_section: boolean;
  show_certifications_section: boolean;
  show_contact_section: boolean;
  social_links: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    email?: string;
    phone?: string;
  };
}

export const websiteContentAPI = {
  getAll: () => apiCall<WebsiteContent>('/website-content'),
  getHero: () => apiCall<HeroContent>('/website-content/hero'),
  updateHero: (data: Partial<HeroContent>) => 
    apiCall<HeroContent>('/website-content/hero', { method: 'PUT', body: JSON.stringify(data) }),
  getAbout: () => apiCall<AboutContent>('/website-content/about'),
  updateAbout: (data: Partial<AboutContent>) => 
    apiCall<AboutContent>('/website-content/about', { method: 'PUT', body: JSON.stringify(data) }),
  getExperience: () => apiCall<ExperienceContent>('/website-content/experience'),
  updateExperience: (data: Partial<ExperienceContent>) => 
    apiCall<ExperienceContent>('/website-content/experience', { method: 'PUT', body: JSON.stringify(data) }),
  getSkills: () => apiCall<SkillsContent>('/website-content/skills'),
  updateSkills: (data: Partial<SkillsContent>) => 
    apiCall<SkillsContent>('/website-content/skills', { method: 'PUT', body: JSON.stringify(data) }),
  getResume: () => apiCall<ResumeContent>('/website-content/resume'),
  updateResume: (data: Partial<ResumeContent>) => 
    apiCall<ResumeContent>('/website-content/resume', { method: 'PUT', body: JSON.stringify(data) }),
  getSettings: () => apiCall<SiteSettings>('/website-content/settings'),
  updateSettings: (data: Partial<SiteSettings>) => 
    apiCall<SiteSettings>('/website-content/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// ==================== ANALYTICS API ====================

export interface AnalyticsSummary {
  total_page_views: number;
  unique_visitors: number;
  total_sessions: number;
  avg_session_duration: number;
  top_pages: Array<{ page: string; views: number }>;
  popular_products: any[];
  contact_form_submissions: number;
  date_range: string;
}

export const analyticsAPI = {
  trackPageView: (page_path: string, page_title?: string) => {
    // Get or create visitor/session IDs
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitor_id', visitorId);
    }
    
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }

    return fetch(`${API_BASE_URL}/api/analytics/pageview?page_path=${encodeURIComponent(page_path)}${page_title ? `&page_title=${encodeURIComponent(page_title)}` : ''}`, {
      method: 'POST',
      headers: {
        'x-visitor-id': visitorId,
        'x-session-id': sessionId,
      },
    }).catch(err => console.error('Analytics tracking failed:', err));
  },

  getSummary: (days: number = 30) => 
    apiCall<AnalyticsSummary>(`/analytics/summary?days=${days}`),
};

// ==================== SEARCH API ====================

export interface SearchParams {
  q?: string;
  product_type?: string;
  min_price?: number;
  max_price?: number;
  tags?: string;
  sort_by?: string;
  sort_order?: string;
  limit?: number;
  skip?: number;
}

export interface SearchResponse {
  products: Product[];
  total: number;
  limit: number;
  skip: number;
}

export const searchAPI = {
  searchProducts: (params: SearchParams) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    return apiCall<SearchResponse>(`/search/products?${queryParams.toString()}`);
  },
};
