import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

async function proxy(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const { path } = await context.params;
  const url = new URL(request.url);
  const target = new URL(`${BACKEND_URL.replace(/\/$/, "")}/api/${path.join("/")}`);
  target.search = url.search;

  const headers = new Headers(request.headers);
  headers.set("x-clerk-user-id", userId);
  headers.delete("host");

  const response = await fetch(target, {
    method: request.method,
    headers,
    redirect: "manual",
    body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
