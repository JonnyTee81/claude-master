'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit2, Check, X, Upload, Plus, Trash2, Github, Linkedin, Twitter, Globe, Instagram, MapPin, Users, FolderGit2 } from 'lucide-react'

const platformIcons = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  website: Globe,
  instagram: Instagram,
}

interface SocialLink {
  id: string
  platform: keyof typeof platformIcons
  url: string
}

export default function ProfileCardBased() {
  // Profile data
  const [avatar, setAvatar] = useState('/api/placeholder/96/96')
  const [name, setName] = useState('Sarah Johnson')
  const [username, setUsername] = useState('sarahj')
  const [bio, setBio] = useState('Product designer passionate about creating intuitive user experiences. Coffee enthusiast ☕')
  const [location, setLocation] = useState('San Francisco, CA')
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { id: '1', platform: 'twitter', url: 'twitter.com/sarahj' },
    { id: '2', platform: 'linkedin', url: 'linkedin.com/in/sarahj' },
    { id: '3', platform: 'github', url: 'github.com/sarahj' },
  ])

  // Edit states
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [avatarTemp, setAvatarTemp] = useState(avatar)
  const [bioTemp, setBioTemp] = useState(bio)
  const [locationTemp, setLocationTemp] = useState(location)
  const [socialLinksTemp, setSocialLinksTemp] = useState(socialLinks)
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const startEdit = (cardName: string) => {
    setEditingCard(cardName)
    if (cardName === 'avatar') setAvatarTemp(avatar)
    if (cardName === 'bio') setBioTemp(bio)
    if (cardName === 'location') setLocationTemp(location)
    if (cardName === 'social') setSocialLinksTemp([...socialLinks])
  }

  const cancelEdit = () => {
    setEditingCard(null)
  }

  const saveCard = (cardName: string) => {
    if (cardName === 'avatar') setAvatar(avatarTemp)
    if (cardName === 'bio') setBio(bioTemp)
    if (cardName === 'location') setLocation(locationTemp)
    if (cardName === 'social') setSocialLinks([...socialLinksTemp])
    setEditingCard(null)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      setTimeout(() => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setAvatarTemp(reader.result as string)
          setIsUploading(false)
        }
        reader.readAsDataURL(file)
      }, 1000)
    }
  }

  const maxBioLength = 500

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Direction 3: Card-Based Progressive Disclosure</h1>
          <p className="text-slate-600">Each section is its own editable card that expands independently</p>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar Card */}
          <motion.div
            layout
            className={`bg-white rounded-xl shadow-lg border-2 transition-all ${
              editingCard === 'avatar' ? 'border-teal-500 shadow-teal-100 shadow-2xl md:col-span-2' : 'border-transparent'
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Profile Photo</h3>
                {editingCard !== 'avatar' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startEdit('avatar')}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5 text-slate-600" />
                  </motion.button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {editingCard !== 'avatar' ? (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200">
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{name}</h4>
                      <p className="text-slate-600">@{username}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-start gap-6">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 flex-shrink-0">
                        <img src={avatarTemp} alt="Avatar" className="w-full h-full object-cover" />
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-teal-500 hover:bg-teal-50 transition-all cursor-pointer"
                        >
                          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm font-medium text-slate-700">Drop file here or click</p>
                          <p className="text-xs text-slate-500 mt-1">JPG, PNG • Max 5MB</p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveCard('avatar')}
                        className="px-4 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Bio Card */}
          <motion.div
            layout
            className={`bg-white rounded-xl shadow-lg border-2 transition-all ${
              editingCard === 'bio' ? 'border-teal-500 shadow-teal-100 shadow-2xl md:col-span-2' : 'border-transparent'
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">About</h3>
                {editingCard !== 'bio' ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startEdit('bio')}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5 text-slate-600" />
                  </motion.button>
                ) : (
                  <span className="text-sm text-teal-600 font-medium">Editing</span>
                )}
              </div>

              <AnimatePresence mode="wait">
                {editingCard !== 'bio' ? (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-slate-700 whitespace-pre-wrap">{bio}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <textarea
                      value={bioTemp}
                      onChange={(e) => setBioTemp(e.target.value.slice(0, maxBioLength))}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border-2 border-teal-500 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/20 outline-none resize-none"
                      placeholder="Tell people about yourself..."
                      maxLength={maxBioLength}
                      autoFocus
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">
                        {bioTemp.length}/{maxBioLength} characters
                      </span>
                      <div className="flex gap-3">
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveCard('bio')}
                          className="px-4 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Save
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Location Card */}
          <motion.div
            layout
            className={`bg-white rounded-xl shadow-lg border-2 transition-all ${
              editingCard === 'location' ? 'border-teal-500 shadow-teal-100 shadow-2xl' : 'border-transparent'
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Location</h3>
                {editingCard !== 'location' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startEdit('location')}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5 text-slate-600" />
                  </motion.button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {editingCard !== 'location' ? (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-slate-700"
                  >
                    <MapPin className="w-5 h-5 text-slate-500" />
                    <span>{location}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      value={locationTemp}
                      onChange={(e) => setLocationTemp(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-teal-500 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/20 outline-none"
                      placeholder="City, Country"
                      autoFocus
                    />
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveCard('location')}
                        className="px-4 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Stats Card (Read-only) */}
          <motion.div layout className="bg-white rounded-xl shadow-lg border-2 border-transparent">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-2">
                    <FolderGit2 className="w-6 h-6 text-teal-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">24</p>
                  <p className="text-sm text-slate-600">Projects</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">1.2k</p>
                  <p className="text-sm text-slate-600">Followers</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">432</p>
                  <p className="text-sm text-slate-600">Following</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Social Links Card */}
          <motion.div
            layout
            className={`bg-white rounded-xl shadow-lg border-2 transition-all ${
              editingCard === 'social' ? 'border-teal-500 shadow-teal-100 shadow-2xl md:col-span-2' : 'border-transparent md:col-span-2'
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Social Links</h3>
                {editingCard !== 'social' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startEdit('social')}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5 text-slate-600" />
                  </motion.button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {editingCard !== 'social' ? (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {socialLinks.map((link) => {
                      const Icon = platformIcons[link.platform]
                      return (
                        <div key={link.id} className="flex items-center gap-3 text-slate-700">
                          <Icon className="w-5 h-5 text-slate-500" />
                          <span className="font-medium">{link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-slate-600">{link.url}</span>
                        </div>
                      )
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {socialLinksTemp.map((link) => {
                      const Icon = platformIcons[link.platform]
                      return (
                        <div key={link.id} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-slate-700" />
                          </div>
                          <select
                            value={link.platform}
                            onChange={(e) => {
                              setSocialLinksTemp(socialLinksTemp.map(l =>
                                l.id === link.id ? { ...l, platform: e.target.value as keyof typeof platformIcons } : l
                              ))
                            }}
                            className="px-3 py-2 rounded-lg border border-slate-300 outline-none focus:border-teal-500 bg-white"
                          >
                            {Object.keys(platformIcons).map((platform) => (
                              <option key={platform} value={platform}>
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => {
                              setSocialLinksTemp(socialLinksTemp.map(l =>
                                l.id === link.id ? { ...l, url: e.target.value } : l
                              ))
                            }}
                            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                            placeholder="Enter URL"
                          />
                          <button
                            onClick={() => setSocialLinksTemp(socialLinksTemp.filter(l => l.id !== link.id))}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )
                    })}

                    <button
                      onClick={() => {
                        setSocialLinksTemp([
                          ...socialLinksTemp,
                          { id: Date.now().toString(), platform: 'website', url: '' }
                        ])
                      }}
                      className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 font-medium hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Link
                    </button>

                    <div className="flex gap-3 justify-end pt-3">
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveCard('social')}
                        className="px-4 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-white/80 backdrop-blur rounded-lg border border-slate-200"
        >
          <h3 className="font-semibold text-slate-900 mb-2">Interaction Tips:</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Click the edit icon on any card to expand it</li>
            <li>• Each card edits independently</li>
            <li>• Cards automatically expand when editing</li>
            <li>• Stats card is read-only for demonstration</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
