import { PropertyForm } from '@/components/properties/property-form'

export default function NewPropertyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">List a New Property</h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details below. Your listing will go live immediately.
        </p>
      </div>
      <PropertyForm />
    </div>
  )
}
