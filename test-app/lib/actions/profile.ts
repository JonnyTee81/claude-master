'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Profile, ProfileFormState } from '@/lib/types/profile'

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export async function updateProfile(
  prevState: ProfileFormState | null,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Extract and validate
  const fullName = formData.get('full_name') as string
  if (!fullName || fullName.trim().length === 0) {
    return { error: 'Name is required' }
  }
  if (fullName.length > 100) {
    return { error: 'Name is too long (max 100 characters)' }
  }

  // Update database
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName.trim() })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    return { error: 'Failed to update profile' }
  }

  revalidatePath('/profile')
  return { success: 'Profile updated successfully!' }
}

export async function updateAvatar(
  prevState: ProfileFormState | null,
  formData: FormData
): Promise<ProfileFormState> {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Not authenticated' }
    }

    // Extract file
    const file = formData.get('avatar') as File
    if (!file || file.size === 0) {
      return { error: 'No file selected' }
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { error: 'Only JPG, PNG, GIF, and WebP files are allowed' }
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { error: 'File must be under 5MB' }
    }

    // Generate filename with folder structure for RLS
    // Format: {userId}/avatar.{extension}
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `${user.id}/avatar.${extension}`

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filename, file, {
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      return { error: 'Failed to upload avatar' }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filename)

    // Update database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)

    if (updateError) {
      return { error: 'Failed to update profile' }
    }

    revalidatePath('/profile')
    return { success: 'Avatar updated successfully!' }

  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}
