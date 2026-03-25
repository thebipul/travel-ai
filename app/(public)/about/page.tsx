import Link from "next/link";
import { Mountain, Users, Shield, Heart, Award, Globe, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "All our guides are verified and trained. We prioritize your safety on every adventure.",
  },
  {
    icon: Heart,
    title: "Authentic Experiences",
    description: "Connect with local culture and communities for genuine, meaningful travel experiences.",
  },
  {
    icon: Users,
    title: "Local Expertise",
    description: "Our guides are local experts who share deep knowledge of their homeland.",
  },
  {
    icon: Globe,
    title: "Sustainable Tourism",
    description: "We support responsible travel that benefits local communities and preserves nature.",
  },
];

const stats = [
  { number: "500+", label: "Happy Travelers" },
  { number: "50+", label: "Expert Guides" },
  { number: "100+", label: "Unique Tours" },
  { number: "4.9", label: "Average Rating" },
];

const team = [
  {
    name: "Pemba Sherpa",
    role: "Founder & CEO",
    bio: "Born in the Khumbu region, Pemba founded TrailMate to share his love of the Himalayas with the world.",
  },
  {
    name: "Anita Thapa",
    role: "Head of Operations",
    bio: "With 15 years in tourism, Anita ensures every trip runs smoothly and every traveler is happy.",
  },
  {
    name: "Raj Karki",
    role: "Guide Relations",
    bio: "Raj works closely with our guide community to maintain the highest standards of service.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold md:text-5xl">
              About <span className="text-primary">TrailMate</span> Nepal
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              We&apos;re on a mission to connect travelers with authentic Nepal experiences through verified local guides who share their passion, knowledge, and culture.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-center text-3xl font-bold">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                TrailMate Nepal was born from a simple observation: travelers visiting Nepal often struggled to find reliable local guides, while talented Nepali guides had limited ways to reach international travelers.
              </p>
              <p>
                Our founder, Pemba Sherpa, grew up in the shadow of Mount Everest and spent his childhood watching trekkers pass through his village. He became a guide himself, leading expeditions throughout the Himalayas for over 15 years.
              </p>
              <p>
                In 2023, Pemba launched TrailMate with a vision to create a platform that benefits both travelers and guides. We carefully vet every guide on our platform, ensuring they have proper certifications, local knowledge, and a genuine passion for sharing Nepal&apos;s wonders.
              </p>
              <p>
                Today, TrailMate connects hundreds of travelers each year with authentic Nepal experiences, from iconic treks to hidden cultural gems. We&apos;re proud to support local communities and promote sustainable tourism across the country.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-primary">{stat.number}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title}>
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mb-2 font-semibold">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Meet Our Team</h2>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {team.map((member) => (
              <Card key={member.name}>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold">Why Choose TrailMate?</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Verified Local Guides</h3>
                  <p className="text-muted-foreground">
                    Every guide on our platform is personally vetted for certifications, experience, and local knowledge.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Authentic Experiences</h3>
                  <p className="text-muted-foreground">
                    Go beyond tourist spots with guides who share genuine local culture, hidden gems, and personal connections.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Fair Pricing</h3>
                  <p className="text-muted-foreground">
                    Guides set their own prices, ensuring fair compensation while keeping adventures accessible.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Local Support</h3>
                  <p className="text-muted-foreground">
                    Our team is based in Nepal and available to help before, during, and after your adventure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to Explore Nepal?</h2>
          <p className="mx-auto mt-4 max-w-xl opacity-90">
            Start your adventure today with our expert local guides.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/explore">Browse Adventures</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link href="/register?role=guide">Join as Guide</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
