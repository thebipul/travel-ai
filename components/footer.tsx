import Link from "next/link";
import { Mountain, Facebook, Instagram, Youtube, Mail } from "lucide-react";

const footerLinks = {
  explore: [
    { href: "/explore?category=trekking", label: "Trekking" },
    { href: "/explore?category=climbing", label: "Climbing" },
    { href: "/explore?category=cultural", label: "Cultural Tours" },
    { href: "/explore?category=safari", label: "Wildlife Safari" },
  ],
  regions: [
    { href: "/explore?region=Everest%20Region", label: "Everest Region" },
    { href: "/explore?region=Annapurna%20Region", label: "Annapurna Region" },
    { href: "/explore?region=Langtang%20Region", label: "Langtang Region" },
    { href: "/explore?region=Mustang", label: "Upper Mustang" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/guides", label: "Our Guides" },
    { href: "/register?role=guide", label: "Become a Guide" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/cancellation", label: "Cancellation Policy" },
  ],
};

// Prayer flag colors
const prayerFlagColors = [
  "bg-blue-500",
  "bg-white",
  "bg-red-500",
  "bg-green-600",
  "bg-yellow-400",
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      {/* Prayer flag decoration */}
      <div className="flex h-1">
        {prayerFlagColors.map((color, i) => (
          <div key={i} className={`flex-1 ${color}`} />
        ))}
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Mountain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Trail<span className="text-primary">Mate</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Connecting travelers with authentic Nepal experiences through verified local guides.
            </p>
            <div className="mt-4 flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="mailto:info@trailmate.com" className="text-muted-foreground hover:text-primary" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Explore</h3>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Regions</h3>
            <ul className="space-y-2">
              {footerLinks.regions.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} TrailMate Nepal. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with love in Nepal
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
