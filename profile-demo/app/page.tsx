'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Layers, ArrowRight, Sparkles, Zap, Shield, Box } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Profile Design Prototypes</h1>
              <p className="text-slate-400 text-sm">Interactive design explorations</p>
            </div>
          </motion.div>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Design Exploration Complete
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Profile Page Design
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Three Approaches
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Explore three distinct design directions for user profile pages with avatar upload, bio editing, and social links management.
            </p>
          </motion.div>

          {/* Prototype Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Inline Edit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Inline Edit-First</h3>
              <p className="text-slate-300 text-sm mb-4">
                Edit everything in place with hover states. Fast and fluid for power users.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="text-sm text-slate-400 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Fastest editing experience</span>
                </li>
                <li className="text-sm text-slate-400 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>No mode switching</span>
                </li>
                <li className="text-sm text-slate-400 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Modern and fluid</span>
                </li>
              </ul>
            </motion.div>

            {/* Modal Based */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Modal-Based</h3>
              <p className="text-slate-300 text-sm mb-4">
                Dedicated edit modal for safe, controlled editing with validation.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="text-sm text-slate-400 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>No accidental edits</span>
                </li>
                <li className="text-sm text-slate-400 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Better for bulk editing</span>
                </li>
                <li className="text-sm text-slate-400 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Easier validation</span>
                </li>
              </ul>
            </motion.div>

            {/* Card Based */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4">
                <Box className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Card-Based</h3>
              <p className="text-slate-300 text-sm mb-4">
                Modular cards that expand independently. Scalable and organized.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="text-sm text-slate-400 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Flexible editing</span>
                </li>
                <li className="text-sm text-slate-400 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Organized sections</span>
                </li>
                <li className="text-sm text-slate-400 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Easily extensible</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Link href="/prototypes">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold rounded-xl shadow-2xl shadow-blue-500/50 hover:shadow-purple-500/50 transition-all"
              >
                Explore All Prototypes
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <p className="text-slate-400 text-sm mt-4">
              Interactive prototypes with full functionality
            </p>
          </motion.div>
        </div>

        {/* Features */}
        <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-white mb-4">What's Included</h3>
            <p className="text-slate-300">Each prototype demonstrates key interactions and patterns</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Avatar Upload', desc: 'Drag-and-drop with preview and crop' },
              { title: 'Bio Editing', desc: 'Character counter and auto-save' },
              { title: 'Social Links', desc: 'Add, edit, reorder, and remove' },
              { title: 'Smooth Animations', desc: 'Framer Motion transitions' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600" />
                </div>
                <h4 className="font-bold text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
