"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Mountain, Star, MapPin, Clock, LogOut, CheckCircle, AlertCircle, XCircle,
  Users, Heart, Calendar, ArrowRight, LayoutDashboard, User, Bell,
  TrendingUp, Gift, Compass, PenLine, Leaf, Globe, Flame, Siren,
  Menu, X, BookOpen, Trophy, Copy, ChevronDown, ChevronUp, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import { bookings, listings, guides, reviews, formatNPR, formatUSD } from "@/lib/data";
import type { Tourist } from "@/lib/data";

// ─── Dummy enrichment data ───────────────────────────────────────────────────

const TRIP_CHECKLIST: Record<string, { label: string; done: boolean }[]> = {
  "booking-1": [
    { label: "Book international flights", done: true  },
    { label: "Get Nepal visa",             done: true  },
    { label: "Purchase travel insurance",  done: false },
    { label: "Pack warm layers (−10°C at EBC)", done: false },
    { label: "Download offline maps",      done: false },
    { label: "Confirm meeting point",      done: true  },
  ],
  "booking-5": [
    { label: "Confirm international flights", done: true  },
    { label: "Get Nepal visa",                done: true  },
    { label: "Purchase travel insurance",     done: false },
    { label: "Pack for 18 days",              done: false },
    { label: "Altitude sickness meds",        done: false },
  ],
};

const SPENDING_BY_CATEGORY = [
  { category: "Trekking",  amount: 788400 },
  { category: "Cultural",  amount: 12000  },
  { category: "Safari",    amount: 66500  },
];

const LOYALTY_TIERS = [
  { name: "Explorer",        icon: Compass,  minTrips: 0,  color: "text-green-600",  bg: "bg-green-100 dark:bg-green-900/30"  },
  { name: "Trekker",         icon: Mountain, minTrips: 3,  color: "text-blue-600",   bg: "bg-blue-100 dark:bg-blue-900/30"   },
  { name: "Summit Champion", icon: Trophy,   minTrips: 7,  color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
];

const EMERGENCY_INFO = [
  { label: "Tourist Police",   number: "1144"          },
  { label: "Nepal Police",     number: "100"           },
  { label: "Ambulance",        number: "102"           },
  { label: "US Embassy Kathmandu", number: "+977-1-4234000" },
];

const RECOMMENDATIONS = [
  "listing-3", "listing-4", "listing-7",
];

const NOTIFICATIONS = [
  { id: 1, text: "Your EBC Trek is confirmed — 33 days away!",       time: "Just now",  unread: true  },
  { id: 2, text: "Leave a review for your Kathmandu Cultural Tour",   time: "2 hrs ago", unread: true  },
  { id: 3, text: "New dates available for Annapurna Circuit",         time: "1 day ago", unread: false },
  { id: 4, text: "TrailMate: Tips for your upcoming Himalayan trek",  time: "2 days ago",unread: false },
];

const STATUS_CFG = {
  pending:   { label: "Pending",   icon: AlertCircle, cls: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  confirmed: { label: "Confirmed", icon: CheckCircle, cls: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"   },
  declined:  { label: "Declined",  icon: XCircle,     cls: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"           },
  completed: { label: "Completed", icon: CheckCircle, cls: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"       },
  cancelled: { label: "Cancelled", icon: XCircle,     cls: "bg-muted text-muted-foreground"                                         },
};

const NAV = [
  { id: "overview",  label: "Overview",    icon: LayoutDashboard },
  { id: "trips",     label: "My Trips",    icon: Calendar        },
  { id: "discover",  label: "Discover",    icon: Compass         },
  { id: "wishlist",  label: "Wishlist",    icon: Heart           },
  { id: "reviews",   label: "Reviews",     icon: Star            },
  { id: "stats",     label: "Stats",       icon: TrendingUp      },
  { id: "rewards",   label: "Rewards",     icon: Gift            },
  { id: "safety",    label: "Safety",      icon: Siren           },
];

// ─── Sub-section components ──────────────────────────────────────────────────

function OverviewSection({ tourist }: { tourist: Tourist }) {
  const myBookings   = bookings.filter(b => b.touristId === tourist.id);
  const upcoming     = myBookings.filter(b => b.status === "confirmed" || b.status === "pending");
  const completed    = myBookings.filter(b => b.status === "completed");

  const nextTrip = upcoming
    .filter(b => new Date(b.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const daysUntil = nextTrip
    ? Math.ceil((new Date(nextTrip.date).getTime() - Date.now()) / 86400000)
    : null;

  const nextListing = nextTrip ? listings.find(l => l.id === nextTrip.listingId) : null;
  const nextGuide   = nextTrip ? guides.find(g => g.id === nextTrip.guideId)    : null;

  const checklist = nextTrip ? (TRIP_CHECKLIST[nextTrip.id] ?? []) : [];
  const checklistDone = checklist.filter(i => i.done).length;

  const unread = NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <div className="space-y-6">
      {/* Countdown card */}
      {nextTrip && nextListing && daysUntil !== null ? (
        <Card className="border-primary/30 bg-linear-to-br from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-primary">Your next adventure</p>
                <h2 className="mt-1 text-xl font-bold">{nextListing.title}</h2>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{nextListing.region}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(nextTrip.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />with {nextGuide?.name}</span>
                </div>
              </div>
              <div className="text-center sm:text-right shrink-0">
                <p className="text-5xl font-bold text-primary">{daysUntil}</p>
                <p className="text-sm text-muted-foreground">days to go</p>
              </div>
            </div>

            {checklist.length > 0 && (
              <div className="mt-4 border-t border-border pt-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Trip Checklist</span>
                  <span className="text-muted-foreground">{checklistDone}/{checklist.length} done</span>
                </div>
                <Progress value={(checklistDone / checklist.length) * 100} className="mb-3" />
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {checklist.map(item => (
                    <div key={item.label} className="flex items-center gap-2 text-sm">
                      {item.done
                        ? <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                        : <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/40 shrink-0" />
                      }
                      <span className={item.done ? "line-through text-muted-foreground" : ""}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <Mountain className="h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium">No upcoming trips</p>
            <p className="text-sm text-muted-foreground">Ready for your next Nepal adventure?</p>
            <Button asChild><Link href="/explore">Explore Adventures</Link></Button>
          </CardContent>
        </Card>
      )}

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Upcoming Trips",  value: upcoming.length,              icon: Calendar,  color: "bg-primary/10 text-primary"               },
          { label: "Completed Trips", value: completed.length,             icon: CheckCircle,color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30" },
          { label: "Wishlist Items",  value: tourist.wishlist?.length ?? 0,icon: Heart,      color: "bg-red-100 text-red-500 dark:bg-red-900/30"   },
          { label: "Points Earned",   value: "1,240",                      icon: Gift,       color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4" /> Notifications
            {unread > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{unread}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {NOTIFICATIONS.map(n => (
            <div key={n.id} className={`flex items-start gap-3 rounded-lg p-3 ${n.unread ? "bg-primary/5 border border-primary/10" : "bg-muted/30"}`}>
              <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.unread ? "bg-primary" : "bg-transparent"}`} />
              <div className="flex-1">
                <p className="text-sm">{n.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function TripsSection({ tourist }: { tourist: Tourist }) {
  const myBookings = bookings.filter(b => b.touristId === tourist.id);
  const [expanded, setExpanded] = useState<string | null>(null);

  const tabs = [
    { key: "upcoming",   label: "Upcoming",   filter: (b: typeof myBookings[0]) => (b.status === "confirmed" || b.status === "pending") && new Date(b.date) >= new Date() },
    { key: "completed",  label: "Completed",  filter: (b: typeof myBookings[0]) => b.status === "completed" },
    { key: "pending",    label: "Pending",    filter: (b: typeof myBookings[0]) => b.status === "pending" },
    { key: "cancelled",  label: "Cancelled",  filter: (b: typeof myBookings[0]) => b.status === "cancelled" },
  ];

  return (
    <Tabs defaultValue="upcoming">
      <TabsList className="mb-4 w-full sm:w-auto">
        {tabs.map(t => {
          const count = myBookings.filter(t.filter).length;
          return (
            <TabsTrigger key={t.key} value={t.key} className="gap-1.5">
              {t.label}
              {count > 0 && <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs">{count}</span>}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {tabs.map(tab => (
        <TabsContent key={tab.key} value={tab.key} className="space-y-3">
          {myBookings.filter(tab.filter).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <BookOpen className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-muted-foreground">No {tab.label.toLowerCase()} bookings</p>
                {tab.key === "upcoming" && (
                  <Button asChild size="sm"><Link href="/explore">Explore Adventures</Link></Button>
                )}
              </CardContent>
            </Card>
          ) : (
            myBookings.filter(tab.filter).map(booking => {
              const listing = listings.find(l => l.id === booking.listingId);
              const guide   = guides.find(g => g.id === booking.guideId);
              const cfg     = STATUS_CFG[booking.status];
              const CfgIcon = cfg.icon;
              const isExpanded = expanded === booking.id;
              const checklist = TRIP_CHECKLIST[booking.id];
              const daysUntil = Math.ceil((new Date(booking.date).getTime() - Date.now()) / 86400000);

              return (
                <Card key={booking.id}>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{listing?.title ?? "Unknown listing"}</h3>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.cls}`}>
                            <CfgIcon className="h-3 w-3" />{cfg.label}
                          </span>
                          {tab.key === "upcoming" && daysUntil > 0 && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              in {daysUntil} days
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{listing?.region}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{listing?.duration} days</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(booking.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />Group of {booking.groupSize}</span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7"
                            onClick={() => setExpanded(isExpanded ? null : booking.id)}>
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                            {isExpanded ? "Less" : "Details"}
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7">
                            <Calendar className="h-3.5 w-3.5" /> Add to Calendar
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7">
                            <FileText className="h-3.5 w-3.5" /> Download PDF
                          </Button>
                          {(tab.key === "upcoming" || tab.key === "pending") && (
                            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7 text-red-600 border-red-200 hover:bg-red-50">
                              <XCircle className="h-3.5 w-3.5" /> Cancel
                            </Button>
                          )}
                        </div>

                        {/* Expandable details */}
                        {isExpanded && (
                          <div className="mt-4 space-y-4 border-t border-border pt-4">
                            {/* Guide info */}
                            {guide && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Your Guide</p>
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                                    {guide.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{guide.name}</p>
                                    <p className="text-xs text-muted-foreground">{guide.phone} · {guide.location}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Meeting point */}
                            {listing && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Meeting Point</p>
                                <p className="text-sm flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" />{listing.meetingPoint}</p>
                              </div>
                            )}

                            {/* What's included */}
                            {listing && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Included</p>
                                <ul className="grid gap-1 sm:grid-cols-2">
                                  {listing.included.slice(0, 6).map(item => (
                                    <li key={item} className="flex items-center gap-1.5 text-sm">
                                      <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" />{item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Trip checklist */}
                            {checklist && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Trip Checklist</p>
                                <div className="grid gap-1.5 sm:grid-cols-2">
                                  {checklist.map(item => (
                                    <div key={item.label} className="flex items-center gap-2 text-sm">
                                      {item.done
                                        ? <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                                        : <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/40 shrink-0" />
                                      }
                                      <span className={item.done ? "line-through text-muted-foreground" : ""}>{item.label}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-semibold text-primary">{formatNPR(booking.totalPrice)}</p>
                        <p className="text-xs text-muted-foreground">{formatUSD(booking.totalPrice)}</p>
                        <p className="text-xs text-muted-foreground capitalize mt-1">{booking.paymentStatus}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}

function DiscoverSection({ tourist }: { tourist: Tourist }) {
  const recommendedListings = RECOMMENDATIONS.map(id => listings.find(l => l.id === id)).filter(Boolean) as typeof listings;
  const trending = listings.filter(l => l.featured).slice(0, 3);

  function ListingCard({ listing }: { listing: typeof listings[0] }) {
    const guide = guides.find(g => g.id === listing.guideId);
    return (
      <Link href={`/listings/${listing.id}`}>
        <Card className="group overflow-hidden transition-all hover:shadow-lg">
          <div className="relative aspect-4/3 bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Mountain className="h-12 w-12 text-primary/30" />
            {listing.featured && (
              <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">Featured</span>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <MapPin className="h-3.5 w-3.5" />{listing.region}
              <span>·</span>
              <Clock className="h-3.5 w-3.5" />{listing.duration} days
            </div>
            <h3 className="font-semibold text-sm group-hover:text-primary">{listing.title}</h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-bold text-primary">{formatNPR(listing.pricePerPerson)}<span className="text-xs font-normal text-muted-foreground">/person</span></span>
              <div className="flex items-center gap-1 text-xs">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />{listing.rating}
              </div>
            </div>
            {guide && <p className="mt-1 text-xs text-muted-foreground">with {guide.name}</p>}
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <div className="space-y-8">
      {/* Personalized recommendations */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Recommended for You</h2>
            <p className="text-sm text-muted-foreground">Based on your past bookings and wishlist</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedListings.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      </div>

      {/* Trending */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <h2 className="text-base font-semibold">Trending This Season</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      </div>
    </div>
  );
}

function WishlistSection({ tourist }: { tourist: Tourist }) {
  const wishlistItems = (tourist.wishlist ?? [])
    .map(id => listings.find(l => l.id === id))
    .filter(Boolean) as typeof listings;

  const COLLECTIONS = [
    { name: "Dream Treks",   ids: wishlistItems.slice(0, 1).map(l => l.id) },
    { name: "Budget Trips",  ids: wishlistItems.slice(1).map(l => l.id)    },
  ];

  if (wishlistItems.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <Heart className="h-12 w-12 text-muted-foreground/30" />
          <div>
            <p className="font-medium">Your wishlist is empty</p>
            <p className="text-sm text-muted-foreground">Save listings you love while browsing</p>
          </div>
          <Button asChild><Link href="/explore">Browse Adventures</Link></Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {COLLECTIONS.map(col => col.ids.length > 0 && (
        <div key={col.name}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">{col.name}</h3>
            <Button size="sm" variant="ghost" className="gap-1.5 text-xs h-7">
              <Copy className="h-3.5 w-3.5" /> Share
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {col.ids.map(id => {
              const listing = listings.find(l => l.id === id);
              if (!listing) return null;
              const guide = guides.find(g => g.id === listing.guideId);
              return (
                <Link key={id} href={`/listings/${id}`}>
                  <Card className="group hover:shadow-md transition-all">
                    <div className="aspect-4/3 bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center rounded-t-lg">
                      <Mountain className="h-10 w-10 text-primary/30" />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-sm group-hover:text-primary">{listing.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />{listing.region}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-bold text-primary">{formatNPR(listing.pricePerPerson)}</span>
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{listing.rating}
                        </div>
                      </div>
                      {guide && <p className="text-xs text-muted-foreground mt-1">with {guide.name}</p>}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewsSection({ tourist }: { tourist: Tourist }) {
  const myReviews = reviews.filter(r => r.touristId === tourist.id);
  const myBookings = bookings.filter(b => b.touristId === tourist.id && b.status === "completed");
  const pendingReviews = myBookings.filter(b => !myReviews.find(r => r.listingId === b.listingId));

  return (
    <div className="space-y-6">
      {/* Pending reviews prompt */}
      {pendingReviews.length > 0 && (
        <div>
          <h3 className="mb-3 text-base font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> Share Your Experience
          </h3>
          <div className="space-y-3">
            {pendingReviews.map(booking => {
              const listing = listings.find(l => l.id === booking.listingId);
              return (
                <Card key={booking.id} className="border-amber-200 dark:border-amber-800">
                  <CardContent className="flex items-center justify-between gap-4 p-4">
                    <div>
                      <p className="font-medium text-sm">{listing?.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Completed {new Date(booking.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <Button size="sm" className="gap-1.5 shrink-0">
                      <PenLine className="h-3.5 w-3.5" /> Write Review
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Written reviews */}
      <div>
        <h3 className="mb-3 text-base font-semibold">Your Reviews</h3>
        {myReviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              You haven&apos;t written any reviews yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {myReviews.map(review => {
              const listing = listings.find(l => l.id === review.listingId);
              return (
                <Card key={review.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-sm">{listing?.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(review.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-0.5">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`h-3.5 w-3.5 ${review.rating >= i ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="ghost" className="gap-1.5 text-xs h-7">
                        <PenLine className="h-3.5 w-3.5" /> Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-1.5 text-xs h-7 text-red-600 hover:text-red-700">
                        <XCircle className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatsSection({ tourist }: { tourist: Tourist }) {
  const myBookings = bookings.filter(b => b.touristId === tourist.id);
  const totalSpent = myBookings
    .filter(b => b.status === "completed" || b.status === "confirmed")
    .reduce((s, b) => s + b.totalPrice, 0);

  const completedBookings = myBookings.filter(b => b.status === "completed");
  const totalDays = completedBookings.reduce((s, b) => {
    const listing = listings.find(l => l.id === b.listingId);
    return s + (listing?.duration ?? 0);
  }, 0);

  const regions = [...new Set(
    completedBookings.map(b => listings.find(l => l.id === b.listingId)?.region).filter(Boolean)
  )];

  const carbonKg = totalDays * 8.5;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Spent",      value: formatNPR(totalSpent),   sub: formatUSD(totalSpent),      icon: TrendingUp, color: "bg-primary/10 text-primary" },
          { label: "Trips Completed",  value: completedBookings.length, sub: "adventures",              icon: CheckCircle,color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30" },
          { label: "Days Trekked",     value: totalDays,                sub: "total trail days",        icon: Clock,      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30" },
          { label: "Regions Explored", value: regions.length,           sub: "of Nepal's regions",     icon: Globe,      color: "bg-green-100 text-green-600 dark:bg-green-900/30" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${s.color} mb-3`}>
                <s.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Spending by category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Spending by Category</CardTitle>
          <CardDescription>Total across all bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SPENDING_BY_CATEGORY} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v: number) => [formatNPR(v), "Spent"]}
                contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
              />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Regions explored */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4" /> Regions Explored
            </CardTitle>
          </CardHeader>
          <CardContent>
            {regions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No completed trips yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {regions.map(r => (
                  <Badge key={r} variant="secondary" className="gap-1.5">
                    <MapPin className="h-3 w-3" />{r}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-600" /> Eco Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-2xl font-bold text-green-600">{carbonKg.toFixed(0)} kg</p>
              <p className="text-sm text-muted-foreground">estimated carbon footprint</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Trekking produces far less carbon than motorized tours. TrailMate offsets 10% of trail emissions through local reforestation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RewardsSection({ tourist }: { tourist: Tourist }) {
  const myBookings = bookings.filter(b => b.touristId === tourist.id && b.status === "completed");
  const points = 1240;
  const tripCount = myBookings.length;

  const currentTierIndex = LOYALTY_TIERS.reduce((idx, tier, i) => tripCount >= tier.minTrips ? i : idx, 0);
  const currentTier = LOYALTY_TIERS[currentTierIndex];
  const nextTier = LOYALTY_TIERS[currentTierIndex + 1];
  const progressToNext = nextTier
    ? Math.min(((tripCount - currentTier.minTrips) / (nextTier.minTrips - currentTier.minTrips)) * 100, 100)
    : 100;

  const [copied, setCopied] = useState(false);
  const referralCode = `TRAILMATE-${tourist.name.split(" ")[0].toUpperCase()}`;

  return (
    <div className="space-y-6">
      {/* Tier status */}
      <Card className={`border-2 ${currentTier.color.replace("text-", "border-").replace("-600", "-200").replace("-500", "-200")}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full ${currentTier.bg}`}>
              <currentTier.icon className={`h-8 w-8 ${currentTier.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Current Tier</p>
              <h2 className={`text-2xl font-bold ${currentTier.color}`}>{currentTier.name}</h2>
              <p className="text-sm text-muted-foreground">{tripCount} completed trip{tripCount !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {nextTier && (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted-foreground">{currentTier.name}</span>
                <span className="text-muted-foreground">{nextTier.name} ({nextTier.minTrips} trips)</span>
              </div>
              <Progress value={progressToNext} />
              <p className="mt-1 text-xs text-muted-foreground">
                {nextTier.minTrips - tripCount} more trip{nextTier.minTrips - tripCount !== 1 ? "s" : ""} to unlock {nextTier.name}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All tiers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tier Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {LOYALTY_TIERS.map((tier, i) => {
              const unlocked = i <= currentTierIndex;
              return (
                <div key={tier.name} className={`flex items-center gap-4 rounded-lg border p-3 ${unlocked ? "" : "opacity-50"}`}>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tier.bg}`}>
                    <tier.icon className={`h-5 w-5 ${tier.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{tier.name}</p>
                    <p className="text-xs text-muted-foreground">{tier.minTrips}+ completed trips</p>
                  </div>
                  {unlocked && <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Points */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Gift className="h-4 w-4 text-yellow-500" /> Your Points
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-4xl font-bold text-yellow-600">{points.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Earn 100 pts per booking · Redeem for discounts</p>
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <p className="font-medium">{points.toLocaleString()} pts ≈ {formatNPR(points * 10)} discount</p>
            </div>
            <Button size="sm" variant="outline" className="w-full">Redeem Points</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Refer a Friend</CardTitle>
            <CardDescription>Earn 500 bonus points per successful referral</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2">
              <code className="flex-1 text-sm font-mono">{referralCode}</code>
              <button
                onClick={() => { navigator.clipboard.writeText(referralCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            {copied && <p className="text-xs text-green-600">Copied!</p>}
            <p className="text-xs text-muted-foreground">Share your code with friends. When they complete their first booking, you both earn 500 points.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SafetySection() {
  return (
    <div className="space-y-6">
      {/* SOS */}
      <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
            <Siren className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-red-700 dark:text-red-400">Emergency SOS</p>
            <p className="text-sm text-red-600/80 dark:text-red-400/70">For genuine emergencies only. Alerts your guide and TrailMate support.</p>
          </div>
          <Button variant="destructive" size="sm" className="shrink-0">SOS</Button>
        </CardContent>
      </Card>

      {/* Emergency contacts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Nepal Emergency Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {EMERGENCY_INFO.map(info => (
              <div key={info.label} className="flex items-center justify-between rounded-lg border border-border p-3">
                <p className="text-sm font-medium">{info.label}</p>
                <a href={`tel:${info.number}`} className="font-mono text-sm text-primary hover:underline">{info.number}</a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Safety guides */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Altitude Sickness Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">Mild (AMS):</span> Headache, fatigue, nausea. Rest, hydrate, do not ascend.</p>
            <p><span className="font-medium text-foreground">Moderate:</span> Severe headache, vomiting. Descend immediately.</p>
            <p><span className="font-medium text-foreground">Severe (HACE/HAPE):</span> Confusion, chest tightness. Emergency descent + oxygen.</p>
            <p className="pt-1 text-xs">Acclimatize properly — follow your guide&apos;s advice on ascent rate.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Travel Insurance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">High-altitude trekking requires specialist insurance covering helicopter rescue.</p>
            <div className="space-y-2">
              {["World Nomads", "True Traveller", "Battleface"].map(name => (
                <div key={name} className="flex items-center justify-between rounded-lg border p-2.5">
                  <span className="font-medium">{name}</span>
                  <Badge variant="outline">Partner</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function TouristDashboard() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [section, setSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "tourist")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "tourist") return null;

  const tourist = user as Tourist;
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  const handleLogout = () => { logout(); router.push("/"); };

  const activeNav = NAV.find(n => n.id === section)!;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            className="rounded-md p-1.5 hover:bg-muted transition-colors lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Mountain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold hidden sm:block">
              Trail<span className="text-primary">Mate</span>
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button className="rounded-full border border-border p-2 hover:bg-muted transition-colors">
                <Bell className="h-4 w-4" />
              </button>
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                {tourist.name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium leading-none">{tourist.name}</p>
                <p className="text-xs text-muted-foreground">Traveler</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 mt-14.25 w-56 border-r border-border bg-card
          transition-transform duration-200 lg:static lg:mt-0 lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <nav className="flex flex-col gap-1 p-3 pt-4">
            {NAV.map(item => (
              <button
                key={item.id}
                onClick={() => { setSection(item.id); setSidebarOpen(false); }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors w-full text-left
                  ${section === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">{activeNav.label}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {section === "overview" && `Welcome back, ${tourist.name.split(" ")[0]}!`}
                {section === "trips"    && "View and manage all your bookings"}
                {section === "discover" && "Find your next Nepal adventure"}
                {section === "wishlist" && "Your saved listings and collections"}
                {section === "reviews"  && "Your reviews and pending feedback"}
                {section === "stats"    && "Your travel history and spending breakdown"}
                {section === "rewards"  && "Your loyalty points, tier, and referrals"}
                {section === "safety"   && "Emergency info and safety resources"}
              </p>
            </div>

            {section === "overview" && <OverviewSection tourist={tourist} />}
            {section === "trips"    && <TripsSection tourist={tourist} />}
            {section === "discover" && <DiscoverSection tourist={tourist} />}
            {section === "wishlist" && <WishlistSection tourist={tourist} />}
            {section === "reviews"  && <ReviewsSection tourist={tourist} />}
            {section === "stats"    && <StatsSection tourist={tourist} />}
            {section === "rewards"  && <RewardsSection tourist={tourist} />}
            {section === "safety"   && <SafetySection />}
          </div>
        </main>
      </div>
    </div>
  );
}
