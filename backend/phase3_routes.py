"""
Phase 3 API Routes: Website Content Management, Analytics, Search, and Payments
"""
from fastapi import APIRouter, Depends, HTTPException, Request, Query
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import uuid
from content_models import (
    WebsiteContent, HeroUpdate, AboutUpdate, ExperienceUpdate,
    SkillsUpdate, ResumeUpdate, SiteSettingsUpdate, ExperienceItem, SkillCategory
)
from analytics_models import PageView, VisitorSession, AnalyticsSummary
from database import (
    website_content_collection, analytics_pageviews_collection,
    analytics_sessions_collection, products_collection
)
from auth import get_current_user
import logging

logger = logging.getLogger(__name__)

# Create router
content_router = APIRouter(prefix="/api/website-content", tags=["Website Content"])
analytics_router = APIRouter(prefix="/api/analytics", tags=["Analytics"])
search_router = APIRouter(prefix="/api/search", tags=["Search"])

# ==================== WEBSITE CONTENT ROUTES ====================

@content_router.get("", response_model=WebsiteContent)
async def get_website_content():
    """Get all website content (public endpoint)"""
    content = await website_content_collection.find_one()
    if not content:
        raise HTTPException(status_code=404, detail="Website content not found")
    return content

@content_router.get("/hero")
async def get_hero_content():
    """Get hero section content"""
    content = await website_content_collection.find_one()
    if not content:
        return {}
    return content.get("hero", {})

@content_router.put("/hero")
async def update_hero_content(
    hero_update: HeroUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update hero section (admin only)"""
    content = await website_content_collection.find_one()
    if not content:
        raise HTTPException(status_code=404, detail="Website content not found")
    
    update_data = hero_update.model_dump(exclude_unset=True)
    
    await website_content_collection.update_one(
        {"id": content["id"]},
        {
            "$set": {
                "hero": {**content.get("hero", {}), **update_data},
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    updated_content = await website_content_collection.find_one({"id": content["id"]})
    logger.info(f"Hero section updated by {current_user['email']}")
    return updated_content.get("hero", {})

@content_router.get("/about")
async def get_about_content():
    """Get about section content"""
    content = await website_content_collection.find_one()
    if not content:
        return {}
    return content.get("about", {})

@content_router.put("/about")
async def update_about_content(
    about_update: AboutUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update about section (admin only)"""
    content = await website_content_collection.find_one()
    if not content:
        raise HTTPException(status_code=404, detail="Website content not found")
    
    update_data = about_update.model_dump(exclude_unset=True)
    
    await website_content_collection.update_one(
        {"id": content["id"]},
        {
            "$set": {
                "about": {**content.get("about", {}), **update_data},
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    updated_content = await website_content_collection.find_one({"id": content["id"]})
    logger.info(f"About section updated by {current_user['email']}")
    return updated_content.get("about", {})

@content_router.get("/experience")
async def get_experience_content():
    """Get experience section content"""
    content = await website_content_collection.find_one()
    if not content:
        return {}
    return content.get("experience", {})

@content_router.put("/experience")
async def update_experience_content(
    experience_update: ExperienceUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update experience section (admin only)"""
    content = await website_content_collection.find_one()
    if not content:
        raise HTTPException(status_code=404, detail="Website content not found")
    
    update_data = experience_update.model_dump(exclude_unset=True)
    
    await website_content_collection.update_one(
        {"id": content["id"]},
        {
            "$set": {
                "experience": {**content.get("experience", {}), **update_data},
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    updated_content = await website_content_collection.find_one({"id": content["id"]})
    logger.info(f"Experience section updated by {current_user['email']}")
    return updated_content.get("experience", {})

@content_router.get("/skills")
async def get_skills_content():
    """Get skills section content"""
    content = await website_content_collection.find_one()
    if not content:
        return {}
    return content.get("skills", {})

@content_router.put("/skills")
async def update_skills_content(
    skills_update: SkillsUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update skills section (admin only)"""
    content = await website_content_collection.find_one()
    if not content:
        raise HTTPException(status_code=404, detail="Website content not found")
    
    update_data = skills_update.model_dump(exclude_unset=True)
    
    await website_content_collection.update_one(
        {"id": content["id"]},
        {
            "$set": {
                "skills": {**content.get("skills", {}), **update_data},
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    updated_content = await website_content_collection.find_one({"id": content["id"]})
    logger.info(f"Skills section updated by {current_user['email']}")
    return updated_content.get("skills", {})

@content_router.get("/resume")
async def get_resume_content():
    """Get resume section content"""
    content = await website_content_collection.find_one()
    if not content:
        return {}
    return content.get("resume", {})

@content_router.put("/resume")
async def update_resume_content(
    resume_update: ResumeUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update resume section (admin only)"""
    content = await website_content_collection.find_one()
    if not content:
        raise HTTPException(status_code=404, detail="Website content not found")
    
    update_data = resume_update.model_dump(exclude_unset=True)
    
    await website_content_collection.update_one(
        {"id": content["id"]},
        {
            "$set": {
                "resume": {**content.get("resume", {}), **update_data},
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    updated_content = await website_content_collection.find_one({"id": content["id"]})
    logger.info(f"Resume section updated by {current_user['email']}")
    return updated_content.get("resume", {})

@content_router.get("/settings")
async def get_site_settings():
    """Get site settings"""
    content = await website_content_collection.find_one()
    if not content:
        return {}
    return content.get("settings", {})

@content_router.put("/settings")
async def update_site_settings(
    settings_update: SiteSettingsUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update site settings (admin only)"""
    content = await website_content_collection.find_one()
    if not content:
        raise HTTPException(status_code=404, detail="Website content not found")
    
    update_data = settings_update.model_dump(exclude_unset=True)
    
    await website_content_collection.update_one(
        {"id": content["id"]},
        {
            "$set": {
                "settings": {**content.get("settings", {}), **update_data},
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    updated_content = await website_content_collection.find_one({"id": content["id"]})
    logger.info(f"Site settings updated by {current_user['email']}")
    return updated_content.get("settings", {})

# ==================== ANALYTICS ROUTES ====================

@analytics_router.post("/pageview")
async def track_page_view(request: Request, page_path: str, page_title: Optional[str] = None):
    """Track a page view (public endpoint)"""
    # Get visitor info from request
    user_agent = request.headers.get("user-agent", "")
    ip_address = request.client.host if request.client else None
    
    # Create or get visitor ID from cookie/header
    visitor_id = request.headers.get("x-visitor-id", str(uuid.uuid4()))
    session_id = request.headers.get("x-session-id", str(uuid.uuid4()))
    
    # Detect device type from user agent
    device_type = "desktop"
    if "mobile" in user_agent.lower():
        device_type = "mobile"
    elif "tablet" in user_agent.lower():
        device_type = "tablet"
    
    # Create page view event
    page_view = {
        "id": str(uuid.uuid4()),
        "page_path": page_path,
        "page_title": page_title,
        "user_agent": user_agent,
        "ip_address": ip_address,
        "visitor_id": visitor_id,
        "session_id": session_id,
        "device_type": device_type,
        "timestamp": datetime.utcnow()
    }
    
    await analytics_pageviews_collection.insert_one(page_view)
    
    # Update or create session
    session = await analytics_sessions_collection.find_one({"id": session_id})
    if session:
        await analytics_sessions_collection.update_one(
            {"id": session_id},
            {
                "$inc": {"page_views": 1},
                "$set": {
                    "exit_page": page_path,
                    "session_end": datetime.utcnow()
                }
            }
        )
    else:
        # Check if this is a unique visitor
        existing_visitor = await analytics_sessions_collection.find_one({"visitor_id": visitor_id})
        
        new_session = {
            "id": session_id,
            "visitor_id": visitor_id,
            "session_start": datetime.utcnow(),
            "page_views": 1,
            "entry_page": page_path,
            "exit_page": page_path,
            "is_unique_visitor": existing_visitor is None
        }
        await analytics_sessions_collection.insert_one(new_session)
    
    return {"status": "tracked", "visitor_id": visitor_id, "session_id": session_id}

@analytics_router.get("/summary", response_model=AnalyticsSummary)
async def get_analytics_summary(
    days: int = Query(default=30, ge=1, le=365),
    current_user: dict = Depends(get_current_user)
):
    """Get analytics summary (admin only)"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Total page views
    total_page_views = await analytics_pageviews_collection.count_documents({
        "timestamp": {"$gte": start_date}
    })
    
    # Unique visitors
    unique_visitors_pipeline = [
        {"$match": {"session_start": {"$gte": start_date}}},
        {"$group": {"_id": "$visitor_id"}},
        {"$count": "count"}
    ]
    unique_visitors_result = await analytics_sessions_collection.aggregate(unique_visitors_pipeline).to_list(1)
    unique_visitors = unique_visitors_result[0]["count"] if unique_visitors_result else 0
    
    # Total sessions
    total_sessions = await analytics_sessions_collection.count_documents({
        "session_start": {"$gte": start_date}
    })
    
    # Top pages
    top_pages_pipeline = [
        {"$match": {"timestamp": {"$gte": start_date}}},
        {"$group": {"_id": "$page_path", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    top_pages = await analytics_pageviews_collection.aggregate(top_pages_pipeline).to_list(10)
    
    return {
        "total_page_views": total_page_views,
        "unique_visitors": unique_visitors,
        "total_sessions": total_sessions,
        "avg_session_duration": 0,  # Calculate if needed
        "top_pages": [{"page": p["_id"], "views": p["count"]} for p in top_pages],
        "popular_products": [],
        "contact_form_submissions": 0,
        "date_range": f"Last {days} days"
    }

# ==================== SEARCH & FILTER ROUTES ====================

@search_router.get("/products")
async def search_products(
    q: Optional[str] = Query(None, description="Search query"),
    product_type: Optional[str] = Query(None, description="Filter by product type"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price"),
    tags: Optional[str] = Query(None, description="Comma-separated tags"),
    sort_by: Optional[str] = Query("name", description="Sort by: name, price, created_at"),
    sort_order: Optional[str] = Query("asc", description="Sort order: asc, desc"),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    """Advanced product search and filtering"""
    query = {"is_active": True}
    
    # Text search
    if q:
        query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"short_description": {"$regex": q, "$options": "i"}}
        ]
    
    # Filter by type
    if product_type:
        query["product_type"] = product_type
    
    # Price range filter
    if min_price is not None or max_price is not None:
        query["price"] = {}
        if min_price is not None:
            query["price"]["$gte"] = min_price
        if max_price is not None:
            query["price"]["$lte"] = max_price
    
    # Tags filter
    if tags:
        tag_list = [tag.strip() for tag in tags.split(",")]
        query["tags"] = {"$in": tag_list}
    
    # Sorting
    sort_direction = 1 if sort_order == "asc" else -1
    sort_field = sort_by if sort_by in ["name", "price", "created_at"] else "name"
    
    # Execute query
    products = await products_collection.find(query).sort(sort_field, sort_direction).skip(skip).limit(limit).to_list(limit)
    total_count = await products_collection.count_documents(query)
    
    return {
        "products": products,
        "total": total_count,
        "limit": limit,
        "skip": skip
    }
