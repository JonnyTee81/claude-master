import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/actions/profile'
import ProfileForm from '@/components/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile data
  const profile = await getProfile(user.id)

  if (!profile) {
    // Profile should exist due to trigger, but handle edge case
    return (
      <div className="py-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-800">Profile not found. Please contact support.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            Profile Settings
          </h1>
        </div>
      </header>
      <main className="mt-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <ProfileForm profile={profile} />
        </div>
      </main>
    </div>
  )
}
