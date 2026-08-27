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
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/properties/search-bar'
import { PropertyCard } from '@/components/properties/property-card'
import { Reveal } from '@/components/motion/reveal'
import { AnimatedCounter } from '@/components/motion/animated-counter'
import { GradientBlobs } from '@/components/motion/gradient-blobs'
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
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <GradientBlobs className="-z-0" />
        <div className="container relative z-10 flex flex-col items-center py-16 text-center md:py-28">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <MapPin className="h-4 w-4 text-primary" />
              Hyderabad &middot; Now live
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
              Find Your Next Home{' '}
              <span className="text-gradient">Without Walking Every Street.</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              RentEase helps you discover rental houses and rooms by area, budget, and amenities —
              so you can search your neighborhood digitally instead of chasing &quot;TO-LET&quot; boards.
            </p>
          </Reveal>

          <Reveal delay={300} className="mt-8 w-full max-w-2xl">
            <SearchBar large />
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="text-xs font-medium uppercase tracking-wider">Popular:</span>
              {['Gachibowli', 'Kondapur', 'Madhapur', 'Kukatpally', 'Hitech City'].map((a) => (
                <Link
                  key={a}
                  href={`/properties?q=${encodeURIComponent(a)}`}
                  className="rounded-full border bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-lg"
                >
                  {a}
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={500}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="group relative overflow-hidden rounded-full">
                <Link href="/properties">
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex items-center">
                    <Search className="mr-2 h-5 w-5" /> Find a Home
                  </span>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/owner/properties/new">
                  <Building2 className="mr-2 h-5 w-5" /> List Your Property
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y bg-muted/40 py-10">
        <div className="container">
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
            {[
              { value: 300, suffix: '+', label: 'Properties Listed', icon: Building2 },
              { value: 50, suffix: '+', label: 'Areas Covered', icon: MapPin },
              { value: 200, suffix: '+', label: 'Happy Tenants', icon: UserCheck },
              { value: 98, suffix: '%', label: 'Satisfaction Rate', icon: Sparkles },
            ].map((stat, i) => (
              <div key={stat.label} className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-3xl font-bold tracking-tight text-primary md:text-4xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                  <stat.icon className="h-3.5 w-3.5" />
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <Reveal>
        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How It Works</h2>
            <p className="mt-3 text-muted-foreground">
              A simple flow for both house seekers and property owners.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Reveal delay={100}>
              <div className="group rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
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
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-muted-foreground">{label}</span>
                    </li>
                  ))}
                </ol>
                <Button asChild variant="outline" className="mt-6 w-full rounded-full">
                  <Link href="/properties">Start Searching</Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="group rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
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
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-muted-foreground">{label}</span>
                    </li>
                  ))}
                </ol>
                <Button asChild className="mt-6 w-full rounded-full">
                  <Link href="/owner/properties/new">List Your Property</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </Reveal>

      {/* Why RentEase */}
      <Reveal>
        <section className="bg-muted/30 py-16 md:py-24">
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
              ].map(({ icon: Icon, title, desc }, i) => (
                <Reveal key={title} delay={i * 80}>
                  <div className="group rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-4 font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Featured properties */}
      <Reveal>
        <section className="container py-16 md:py-24">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Homes</h2>
              <p className="mt-2 text-muted-foreground">Popular available properties near you.</p>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/properties">View All</Link>
            </Button>
          </div>

          {featured.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((property, i) => (
                <Reveal key={property.id} delay={i * 100}>
                  <PropertyCard property={property} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed bg-muted/30 p-12 text-center text-muted-foreground">
              No featured homes yet. Check back soon or be the first to list.
            </div>
          )}
        </section>
      </Reveal>

      {/* CTA */}
      <Reveal>
        <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-violet-600 py-16 text-primary-foreground">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-blob" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-blob-slow" />
          </div>
          <div className="container relative">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Ready to find a place that feels like home?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
                Join RentEase today and start your digital house hunt. Free for seekers, simple for
                owners.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" variant="secondary" className="group relative overflow-hidden rounded-full">
                  <Link href="/signup">
                    <Home className="mr-2 h-5 w-5" /> Get Started
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-white/30 bg-transparent text-primary-foreground backdrop-blur-sm hover:bg-white/10 hover:text-primary-foreground">
                  <Link href="/properties">Explore Homes</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  )
}