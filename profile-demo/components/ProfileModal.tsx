'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, Upload, Check, GripVertical, Trash2, Plus, Github, Linkedin, Twitter, Globe, Instagram } from 'lucide-react'

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

export default function ProfileModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [avatar, setAvatar] = useState('/api/placeholder/128/128')
  const [name, setName] = useState('Sarah Johnson')
  const [username, setUsername] = useState('sarahj')
  const [bio, setBio] = useState('Product designer passionate about creating intuitive user experiences. Coffee enthusiast ☕')
  const [location, setLocation] = useState('San Francisco, CA')
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { id: '1', platform: 'twitter', url: 'twitter.com/sarahj' },
    { id: '2', platform: 'linkedin', url: 'linkedin.com/in/sarahj' },
    { id: '3', platform: 'github', url: 'github.com/sarahj' },
  ])

  // Modal state
  const [modalAvatar, setModalAvatar] = useState(avatar)
  const [modalName, setModalName] = useState(name)
  const [modalUsername, setModalUsername] = useState(username)
  const [modalBio, setModalBio] = useState(bio)
  const [modalLocation, setModalLocation] = useState(location)
  const [modalSocialLinks, setModalSocialLinks] = useState(socialLinks)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [draggedLink, setDraggedLink] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const openModal = () => {
    setModalAvatar(avatar)
    setModalName(name)
    setModalUsername(username)
    setModalBio(bio)
    setModalLocation(location)
    setModalSocialLinks([...socialLinks])
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setAvatar(modalAvatar)
      setName(modalName)
      setUsername(modalUsername)
      setBio(modalBio)
      setLocation(modalLocation)
      setSocialLinks([...modalSocialLinks])
      setIsSaving(false)
      setIsModalOpen(false)
    }, 1000)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      setTimeout(() => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setModalAvatar(reader.result as string)
          setIsUploading(false)
        }
        reader.readAsDataURL(file)
      }, 1000)
    }
  }

  const handleAddLink = () => {
    setModalSocialLinks([
      ...modalSocialLinks,
      { id: Date.now().toString(), platform: 'website', url: '' }
    ])
  }

  const handleRemoveLink = (id: string) => {
    setModalSocialLinks(modalSocialLinks.filter(link => link.id !== id))
  }

  const handleDragStart = (id: string) => {
    setDraggedLink(id)
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (draggedLink && draggedLink !== id) {
      const draggedIndex = modalSocialLinks.findIndex(l => l.id === draggedLink)
      const targetIndex = modalSocialLinks.findIndex(l => l.id === id)
      const newLinks = [...modalSocialLinks]
      const [removed] = newLinks.splice(draggedIndex, 1)
      newLinks.splice(targetIndex, 0, removed)
      setModalSocialLinks(newLinks)
    }
  }

  const maxBioLength = 500
  const bioProgress = (modalBio.length / maxBioLength) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Direction 2: Modal-Based</h1>
          <p className="text-slate-600">Click Edit Profile to modify all fields in one dedicated modal</p>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-600" />

          {/* Content */}
          <div className="px-8 pb-8">
            {/* Avatar and Edit Button */}
            <div className="flex items-start justify-between -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openModal}
                className="mt-4 px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
              >
                Edit Profile
              </motion.button>
            </div>

            {/* Name and username */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">{name}</h2>
              <p className="text-slate-600">@{username}</p>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">About</h3>
              <p className="text-slate-700 whitespace-pre-wrap">{bio}</p>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Location</h3>
              <p className="text-slate-700">{location}</p>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Social Links</h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link) => {
                  const Icon = platformIcons[link.platform]
                  return (
                    <div key={link.id} className="flex items-center gap-2 text-slate-700">
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{link.url}</span>
                    </div>
                  )
                })}
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
            <li>• Click Edit Profile to open the editing modal</li>
            <li>• Upload a new avatar with drag-and-drop</li>
            <li>• Edit all fields at once before saving</li>
            <li>• Drag to reorder social links</li>
          </ul>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeModal}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                  {/* Avatar Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Profile Photo</label>
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200">
                        <img src={modalAvatar} alt="Avatar" className="w-full h-full object-cover" />
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer group"
                        >
                          <Upload className="w-8 h-8 text-slate-400 group-hover:text-purple-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-slate-700 group-hover:text-purple-700">
                            Drop your photo here or click to browse
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            JPG, PNG • Max 5MB
                          </p>
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
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Display Name</label>
                    <input
                      type="text"
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">@</span>
                      <input
                        type="text"
                        value={modalUsername}
                        onChange={(e) => setModalUsername(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all"
                        placeholder="username"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                    <textarea
                      value={modalBio}
                      onChange={(e) => setModalBio(e.target.value.slice(0, maxBioLength))}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all resize-none"
                      placeholder="Tell people about yourself..."
                      maxLength={maxBioLength}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex-1">
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full transition-colors ${
                              bioProgress > 90 ? 'bg-red-500' : bioProgress > 70 ? 'bg-amber-500' : 'bg-purple-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${bioProgress}%` }}
                          />
                        </div>
                      </div>
                      <span className={`ml-4 text-sm font-medium ${
                        bioProgress > 90 ? 'text-red-600' : bioProgress > 70 ? 'text-amber-600' : 'text-slate-600'
                      }`}>
                        {modalBio.length}/{maxBioLength}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={modalLocation}
                      onChange={(e) => setModalLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all"
                      placeholder="City, Country"
                    />
                  </div>

                  {/* Social Links */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Social Links</label>
                    <div className="space-y-2">
                      {modalSocialLinks.map((link) => {
                        const Icon = platformIcons[link.platform]
                        return (
                          <motion.div
                            key={link.id}
                            layout
                            draggable
                            onDragStart={() => handleDragStart(link.id)}
                            onDragOver={(e) => handleDragOver(e, link.id)}
                            onDragEnd={() => setDraggedLink(null)}
                            className={`flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 ${
                              draggedLink === link.id ? 'opacity-50' : ''
                            }`}
                          >
                            <button
                              className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
                              onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
                              onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
                            >
                              <GripVertical className="w-5 h-5" />
                            </button>
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-5 h-5 text-slate-700" />
                            </div>
                            <select
                              value={link.platform}
                              onChange={(e) => {
                                setModalSocialLinks(modalSocialLinks.map(l =>
                                  l.id === link.id ? { ...l, platform: e.target.value as keyof typeof platformIcons } : l
                                ))
                              }}
                              className="px-3 py-2 rounded border border-slate-300 outline-none focus:border-purple-500 bg-white"
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
                                setModalSocialLinks(modalSocialLinks.map(l =>
                                  l.id === link.id ? { ...l, url: e.target.value } : l
                                ))
                              }}
                              className="flex-1 px-3 py-2 rounded border border-slate-300 outline-none focus:border-purple-500"
                              placeholder="Enter URL"
                            />
                            <button
                              onClick={() => handleRemoveLink(link.id)}
                              className="p-2 hover:bg-red-50 rounded text-red-600 transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </motion.div>
                        )
                      })}
                    </div>

                    {/* Add Link Button */}
                    <button
                      onClick={handleAddLink}
                      className="mt-3 w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 font-medium hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Another Link
                    </button>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
