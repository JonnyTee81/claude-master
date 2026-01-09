// =====================================================
// Supabase Storage: Avatar Upload Client Example
// =====================================================
// This file shows how to upload, update, and delete
// avatars using the Supabase JavaScript client.
// =====================================================

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// =====================================================
// 1. Upload Avatar
// =====================================================

/**
 * Upload or update user's avatar
 * @param file - The image file to upload
 * @param userId - The user's UUID
 * @returns The public URL of the uploaded avatar
 */
async function uploadAvatar(file: File, userId: string): Promise<string> {
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.')
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit.')
    }

    // Extract file extension
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}.${fileExt}`

    // Upload to Supabase Storage
    // upsert: true means it will overwrite existing file
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true, // Overwrite existing avatar
      })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (updateError) {
      throw updateError
    }

    console.log('Avatar uploaded successfully:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('Error uploading avatar:', error)
    throw error
  }
}

// =====================================================
// 2. Delete Avatar
// =====================================================

/**
 * Delete user's avatar
 * @param userId - The user's UUID
 * @param fileName - The file name (e.g., "abc-123.jpg")
 */
async function deleteAvatar(userId: string, fileName: string): Promise<void> {
  try {
    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove([fileName])

    if (deleteError) {
      throw deleteError
    }

    // Clear avatar_url in profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: null, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (updateError) {
      throw updateError
    }

    console.log('Avatar deleted successfully')
  } catch (error) {
    console.error('Error deleting avatar:', error)
    throw error
  }
}

// =====================================================
// 3. Get Avatar URL
// =====================================================

/**
 * Get the public URL for a user's avatar
 * @param fileName - The file name (e.g., "abc-123.jpg")
 * @returns The public URL
 */
function getAvatarUrl(fileName: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)

  return publicUrl
}

// =====================================================
// 4. List User's Avatars
// =====================================================

/**
 * List all avatars for a user (should only be one)
 * @param userId - The user's UUID
 */
async function listUserAvatars(userId: string) {
  try {
    const { data, error } = await supabase.storage
      .from('avatars')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) {
      throw error
    }

    // Filter to only this user's avatars
    const userAvatars = data.filter(file => file.name.startsWith(userId))

    console.log('User avatars:', userAvatars)
    return userAvatars
  } catch (error) {
    console.error('Error listing avatars:', error)
    throw error
  }
}

// =====================================================
// 5. React Component Example
// =====================================================

/**
 * Example React component for avatar upload
 */
import { useState } from 'react'

export function AvatarUpload({ userId }: { userId: string }) {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const url = await uploadAvatar(file, userId)
      setAvatarUrl(url)

      alert('Avatar uploaded successfully!')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error uploading avatar')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setUploading(true)

      if (!avatarUrl) {
        throw new Error('No avatar to delete')
      }

      // Extract filename from URL
      const fileName = avatarUrl.split('/').pop()!
      await deleteAvatar(userId, fileName)
      setAvatarUrl(null)

      alert('Avatar deleted successfully!')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error deleting avatar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="avatar-upload">
      {avatarUrl ? (
        <div>
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{ width: 150, height: 150, borderRadius: '50%' }}
          />
          <button onClick={handleDelete} disabled={uploading}>
            {uploading ? 'Deleting...' : 'Delete Avatar'}
          </button>
        </div>
      ) : (
        <div>
          <label htmlFor="avatar-upload">
            {uploading ? 'Uploading...' : 'Upload Avatar'}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
      )}
    </div>
  )
}

// =====================================================
// 6. Security Testing
// =====================================================

/**
 * Test that RLS policies are working correctly
 */
async function testRLSPolicies() {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.error('User not authenticated')
    return
  }

  console.log('Testing RLS policies for user:', user.id)

  // Test 1: Try to upload with correct user ID
  try {
    const testFile = new File(['test'], `${user.id}.jpg`, { type: 'image/jpeg' })
    await uploadAvatar(testFile, user.id)
    console.log('✅ User can upload their own avatar')
  } catch (error) {
    console.error('❌ User cannot upload their own avatar:', error)
  }

  // Test 2: Try to upload with wrong user ID (should fail)
  try {
    const fakeUserId = '00000000-0000-0000-0000-000000000000'
    const testFile = new File(['test'], `${fakeUserId}.jpg`, { type: 'image/jpeg' })
    await uploadAvatar(testFile, fakeUserId)
    console.error('❌ SECURITY ISSUE: User can upload other users\' avatars!')
  } catch (error) {
    console.log('✅ User cannot upload other users\' avatars')
  }

  // Test 3: Try to view public avatar (should work)
  try {
    const publicUrl = getAvatarUrl(`${user.id}.jpg`)
    const response = await fetch(publicUrl)
    if (response.ok) {
      console.log('✅ Anyone can view avatars (public bucket)')
    } else {
      console.error('❌ Cannot view avatars')
    }
  } catch (error) {
    console.error('❌ Error viewing avatar:', error)
  }
}

// =====================================================
// 7. Utility Functions
// =====================================================

/**
 * Convert data URL to File object (useful for cropped images)
 */
function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

/**
 * Compress image before upload (using canvas)
 */
async function compressImage(file: File, maxWidth: number = 800): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          } else {
            reject(new Error('Canvas to Blob conversion failed'))
          }
        }, file.type, 0.9)
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}

export {
  uploadAvatar,
  deleteAvatar,
  getAvatarUrl,
  listUserAvatars,
  testRLSPolicies,
  dataURLtoFile,
  compressImage,
}
