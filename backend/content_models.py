"""
Content Models for Dynamic Website Sections
All sections of the website will be editable through admin panel
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

# Hero Section
class HeroContent(BaseModel):
    title: str = "Chaitanya Vichare"
    subtitle: str = "GRC Professional"
    description: str = "Experienced professional specializing in governance, risk management, and compliance frameworks"
    cta_text: str = "Get In Touch"
    cta_link: str = "#contact"
    background_image: Optional[str] = None
    profile_image: Optional[str] = None

# About Section
class AboutContent(BaseModel):
    heading: str = "About Me"
    subheading: str = "Professional Background"
    bio: str = "Experienced GRC professional with a passion for cybersecurity and compliance"
    description: str = "Detailed description about your professional journey..."
    image_url: Optional[str] = None
    stats: List[Dict[str, Any]] = [
        {"label": "Years Experience", "value": "2.10+"},
        {"label": "Projects Delivered", "value": "2"},
        {"label": "Certifications", "value": "3+"}
    ]

# Experience Item
class ExperienceItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company: str
    role: str
    location: Optional[str] = None
    start_date: str  # Format: "Jan 2022"
    end_date: Optional[str] = None  # None for current, or "Dec 2023"
    is_current: bool = False
    description: str
    responsibilities: List[str] = []
    technologies: List[str] = []
    display_order: int = 0

class ExperienceContent(BaseModel):
    heading: str = "Professional Experience"
    subheading: str = "Career Journey"
    experiences: List[ExperienceItem] = []

# Skills Section
class SkillCategory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    skills: List[str]
    icon: Optional[str] = None
    display_order: int = 0

class SkillsContent(BaseModel):
    heading: str = "Skills & Expertise"
    subheading: str = "Technical Proficiencies"
    categories: List[SkillCategory] = []

# Resume Section
class ResumeContent(BaseModel):
    heading: str = "Download Resume"
    subheading: str = "Get My Complete Profile"
    description: str = "Download my comprehensive resume for detailed information"
    resume_url: Optional[str] = None
    show_section: bool = True

# Social Links
class SocialLinks(BaseModel):
    linkedin: Optional[str] = None
    github: Optional[str] = None
    twitter: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

# Site Settings
class SiteSettings(BaseModel):
    site_title: str = "GRC Portfolio - Chaitanya Vichare"
    site_description: str = "Professional GRC portfolio showcasing expertise in governance, risk, and compliance"
    favicon_url: Optional[str] = None
    logo_url: Optional[str] = None
    primary_color: str = "#6366f1"
    accent_color: str = "#8b5cf6"
    footer_text: str = "© 2025 Chaitanya Vichare. All rights reserved."
    show_products_section: bool = True
    show_certifications_section: bool = True
    show_contact_section: bool = True
    social_links: SocialLinks = SocialLinks()

# Complete Website Content
class WebsiteContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    hero: HeroContent = HeroContent()
    about: AboutContent = AboutContent()
    experience: ExperienceContent = ExperienceContent()
    skills: SkillsContent = SkillsContent()
    resume: ResumeContent = ResumeContent()
    settings: SiteSettings = SiteSettings()
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Update models for individual sections
class HeroUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    background_image: Optional[str] = None
    profile_image: Optional[str] = None

class AboutUpdate(BaseModel):
    heading: Optional[str] = None
    subheading: Optional[str] = None
    bio: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    stats: Optional[List[Dict[str, Any]]] = None

class ExperienceUpdate(BaseModel):
    heading: Optional[str] = None
    subheading: Optional[str] = None
    experiences: Optional[List[ExperienceItem]] = None

class SkillsUpdate(BaseModel):
    heading: Optional[str] = None
    subheading: Optional[str] = None
    categories: Optional[List[SkillCategory]] = None

class ResumeUpdate(BaseModel):
    heading: Optional[str] = None
    subheading: Optional[str] = None
    description: Optional[str] = None
    resume_url: Optional[str] = None
    show_section: Optional[bool] = None

class SiteSettingsUpdate(BaseModel):
    site_title: Optional[str] = None
    site_description: Optional[str] = None
    favicon_url: Optional[str] = None
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    accent_color: Optional[str] = None
    footer_text: Optional[str] = None
    show_products_section: Optional[bool] = None
    show_certifications_section: Optional[bool] = None
    show_contact_section: Optional[bool] = None
    social_links: Optional[SocialLinks] = None
