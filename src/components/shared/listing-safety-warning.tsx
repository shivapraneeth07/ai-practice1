import { ShieldAlert } from 'lucide-react'

export function ListingSafetyWarning({ className }: { className?: string }) {
  return (
    <div className={`flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 ${className ?? ''}`}>
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      <div className="text-sm text-amber-800">
        <p className="font-semibold">Stay safe while renting</p>
        <p className="mt-1 text-amber-700">
          Never transfer money before verifying the property and owner in person. RentEase never
          asks for advance payment through the platform. Always visit the property before paying
          any deposit.
        </p>
      </div>
    </div>
  )
}
