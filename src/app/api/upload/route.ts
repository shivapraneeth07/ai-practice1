import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { validateImage, saveImage } from '@/lib/upload-utils'

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const files = formData.getAll('files') as File[]

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded.' }, { status: 400 })
    }

    const urls: string[] = []

    for (const file of files) {
      const validationError = validateImage(file)
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 })
      }
      const url = await saveImage(file)
      urls.push(url)
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload images. Please try again.' },
      { status: 500 }
    )
  }
}
