'use client'

import { useState, startTransition } from 'react'
import { useActionState } from 'react'
import { updateProfile, updateAvatar } from '@/lib/actions/profile'
import type { Profile } from '@/lib/types/profile'
import AvatarUpload from './AvatarUpload'

interface ProfileFormProps {
  profile: Profile
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [profileState, profileAction, profilePending] = useActionState(updateProfile, null)
  const [avatarState, avatarAction, avatarPending] = useActionState(updateAvatar, null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleAvatarUpload = () => {
    if (!selectedFile) return

    const formData = new FormData()
    formData.append('avatar', selectedFile)

    startTransition(() => {
      avatarAction(formData)
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Avatar Upload Section */}
          <div className="mb-8">
            <div className="flex flex-col items-center">
              <AvatarUpload
                currentSrc={profile.avatar_url}
                name={profile.full_name}
                email={profile.email}
                onFileSelect={handleFileSelect}
                error={avatarState?.error}
              />

              {selectedFile && (
                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  disabled={avatarPending}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {avatarPending ? 'Uploading...' : 'Upload Avatar'}
                </button>
              )}

              {avatarState?.success && (
                <div className="mt-4 rounded-md bg-green-50 p-4 w-full">
                  <p className="text-sm font-medium text-green-800">
                    {avatarState.success}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Profile Information</span>
            </div>
          </div>

          {/* Profile Fields Section */}
          <form action={profileAction} className="space-y-6">
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                id="full_name"
                defaultValue={profile.full_name || ''}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={profile.email || ''}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm px-3 py-2 border cursor-not-allowed text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed
              </p>
            </div>

            {profileState?.error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {profileState.error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {profileState?.success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      {profileState.success}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={profilePending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {profilePending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
