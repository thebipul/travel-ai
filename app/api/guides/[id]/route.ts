import { NextResponse } from "next/server";
import { guides, listings, reviews } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const guide = guides.find(g => g.id === id);
  
  if (!guide) {
    return NextResponse.json({ error: "Guide not found" }, { status: 404 });
  }

  const guideListings = listings.filter(l => l.guideId === id);
  const guideReviews = reviews.filter(r => 
    guideListings.some(l => l.id === r.listingId)
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...safeGuide } = guide;

  return NextResponse.json({
    guide: {
      ...safeGuide,
      listings: guideListings,
      reviews: guideReviews,
    },
  });
}
