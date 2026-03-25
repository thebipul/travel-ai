import { NextResponse } from "next/server";
import { guides, tourists } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Check guides
    const guide = guides.find(g => g.email === email && g.password === password);
    if (guide) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...safeGuide } = guide;
      return NextResponse.json({ success: true, user: safeGuide });
    }

    // Check tourists
    const tourist = tourists.find(t => t.email === email && t.password === password);
    if (tourist) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...safeTourist } = tourist;
      return NextResponse.json({ success: true, user: safeTourist });
    }

    return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
