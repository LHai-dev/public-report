import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {}

export const config = {
  matcher: ["/dashboard/:path*"],
};
