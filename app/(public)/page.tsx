"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  Users,
  Mountain,
  TreePine,
  Landmark,
  Sparkles,
  Footprints,
  TrendingUp,
  Star,
  Shield,
  Heart,
  MapPin,
  Clock,
  ChevronRight,
  ArrowRight,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { listings, guides, formatNPR, formatUSD } from "@/lib/data";

const categories = [
  { id: "trekking", name: "Trekking", icon: Mountain, color: "bg-blue-500" },
  { id: "climbing", name: "Climbing", icon: TrendingUp, color: "bg-red-500" },
  { id: "cultural", name: "Cultural", icon: Landmark, color: "bg-yellow-500" },
  { id: "safari", name: "Safari", icon: TreePine, color: "bg-green-500" },
  { id: "spiritual", name: "Spiritual", icon: Sparkles, color: "bg-purple-500" },
  { id: "hiking", name: "Hiking", icon: Footprints, color: "bg-orange-500" },
];

const howItWorks = [
  {
    step: 1,
    title: "Discover Adventures",
    description: "Browse our curated collection of authentic Nepal experiences led by local experts.",
  },
  {
    step: 2,
    title: "Connect with Guides",
    description: "Chat with verified local guides and customize your perfect trip.",
  },
  {
    step: 3,
    title: "Book with Confidence",
    description: "Secure your adventure with our protected booking system.",
  },
  {
    step: 4,
    title: "Create Memories",
    description: "Embark on your journey with expert guidance and local insights.",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    location: "United States",
    text: "TrailMate connected me with Pasang, who made my Everest Base Camp trek truly unforgettable. His knowledge of the region and genuine care for our group was exceptional.",
    rating: 5,
    trip: "Everest Base Camp Trek",
  },
  {
    name: "Thomas Weber",
    location: "Germany",
    text: "The Annapurna Circuit with Ramesh was incredible. He knew all the hidden gems and made sure we experienced authentic Nepali culture along the way.",
    rating: 5,
    trip: "Annapurna Circuit",
  },
  {
    name: "Yuki Tanaka",
    location: "Japan",
    text: "Maya was an amazing guide for our cultural tour. As a solo female traveler, I felt completely safe and welcomed. Highly recommend TrailMate!",
    rating: 5,
    trip: "Kathmandu Cultural Tour",
  },
];

// Prayer flag colors for decoration
const prayerFlagColors = ["bg-blue-500", "bg-white", "bg-red-500", "bg-green-600", "bg-yellow-400"];

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const featuredListings = listings.filter((l) => l.featured).slice(0, 6);
  const featuredGuides = guides.filter((g) => g.verified).slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/explore?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        {/* Prayer flag decoration at top */}
        <div className="absolute top-0 left-0 right-0 flex h-2">
          {prayerFlagColors.map((color, i) => (
            <div key={i} className={`flex-1 ${color} opacity-60`} />
          ))}
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Discover Nepal with{" "}
              <span className="text-primary">Local Experts</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
              Connect with verified local guides for authentic trekking, cultural tours, and adventure experiences across the Himalayas.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-2xl">
              <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-lg md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Where do you want to go? (e.g., Everest, Annapurna)"
                    className="border-0 pl-10 shadow-none focus-visible:ring-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">Any Date</span>
                  </Button>
                  <Button type="button" variant="outline" className="gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Guests</span>
                  </Button>
                  <Button type="submit" className="gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Happy Travelers</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-3xl font-bold text-primary">50+</p>
                <p className="text-sm text-muted-foreground">Expert Guides</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-3xl font-bold text-primary">100+</p>
                <p className="text-sm text-muted-foreground">Unique Tours</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-3xl font-bold text-primary">4.9</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="border-y border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  href={`/explore?category=${category.id}`}
                  className="group flex flex-col items-center gap-2 rounded-xl p-4 transition-colors hover:bg-muted"
                >
                  <div className={`rounded-full ${category.color} p-4 text-white transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold">Popular Adventures</h2>
              <p className="mt-2 text-muted-foreground">
                Most booked experiences by travelers
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link href="/explore" className="gap-2">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredListings.map((listing) => {
              const guide = guides.find((g) => g.id === listing.guideId);
              return (
                <Link key={listing.id} href={`/listings/${listing.id}`}>
                  <Card className="group overflow-hidden transition-all hover:shadow-lg">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                        <Mountain className="h-16 w-16 text-primary/30" />
                      </div>
                      {listing.featured && (
                        <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                          Featured
                        </span>
                      )}
                      <button
                        className="absolute right-3 top-3 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to wishlist logic
                        }}
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {listing.region}
                        <span className="mx-1">·</span>
                        <Clock className="h-4 w-4" />
                        {listing.duration} days
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary">
                        {listing.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {guide?.name.charAt(0)}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          with {guide?.name}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-primary">
                            {formatNPR(listing.pricePerPerson)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {" "}({formatUSD(listing.pricePerPerson)})
                          </span>
                          <span className="text-sm text-muted-foreground"> /person</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{listing.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({listing.totalReviews})
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button asChild>
              <Link href="/explore" className="gap-2">
                View all adventures <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">Meet Our Expert Guides</h2>
            <p className="mt-2 text-muted-foreground">
              Passionate locals who bring Nepal to life
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredGuides.map((guide) => (
              <Link key={guide.id} href={`/guides/${guide.id}`}>
                <Card className="group overflow-hidden text-center transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                      {guide.name.charAt(0)}
                    </div>
                    <h3 className="font-semibold group-hover:text-primary">
                      {guide.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {guide.location}
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{guide.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({guide.totalReviews} reviews)
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap justify-center gap-1">
                      {guide.specialties.slice(0, 2).map((specialty) => (
                        <span
                          key={specialty}
                          className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
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

          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/guides" className="gap-2">
                View all guides <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">How TrailMate Works</h2>
            <p className="mt-2 text-muted-foreground">
              Your journey to Nepal, simplified
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-1/2 bg-gradient-to-r from-primary to-transparent lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">What Travelers Say</h2>
            <p className="mt-2 opacity-80">
              Real experiences from our community
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="bg-primary-foreground/10 border-primary-foreground/20">
                <CardContent className="p-6 text-primary-foreground">
                  <Quote className="mb-4 h-8 w-8 opacity-50" />
                  <p className="mb-4 text-sm leading-relaxed opacity-90">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="mb-2 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm opacity-70">{testimonial.location}</p>
                  <p className="mt-1 text-xs opacity-50">{testimonial.trip}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 text-center text-primary-foreground md:p-12">
            <h2 className="text-3xl font-bold md:text-4xl">
              Ready for Your Nepal Adventure?
            </h2>
            <p className="mx-auto mt-4 max-w-xl opacity-90">
              Join thousands of travelers who have discovered the magic of Nepal with our expert local guides.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/explore">Explore Adventures</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/register?role=guide">Become a Guide</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
