import { NextResponse } from "next/server";
import { bookings, listings, guides, tourists } from "@/lib/data";

// In-memory store (shared with main route in real app)
const bookingUpdates: Map<string, Partial<typeof bookings[0]>> = new Map();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const booking = bookings.find(b => b.id === id);
  
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const updates = bookingUpdates.get(id) || {};
  const updatedBooking = { ...booking, ...updates };

  const listing = listings.find(l => l.id === updatedBooking.listingId);
  const guide = guides.find(g => g.id === updatedBooking.guideId);
  const tourist = tourists.find(t => t.id === updatedBooking.touristId);

  return NextResponse.json({
    booking: {
      ...updatedBooking,
      listing: listing || null,
      guide: guide ? {
        id: guide.id,
        name: guide.name,
        avatar: guide.avatar,
        phone: guide.phone,
        email: guide.email,
      } : null,
      tourist: tourist ? {
        id: tourist.id,
        name: tourist.name,
        email: tourist.email,
        phone: tourist.phone,
      } : null,
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const updates = await request.json();
    
    const booking = bookings.find(b => b.id === id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Store updates
    const existing = bookingUpdates.get(id) || {};
    bookingUpdates.set(id, { ...existing, ...updates });

    return NextResponse.json({ 
      success: true, 
      booking: { ...booking, ...bookingUpdates.get(id) } 
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
