"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Mountain, Star, MapPin, Clock, LogOut, CheckCircle, AlertCircle, XCircle,
  Users, TrendingUp, Shield, Calendar, LayoutDashboard,
  DollarSign, CalendarDays, User, Bell, Eye, MessageSquare,
  ToggleLeft, ToggleRight, Award, Zap, Repeat, ThumbsUp, BadgeCheck,
  Menu, X, Download, CreditCard, Percent, Info, PenLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { useAuth } from "@/lib/auth-context";
import { bookings, listings, reviews, formatNPR, formatUSD } from "@/lib/data";
import type { Guide } from "@/lib/data";

type DashboardBooking = {
  id: string;
  listingId: string;
  touristId: string;
  guideId: string;
  date: string;
  groupSize: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "declined" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid";
  createdAt: string;
  notes?: string;
};

// ─── Dummy enrichment data ───────────────────────────────────────────────────

const MONTHLY_EARNINGS = [
  { month: "Jan", earnings: 120000, trips: 3 },
  { month: "Feb", earnings: 85000,  trips: 2 },
  { month: "Mar", earnings: 215000, trips: 5 },
  { month: "Apr", earnings: 180000, trips: 4 },
  { month: "May", earnings: 340000, trips: 8 },
  { month: "Jun", earnings: 95000,  trips: 2 },
  { month: "Jul", earnings: 125000, trips: 3 },
  { month: "Aug", earnings: 145000, trips: 4 },
  { month: "Sep", earnings: 280000, trips: 7 },
  { month: "Oct", earnings: 420000, trips: 10 },
  { month: "Nov", earnings: 390000, trips: 9 },
  { month: "Dec", earnings: 160000, trips: 4 },
];

const EXTRA_BOOKINGS: DashboardBooking[] = [
  { id: "ex-1", listingId: "listing-1", touristId: "tourist-2", guideId: "guide-1", date: "2026-05-12", groupSize: 3, totalPrice: 499500, status: "pending",   paymentStatus: "pending", createdAt: "2026-03-20", notes: "First high-altitude trek, need acclimatization advice" },
  { id: "ex-2", listingId: "listing-1", touristId: "tourist-3", guideId: "guide-1", date: "2026-04-28", groupSize: 2, totalPrice: 333000, status: "confirmed",  paymentStatus: "paid",    createdAt: "2026-03-18", notes: "Celebrating anniversary" },
  { id: "ex-3", listingId: "listing-1", touristId: "tourist-4", guideId: "guide-1", date: "2025-11-05", groupSize: 4, totalPrice: 666000, status: "completed",  paymentStatus: "paid",    createdAt: "2025-10-01", notes: "" },
  { id: "ex-4", listingId: "listing-1", touristId: "tourist-5", guideId: "guide-1", date: "2026-03-01", groupSize: 1, totalPrice: 166500, status: "cancelled",  paymentStatus: "pending", createdAt: "2026-02-15", notes: "Visa issues" },
];

const TOURIST_NAMES: Record<string, string> = {
  "tourist-1": "Sarah Johnson",
  "tourist-2": "Michael Chen",
  "tourist-3": "Emma Williams",
  "tourist-4": "David Miller",
  "tourist-5": "James Wilson",
};

const LISTING_STATS: Record<string, { views: number; saves: number; conversionRate: number }> = {
  "listing-1": { views: 1240, saves: 87, conversionRate: 12.4 },
  "listing-7": { views: 380,  saves: 34, conversionRate: 8.2  },
};

const ACHIEVEMENTS = [
  { icon: Award,    label: "Top Rated in Everest",   color: "text-yellow-500" },
  { icon: Zap,      label: "Fast Responder",          color: "text-blue-500" },
  { icon: Repeat,   label: "68% Repeat Clients",      color: "text-green-600" },
  { icon: ThumbsUp, label: "5 Years on TrailMate",    color: "text-purple-500" },
];

const CERTIFICATIONS = [
  { name: "Nepal Mountaineering Association License", verified: true },
  { name: "Wilderness First Responder",               verified: true },
  { name: "Leave No Trace Trainer",                   verified: true },
  { name: "Porter Welfare Certificate",               verified: false },
];

const PROFILE_CHECKLIST = [
  { label: "Profile photo added",         done: true  },
  { label: "Bio written",                  done: true  },
  { label: "Certifications uploaded",      done: false },
  { label: "First listing created",        done: true  },
  { label: "First review received",        done: true  },
  { label: "Response rate above 90%",      done: true  },
  { label: "Porter welfare cert uploaded", done: false },
];

const NOTIFICATIONS = [
  { id: 1, type: "booking",  text: "New booking request from Michael Chen for EBC Trek",  time: "2 min ago",  unread: true  },
  { id: 2, type: "review",   text: "Emma Williams left you a 4-star review",               time: "1 hr ago",   unread: true  },
  { id: 3, type: "reminder", text: "Tomorrow's trek: Everest Base Camp with Sarah Johnson", time: "3 hrs ago",  unread: false },
  { id: 4, type: "system",   text: "TrailMate: Nepal tourism peak season starts October",   time: "1 day ago",  unread: false },
];

const STATUS_CFG = {
  pending:   { label: "Pending",   icon: AlertCircle, cls: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  confirmed: { label: "Confirmed", icon: CheckCircle, cls: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  declined:  { label: "Declined",  icon: XCircle,     cls: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  completed: { label: "Completed", icon: CheckCircle, cls: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  cancelled: { label: "Cancelled", icon: XCircle,     cls: "bg-muted text-muted-foreground" },
};

const NAV = [
  { id: "overview",   label: "Overview",    icon: LayoutDashboard },
  { id: "earnings",   label: "Earnings",    icon: DollarSign      },
  { id: "bookings",   label: "Bookings",    icon: CalendarDays    },
  { id: "calendar",   label: "Availability",icon: Calendar        },
  { id: "reviews",    label: "Reviews",     icon: Star            },
  { id: "listings",   label: "Listings",    icon: Mountain        },
  { id: "profile",    label: "Profile",     icon: User            },
];

// ─── Sub-section components ──────────────────────────────────────────────────

function OverviewSection({ guide, allBookings }: { guide: Guide; allBookings: DashboardBooking[] }) {
  const pending   = allBookings.filter(b => b.status === "pending").length;
  const totalEarnings = allBookings
    .filter(b => b.status === "completed" || b.status === "confirmed")
    .reduce((s, b) => s + b.totalPrice, 0);

  const upcomingBooking = allBookings
    .filter(b => b.status === "confirmed" && new Date(b.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const daysUntil = upcomingBooking
    ? Math.ceil((new Date(upcomingBooking.date).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div className="space-y-6">
      {/* Upcoming alert */}
      {upcomingBooking && daysUntil !== null && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <Bell className="h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-primary">
              Upcoming trek in {daysUntil} day{daysUntil !== 1 ? "s" : ""}
            </p>
            <p className="text-sm text-muted-foreground">
              {listings.find(l => l.id === upcomingBooking.listingId)?.title} · {new Date(upcomingBooking.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Trips",       value: guide.totalTrips,          icon: TrendingUp,  color: "bg-primary/10 text-primary" },
          { label: "Rating",            value: `${guide.rating} ★`,        icon: Star,        color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30" },
          { label: "Pending Requests",  value: pending,                   icon: AlertCircle, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30" },
          { label: "Total Earnings",    value: formatNPR(totalEarnings),  icon: DollarSign,  color: "bg-green-100 text-green-600 dark:bg-green-900/30", small: true },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className={`font-bold ${s.small ? "text-base" : "text-2xl"} truncate`}>{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Profile Views</p>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">1,240</p>
            <p className="text-xs text-green-600 mt-1">+18% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Avg Response Time</p>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">1.4h</p>
            <p className="text-xs text-green-600 mt-1">Top 10% of guides</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Repeat Clients</p>
              <Repeat className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">68%</p>
            <p className="text-xs text-muted-foreground mt-1">{guide.totalReviews} total reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements + Profile strength */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Your Highlights</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {ACHIEVEMENTS.map(a => (
              <div key={a.label} className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                <a.icon className={`h-5 w-5 ${a.color}`} />
                <span className="text-xs font-medium leading-tight">{a.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Profile Strength</CardTitle>
            <CardDescription>Complete your profile to get more bookings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{Math.round((PROFILE_CHECKLIST.filter(i => i.done).length / PROFILE_CHECKLIST.length) * 100)}% Complete</span>
              <span className="text-muted-foreground">{PROFILE_CHECKLIST.filter(i => i.done).length}/{PROFILE_CHECKLIST.length} tasks</span>
            </div>
            <Progress value={Math.round((PROFILE_CHECKLIST.filter(i => i.done).length / PROFILE_CHECKLIST.length) * 100)} />
            <div className="space-y-1.5">
              {PROFILE_CHECKLIST.filter(i => !i.done).map(item => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />
                  {item.label}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {NOTIFICATIONS.filter(n => n.unread).length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {NOTIFICATIONS.map(n => (
            <div key={n.id} className={`flex items-start gap-3 rounded-lg p-3 ${n.unread ? "bg-primary/5 border border-primary/10" : "bg-muted/30"}`}>
              <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${n.unread ? "bg-primary" : "bg-transparent"}`} />
              <div className="flex-1 min-w-0">
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

function EarningsSection() {
  const totalYear   = MONTHLY_EARNINGS.reduce((s, m) => s + m.earnings, 0);
  const thisMonth   = MONTHLY_EARNINGS[2]; // March
  const lastMonth   = MONTHLY_EARNINGS[1];
  const platformFee = Math.round(totalYear * 0.15);
  const guideEarnings = totalYear - platformFee;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total This Year</p>
            <p className="text-2xl font-bold text-primary mt-1">{formatNPR(totalYear)}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatUSD(totalYear)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold mt-1">{formatNPR(thisMonth.earnings)}</p>
            <p className={`text-xs mt-1 ${thisMonth.earnings > lastMonth.earnings ? "text-green-600" : "text-red-500"}`}>
              {thisMonth.earnings > lastMonth.earnings ? "▲" : "▼"}&nbsp;
              {Math.abs(Math.round(((thisMonth.earnings - lastMonth.earnings) / lastMonth.earnings) * 100))}% vs last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Pending Payout</p>
            <p className="text-2xl font-bold mt-1">{formatNPR(340000)}</p>
            <Button size="sm" variant="outline" className="mt-2 w-full gap-1.5 text-xs">
              <CreditCard className="h-3.5 w-3.5" /> Withdraw to Bank
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Monthly chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Earnings</CardTitle>
          <CardDescription>NPR earnings over the past 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={MONTHLY_EARNINGS} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v: number) => [formatNPR(v), "Earnings"]}
                contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
              />
              <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Commission breakdown + per-listing */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Percent className="h-4 w-4" /> Commission Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Your earnings (85%)</span>
                <span className="font-semibold text-primary">{formatNPR(guideEarnings)}</span>
              </div>
              <Progress value={85} className="h-3" />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Platform fee (15%)</span>
                <span className="font-semibold text-muted-foreground">{formatNPR(platformFee)}</span>
              </div>
              <Progress value={15} className="h-3 [&>div]:bg-muted-foreground/40" />
            </div>
            <p className="text-xs text-muted-foreground">Fees cover payment processing, insurance, and platform services.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Earnings by Listing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(LISTING_STATS).map(([id, stats]) => {
              const listing = listings.find(l => l.id === id);
              if (!listing) return null;
              const revenue = stats.views * listing.pricePerPerson * (stats.conversionRate / 100);
              return (
                <div key={id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="truncate font-medium pr-2">{listing.title}</span>
                    <span className="shrink-0 font-semibold text-primary">{formatNPR(Math.round(revenue))}</span>
                  </div>
                  <Progress value={(revenue / (MONTHLY_EARNINGS.reduce((s, m) => s + m.earnings, 0) / 2)) * 100} className="h-1.5" />
                </div>
              );
            })}
            <p className="text-xs text-muted-foreground pt-2">Based on confirmed + completed bookings</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BookingsSection({ allBookings }: { allBookings: DashboardBooking[] }) {
  const tabs = ["pending", "confirmed", "completed", "cancelled"] as const;

  return (
    <Tabs defaultValue="pending">
      <TabsList className="mb-4 w-full sm:w-auto">
        {tabs.map(t => {
          const count = allBookings.filter(b => b.status === t).length;
          return (
            <TabsTrigger key={t} value={t} className="capitalize gap-1.5">
              {t}
              {count > 0 && (
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium">{count}</span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {tabs.map(tab => (
        <TabsContent key={tab} value={tab} className="space-y-3">
          {allBookings.filter(b => b.status === tab).length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12 text-muted-foreground">
                No {tab} bookings
              </CardContent>
            </Card>
          ) : (
            allBookings.filter(b => b.status === tab).map(booking => {
              const listing = listings.find(l => l.id === booking.listingId);
              const touristName = TOURIST_NAMES[booking.touristId] ?? "Unknown traveler";
              const cfg = STATUS_CFG[booking.status];
              const CfgIcon = cfg.icon;
              return (
                <Card key={booking.id}>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{listing?.title ?? "Unknown listing"}</h3>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.cls}`}>
                            <CfgIcon className="h-3 w-3" />
                            {cfg.label}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{touristName}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(booking.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />Group of {booking.groupSize}</span>
                        </div>
                        {booking.notes && (
                          <p className="mt-2 text-sm italic text-muted-foreground">"{booking.notes}"</p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7">
                            <MessageSquare className="h-3.5 w-3.5" /> Message
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7">
                            <MapPin className="h-3.5 w-3.5" /> Meeting Point
                          </Button>
                          {tab === "pending" && (
                            <>
                              <Button size="sm" className="gap-1 text-xs h-7 bg-green-600 hover:bg-green-700">
                                <CheckCircle className="h-3.5 w-3.5" /> Accept
                              </Button>
                              <Button size="sm" variant="outline" className="gap-1 text-xs h-7 text-red-600 border-red-200 hover:bg-red-50">
                                <XCircle className="h-3.5 w-3.5" /> Decline
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-primary">{formatNPR(booking.totalPrice)}</p>
                        <p className="text-xs text-muted-foreground capitalize">{booking.paymentStatus}</p>
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

function AvailabilitySection() {
  const [blocked, setBlocked] = useState<Date[]>([
    new Date(2026, 3, 5),
    new Date(2026, 3, 6),
    new Date(2026, 3, 20),
    new Date(2026, 4, 1),
  ]);

  const bookedDates = [
    new Date(2026, 3, 28),
    new Date(2026, 4, 12),
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mark Your Availability</CardTitle>
            <CardDescription>Click dates to toggle them as unavailable (shown in red)</CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarUI
              mode="multiple"
              selected={blocked}
              onSelect={(days) => setBlocked(days ?? [])}
              modifiers={{ booked: bookedDates }}
              modifiersClassNames={{
                selected: "!bg-red-500 !text-white rounded-full",
                booked: "!bg-primary !text-primary-foreground rounded-full",
              }}
              className="rounded-lg border"
            />
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-primary inline-block" /> Booked
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500 inline-block" /> Blocked by you
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-muted border inline-block" /> Available
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recurring Days Off</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm">{day}</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Available</span>
                      <button className="text-muted-foreground hover:text-primary">
                        <ToggleLeft className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Blocked dates won&apos;t appear in your availability to tourists. Booked dates are fixed by confirmed reservations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ReviewsSection({ guideListingIds }: { guideListingIds: string[] }) {
  const myReviews = reviews.filter(r => guideListingIds.includes(r.listingId));
  const starCounts = [5, 4, 3, 2, 1].map(s => ({ star: s, count: myReviews.filter(r => r.rating === s).length }));
  const avgRating = myReviews.length ? (myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length).toFixed(1) : "0";
  const [replying, setReplying] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Rating overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6 flex items-center gap-6">
            <div className="text-center">
              <p className="text-5xl font-bold text-primary">{avgRating}</p>
              <div className="mt-1 flex justify-center gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`h-4 w-4 ${parseFloat(avgRating) >= i ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                ))}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{myReviews.length} reviews</p>
            </div>
            <div className="flex-1 space-y-2">
              {starCounts.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-4 text-right">{star}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
                  <Progress value={myReviews.length ? (count / myReviews.length) * 100 : 0} className="flex-1 h-1.5" />
                  <span className="w-4 text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Achievement Badges</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {ACHIEVEMENTS.map(a => (
              <div key={a.label} className="flex items-center gap-2 rounded-lg border p-2.5">
                <a.icon className={`h-4 w-4 ${a.color} shrink-0`} />
                <span className="text-xs font-medium leading-tight">{a.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Reviews feed */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold">All Reviews</h3>
        {myReviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">No reviews yet</CardContent>
          </Card>
        ) : (
          myReviews.map(review => (
            <Card key={review.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {review.touristName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{review.touristName}</p>
                      <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`h-3.5 w-3.5 ${review.rating >= i ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                {replying === review.id ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                      placeholder="Write a public reply..."
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" className="text-xs h-7">Post Reply</Button>
                      <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setReplying(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="ghost" className="gap-1.5 text-xs h-7" onClick={() => setReplying(review.id)}>
                      <PenLine className="h-3.5 w-3.5" /> Reply
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function ListingsSection({ guideId }: { guideId: string }) {
  const myListings = listings.filter(l => l.guideId === guideId);
  const [paused, setPaused] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      {myListings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">No listings yet</CardContent>
        </Card>
      ) : (
        myListings.map(listing => {
          const stats = LISTING_STATS[listing.id] ?? { views: 0, saves: 0, conversionRate: 0 };
          const isPaused = paused.includes(listing.id);
          return (
            <Card key={listing.id} className={isPaused ? "opacity-60" : ""}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{listing.title}</h3>
                      {isPaused && <Badge variant="secondary">Paused</Badge>}
                      {listing.featured && <Badge className="bg-accent text-accent-foreground">Featured</Badge>}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{listing.region}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{listing.duration} days</span>
                      <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />{listing.rating} ({listing.totalReviews})</span>
                    </div>

                    {/* Stats row */}
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      <div className="rounded-lg bg-muted/50 p-2 text-center">
                        <p className="text-lg font-bold">{stats.views.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Views</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2 text-center">
                        <p className="text-lg font-bold">{stats.saves}</p>
                        <p className="text-xs text-muted-foreground">Saves</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2 text-center">
                        <p className="text-lg font-bold">{stats.conversionRate}%</p>
                        <p className="text-xs text-muted-foreground">Conversion</p>
                      </div>
                    </div>

                    {/* Tip */}
                    {stats.views > 0 && stats.conversionRate < 10 && (
                      <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3">
                        <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 dark:text-amber-400">
                          Listings with 5+ photos get 3× more bookings. Add more images to boost conversions.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                    <p className="font-semibold text-primary">{formatNPR(listing.pricePerPerson)}<span className="text-xs text-muted-foreground font-normal">/person</span></p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild className="text-xs h-7">
                        <Link href={`/listings/${listing.id}`}><Eye className="h-3.5 w-3.5 mr-1" />View</Link>
                      </Button>
                      <button
                        onClick={() => setPaused(p => p.includes(listing.id) ? p.filter(x => x !== listing.id) : [...p, listing.id])}
                        className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors"
                      >
                        {isPaused ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4 text-primary" />}
                        {isPaused ? "Unpause" : "Pause"}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

function ProfileSection({ guide }: { guide: Guide }) {
  const strength = Math.round((PROFILE_CHECKLIST.filter(i => i.done).length / PROFILE_CHECKLIST.length) * 100);

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
              {guide.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">{guide.name}</h2>
                {guide.verified && (
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    <Shield className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{guide.location}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{guide.bio}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {guide.specialties.map(s => (
                  <span key={s} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">{s}</span>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {guide.languages.map(l => (
                  <span key={l} className="rounded-full border border-border px-2 py-0.5 text-xs">{l}</span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile strength */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Profile Strength — {strength}%</CardTitle>
          <CardDescription>Complete all tasks to maximize discoverability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={strength} />
          <div className="space-y-2">
            {PROFILE_CHECKLIST.map(item => (
              <div key={item.label} className="flex items-center gap-3">
                {item.done
                  ? <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                  : <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                }
                <span className={`text-sm ${item.done ? "" : "text-muted-foreground"}`}>{item.label}</span>
                {!item.done && <Button size="sm" variant="ghost" className="ml-auto text-xs h-6 text-primary">Fix</Button>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BadgeCheck className="h-4 w-4" /> Certifications & Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {CERTIFICATIONS.map(cert => (
            <div key={cert.name} className="flex items-center gap-3 rounded-lg border p-3">
              {cert.verified
                ? <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                : <AlertCircle className="h-5 w-5 text-orange-500 shrink-0" />
              }
              <span className="flex-1 text-sm">{cert.name}</span>
              {!cert.verified && (
                <Button size="sm" variant="outline" className="text-xs h-7 shrink-0">
                  <Download className="h-3 w-3 mr-1" /> Upload
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function GuideDashboard() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [section, setSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "guide")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "guide") return null;

  const guide = user as Guide;
  const realBookings = bookings.filter(b => b.guideId === guide.id);
  const allBookings = [
    ...realBookings.map(b => ({ ...b, notes: b.notes ?? "" })),
    ...EXTRA_BOOKINGS.filter(b => b.guideId === guide.id),
  ];
  const myListingIds = listings.filter(l => l.guideId === guide.id).map(l => l.id);
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  const handleLogout = () => { logout(); router.push("/"); };

  const activeNav = NAV.find(n => n.id === section)!;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Mobile menu toggle */}
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {guide.name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium leading-none">{guide.name}</p>
                <p className="text-xs text-muted-foreground">Guide</p>
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
          transition-transform duration-200 lg:static lg:mt-0 lg:translate-x-0 lg:block
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
                {item.id === "bookings" && allBookings.filter(b => b.status === "pending").length > 0 && (
                  <span className={`ml-auto rounded-full px-1.5 py-0.5 text-xs font-bold ${section === item.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                    {allBookings.filter(b => b.status === "pending").length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">{activeNav.label}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {section === "overview"    && "Your performance at a glance"}
                {section === "earnings"    && "Track your income and payouts"}
                {section === "bookings"    && "Manage booking requests and confirmed trips"}
                {section === "calendar"    && "Set your availability and block dates"}
                {section === "reviews"     && "Your reputation and client feedback"}
                {section === "listings"    && "Manage and optimize your tour listings"}
                {section === "profile"     && "Your public guide profile and certifications"}
              </p>
            </div>

            {section === "overview"  && <OverviewSection guide={guide} allBookings={allBookings} />}
            {section === "earnings"  && <EarningsSection />}
            {section === "bookings"  && <BookingsSection allBookings={allBookings} />}
            {section === "calendar"  && <AvailabilitySection />}
            {section === "reviews"   && <ReviewsSection guideListingIds={myListingIds} />}
            {section === "listings"  && <ListingsSection guideId={guide.id} />}
            {section === "profile"   && <ProfileSection guide={guide} />}
          </div>
        </main>
      </div>
    </div>
  );
}
