'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Check, X, Plus, Trash2, Edit2, Github, Linkedin, Twitter, Globe, Instagram } from 'lucide-react'

const platformIcons = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  website: Globe,
  instagram: Instagram,
}

const platformColors = {
  twitter: 'hover:bg-blue-400',
  linkedin: 'hover:bg-blue-600',
  github: 'hover:bg-slate-800',
  website: 'hover:bg-green-600',
  instagram: 'hover:bg-pink-600',
}

interface SocialLink {
  id: string
  platform: keyof typeof platformIcons
  url: string
}

export default function ProfileInlineEdit() {
  const [avatar, setAvatar] = useState('/api/placeholder/128/128')
  const [avatarHover, setAvatarHover] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const [bio, setBio] = useState('Product designer passionate about creating intuitive user experiences. Coffee enthusiast ☕')
  const [isBioEditing, setIsBioEditing] = useState(false)
  const [bioValue, setBioValue] = useState(bio)
  const [bioHover, setIsBioHover] = useState(false)
  const [bioSaving, setBioSaving] = useState(false)
  const [bioSaved, setBioSaved] = useState(false)

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { id: '1', platform: 'twitter', url: 'twitter.com/sarahj' },
    { id: '2', platform: 'linkedin', url: 'linkedin.com/in/sarahj' },
    { id: '3', platform: 'github', url: 'github.com/sarahj' },
  ])
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null)
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [newLink, setNewLink] = useState({ platform: 'website' as keyof typeof platformIcons, url: '' })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const bioTextareaRef = useRef<HTMLTextAreaElement>(null)

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploadingAvatar(true)
      // Simulate upload
      setTimeout(() => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setAvatar(reader.result as string)
          setIsUploadingAvatar(false)
        }
        reader.readAsDataURL(file)
      }, 1000)
    }
  }

  const handleBioSave = () => {
    setBioSaving(true)
    setTimeout(() => {
      setBio(bioValue)
      setBioSaving(false)
      setBioSaved(true)
      setIsBioEditing(false)
      setTimeout(() => setBioSaved(false), 2000)
    }, 500)
  }

  const handleBioCancel = () => {
    setBioValue(bio)
    setIsBioEditing(false)
  }

  const handleAddLink = () => {
    if (newLink.url.trim()) {
      setSocialLinks([...socialLinks, { ...newLink, id: Date.now().toString() }])
      setNewLink({ platform: 'website', url: '' })
      setIsAddingLink(false)
    }
  }

  const handleRemoveLink = (id: string) => {
    setSocialLinks(socialLinks.filter(link => link.id !== id))
    setEditingLinkId(null)
  }

  const maxBioLength = 500
  const bioProgress = (bioValue.length / maxBioLength) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Direction 1: Inline Edit-First</h1>
          <p className="text-slate-600">Hover over elements to edit them directly in place</p>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600" />

          {/* Content */}
          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="relative -mt-16 mb-6">
              <div
                className="relative inline-block"
                onMouseEnter={() => setAvatarHover(true)}
                onMouseLeave={() => setAvatarHover(false)}
              >
                <motion.div
                  className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100"
                  whileHover={{ scale: 1.02 }}
                >
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />

                  {/* Upload overlay */}
                  <AnimatePresence>
                    {avatarHover && !isUploadingAvatar && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="w-6 h-6 text-white mb-1" />
                        <span className="text-white text-xs font-medium">Change Photo</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Upload progress */}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </motion.div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>

              {/* Name and username */}
              <div className="mt-4">
                <h2 className="text-2xl font-bold text-slate-900">Sarah Johnson</h2>
                <p className="text-slate-600">@sarahj</p>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">About</label>

              {!isBioEditing ? (
                <motion.div
                  className="relative p-4 rounded-lg border-2 border-transparent hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-text group"
                  onMouseEnter={() => setIsBioHover(true)}
                  onMouseLeave={() => setIsBioHover(false)}
                  onClick={() => {
                    setIsBioEditing(true)
                    setTimeout(() => bioTextareaRef.current?.focus(), 0)
                  }}
                  whileHover={{ scale: 1.01 }}
                >
                  <p className="text-slate-700 whitespace-pre-wrap">{bio}</p>
                  <AnimatePresence>
                    {bioHover && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-2 right-2"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <textarea
                    ref={bioTextareaRef}
                    value={bioValue}
                    onChange={(e) => setBioValue(e.target.value.slice(0, maxBioLength))}
                    className="w-full px-4 py-3 rounded-lg border-2 border-blue-500 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all resize-none"
                    rows={4}
                    maxLength={maxBioLength}
                  />

                  {/* Character counter */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full transition-colors ${
                            bioProgress > 90 ? 'bg-red-500' : bioProgress > 70 ? 'bg-amber-500' : 'bg-blue-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${bioProgress}%` }}
                        />
                      </div>
                    </div>
                    <span className={`ml-4 text-sm font-medium ${
                      bioProgress > 90 ? 'text-red-600' : bioProgress > 70 ? 'text-amber-600' : 'text-slate-600'
                    }`}>
                      {bioValue.length}/{maxBioLength}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleBioCancel}
                      className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBioSave}
                      disabled={bioSaving}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {bioSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Save indicator */}
              <AnimatePresence>
                {bioSaved && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 mt-2 text-green-600"
                  >
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Saved successfully</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Social Links</label>

              <div className="flex flex-wrap gap-3">
                {/* Existing links */}
                {socialLinks.map((link) => {
                  const Icon = platformIcons[link.platform]
                  return (
                    <motion.div
                      key={link.id}
                      className="relative group"
                      whileHover={{ scale: 1.05 }}
                    >
                      <button
                        className={`w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center transition-colors ${platformColors[link.platform]}`}
                        onClick={() => setEditingLinkId(editingLinkId === link.id ? null : link.id)}
                      >
                        <Icon className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
                      </button>

                      {/* Edit popover */}
                      <AnimatePresence>
                        {editingLinkId === link.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl border border-slate-200 p-3 w-64 z-10"
                          >
                            <input
                              type="text"
                              value={link.url}
                              onChange={(e) => {
                                setSocialLinks(socialLinks.map(l =>
                                  l.id === link.id ? { ...l, url: e.target.value } : l
                                ))
                              }}
                              className="w-full px-3 py-2 rounded border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm mb-2"
                              placeholder="Enter URL"
                            />
                            <button
                              onClick={() => handleRemoveLink(link.id)}
                              className="w-full px-3 py-2 rounded bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}

                {/* Add link button */}
                {!isAddingLink ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsAddingLink(true)}
                    className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                  >
                    <Plus className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 min-w-[200px] bg-blue-50 rounded-lg p-3 border-2 border-blue-200"
                  >
                    <select
                      value={newLink.platform}
                      onChange={(e) => setNewLink({ ...newLink, platform: e.target.value as keyof typeof platformIcons })}
                      className="w-full px-3 py-2 rounded border border-slate-300 mb-2 outline-none focus:border-blue-500"
                    >
                      {Object.keys(platformIcons).map((platform) => (
                        <option key={platform} value={platform}>
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      placeholder="Enter URL"
                      className="w-full px-3 py-2 rounded border border-slate-300 mb-2 outline-none focus:border-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsAddingLink(false)
                          setNewLink({ platform: 'website', url: '' })
                        }}
                        className="flex-1 px-3 py-2 rounded bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddLink}
                        disabled={!newLink.url.trim()}
                        className="flex-1 px-3 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-white/80 backdrop-blur rounded-lg border border-slate-200"
        >
          <h3 className="font-semibold text-slate-900 mb-2">Interaction Tips:</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Hover over the avatar to change your photo</li>
            <li>• Click the bio text to edit it inline</li>
            <li>• Click social icons to edit URLs or remove links</li>
            <li>• Click the + button to add new social links</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
