import { NextResponse } from "next/server";
import { bookings, listings, guides, tourists } from "@/lib/data";

// In-memory store for new bookings (resets on server restart)
const newBookings: typeof bookings = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const allBookings = [...bookings, ...newBookings];
  let filtered = [...allBookings];

  // Filter by tourist ID
  const touristId = searchParams.get("touristId");
  if (touristId) {
    filtered = filtered.filter(b => b.touristId === touristId);
  }

  // Filter by guide ID
  const guideId = searchParams.get("guideId");
  if (guideId) {
    filtered = filtered.filter(b => b.guideId === guideId);
  }

  // Filter by status
  const status = searchParams.get("status");
  if (status && status !== "all") {
    filtered = filtered.filter(b => b.status === status);
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Add listing and user details
  const bookingsWithDetails = filtered.map(booking => {
    const listing = listings.find(l => l.id === booking.listingId);
    const guide = guides.find(g => g.id === booking.guideId);
    const tourist = tourists.find(t => t.id === booking.touristId);

    return {
      ...booking,
      listing: listing ? {
        id: listing.id,
        title: listing.title,
        category: listing.category,
        duration: listing.duration,
        images: listing.images,
        pricePerPerson: listing.pricePerPerson,
      } : null,
      guide: guide ? {
        id: guide.id,
        name: guide.name,
        avatar: guide.avatar,
      } : null,
      tourist: tourist ? {
        id: tourist.id,
        name: tourist.name,
        email: tourist.email,
      } : null,
    };
  });

  return NextResponse.json({ bookings: bookingsWithDetails });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { listingId, touristId, date, groupSize, notes } = data;

    const listing = listings.find(l => l.id === listingId);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Calculate total price
    let totalPrice = listing.pricePerPerson * groupSize;
    if (listing.groupDiscountPercent > 0 && groupSize >= 3) {
      totalPrice = totalPrice * (1 - listing.groupDiscountPercent / 100);
    }

    const newBooking = {
      id: `booking-${Date.now()}`,
      listingId,
      touristId,
      guideId: listing.guideId,
      date,
      groupSize,
      totalPrice: Math.round(totalPrice),
      status: "pending" as const,
      paymentStatus: "pending" as const,
      createdAt: new Date().toISOString().split("T")[0],
      notes,
    };

    newBookings.push(newBooking);

    return NextResponse.json({ success: true, booking: newBooking });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
