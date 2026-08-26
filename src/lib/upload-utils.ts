import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { uid } from '@/lib/utils'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export function validateImage(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG, WebP, and GIF images are allowed'
  }
  if (file.size > MAX_SIZE) {
    return 'Image must be less than 5MB'
  }
  return null
}

export async function saveImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const filename = `${uid()}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')

  await mkdir(uploadDir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  const filepath = path.join(uploadDir, filename)
  await writeFile(filepath, buffer)

  return `/uploads/${filename}`
}