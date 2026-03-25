"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Star,
  Shield,
  MapPin,
  Clock,
  Users,
  Globe,
  Award,
  Mountain,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Guide, Listing, Review } from "@/lib/data";
import { formatNPR, formatUSD } from "@/lib/data";

interface GuideWithDetails extends Omit<Guide, "password"> {
  listings: Listing[];
  reviews: Review[];
}

export default function GuideProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [guide, setGuide] = useState<GuideWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/guides/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setGuide(data.guide);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-10 w-32" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="mx-auto h-32 w-32 rounded-full" />
                <Skeleton className="mx-auto mt-4 h-6 w-40" />
                <Skeleton className="mx-auto mt-2 h-4 w-32" />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Guide not found</h1>
        <p className="mt-2 text-muted-foreground">
          The guide you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild className="mt-4">
          <Link href="/guides">Browse Guides</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/guides" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            All Guides
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar - Guide Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {/* Avatar */}
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-primary text-5xl font-bold text-primary-foreground">
                  {guide.name.charAt(0)}
                </div>

                {/* Name & Location */}
                <h1 className="mt-4 text-center text-2xl font-bold">{guide.name}</h1>
                <p className="mt-1 flex items-center justify-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {guide.location}
                </p>

                {/* Verified Badge */}
                {guide.verified && (
                  <div className="mt-3 flex items-center justify-center gap-1 text-primary">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Verified Guide</span>
                  </div>
                )}

                {/* Rating */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-bold">{guide.rating}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ({guide.totalReviews} reviews)
                  </span>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{guide.experience}</p>
                    <p className="text-xs text-muted-foreground">Years Exp.</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{guide.totalTrips}</p>
                    <p className="text-xs text-muted-foreground">Total Trips</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{guide.listings.length}</p>
                    <p className="text-xs text-muted-foreground">Active Tours</p>
                  </div>
                </div>

                {/* Languages */}
                <div className="mt-6 border-t border-border pt-6">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Globe className="h-4 w-4" />
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {guide.languages.map((lang) => (
                      <span
                        key={lang}
                        className="rounded-full bg-muted px-3 py-1 text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="mt-6 border-t border-border pt-6">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Award className="h-4 w-4" />
                    Certifications
                  </h3>
                  <ul className="space-y-1">
                    {guide.certifications.map((cert) => (
                      <li key={cert} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact Button */}
                <Button className="mt-6 w-full">
                  Contact {guide.name.split(" ")[0]}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about">
              <TabsList className="mb-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="tours">Tours ({guide.listings.length})</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({guide.reviews.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                {/* Bio */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-xl font-semibold">About {guide.name}</h2>
                    <p className="leading-relaxed text-muted-foreground">{guide.bio}</p>
                  </CardContent>
                </Card>

                {/* Specialties */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-xl font-semibold">Specialties</h2>
                    <div className="flex flex-wrap gap-2">
                      {guide.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tours">
                {guide.listings.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Mountain className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 font-semibold">No tours available</h3>
                      <p className="text-sm text-muted-foreground">
                        This guide hasn&apos;t listed any tours yet.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {guide.listings.map((listing) => (
                      <Link key={listing.id} href={`/listings/${listing.id}`}>
                        <Card className="group h-full transition-all hover:shadow-lg">
                          <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg bg-muted">
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                              <Mountain className="h-12 w-12 text-primary/30" />
                            </div>
                            <button
                              className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 backdrop-blur-sm"
                              onClick={(e) => e.preventDefault()}
                            >
                              <Heart className="h-4 w-4" />
                            </button>
                          </div>
                          <CardContent className="p-4">
                            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {listing.region}
                              <span className="mx-1">·</span>
                              <Clock className="h-3 w-3" />
                              {listing.duration} days
                            </div>
                            <h3 className="font-semibold group-hover:text-primary">
                              {listing.title}
                            </h3>
                            <div className="mt-3 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-primary">
                                  {formatNPR(listing.pricePerPerson)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {" "}({formatUSD(listing.pricePerPerson)})
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{listing.rating}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews">
                {guide.reviews.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Star className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 font-semibold">No reviews yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Be the first to review this guide!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {guide.reviews.map((review) => (
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
                              <p className="mt-2 text-sm text-muted-foreground">
                                {review.comment}
                              </p>
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
        </div>
      </div>
    </div>
  );
}
