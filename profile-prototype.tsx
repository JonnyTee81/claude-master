'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Edit,
  Camera,
  AlertCircle,
  Loader2,
  UserPlus,
  CheckCircle
} from 'lucide-react'

type ProfileState = 'loading' | 'error' | 'empty' | 'success'

export default function ProfilePrototype() {
  const [currentState, setCurrentState] = useState<ProfileState>('success')

  // Mock user data
  const mockUser = {
    name: 'Sarah Johnson',
    username: '@sarahj',
    email: 'sarah.johnson@example.com',
    bio: 'Product designer passionate about creating intuitive user experiences. Coffee enthusiast ☕️',
    location: 'San Francisco, CA',
    joinedDate: 'January 2024',
    stats: {
      projects: 24,
      followers: 1234,
      following: 567
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* State Switcher - For prototype navigation */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200">
          <p className="text-sm font-semibold text-slate-700 mb-3">Prototype States:</p>
          <div className="flex flex-wrap gap-2">
            {(['loading', 'error', 'empty', 'success'] as ProfileState[]).map((state) => (
              <button
                key={state}
                onClick={() => setCurrentState(state)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                  currentState === state
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {currentState === 'loading' && <LoadingState key="loading" />}
          {currentState === 'error' && <ErrorState key="error" />}
          {currentState === 'empty' && <EmptyState key="empty" />}
          {currentState === 'success' && <SuccessState key="success" user={mockUser} />}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Loading State Component
function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
    >
      {/* Header Skeleton */}
      <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" />

      <div className="p-8">
        {/* Avatar Skeleton */}
        <div className="relative -mt-20 mb-6">
          <div className="w-32 h-32 rounded-full bg-slate-200 animate-pulse border-4 border-white" />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-slate-200 rounded-lg w-1/3 animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="h-6 bg-slate-200 rounded w-12 mx-auto mb-2 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-16 mx-auto animate-pulse" />
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-slate-600 font-medium">Loading profile...</span>
        </div>
      </div>
    </motion.div>
  )
}

// Error State Component
function ErrorState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-xl border border-red-200 overflow-hidden"
    >
      <div className="p-12">
        <div className="text-center max-w-md mx-auto">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>

          {/* Error Message */}
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Unable to Load Profile
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            We encountered an error while loading this profile. This could be due to a network issue or the profile may not exist.
          </p>

          {/* Error Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
            <button className="bg-white text-slate-700 px-6 py-3 rounded-lg font-semibold border border-slate-300 hover:bg-slate-50 transition-colors">
              Go Back
            </button>
          </div>

          {/* Technical Details (collapsible in real app) */}
          <details className="mt-8 text-left">
            <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-700">
              Technical Details
            </summary>
            <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <code className="text-xs text-slate-600 font-mono">
                Error: Failed to fetch user profile
                <br />
                Status: 500 Internal Server Error
                <br />
                Timestamp: {new Date().toISOString()}
              </code>
            </div>
          </details>
        </div>
      </div>
    </motion.div>
  )
}

// Empty State Component
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
    >
      {/* Simple Header */}
      <div className="h-24 bg-gradient-to-r from-slate-200 to-slate-300" />

      <div className="p-12">
        {/* Empty Avatar */}
        <div className="relative -mt-20 mb-8">
          <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center">
            <User className="w-16 h-16 text-slate-300" />
          </div>
        </div>

        <div className="text-center max-w-lg mx-auto">
          {/* Empty State Icon */}
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>

          {/* Empty State Message */}
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Complete Your Profile
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Your profile is looking a bit empty! Add your personal information, profile picture, and bio to help others get to know you better.
          </p>

          {/* Setup Checklist */}
          <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Setup:</h3>
            <div className="space-y-3">
              {[
                { label: 'Add profile photo', done: false },
                { label: 'Write a bio', done: false },
                { label: 'Add location', done: false },
                { label: 'Connect social accounts', done: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    item.done ? 'bg-green-600 border-green-600' : 'border-slate-300'
                  }`}>
                    {item.done && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <span className={item.done ? 'text-slate-400 line-through' : 'text-slate-700'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 mx-auto">
            <Edit className="w-5 h-5" />
            Set Up Profile
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Success State Component
function SuccessState({ user }: { user: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
    >
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
        <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-white transition-all flex items-center gap-2 shadow-md">
          <Camera className="w-4 h-4" />
          Edit Cover
        </button>
      </div>

      <div className="p-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 mb-4 md:mb-0">
            {/* Avatar */}
            <div className="relative -mt-20">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-4 border-white shadow-xl flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {user.name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              <button className="absolute bottom-1 right-1 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {/* Name and Username */}
            <div className="sm:pb-2">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
                {user.name}
              </h1>
              <p className="text-slate-500 font-medium">{user.username}</p>
            </div>
          </div>

          {/* Action Button */}
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {/* Bio */}
        <p className="text-slate-700 leading-relaxed mb-6 text-lg">
          {user.bio}
        </p>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-6 mb-8 text-slate-600">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-slate-400" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-slate-400" />
            <span>{user.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <span>Joined {user.joinedDate}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {user.stats.projects}
            </div>
            <div className="text-sm text-slate-600 font-medium">Projects</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {user.stats.followers.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600 font-medium">Followers</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {user.stats.following}
            </div>
            <div className="text-sm text-slate-600 font-medium">Following</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
