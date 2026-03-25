import { NextResponse } from "next/server";
import { guides, listings } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  let filtered = [...guides];

  // Filter by specialty
  const specialty = searchParams.get("specialty");
  if (specialty) {
    filtered = filtered.filter(g => 
      g.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
    );
  }

  // Filter by verified
  const verified = searchParams.get("verified");
  if (verified === "true") {
    filtered = filtered.filter(g => g.verified);
  }

  // Filter by minimum rating
  const minRating = searchParams.get("minRating");
  if (minRating) {
    filtered = filtered.filter(g => g.rating >= parseFloat(minRating));
  }

  // Sort
  const sortBy = searchParams.get("sortBy") || "rating";
  switch (sortBy) {
    case "experience":
      filtered.sort((a, b) => b.experience - a.experience);
      break;
    case "trips":
      filtered.sort((a, b) => b.totalTrips - a.totalTrips);
      break;
    default:
      filtered.sort((a, b) => b.rating - a.rating);
  }

  // Add listing count to each guide
  const guidesWithListings = filtered.map(guide => {
    const guideListings = listings.filter(l => l.guideId === guide.id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeGuide } = guide;
    return {
      ...safeGuide,
      listingCount: guideListings.length,
    };
  });

  return NextResponse.json({ guides: guidesWithListings });
}
