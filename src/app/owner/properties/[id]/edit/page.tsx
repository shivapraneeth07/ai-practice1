import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PropertyForm } from '@/components/properties/property-form'

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { order: 'asc' } }, amenities: true, rules: true },
  })
  if (!property) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Property</h1>
        <p className="text-sm text-muted-foreground">Update the details of {property.title}.</p>
      </div>
      <PropertyForm initialData={property} />
    </div>
  )
}
