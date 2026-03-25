"use client";

import { use, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Mountain, MapPin, Clock, Users, Calendar,
  CheckCircle, Shield, CreditCard, AlertCircle, Loader2,
  Star, User, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import { listings, guides, formatNPR, formatUSD } from "@/lib/data";
import { toast } from "sonner";

export default function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const date = searchParams.get("date") ?? "";
  const groupSize = parseInt(searchParams.get("groupSize") ?? "1", 10);

  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const listing = listings.find((l) => l.id === id);
  const guide = listing ? guides.find((g) => g.id === listing.guideId) : null;

  // Redirect if not logged in
  if (!user) {
    router.push("/login");
    return null;
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <Mountain className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold">Listing not found</h1>
        <p className="mt-2 text-muted-foreground">This tour no longer exists.</p>
        <Button className="mt-6" asChild>
          <Link href="/explore">Browse Adventures</Link>
        </Button>
      </div>
    );
  }

  // Price calculation
  const subtotal = listing.pricePerPerson * groupSize;
  const discount = listing.groupDiscountPercent > 0 && groupSize >= 3
    ? subtotal * (listing.groupDiscountPercent / 100)
    : 0;
  const total = subtotal - discount;

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "No date selected";

  const handleConfirm = async () => {
    if (!date) {
      toast.error("No date selected — go back and pick a date");
      return;
    }
    if (user.role !== "tourist") {
      toast.error("Only tourists can make bookings");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: id,
          touristId: user.id,
          date,
          groupSize,
          notes: notes.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConfirmed(true);
      } else {
        toast.error(data.error ?? "Booking failed. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold">Booking Requested!</h1>
        <p className="mt-3 text-muted-foreground">
          Your booking for <span className="font-semibold text-foreground">{listing.title}</span> has been sent to {guide?.name}. You&apos;ll receive a confirmation once they accept.
        </p>

        <div className="mt-6 rounded-xl border border-border bg-card p-5 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tour</span>
            <span className="font-medium">{listing.title}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{formattedDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Group size</span>
            <span className="font-medium">{groupSize} person{groupSize !== 1 ? "s" : ""}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-primary">{formatNPR(total)}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/tourist/dashboard">View My Bookings</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/explore">Explore More</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ── Booking form ──────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Back */}
      <Link
        href={`/listings/${id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to listing
      </Link>

      <h1 className="text-2xl font-bold mb-6">Confirm Your Booking</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: details + notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Listing summary */}
          <Card>
            <CardContent className="p-5">
              <div className="flex gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-accent/20">
                  <Mountain className="h-8 w-8 text-primary/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-lg leading-snug">{listing.title}</h2>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{listing.region}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{listing.duration} days</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      {listing.rating} ({listing.totalReviews} reviews)
                    </span>
                  </div>
                  {guide && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {guide.name.charAt(0)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        with <span className="text-foreground font-medium">{guide.name}</span>
                        {guide.verified && <Shield className="ml-1 inline h-3.5 w-3.5 text-primary" />}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trip details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Trip Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                  <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Start Date</p>
                    <p className="font-semibold">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                  <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Group Size</p>
                    <p className="font-semibold">{groupSize} person{groupSize !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Meeting Point</p>
                  <p className="font-semibold">{listing.meetingPoint}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's included */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">What&apos;s Included</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {listing.included.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" /> Notes for Guide
                <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any special requirements, fitness concerns, celebration, or questions for the guide…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Booker info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" /> Booked by
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">{user.name}</p>
              <p className="text-muted-foreground">{user.email}</p>
              {user.phone && <p className="text-muted-foreground">{user.phone}</p>}
            </CardContent>
          </Card>
        </div>

        {/* Right: price summary */}
        <div className="space-y-4">
          <Card className="sticky top-24">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Price Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {formatNPR(listing.pricePerPerson)} × {groupSize} person{groupSize !== 1 ? "s" : ""}
                  </span>
                  <span>{formatNPR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Group discount ({listing.groupDiscountPercent}%)</span>
                    <span>−{formatNPR(discount)}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">{formatNPR(total)}</p>
                  <p className="text-xs text-muted-foreground">{formatUSD(total)}</p>
                </div>
              </div>

              {/* Payment note */}
              <div className="flex items-start gap-2.5 rounded-lg bg-muted/50 p-3">
                <CreditCard className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Payment is collected at the meeting point before the trek begins. No online payment required now.
                </p>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleConfirm}
                disabled={isSubmitting || !date}
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Confirming…</>
                ) : (
                  "Confirm Booking"
                )}
              </Button>

              {!date && (
                <div className="flex items-center gap-2 text-xs text-amber-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  No date selected — go back to pick one
                </div>
              )}

              {/* Policies */}
              <div className="space-y-2 pt-1">
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-green-600" />
                  Free cancellation up to 48 hours before start
                </div>
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
                  Verified guide — background checked
                </div>
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-green-600" />
                  Booking protected by TrailMate guarantee
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
