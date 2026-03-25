import { NextResponse } from "next/server";
import { listings, guides, reviews } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const listing = listings.find(l => l.id === id);
  
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const guide = guides.find(g => g.id === listing.guideId);
  const listingReviews = reviews.filter(r => r.listingId === id);

  return NextResponse.json({
    listing: {
      ...listing,
      guide: guide ? {
        id: guide.id,
        name: guide.name,
        avatar: guide.avatar,
        bio: guide.bio,
        rating: guide.rating,
        totalReviews: guide.totalReviews,
        totalTrips: guide.totalTrips,
        experience: guide.experience,
        languages: guide.languages,
        verified: guide.verified,
        location: guide.location,
      } : null,
      reviews: listingReviews,
    },
  });
}
