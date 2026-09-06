import time
from collections import defaultdict
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response, JSONResponse

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Injects industry-standard HTTP security headers into every response
    to protect against XSS, Clickjacking, MIME sniffing, and cross-origin leaks.
    """
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        return response

class RateLimiterMiddleware(BaseHTTPMiddleware):
    """
    Sliding-window IP rate limiter protecting heavy mathematical endpoints
    (Genetic Algorithm, Monte Carlo, Backtest, Crawlers) against DoS and brute-force attacks.
    """
    def __init__(self, app):
        super().__init__(app)
        # Store timestamps per IP: ip -> list of float timestamps
        self.request_records = defaultdict(list)
        # Separate record for heavy algorithmic operations
        self.heavy_records = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        window_seconds = 60.0

        path = request.url.path

        # 1. Heavy endpoint throttling (/api/predict, /api/backtest/run, /api/sync)
        if any(h in path for h in ["/api/predict/generate_tickets", "/api/backtest/run", "/api/sync"]):
            heavy_list = [t for t in self.heavy_records[client_ip] if now - t < window_seconds]
            if len(heavy_list) >= 20: # Max 20 heavy calculations per minute per IP
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "error": "Rate limit exceeded",
                        "message": "Quá nhiều yêu cầu tính toán thuật toán phức tạp. Vui lòng chờ 30 giây trước khi thử lại."
                    }
                )
            heavy_list.append(now)
            self.heavy_records[client_ip] = heavy_list

        # 2. General endpoint throttling
        all_list = [t for t in self.request_records[client_ip] if now - t < window_seconds]
        if len(all_list) >= 150: # Max 150 requests per minute
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": "Rate limit exceeded",
                    "message": "Tần suất gửi yêu cầu quá nhanh. Vui lòng giảm tần suất thao tác."
                }
            )
        all_list.append(now)
        self.request_records[client_ip] = all_list

        return await call_next(request)
