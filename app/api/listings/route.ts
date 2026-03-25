import { NextResponse } from "next/server";
import { listings, guides } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  let filtered = [...listings];

  // Filter by category
  const category = searchParams.get("category");
  if (category && category !== "all") {
    filtered = filtered.filter(l => l.category === category);
  }

  // Filter by region
  const region = searchParams.get("region");
  if (region && region !== "all") {
    filtered = filtered.filter(l => l.region === region);
  }

  // Filter by difficulty
  const difficulty = searchParams.get("difficulty");
  if (difficulty && difficulty !== "all") {
    filtered = filtered.filter(l => l.difficulty === difficulty);
  }

  // Filter by duration (max days)
  const maxDuration = searchParams.get("maxDuration");
  if (maxDuration) {
    filtered = filtered.filter(l => l.duration <= parseInt(maxDuration));
  }

  // Filter by price (max price)
  const maxPrice = searchParams.get("maxPrice");
  if (maxPrice) {
    filtered = filtered.filter(l => l.pricePerPerson <= parseInt(maxPrice));
  }

  // Filter by minimum rating
  const minRating = searchParams.get("minRating");
  if (minRating) {
    filtered = filtered.filter(l => l.rating >= parseFloat(minRating));
  }

  // Filter by guide ID
  const guideId = searchParams.get("guideId");
  if (guideId) {
    filtered = filtered.filter(l => l.guideId === guideId);
  }

  // Filter by featured
  const featured = searchParams.get("featured");
  if (featured === "true") {
    filtered = filtered.filter(l => l.featured);
  }

  // Search by title
  const search = searchParams.get("search");
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(l => 
      l.title.toLowerCase().includes(searchLower) ||
      l.description.toLowerCase().includes(searchLower) ||
      l.region.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  const sortBy = searchParams.get("sortBy") || "featured";
  switch (sortBy) {
    case "price-low":
      filtered.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
      break;
    case "price-high":
      filtered.sort((a, b) => b.pricePerPerson - a.pricePerPerson);
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "duration-short":
      filtered.sort((a, b) => a.duration - b.duration);
      break;
    case "duration-long":
      filtered.sort((a, b) => b.duration - a.duration);
      break;
    case "newest":
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    default:
      // Featured first, then by rating
      filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
      });
  }

  // Add guide info to each listing
  const listingsWithGuides = filtered.map(listing => {
    const guide = guides.find(g => g.id === listing.guideId);
    return {
      ...listing,
      guide: guide ? {
        id: guide.id,
        name: guide.name,
        avatar: guide.avatar,
        rating: guide.rating,
        totalReviews: guide.totalReviews,
        verified: guide.verified,
      } : null,
    };
  });

  return NextResponse.json({ listings: listingsWithGuides });
}
