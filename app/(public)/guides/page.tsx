"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Shield, MapPin, Award, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Guide } from "@/lib/data";

export default function GuidesPage() {
  const [guides, setGuides] = useState<(Guide & { listingCount: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/guides")
      .then((res) => res.json())
      .then((data) => {
        setGuides(data.guides);
        setIsLoading(false);
      });
  }, []);

  const filteredGuides = guides.filter((guide) =>
    guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
    guide.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-center text-3xl font-bold md:text-4xl">
            Our Expert <span className="text-primary">Guides</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Meet the passionate local experts who will make your Nepal adventure unforgettable
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, specialty, or location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="mx-auto h-24 w-24 rounded-full" />
                    <Skeleton className="mx-auto mt-4 h-5 w-32" />
                    <Skeleton className="mx-auto mt-2 h-4 w-24" />
                    <Skeleton className="mx-auto mt-4 h-4 w-full" />
                    <Skeleton className="mx-auto mt-2 h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredGuides.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No guides found</h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your search query
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredGuides.map((guide) => (
                <Link key={guide.id} href={`/guides/${guide.id}`}>
                  <Card className="group h-full transition-all hover:shadow-lg">
                    <CardContent className="p-6">
                      {/* Avatar */}
                      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground transition-transform group-hover:scale-105">
                        {guide.name.charAt(0)}
                      </div>

                      {/* Name & Location */}
                      <h3 className="text-center font-semibold group-hover:text-primary">
                        {guide.name}
                      </h3>
                      <p className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {guide.location}
                      </p>

                      {/* Rating */}
                      <div className="mt-3 flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{guide.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({guide.totalReviews} reviews)
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="mt-4 flex justify-center gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-primary">{guide.experience}</p>
                          <p className="text-xs text-muted-foreground">Years</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-primary">{guide.totalTrips}</p>
                          <p className="text-xs text-muted-foreground">Trips</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-primary">{guide.listingCount}</p>
                          <p className="text-xs text-muted-foreground">Tours</p>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="mt-4 flex flex-wrap justify-center gap-1">
                        {guide.specialties.slice(0, 2).map((specialty) => (
                          <span
                            key={specialty}
                            className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>

                      {/* Verified Badge */}
                      {guide.verified && (
                        <div className="mt-4 flex items-center justify-center gap-1 text-sm text-primary">
                          <Shield className="h-4 w-4" />
                          Verified Guide
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Become a Guide CTA */}
      <section className="border-t border-border bg-muted/50 py-12">
        <div className="container mx-auto px-4 text-center">
          <Award className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-2xl font-bold">Are You a Local Guide?</h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
            Join TrailMate and connect with travelers from around the world. Share your expertise and grow your business.
          </p>
          <Button asChild className="mt-6">
            <Link href="/register?role=guide">Become a Guide</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
