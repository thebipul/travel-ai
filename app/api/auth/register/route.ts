import { NextResponse } from "next/server";
import { guides, tourists } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password, name, role, phone, bio, experience, specialties, certifications, languages, location } = data;

    // Check if email already exists
    const existingGuide = guides.find(g => g.email === email);
    const existingTourist = tourists.find(t => t.email === email);

    if (existingGuide || existingTourist) {
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 400 });
    }

    // Create new user (in real app, this would be saved to database)
    const newId = `${role}-${Date.now()}`;
    
    if (role === "guide") {
      const newGuide = {
        id: newId,
        email,
        name,
        role: "guide" as const,
        phone: phone || "",
        bio: bio || "",
        experience: experience || 0,
        specialties: specialties || [],
        certifications: certifications || [],
        languages: languages || ["English", "Nepali"],
        rating: 0,
        totalReviews: 0,
        totalTrips: 0,
        location: location || "Kathmandu",
        verified: false,
        createdAt: new Date().toISOString().split("T")[0],
      };
      
      return NextResponse.json({ success: true, user: newGuide });
    } else {
      const newTourist = {
        id: newId,
        email,
        password, // In real app, this would be hashed
        name,
        role: "tourist" as const,
        phone: phone || "",
        wishlist: [],
        createdAt: new Date().toISOString().split("T")[0],
      };
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...safeTourist } = newTourist;
      return NextResponse.json({ success: true, user: safeTourist });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
