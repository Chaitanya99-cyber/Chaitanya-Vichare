from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid

# Base Model with common fields
class TimestampModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Product Models
class ProductBase(BaseModel):
    name: str
    description: str
    short_description: Optional[str] = None
    price: float = 0.0
    original_price: Optional[float] = None
    product_type: str = "digital"
    image_url: Optional[str] = None
    file_url: Optional[str] = None
    preview_url: Optional[str] = None
    features: Optional[List[str]] = []
    requirements: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    is_active: bool = True
    is_featured: bool = False
    slug: str
    display_order: Optional[int] = None
    download_count: int = 0
    rating: Optional[float] = None
    review_count: int = 0
    gallery_images: Optional[List[str]] = []

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    product_type: Optional[str] = None
    image_url: Optional[str] = None
    file_url: Optional[str] = None
    preview_url: Optional[str] = None
    features: Optional[List[str]] = None
    requirements: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    slug: Optional[str] = None
    display_order: Optional[int] = None

class Product(ProductBase, TimestampModel):
    pass

# Certification Models
class CertificationBase(BaseModel):
    name: str
    issuer: str
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool = True
    display_order: Optional[int] = None

class CertificationCreate(CertificationBase):
    pass

class CertificationUpdate(BaseModel):
    name: Optional[str] = None
    issuer: Optional[str] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None

class Certification(CertificationBase, TimestampModel):
    pass

# Contact Message Models
class ContactMessageBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    message: str
    subject: Optional[str] = None

class ContactMessageCreate(ContactMessageBase):
    pass

class ContactMessage(ContactMessageBase, TimestampModel):
    is_read: bool = False
    replied_at: Optional[datetime] = None

# Profile Models
class ProfileBase(BaseModel):
    name: str = "Chaitanya Vichare"
    title: str = "GRC Professional"
    bio: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    profile_image_url: Optional[str] = None
    resume_url: Optional[str] = None
    experience_years: float = 2.10

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    profile_image_url: Optional[str] = None
    resume_url: Optional[str] = None
    experience_years: Optional[float] = None

class Profile(ProfileBase, TimestampModel):
    pass

# Admin User Models
class AdminUserBase(BaseModel):
    email: EmailStr

class AdminUserCreate(AdminUserBase):
    password: str

class AdminUser(AdminUserBase, TimestampModel):
    password_hash: str
    is_active: bool = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# Content Section Models (for dynamic content)
class ContentSection(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    section_name: str  # e.g., "about", "experience", "skills"
    content: dict  # JSON content for the section
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ContentSectionUpdate(BaseModel):
    content: dict
