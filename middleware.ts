import { NextRequest, NextResponse } from "next/server";

async function validateToken(token: string) {
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      }
    );

    const data = await res.json();

    if (!res.ok || !data.users || data.error) {
      throw new Error("Invalid or expired token");
    }

    return true; 
  } catch (err) {
    return false; 
  }
}

function handleUnauthorizedRequest(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/api/")) {
    return new NextResponse("Unauthorized", { status: 401 });
  } else {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const method = req.method;
  const token = req.cookies.get("token")?.value;

 
  if (method === "OPTIONS") {
    return NextResponse.json({}, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400", // 1 day
      },
    });
  }

  // CORS handling for /api/docs
  if (pathname === "/api/docs") {
    const res = NextResponse.next();
    res.headers.set("Content-Type", "application/json");
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  }

  
  if (pathname === "/api/token" || method === "GET") {
    return NextResponse.next();
  }


  if (!token) {
    return handleUnauthorizedRequest(req);
  }

 
  const isTokenValid = await validateToken(token);

  if (isTokenValid) {
    return NextResponse.next();
  } else {
    return handleUnauthorizedRequest(req);
  }
}

export const config = {
  matcher: ["/api/:path*", "/api/docs"],
};
