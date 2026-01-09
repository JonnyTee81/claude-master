'use client'

import { useState, useRef } from 'react'
import Avatar from './Avatar'

interface AvatarUploadProps {
  currentSrc: string | null
  name: string | null
  email: string | null
  onFileSelect: (file: File) => void
  error?: string
}

export default function AvatarUpload({
  currentSrc,
  name,
  email,
  onFileSelect,
  error,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          // Calculate new dimensions (max 512x512)
          let width = img.width
          let height = img.height
          const maxSize = 512

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height
              height = maxSize
            }
          }

          canvas.width = width
          canvas.height = height

          ctx?.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const resizedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                })
                resolve(resizedFile)
              } else {
                reject(new Error('Failed to create blob'))
              }
            },
            'image/jpeg',
            0.8
          )
        }
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Client-side validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, PNG, GIF, and WebP files are allowed')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File must be under 5MB')
      return
    }

    // Resize image
    try {
      const resizedFile = await resizeImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(resizedFile)

      // Notify parent
      onFileSelect(resizedFile)
    } catch (err) {
      console.error('Error processing image:', err)
      // Fallback to original file
      onFileSelect(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
        aria-label="Upload profile picture"
      >
        <Avatar
          src={preview || currentSrc}
          name={name}
          email={email}
          size="lg"
        />

        {/* Camera overlay on hover */}
        <div className={`absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      <p className="mt-2 text-sm text-gray-600">
        Click to upload new avatar
      </p>
      <p className="text-xs text-gray-500">
        JPG, PNG, GIF or WebP (max 5MB)
      </p>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
