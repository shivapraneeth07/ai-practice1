import Link from 'next/link'
import {
  Home,
  MapPin,
  ShieldCheck,
  Search,
  Wallet,
  MessagesSquare,
  CalendarCheck,
  KeyRound,
  ImagePlus,
  Bell,
  UserCheck,
  Building2,
  ClipboardList,
  Heart,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/properties/search-bar'
import { PropertyCard } from '@/components/properties/property-card'
import { prisma } from '@/lib/prisma'

async function getFeaturedProperties() {
  try {
    if (!process.env.DATABASE_URL) return []
    return await prisma.property.findMany({
      where: { status: 'AVAILABLE' },
      orderBy: { viewCount: 'desc' },
      take: 6,
      include: {
        images: { orderBy: { order: 'asc' }, take: 1 },
        amenities: true,
        owner: { select: { id: true, name: true, emailVerified: true, identityVerified: true } },
      },
    })
  } catch {
    return []
  }
}

export const revalidate = 60

export default async function LandingPage() {
  const featured = await getFeaturedProperties()

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-background">
        <div className="container flex flex-col items-center py-16 text-center md:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Hyderabad &middot; Now live
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">
            Find Your Next Home{' '}
            <span className="text-primary">Without Walking Every Street.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            RentEase helps you discover rental houses and rooms by area, budget, and amenities —
            so you can search your neighborhood digitally instead of chasing &quot;TO-LET&quot; boards.
          </p>

          <div className="mt-8 w-full max-w-2xl">
            <SearchBar large />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Popular:</span>
            {['Gachibowli', 'Kondapur', 'Madhapur', 'Kukatpally', 'Hitech City'].map((a) => (
              <Link
                key={a}
                href={`/properties?q=${encodeURIComponent(a)}`}
                className="rounded-full border bg-background px-3 py-1 transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {a}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/properties">
                <Search className="mr-2 h-5 w-5" /> Find a Home
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/owner/properties/new">
                <Building2 className="mr-2 h-5 w-5" /> List Your Property
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How It Works</h2>
          <p className="mt-3 text-muted-foreground">
            A simple flow for both house seekers and property owners.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
              <UserCheck className="h-5 w-5 text-primary" /> For House Seekers
            </h3>
            <ol className="space-y-4">
              {(
                [
                  ['Search your preferred area', Search],
                  ['Filter by budget & bedrooms', Wallet],
                  ['View property details', ClipboardList],
                  ['Contact the owner directly', MessagesSquare],
                  ['Schedule a visit', CalendarCheck],
                ] as [string, React.ComponentType<{ className?: string }>][]
              ).map(([label, Icon], i) => (
                <li key={i} className="flex items-center gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-muted-foreground">{label}</span>
                </li>
              ))}
            </ol>
            <Button asChild variant="outline" className="mt-6 w-full">
              <Link href="/properties">Start Searching</Link>
            </Button>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
              <Building2 className="h-5 w-5 text-primary" /> For House Owners
            </h3>
            <ol className="space-y-4">
              {(
                [
                  ['Create an account', UserCheck],
                  ['Add your property', Building2],
                  ['Upload photos', ImagePlus],
                  ['Receive enquiries', Bell],
                  ['Find a tenant', KeyRound],
                ] as [string, React.ComponentType<{ className?: string }>][]
              ).map(([label, Icon], i) => (
                <li key={i} className="flex items-center gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-muted-foreground">{label}</span>
                </li>
              ))}
            </ol>
            <Button asChild className="mt-6 w-full">
              <Link href="/owner/properties/new">List Your Property</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why RentEase */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Why use RentEase?</h2>
            <p className="mt-3 text-muted-foreground">
              Built to replace the tiring street-by-street house hunt.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: MapPin, title: 'No more walking every street', desc: 'Discover homes in your preferred area from your phone.' },
              { icon: Search, title: 'Location-based discovery', desc: 'Search by city, area, locality, or landmark.' },
              { icon: ShieldCheck, title: 'Verified information', desc: 'Clear verification badges so you know who you are dealing with.' },
              { icon: Wallet, title: 'Budget-based filtering', desc: 'Filter by rent, deposit, and amenities that matter to you.' },
              { icon: MessagesSquare, title: 'Direct owner contact', desc: 'Message owners and request visits without middlemen.' },
              { icon: Clock, title: 'Real-time availability', desc: 'Know the availability status before you reach out.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border bg-card p-6 transition-shadow hover:shadow-md">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured properties */}
      <section className="container py-16 md:py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Homes</h2>
            <p className="mt-2 text-muted-foreground">Popular available properties near you.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/properties">View All</Link>
          </Button>
        </div>

        {featured.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed bg-muted/30 p-12 text-center text-muted-foreground">
            No featured homes yet. Check back soon or be the first to list.
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to find a place that feels like home?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Join RentEase today and start your digital house hunt. Free for seekers, simple for
            owners.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary" className="rounded-full">
              <Link href="/signup">
                <Home className="mr-2 h-5 w-5" /> Get Started
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link href="/properties">Explore Homes</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

