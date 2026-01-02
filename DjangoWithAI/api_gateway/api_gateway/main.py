from fastapi import FastAPI, Request, HTTPException, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
from jose import jwt, JWTError
import time
from collections import defaultdict
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Microservices API Gateway",
    version="1.0.0",
    description="Central gateway for microservices platform"
)

# CORS Configuration - Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev
        "http://localhost:5173",  # Vite dev
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service URLs - Map service names to backend ports
SERVICE_URLS = {
    "auth": "http://127.0.0.1:8001",
    "pdf": "http://127.0.0.1:8002",
    "ai": "http://127.0.0.1:8003",
    "content": "http://127.0.0.1:8004",
    "db": "http://127.0.0.1:8005"
}

# CRITICAL: Must match the SECRET_KEY in all microservices
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "microservice-shared-secret-key-change-in-production-12345")
ALGORITHM = "HS256"

# Rate limiting storage (in-memory, use Redis in production)
rate_limit_storage = defaultdict(list)
RATE_LIMIT_REQUESTS = 100  # requests per window
RATE_LIMIT_WINDOW = 60     # seconds


def check_rate_limit(client_id: str) -> bool:
    """Simple rate limiter - 100 requests per minute per IP"""
    now = time.time()
    window_start = now - RATE_LIMIT_WINDOW
    
    # Clean old requests
    rate_limit_storage[client_id] = [
        req_time for req_time in rate_limit_storage[client_id]
        if req_time > window_start
    ]
    
    # Check limit
    if len(rate_limit_storage[client_id]) >= RATE_LIMIT_REQUESTS:
        return False
    
    # Add current request
    rate_limit_storage[client_id].append(now)
    return True


@app.get("/")
def read_root():
    return {
        "message": "API Gateway - Microservices Platform",
        "version": "1.0.0",
        "services": list(SERVICE_URLS.keys()),
        "endpoints": {
            "auth": "/api/auth/*",
            "content": "/api/content/*",
            "pdf": "/api/pdf/*",
            "ai": "/api/ai/*",
            "db": "/api/db/*"
        },
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Check health of all services"""
    statuses = {}
    
    async with httpx.AsyncClient(timeout=2.0) as client:
        for service_name, service_url in SERVICE_URLS.items():
            try:
                response = await client.get(f"{service_url}/health")
                statuses[service_name] = {
                    "status": "healthy" if response.status_code < 500 else "unhealthy",
                    "code": response.status_code
                }
            except httpx.TimeoutException:
                statuses[service_name] = {"status": "timeout", "code": 504}
            except Exception as e:
                statuses[service_name] = {"status": "down", "error": str(e)}
    
    all_healthy = all(s.get("status") == "healthy" for s in statuses.values())
    
    return {
        "gateway": "healthy",
        "services": statuses,
        "overall_status": "healthy" if all_healthy else "degraded",
        "timestamp": datetime.now().isoformat()
    }


# JWT Middleware
@app.middleware("http")
async def jwt_and_rate_limit_middleware(request: Request, call_next):
    """
    1. Rate limiting
    2. JWT validation for protected endpoints
    """
    path = request.url.path
    client_ip = request.client.host
    
    # Rate limiting
    if not check_rate_limit(client_ip):
        return JSONResponse(
            status_code=429,
            content={
                "detail": "Rate limit exceeded. Try again later.",
                "retry_after": RATE_LIMIT_WINDOW
            }
        )
    
    # Skip JWT validation for public endpoints
    public_paths = ["/", "/health", "/docs", "/openapi.json", "/redoc"]
    is_auth_endpoint = path.startswith("/api/auth/signup") or path.startswith("/api/auth/login")
    
    if path in public_paths or is_auth_endpoint:
        response = await call_next(request)
        return response
    
    # JWT validation for protected endpoints
    if path.startswith("/api/"):
        auth_header = request.headers.get("Authorization")
        
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content={"detail": "Authentication credentials were not provided."}
            )
        
        try:
            token = auth_header.split(" ")[1]
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            request.state.user = payload
        except JWTError as e:
            return JSONResponse(
                status_code=401,
                content={"detail": f"Invalid token: {str(e)}"}
            )
    
    response = await call_next(request)
    return response


# Dynamic proxy endpoint
@app.api_route(
    "/api/{service}/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
)
async def proxy(service: str, path: str, request: Request):
    """
    Proxy requests to appropriate microservice.
    Handles all HTTP methods and forwards headers.
    """
    if service not in SERVICE_URLS:
        raise HTTPException(
            status_code=404,
            detail=f"Service '{service}' not found. Available: {list(SERVICE_URLS.keys())}"
        )
    
    # Build target URL - remove trailing slash if path is empty
    if path:
        target_url = f"{SERVICE_URLS[service]}/api/{service}/{path}"
    else:
        target_url = f"{SERVICE_URLS[service]}/api/{service}"
    
    # Add trailing slash only if original request had it
    if request.url.path.endswith('/') and not target_url.endswith('/'):
        target_url += '/'
    
    # Prepare headers (forward all except host)
    headers = dict(request.headers)
    headers.pop("host", None)
    
    # Add user info to headers if authenticated
    if hasattr(request.state, "user"):
        headers["X-User-ID"] = str(request.state.user.get("user_id", ""))
        headers["X-User-Email"] = str(request.state.user.get("email", ""))
    
    # Read request body
    body = await request.body()
    
    # Forward request to microservice
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.request(
                method=request.method,
                url=target_url,
                headers=headers,
                content=body,
                params=request.query_params
            )
            
            # Return response with same status code and headers
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=response.headers.get("content-type")
            )
            
        except httpx.TimeoutException:
            return JSONResponse(
                status_code=504,
                content={"detail": f"Service '{service}' timed out"}
            )
        except httpx.RequestError as e:
            return JSONResponse(
                status_code=503,
                content={"detail": f"Service '{service}' unavailable: {str(e)}"}
            )


# Special handling for file uploads (PDF service)
@app.post("/api/pdf/upload")
async def pdf_upload_proxy(request: Request):
    """Special endpoint for PDF uploads with larger timeout"""
    target_url = f"{SERVICE_URLS['pdf']}/api/pdf/upload/"
    
    headers = dict(request.headers)
    headers.pop("host", None)
    
    # Add user info if authenticated
    if hasattr(request.state, "user"):
        headers["X-User-ID"] = str(request.state.user.get("user_id", ""))
    
    body = await request.body()
    
    async with httpx.AsyncClient(timeout=60.0) as client:  # Longer timeout for uploads
        try:
            response = await client.post(
                target_url,
                headers=headers,
                content=body
            )
            
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=response.headers.get("content-type")
            )
        except httpx.TimeoutException:
            return JSONResponse(
                status_code=504,
                content={"detail": "PDF upload timed out"}
            )
        except Exception as e:
            return JSONResponse(
                status_code=500,
                content={"detail": f"PDF upload failed: {str(e)}"}
            )


if __name__ == "__main__":
    import uvicorn
    print(f"🚀 Starting API Gateway on http://0.0.0.0:8080")
    print(f"📚 API Documentation: http://localhost:8080/docs")
    uvicorn.run(app, host="0.0.0.0", port=8080, reload=True)