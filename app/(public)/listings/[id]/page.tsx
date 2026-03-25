"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  Clock,
  Users,
  Calendar,
  Check,
  X,
  Heart,
  Share2,
  Shield,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Mountain,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import type { Listing, Review, Guide } from "@/lib/data";
import { formatNPR, formatUSD, NPR_TO_USD } from "@/lib/data";

interface ListingWithDetails extends Listing {
  guide: Omit<Guide, "password"> | null;
  reviews: Review[];
}

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState<ListingWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [groupSize, setGroupSize] = useState(1);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setListing(data.listing);
        setIsLoading(false);
      });
  }, [id]);

  const calculatePrice = () => {
    if (!listing) return { subtotal: 0, discount: 0, total: 0 };
    const subtotal = listing.pricePerPerson * groupSize;
    let discount = 0;
    if (listing.groupDiscountPercent > 0 && groupSize >= 3) {
      discount = subtotal * (listing.groupDiscountPercent / 100);
    }
    return {
      subtotal,
      discount,
      total: subtotal - discount,
    };
  };

  const pricing = calculatePrice();

  const handleBookNow = () => {
    if (!user) {
      toast.error("Please log in to book");
      router.push("/login");
      return;
    }
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    // Navigate to booking page
    router.push(`/book/${id}?date=${selectedDate}&groupSize=${groupSize}`);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: listing?.title,
        text: listing?.description,
        url: window.location.href,
      });
    } catch {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Rating distribution calculation
  const getRatingDistribution = () => {
    if (!listing?.reviews) return [];
    const distribution = [0, 0, 0, 0, 0]; // 1-5 stars
    listing.reviews.forEach((review) => {
      distribution[review.rating - 1]++;
    });
    return distribution.reverse(); // 5 stars first
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-4 h-10 w-32" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="aspect-[16/9] w-full rounded-lg" />
            <Skeleton className="mt-4 h-8 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </div>
          <div>
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Listing not found</h1>
        <p className="mt-2 text-muted-foreground">
          The adventure you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild className="mt-4">
          <Link href="/explore">Browse Adventures</Link>
        </Button>
      </div>
    );
  }

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/explore" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <Mountain className="h-24 w-24 text-primary/30" />
              </div>
              {listing.featured && (
                <span className="absolute left-4 top-4 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
                  Featured
                </span>
              )}
              <div className="absolute right-4 top-4 flex gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Title & Meta */}
            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary capitalize">
                  {listing.category}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {listing.region}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {listing.duration} days
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Max {listing.maxGroupSize} people
                </span>
                <span className="rounded-full bg-muted px-3 py-1 capitalize">
                  {listing.difficulty}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold">{listing.title}</h1>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{listing.rating}</span>
                  <span className="text-muted-foreground">
                    ({listing.totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="mt-8">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="details">What&apos;s Included</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                {/* Description */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-xl font-semibold">About This Adventure</h2>
                    <p className="leading-relaxed text-muted-foreground">
                      {listing.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Highlights */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-xl font-semibold">Highlights</h2>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {listing.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <span className="text-muted-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Guide Card */}
                {listing.guide && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="mb-4 text-xl font-semibold">Your Guide</h2>
                      <Link href={`/guides/${listing.guide.id}`} className="flex items-start gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                          {listing.guide.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{listing.guide.name}</h3>
                            {listing.guide.verified && (
                              <Shield className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {listing.guide.location}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{listing.guide.rating}</span>
                            </div>
                            <span className="text-muted-foreground">
                              · {listing.guide.experience} years exp. · {listing.guide.totalTrips} trips
                            </span>
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                            {listing.guide.bio}
                          </p>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="itinerary" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-6 text-xl font-semibold">Day-by-Day Itinerary</h2>
                    <div className="space-y-4">
                      {listing.itinerary.map((day, index) => (
                        <Collapsible
                          key={day.day}
                          open={expandedDay === day.day}
                          onOpenChange={() =>
                            setExpandedDay(expandedDay === day.day ? null : day.day)
                          }
                        >
                          <CollapsibleTrigger className="flex w-full items-center gap-4 rounded-lg border border-border p-4 text-left transition-colors hover:bg-muted">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                              {day.day}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{day.title}</h3>
                              {day.elevation && (
                                <p className="text-sm text-muted-foreground">
                                  Elevation: {day.elevation}
                                  {day.distance && ` · Distance: ${day.distance}`}
                                </p>
                              )}
                            </div>
                            {expandedDay === day.day ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-4 pb-4">
                            <div className="ml-14 mt-2 rounded-lg bg-muted p-4">
                              <p className="text-muted-foreground">{day.description}</p>
                              {day.accommodation && (
                                <p className="mt-2 text-sm">
                                  <strong>Accommodation:</strong> {day.accommodation}
                                </p>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="mt-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Check className="h-5 w-5 text-primary" />
                        What&apos;s Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {listing.included.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <X className="h-5 w-5 text-destructive" />
                        What&apos;s Not Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {listing.excluded.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-2 flex items-center gap-2 font-semibold">
                      <MapPin className="h-5 w-5 text-primary" />
                      Meeting Point
                    </h3>
                    <p className="text-muted-foreground">{listing.meetingPoint}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 space-y-6">
                {/* Rating Overview */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center">
                      <div className="text-center md:text-left">
                        <div className="text-5xl font-bold">{listing.rating}</div>
                        <div className="mt-1 flex items-center justify-center gap-1 md:justify-start">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(listing.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {listing.totalReviews} reviews
                        </p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars, index) => (
                          <div key={stars} className="flex items-center gap-2">
                            <span className="w-3 text-sm">{stars}</span>
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <div className="h-2 flex-1 rounded-full bg-muted">
                              <div
                                className="h-2 rounded-full bg-yellow-400"
                                style={{
                                  width: listing.reviews.length
                                    ? `${(ratingDistribution[index] / listing.reviews.length) * 100}%`
                                    : "0%",
                                }}
                              />
                            </div>
                            <span className="w-8 text-sm text-muted-foreground">
                              {ratingDistribution[index]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews List */}
                {listing.reviews.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Star className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 font-semibold">No reviews yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Be the first to review this adventure!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {listing.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                              {review.touristName.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold">{review.touristName}</h4>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="mt-1 flex gap-0.5">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <p className="mt-2 text-muted-foreground">{review.comment}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {/* Price */}
                <div className="mb-6 text-center">
                  <div className="text-3xl font-bold text-primary">
                    {formatNPR(listing.pricePerPerson)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ({formatUSD(listing.pricePerPerson)}) per person
                  </div>
                  {listing.groupDiscountPercent > 0 && (
                    <p className="mt-1 text-sm text-accent">
                      {listing.groupDiscountPercent}% off for groups of 3+
                    </p>
                  )}
                </div>

                {/* Date Picker */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Select Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        className="pl-10"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>

                  {/* Group Size */}
                  <div className="space-y-2">
                    <Label>Group Size</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                        disabled={groupSize <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center text-lg font-semibold">
                        {groupSize}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setGroupSize(Math.min(listing.maxGroupSize, groupSize + 1))}
                        disabled={groupSize >= listing.maxGroupSize}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        (max {listing.maxGroupSize})
                      </span>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 border-t border-border pt-4">
                    <div className="flex justify-between text-sm">
                      <span>
                        {formatNPR(listing.pricePerPerson)} x {groupSize} {groupSize > 1 ? "people" : "person"}
                      </span>
                      <span>{formatNPR(pricing.subtotal)}</span>
                    </div>
                    {pricing.discount > 0 && (
                      <div className="flex justify-between text-sm text-accent">
                        <span>Group discount ({listing.groupDiscountPercent}%)</span>
                        <span>-{formatNPR(pricing.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-border pt-2 text-lg font-semibold">
                      <span>Total</span>
                      <div className="text-right">
                        <div>{formatNPR(pricing.total)}</div>
                        <div className="text-sm font-normal text-muted-foreground">
                          (~${(pricing.total * NPR_TO_USD).toFixed(2)} USD)
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleBookNow}>
                    Book Now
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    You won&apos;t be charged yet
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
