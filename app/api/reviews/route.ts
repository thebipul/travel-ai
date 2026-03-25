import { NextResponse } from "next/server";
import { reviews } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  let filtered = [...reviews];

  // Filter by listing ID
  const listingId = searchParams.get("listingId");
  if (listingId) {
    filtered = filtered.filter(r => r.listingId === listingId);
  }

  // Filter by tourist ID
  const touristId = searchParams.get("touristId");
  if (touristId) {
    filtered = filtered.filter(r => r.touristId === touristId);
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ reviews: filtered });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { listingId, touristId, touristName, touristAvatar, rating, comment } = data;

    const newReview = {
      id: `review-${Date.now()}`,
      listingId,
      touristId,
      touristName,
      touristAvatar,
      rating,
      comment,
      createdAt: new Date().toISOString().split("T")[0],
    };

    return NextResponse.json({ success: true, review: newReview });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
