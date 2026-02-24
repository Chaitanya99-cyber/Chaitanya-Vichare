#!/usr/bin/env python3
"""
Comprehensive backend API testing for GRC Portfolio website
Tests all FastAPI endpoints with proper authentication flows
"""

import asyncio
import aiohttp
import json
import sys
from typing import Dict, Any, Optional
from datetime import datetime

# Backend URL from frontend env
BACKEND_URL = "https://site-upgrade-118.preview.emergentagent.com/api"

class GRCAPITester:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.auth_token = None
        self.session = None
        
    async def __aenter__(self):
        connector = aiohttp.TCPConnector(ssl=False)
        self.session = aiohttp.ClientSession(connector=connector)
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                          requires_auth: bool = False) -> Dict[str, Any]:
        """Make HTTP request with optional authentication"""
        url = f"{self.base_url}{endpoint}"
        headers = {"Content-Type": "application/json"}
        
        if requires_auth and self.auth_token:
            headers["Authorization"] = f"Bearer {self.auth_token}"
            
        try:
            if method == "GET":
                async with self.session.get(url, headers=headers) as resp:
                    result = await resp.json()
                    return {"status": resp.status, "data": result}
            elif method == "POST":
                async with self.session.post(url, json=data, headers=headers) as resp:
                    result = await resp.json()
                    return {"status": resp.status, "data": result}
            elif method == "PUT":
                async with self.session.put(url, json=data, headers=headers) as resp:
                    result = await resp.json()
                    return {"status": resp.status, "data": result}
            elif method == "DELETE":
                async with self.session.delete(url, headers=headers) as resp:
                    result = await resp.json()
                    return {"status": resp.status, "data": result}
        except Exception as e:
            return {"status": 0, "error": str(e)}
    
    def print_test_result(self, test_name: str, success: bool, details: str = ""):
        """Print formatted test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if not success:
            print()
    
    async def test_health_check(self) -> bool:
        """Test health check endpoint"""
        print("\n🏥 TESTING HEALTH CHECK")
        
        # Test basic root endpoint
        result = await self.make_request("GET", "/")
        success = result["status"] == 200 and "GRC Portfolio API" in str(result.get("data", {}))
        self.print_test_result("GET /api/ - Root endpoint", success, 
                              f"Status: {result['status']}, Response: {result.get('data', {})}")
        
        # Test detailed health endpoint
        result = await self.make_request("GET", "/health")
        success = result["status"] == 200 and result.get("data", {}).get("status") == "healthy"
        db_status = result.get("data", {}).get("database", "unknown")
        self.print_test_result("GET /api/health - Database connectivity", success,
                              f"Status: {result['status']}, DB: {db_status}")
        
        return success
    
    async def test_authentication(self) -> bool:
        """Test authentication flow"""
        print("\n🔐 TESTING AUTHENTICATION")
        
        # Test login with valid credentials
        login_data = {
            "email": "admin@grc.com",
            "password": "admin123"
        }
        
        result = await self.make_request("POST", "/auth/login", login_data)
        login_success = result["status"] == 200 and "access_token" in result.get("data", {})
        
        if login_success:
            self.auth_token = result["data"]["access_token"]
            user_info = result["data"].get("user", {})
            self.print_test_result("POST /api/auth/login - Valid credentials", True,
                                  f"Token received, User: {user_info.get('email')}")
        else:
            self.print_test_result("POST /api/auth/login - Valid credentials", False,
                                  f"Status: {result['status']}, Response: {result.get('data', result.get('error'))}")
            return False
        
        # Test token verification
        result = await self.make_request("GET", "/auth/verify", requires_auth=True)
        verify_success = result["status"] == 200 and result.get("data", {}).get("valid") == True
        self.print_test_result("GET /api/auth/verify - Token validation", verify_success,
                              f"Status: {result['status']}, Valid: {result.get('data', {}).get('valid')}")
        
        # Test login with invalid credentials
        invalid_login = {
            "email": "admin@grc.com",
            "password": "wrongpassword"
        }
        result = await self.make_request("POST", "/auth/login", invalid_login)
        invalid_success = result["status"] == 401
        self.print_test_result("POST /api/auth/login - Invalid credentials", invalid_success,
                              f"Status: {result['status']} (expected 401)")
        
        return login_success and verify_success
    
    async def test_products_api(self) -> bool:
        """Test Products CRUD operations"""
        print("\n📦 TESTING PRODUCTS API")
        
        created_product_id = None
        all_passed = True
        
        # Test GET /api/products (should be empty initially)
        result = await self.make_request("GET", "/products")
        get_success = result["status"] == 200 and isinstance(result.get("data"), list)
        initial_count = len(result.get("data", []))
        self.print_test_result("GET /api/products - List products", get_success,
                              f"Status: {result['status']}, Count: {initial_count}")
        all_passed &= get_success
        
        # Test POST /api/products (create)
        product_data = {
            "name": "Advanced GRC Risk Assessment Framework",
            "description": "A comprehensive framework for conducting risk assessments in GRC environments, including templates, checklists, and methodology guides.",
            "price": 149.99,
            "product_type": "framework",
            "slug": "advanced-grc-risk-assessment-framework",
            "short_description": "Complete risk assessment toolkit for GRC professionals",
            "features": ["Risk matrices", "Assessment templates", "Compliance checklists", "Methodology guides"],
            "tags": ["risk", "grc", "assessment", "compliance"],
            "is_active": True,
            "is_featured": True
        }
        
        result = await self.make_request("POST", "/products", product_data, requires_auth=True)
        create_success = result["status"] == 200 and "id" in result.get("data", {})
        
        if create_success:
            created_product_id = result["data"]["id"]
            self.print_test_result("POST /api/products - Create product", True,
                                  f"Product created with ID: {created_product_id}")
        else:
            self.print_test_result("POST /api/products - Create product", False,
                                  f"Status: {result['status']}, Response: {result.get('data', result.get('error'))}")
            all_passed = False
            return all_passed
        
        # Test GET /api/products again (should have new product)
        result = await self.make_request("GET", "/products")
        updated_success = result["status"] == 200 and len(result.get("data", [])) == initial_count + 1
        self.print_test_result("GET /api/products - After creation", updated_success,
                              f"Status: {result['status']}, Count: {len(result.get('data', []))}")
        all_passed &= updated_success
        
        # Test GET /api/products/{id} (get single product)
        if created_product_id:
            result = await self.make_request("GET", f"/products/{created_product_id}")
            get_single_success = result["status"] == 200 and result.get("data", {}).get("id") == created_product_id
            self.print_test_result("GET /api/products/{id} - Single product", get_single_success,
                                  f"Status: {result['status']}, ID matches: {result.get('data', {}).get('id') == created_product_id}")
            all_passed &= get_single_success
        
        # Test PUT /api/products/{id} (update)
        if created_product_id:
            update_data = {
                "name": "Advanced GRC Risk Assessment Framework - Updated",
                "price": 199.99,
                "is_featured": False
            }
            
            result = await self.make_request("PUT", f"/products/{created_product_id}", 
                                           update_data, requires_auth=True)
            update_success = result["status"] == 200 and result.get("data", {}).get("price") == 199.99
            self.print_test_result("PUT /api/products/{id} - Update product", update_success,
                                  f"Status: {result['status']}, Price updated: {result.get('data', {}).get('price')}")
            all_passed &= update_success
        
        # Test DELETE /api/products/{id}
        if created_product_id:
            result = await self.make_request("DELETE", f"/products/{created_product_id}", requires_auth=True)
            delete_success = result["status"] == 200
            self.print_test_result("DELETE /api/products/{id} - Delete product", delete_success,
                                  f"Status: {result['status']}, Message: {result.get('data', {}).get('message')}")
            all_passed &= delete_success
        
        # Verify deletion
        if created_product_id:
            result = await self.make_request("GET", f"/products/{created_product_id}")
            verify_delete = result["status"] == 404
            self.print_test_result("Verify deletion - Product not found", verify_delete,
                                  f"Status: {result['status']} (expected 404)")
            all_passed &= verify_delete
        
        return all_passed
    
    async def test_certifications_api(self) -> bool:
        """Test Certifications CRUD operations"""
        print("\n🎓 TESTING CERTIFICATIONS API")
        
        created_cert_id = None
        all_passed = True
        
        # Test GET /api/certifications
        result = await self.make_request("GET", "/certifications")
        get_success = result["status"] == 200 and isinstance(result.get("data"), list)
        initial_count = len(result.get("data", []))
        self.print_test_result("GET /api/certifications - List certifications", get_success,
                              f"Status: {result['status']}, Count: {initial_count}")
        all_passed &= get_success
        
        # Test POST /api/certifications (create)
        cert_data = {
            "name": "Certified Information Systems Security Professional (CISSP)",
            "issuer": "International Information System Security Certification Consortium (ISC)²",
            "credential_id": "CISSP-2024-001234",
            "credential_url": "https://www.isc2.org/Credentials/CISSP",
            "issue_date": "2024-01-15",
            "expiry_date": "2027-01-15",
            "is_active": True,
            "display_order": 1
        }
        
        result = await self.make_request("POST", "/certifications", cert_data, requires_auth=True)
        create_success = result["status"] == 200 and "id" in result.get("data", {})
        
        if create_success:
            created_cert_id = result["data"]["id"]
            self.print_test_result("POST /api/certifications - Create certification", True,
                                  f"Certification created with ID: {created_cert_id}")
        else:
            self.print_test_result("POST /api/certifications - Create certification", False,
                                  f"Status: {result['status']}, Response: {result.get('data', result.get('error'))}")
            all_passed = False
        
        # Test PUT /api/certifications/{id} (update)
        if created_cert_id:
            update_data = {
                "name": "Certified Information Systems Security Professional (CISSP) - Renewed",
                "expiry_date": "2028-01-15"
            }
            
            result = await self.make_request("PUT", f"/certifications/{created_cert_id}", 
                                           update_data, requires_auth=True)
            update_success = result["status"] == 200
            self.print_test_result("PUT /api/certifications/{id} - Update certification", update_success,
                                  f"Status: {result['status']}")
            all_passed &= update_success
        
        # Test DELETE /api/certifications/{id}
        if created_cert_id:
            result = await self.make_request("DELETE", f"/certifications/{created_cert_id}", requires_auth=True)
            delete_success = result["status"] == 200
            self.print_test_result("DELETE /api/certifications/{id} - Delete certification", delete_success,
                                  f"Status: {result['status']}")
            all_passed &= delete_success
        
        return all_passed
    
    async def test_contact_messages_api(self) -> bool:
        """Test Contact Messages API"""
        print("\n📧 TESTING CONTACT MESSAGES API")
        
        created_message_id = None
        all_passed = True
        
        # Test POST /api/contact-messages (public endpoint)
        message_data = {
            "name": "Sarah Johnson",
            "email": "sarah.johnson@techcorp.com",
            "phone": "+1-555-0123",
            "company": "TechCorp Solutions",
            "subject": "GRC Consultation Inquiry",
            "message": "Hi Chaitanya, I came across your portfolio and I'm impressed with your GRC expertise. Our company is looking to improve our risk management framework and compliance processes. Would you be available for a consultation to discuss how we can enhance our GRC practices? We're particularly interested in your risk assessment templates and compliance automation solutions."
        }
        
        result = await self.make_request("POST", "/contact-messages", message_data)
        create_success = result["status"] == 200 and "id" in result.get("data", {})
        
        if create_success:
            created_message_id = result["data"]["id"]
            self.print_test_result("POST /api/contact-messages - Submit message (public)", True,
                                  f"Message submitted with ID: {created_message_id}")
        else:
            self.print_test_result("POST /api/contact-messages - Submit message (public)", False,
                                  f"Status: {result['status']}, Response: {result.get('data', result.get('error'))}")
            all_passed = False
        
        # Test GET /api/contact-messages (admin only)
        result = await self.make_request("GET", "/contact-messages", requires_auth=True)
        get_success = result["status"] == 200 and isinstance(result.get("data"), list)
        message_count = len(result.get("data", []))
        self.print_test_result("GET /api/contact-messages - List messages (admin)", get_success,
                              f"Status: {result['status']}, Message count: {message_count}")
        all_passed &= get_success
        
        # Test DELETE /api/contact-messages/{id} (admin only)
        if created_message_id:
            result = await self.make_request("DELETE", f"/contact-messages/{created_message_id}", requires_auth=True)
            delete_success = result["status"] == 200
            self.print_test_result("DELETE /api/contact-messages/{id} - Delete message", delete_success,
                                  f"Status: {result['status']}")
            all_passed &= delete_success
        
        return all_passed
    
    async def test_profile_api(self) -> bool:
        """Test Profile API"""
        print("\n👤 TESTING PROFILE API")
        
        all_passed = True
        
        # Test GET /api/profile (public endpoint)
        result = await self.make_request("GET", "/profile")
        get_success = result["status"] == 200 and "name" in result.get("data", {})
        profile_name = result.get("data", {}).get("name", "unknown")
        self.print_test_result("GET /api/profile - Get profile (public)", get_success,
                              f"Status: {result['status']}, Name: {profile_name}")
        all_passed &= get_success
        
        # Test PUT /api/profile (admin only)
        update_data = {
            "bio": "Experienced GRC professional with 2+ years in risk management, compliance, and governance. Specialized in developing comprehensive risk assessment frameworks and automated compliance solutions for enterprise environments.",
            "location": "Mumbai, India",
            "phone": "+91-9876543210",
            "experience_years": 2.5
        }
        
        result = await self.make_request("PUT", "/profile", update_data, requires_auth=True)
        update_success = result["status"] == 200
        updated_experience = result.get("data", {}).get("experience_years")
        self.print_test_result("PUT /api/profile - Update profile (admin)", update_success,
                              f"Status: {result['status']}, Experience years: {updated_experience}")
        all_passed &= update_success
        
        return all_passed
    
    async def test_unauthenticated_access(self) -> bool:
        """Test that protected endpoints reject unauthenticated requests"""
        print("\n🔒 TESTING AUTHENTICATION PROTECTION")
        
        all_passed = True
        protected_endpoints = [
            ("POST", "/products", {"name": "test", "slug": "test"}),
            ("PUT", "/products/fake-id", {"name": "test"}),
            ("DELETE", "/products/fake-id", None),
            ("GET", "/contact-messages", None),
            ("PUT", "/profile", {"bio": "test"}),
        ]
        
        # Temporarily clear auth token
        original_token = self.auth_token
        self.auth_token = None
        
        for method, endpoint, data in protected_endpoints:
            result = await self.make_request(method, endpoint, data)
            unauthorized = result["status"] == 401 or result["status"] == 403
            self.print_test_result(f"{method} {endpoint} - Unauthorized access blocked", unauthorized,
                                  f"Status: {result['status']} (expected 401/403)")
            all_passed &= unauthorized
        
        # Restore auth token
        self.auth_token = original_token
        return all_passed
    
    async def run_all_tests(self) -> bool:
        """Run all API tests"""
        print("=" * 60)
        print("🧪 STARTING GRC BACKEND API COMPREHENSIVE TESTS")
        print("=" * 60)
        
        test_results = []
        
        # Health Check
        health_result = await self.test_health_check()
        test_results.append(("Health Check", health_result))
        
        # Authentication (required for other tests)
        auth_result = await self.test_authentication()
        test_results.append(("Authentication", auth_result))
        
        if not auth_result:
            print("\n❌ AUTHENTICATION FAILED - Cannot continue with protected endpoint tests")
            return False
        
        # Protected endpoint tests
        products_result = await self.test_products_api()
        test_results.append(("Products API", products_result))
        
        certifications_result = await self.test_certifications_api()
        test_results.append(("Certifications API", certifications_result))
        
        contact_result = await self.test_contact_messages_api()
        test_results.append(("Contact Messages API", contact_result))
        
        profile_result = await self.test_profile_api()
        test_results.append(("Profile API", profile_result))
        
        # Security tests
        security_result = await self.test_unauthenticated_access()
        test_results.append(("Security Protection", security_result))
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed_count = 0
        total_count = len(test_results)
        
        for test_name, result in test_results:
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{status} {test_name}")
            if result:
                passed_count += 1
        
        print(f"\nResults: {passed_count}/{total_count} test suites passed")
        
        overall_success = passed_count == total_count
        if overall_success:
            print("🎉 ALL TESTS PASSED! Backend API is working correctly.")
        else:
            print("⚠️  SOME TESTS FAILED! Please check the failed tests above.")
        
        return overall_success

async def main():
    """Main test runner"""
    try:
        async with GRCAPITester(BACKEND_URL) as tester:
            success = await tester.run_all_tests()
            sys.exit(0 if success else 1)
    except Exception as e:
        print(f"❌ CRITICAL ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())