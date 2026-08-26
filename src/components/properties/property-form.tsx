'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2,
  Upload,
  X,
  ImagePlus,
  MapPin,
  Save,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/components/ui/use-toast'
import { propertySchema } from '@/lib/validations'
import {
  BEDROOM_TYPE_LABELS,
  BEDROOM_OPTIONS,
  PROPERTY_TYPE_LABELS,
  PROPERTY_TYPE_OPTIONS,
  FURNISHING_LABELS,
  FURNISHING_OPTIONS,
  AMENITY_LABELS,
  AMENITY_OPTIONS,
  RULE_LABELS,
  RULE_OPTIONS,
  AREA_NAMES,
  HYDERABAD_AREAS,
} from '@/lib/constants'
import { uid } from '@/lib/utils'

export function PropertyForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>(initialData?.images?.map((i: any) => i.url) ?? [])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData
      ? {
          ...initialData,
          availableFrom: initialData.availableFrom
            ? new Date(initialData.availableFrom).toISOString().split('T')[0]
            : '',
          amenities: initialData.amenities?.map((a: any) => a.amenity) ?? [],
          rules: initialData.rules?.map((r: any) => r.rule) ?? [],
          images: initialData.images?.map((i: any) => i.url) ?? [],
        }
      : {
          amenities: [],
          rules: [],
          images: [],
          availableFrom: new Date().toISOString().split('T')[0],
        },
  })

  const selectedAmenities = watch('amenities') ?? []
  const selectedRules = watch('rules') ?? []

  const toggleAmenity = (amenity: string) => {
    const current = selectedAmenities as string[]
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity]
    setValue('amenities', updated as any)
  }

  const toggleRule = (rule: string) => {
    const current = selectedRules as string[]
    const updated = current.includes(rule)
      ? current.filter((r) => r !== rule)
      : [...current, rule]
    setValue('rules', updated as any)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach((f) => formData.append('files', f))

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        const newUrls = data.urls as string[]
        setImages((prev) => [...prev, ...newUrls])
        setValue('images', [...images, ...newUrls] as any)
        toast({ title: 'Images uploaded', variant: 'success' })
      } else {
        toast({ title: 'Upload failed', description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Upload failed', variant: 'destructive' })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = (url: string) => {
    const updated = images.filter((i) => i !== url)
    setImages(updated)
    setValue('images', updated as any)
  }

  const onAreaSelect = (area: string) => {
    const found = HYDERABAD_AREAS.find((a) => a.area === area)
    if (found) {
      setValue('area', found.area)
      setValue('locality', found.locality)
      setValue('lat', found.lat)
      setValue('lng', found.lng)
    }
  }

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const res = await fetch(
        initialData ? `/api/properties/${initialData.id}` : '/api/properties',
        {
          method: initialData ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            availableFrom: new Date(data.availableFrom).toISOString(),
          }),
        }
      )
      const result = await res.json()
      if (res.ok) {
        toast({
          title: initialData ? 'Property updated' : 'Property listed!',
          description: initialData
            ? 'Your property has been updated.'
            : 'Your property is now live on RentEase.',
          variant: 'success',
        })
        router.push('/owner/properties')
        router.refresh()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Something went wrong.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save property.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="title">Property Title</Label>
            <Input id="title" placeholder="e.g. Cozy 2 BHK in Kondapur" {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label>Property Type</Label>
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              {...register('type')}
              defaultValue="APARTMENT"
            >
              {PROPERTY_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{PROPERTY_TYPE_LABELS[t]}</option>
              ))}
            </select>
            {errors.type && <p className="text-sm text-destructive">{errors.type.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label>Bedroom Type</Label>
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              {...register('bedroomType')}
              defaultValue="TWO_BHK"
            >
              {BEDROOM_OPTIONS.map((b) => (
                <option key={b} value={b}>{BEDROOM_TYPE_LABELS[b]}</option>
              ))}
            </select>
            {errors.bedroomType && <p className="text-sm text-destructive">{errors.bedroomType.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label>Bedrooms</Label>
            <Input type="number" min={1} max={20} defaultValue={2} {...register('bedrooms', { valueAsNumber: true })} />
            {errors.bedrooms && <p className="text-sm text-destructive">{errors.bedrooms.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label>Bathrooms</Label>
            <Input type="number" min={1} max={20} defaultValue={1} {...register('bathrooms', { valueAsNumber: true })} />
            {errors.bathrooms && <p className="text-sm text-destructive">{errors.bathrooms.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label>Monthly Rent (₹)</Label>
            <Input type="number" min={500} placeholder="18000" {...register('rent', { valueAsNumber: true })} />
            {errors.rent && <p className="text-sm text-destructive">{errors.rent.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label>Security Deposit (₹)</Label>
            <Input type="number" min={0} placeholder="36000" {...register('deposit', { valueAsNumber: true })} />
            {errors.deposit && <p className="text-sm text-destructive">{errors.deposit.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label>Maintenance (₹)</Label>
            <Input type="number" min={0} placeholder="0" {...register('maintenance', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Available From</Label>
            <Input type="date" {...register('availableFrom')} />
            {errors.availableFrom && <p className="text-sm text-destructive">{errors.availableFrom.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label>Furnishing</Label>
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              {...register('furnishing')}
              defaultValue="SEMI_FURNISHED"
            >
              {FURNISHING_OPTIONS.map((f) => (
                <option key={f} value={f}>{FURNISHING_LABELS[f]}</option>
              ))}
            </select>
            {errors.furnishing && <p className="text-sm text-destructive">{errors.furnishing.message as string}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" /> Location
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>City</Label>
            <Input placeholder="Hyderabad" defaultValue="Hyderabad" {...register('city')} />
            {errors.city && <p className="text-sm text-destructive">{errors.city.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label>Area</Label>
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              onChange={(e) => onAreaSelect(e.target.value)}
              value={watch('area') || ''}
            >
              <option value="">Select area</option>
              {AREA_NAMES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <input type="hidden" {...register('area')} />
            {errors.area && <p className="text-sm text-destructive">{errors.area.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label>Locality</Label>
            <Input placeholder="e.g. Hitech City" {...register('locality')} />
            {errors.locality && <p className="text-sm text-destructive">{errors.locality.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input placeholder="Full address" {...register('address')} />
            {errors.address && <p className="text-sm text-destructive">{errors.address.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label>Pincode</Label>
            <Input placeholder="500081" {...register('pincode')} />
          </div>
        </CardContent>
      </Card>

      {/* Property Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Property Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Area (sq.ft)</Label>
            <Input type="number" placeholder="1200" {...register('sqft', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Floor</Label>
            <Input type="number" min={0} placeholder="2" {...register('floor', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Total Floors</Label>
            <Input type="number" min={0} placeholder="5" {...register('totalFloors', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Facing</Label>
            <Input placeholder="e.g. North, East" {...register('facing')} />
          </div>
          <div className="space-y-2">
            <Label>Age of Property (years)</Label>
            <Input type="number" min={0} placeholder="5" {...register('age', { valueAsNumber: true })} />
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {AMENITY_OPTIONS.map((amenity) => (
              <label
                key={amenity}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                  (selectedAmenities as string[]).includes(amenity)
                    ? 'border-primary bg-primary-50'
                    : 'hover:bg-muted'
                }`}
              >
                <Checkbox
                  checked={(selectedAmenities as string[]).includes(amenity)}
                  onCheckedChange={() => toggleAmenity(amenity)}
                />
                {AMENITY_LABELS[amenity]}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">House Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {RULE_OPTIONS.map((rule) => (
              <label
                key={rule}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                  (selectedRules as string[]).includes(rule)
                    ? 'border-primary bg-primary-50'
                    : 'hover:bg-muted'
                }`}
              >
                <Checkbox
                  checked={(selectedRules as string[]).includes(rule)}
                  onCheckedChange={() => toggleRule(rule)}
                />
                {RULE_LABELS[rule]}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((url) => (
              <div key={url} className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="Property" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-[4/3] items-center justify-center rounded-lg border-2 border-dashed bg-muted/30 transition-colors hover:bg-muted"
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImagePlus className="mx-auto h-6 w-6" />
                  <span className="mt-1 block text-xs">Add Photo</span>
                </div>
              )}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          {errors.images && <p className="mt-2 text-sm text-destructive">{errors.images.message as string}</p>}
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={5}
            placeholder="Describe your property in detail — what makes it special, nearby landmarks, transport options, etc."
            {...register('description')}
          />
          {errors.description && <p className="mt-1 text-sm text-destructive">{errors.description.message as string}</p>}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/owner/properties')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {initialData ? 'Update Property' : 'Publish Listing'}
        </Button>
      </div>
    </form>
  )
}