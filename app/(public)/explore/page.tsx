"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Grid,
  List,
  MapPin,
  Clock,
  Star,
  Heart,
  Mountain,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { categories, regions, difficulties, formatNPR, formatUSD, type Listing } from "@/lib/data";

interface ListingWithGuide extends Listing {
  guide: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    verified: boolean;
  } | null;
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [listings, setListings] = useState<ListingWithGuide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get("region") || "all");
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get("difficulty") || "all");
  const [maxPrice, setMaxPrice] = useState([500000]);
  const [maxDuration, setMaxDuration] = useState([30]);
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch listings
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedRegion !== "all") params.set("region", selectedRegion);
    if (selectedDifficulty !== "all") params.set("difficulty", selectedDifficulty);
    if (maxPrice[0] < 500000) params.set("maxPrice", maxPrice[0].toString());
    if (maxDuration[0] < 30) params.set("maxDuration", maxDuration[0].toString());
    params.set("sortBy", sortBy);

    setIsLoading(true);
    fetch(`/api/listings?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data.listings);
        setIsLoading(false);
      });
  }, [searchQuery, selectedCategory, selectedRegion, selectedDifficulty, maxPrice, maxDuration, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedRegion("all");
    setSelectedDifficulty("all");
    setMaxPrice([500000]);
    setMaxDuration([30]);
    router.push("/explore");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "all" ||
    selectedRegion !== "all" ||
    selectedDifficulty !== "all" ||
    maxPrice[0] < 500000 ||
    maxDuration[0] < 30;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="mb-3 font-semibold">Category</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="cat-all"
              checked={selectedCategory === "all"}
              onCheckedChange={() => setSelectedCategory("all")}
            />
            <Label htmlFor="cat-all" className="cursor-pointer">All Categories</Label>
          </div>
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.id}`}
                checked={selectedCategory === cat.id}
                onCheckedChange={() => setSelectedCategory(cat.id)}
              />
              <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer">{cat.name}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Region */}
      <div>
        <h3 className="mb-3 font-semibold">Region</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="reg-all"
              checked={selectedRegion === "all"}
              onCheckedChange={() => setSelectedRegion("all")}
            />
            <Label htmlFor="reg-all" className="cursor-pointer">All Regions</Label>
          </div>
          {regions.map((region) => (
            <div key={region} className="flex items-center gap-2">
              <Checkbox
                id={`reg-${region}`}
                checked={selectedRegion === region}
                onCheckedChange={() => setSelectedRegion(region)}
              />
              <Label htmlFor={`reg-${region}`} className="cursor-pointer text-sm">{region}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <h3 className="mb-3 font-semibold">Difficulty</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="diff-all"
              checked={selectedDifficulty === "all"}
              onCheckedChange={() => setSelectedDifficulty("all")}
            />
            <Label htmlFor="diff-all" className="cursor-pointer">All Levels</Label>
          </div>
          {difficulties.map((diff) => (
            <div key={diff.id} className="flex items-center gap-2">
              <Checkbox
                id={`diff-${diff.id}`}
                checked={selectedDifficulty === diff.id}
                onCheckedChange={() => setSelectedDifficulty(diff.id)}
              />
              <Label htmlFor={`diff-${diff.id}`} className="cursor-pointer">{diff.name}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-3 font-semibold">Max Price</h3>
        <Slider
          value={maxPrice}
          onValueChange={setMaxPrice}
          max={500000}
          min={5000}
          step={5000}
          className="mb-2"
        />
        <p className="text-sm text-muted-foreground">
          Up to {formatNPR(maxPrice[0])} ({formatUSD(maxPrice[0])})
        </p>
      </div>

      {/* Duration */}
      <div>
        <h3 className="mb-3 font-semibold">Max Duration</h3>
        <Slider
          value={maxDuration}
          onValueChange={setMaxDuration}
          max={30}
          min={1}
          step={1}
          className="mb-2"
        />
        <p className="text-sm text-muted-foreground">Up to {maxDuration[0]} days</p>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-card py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search adventures..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="duration-short">Duration: Short</SelectItem>
                  <SelectItem value="duration-long">Duration: Long</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="hidden items-center rounded-md border border-border md:flex">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-muted" : ""}`}
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-muted" : ""}`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Filter Button */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden w-64 shrink-0 md:block">
            <div className="sticky top-24">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Listings */}
          <div className="flex-1">
            {/* Results Count */}
            <p className="mb-4 text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${listings.length} adventures found`}
            </p>

            {isLoading ? (
              <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="aspect-[4/3]" />
                    <CardContent className="p-4">
                      <Skeleton className="mb-2 h-4 w-24" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="mt-2 h-4 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="py-16 text-center">
                <Mountain className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No adventures found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((listing) => (
                  <Link key={listing.id} href={`/listings/${listing.id}`}>
                    <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
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
                          onClick={(e) => e.preventDefault()}
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-3 left-3 rounded-full bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                          {listing.difficulty.charAt(0).toUpperCase() + listing.difficulty.slice(1)}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {listing.region}
                          <span className="mx-1">·</span>
                          <Clock className="h-4 w-4" />
                          {listing.duration} days
                        </div>
                        <h3 className="font-semibold group-hover:text-primary">
                          {listing.title}
                        </h3>
                        {listing.guide && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                              {listing.guide.name.charAt(0)}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              with {listing.guide.name}
                            </span>
                          </div>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-primary">
                              {formatNPR(listing.pricePerPerson)}
                            </span>
                            <span className="text-sm text-muted-foreground"> /person</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{listing.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <Link key={listing.id} href={`/listings/${listing.id}`}>
                    <Card className="group overflow-hidden transition-all hover:shadow-lg">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted sm:aspect-square sm:w-48">
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                            <Mountain className="h-12 w-12 text-primary/30" />
                          </div>
                          {listing.featured && (
                            <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                              Featured
                            </span>
                          )}
                        </div>
                        <CardContent className="flex flex-1 flex-col justify-between p-4">
                          <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">
                                {listing.difficulty}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {listing.region}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {listing.duration} days
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold group-hover:text-primary">
                              {listing.title}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {listing.description}
                            </p>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {listing.guide && (
                                <div className="flex items-center gap-2">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                                    {listing.guide.name.charAt(0)}
                                  </div>
                                  <span className="text-sm">{listing.guide.name}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{listing.rating}</span>
                                <span className="text-sm text-muted-foreground">
                                  ({listing.totalReviews})
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-bold text-primary">
                                {formatNPR(listing.pricePerPerson)}
                              </span>
                              <p className="text-xs text-muted-foreground">per person</p>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
