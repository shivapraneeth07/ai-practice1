import Link from 'next/link'
import { Home, Search, ShieldCheck, Heart, MessagesSquare } from 'lucide-react'
import { Logo } from '@/components/layout/navbar'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Stop searching streets. Search your neighborhood digitally. Find rental houses and
              rooms near you with verified information.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">For Seekers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/properties" className="hover:text-foreground">Search Homes</Link></li>
              <li><Link href="/properties" className="hover:text-foreground">Map View</Link></li>
              <li><Link href="/signup" className="hover:text-foreground">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">For Owners</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/owner/properties/new" className="hover:text-foreground">List a Property</Link></li>
              <li><Link href="/signup" className="hover:text-foreground">Owner Signup</Link></li>
              <li><Link href="/login" className="hover:text-foreground">Owner Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Why RentEase</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Search className="h-4 w-4" /> Location-based discovery</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Verified listings</li>
              <li className="flex items-center gap-2"><MessagesSquare className="h-4 w-4" /> Direct owner contact</li>
              <li className="flex items-center gap-2"><Heart className="h-4 w-4" /> Budget filtering</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RentEase. All rights reserved. For demo purposes only.</p>
          <p className="mt-1">
            <ShieldCheck className="mr-1 inline h-3 w-3" />
            Never transfer money before verifying the property and owner.
          </p>
        </div>
      </div>
    </footer>
  )
}
