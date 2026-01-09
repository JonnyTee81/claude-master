'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, Check, X, Zap, Shield, Box } from 'lucide-react'
import ProfileInlineEdit from '@/components/ProfileInlineEdit'
import ProfileModal from '@/components/ProfileModal'
import ProfileCardBased from '@/components/ProfileCardBased'

type PrototypeType = 'inline' | 'modal' | 'card-based'

const prototypes = {
  inline: {
    name: 'Inline Edit-First',
    description: 'Everything editable in place with hover states',
    component: ProfileInlineEdit,
    icon: Zap,
    color: 'blue',
    pros: [
      'Fastest editing experience',
      'No mode switching',
      'Modern and fluid',
      'Great for power users'
    ],
    cons: [
      'Risk of accidental edits',
      'Harder to validate multiple fields',
      'Can feel cluttered',
      'Complex state management'
    ]
  },
  modal: {
    name: 'Modal-Based',
    description: 'Single edit button opens comprehensive modal',
    component: ProfileModal,
    icon: Shield,
    color: 'purple',
    pros: [
      'No accidental edits',
      'Better for bulk editing',
      'Easier validation',
      'Cleaner view state'
    ],
    cons: [
      'More clicks for simple changes',
      'Modal fatigue',
      'Context switch',
      'Takes longer to update single field'
    ]
  },
  'card-based': {
    name: 'Card-Based Progressive Disclosure',
    description: 'Each section is its own expandable card',
    component: ProfileCardBased,
    icon: Box,
    color: 'teal',
    pros: [
      'Flexible editing approach',
      'Organized sections',
      'Easily extensible',
      'Progressive disclosure'
    ],
    cons: [
      'More visual weight',
      'Can feel segmented',
      'Requires more scrolling',
      'Complex per-card state'
    ]
  }
}

export default function PrototypesPage() {
  const [activePrototype, setActivePrototype] = useState<PrototypeType>('inline')

  const ActiveComponent = prototypes[activePrototype].component

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Profile Design Prototypes</h1>
                <p className="text-slate-300 text-sm">Compare three different design approaches</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prototype Selector */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(prototypes) as PrototypeType[]).map((key) => {
              const prototype = prototypes[key]
              const Icon = prototype.icon
              const isActive = activePrototype === key

              return (
                <motion.button
                  key={key}
                  onClick={() => setActivePrototype(key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                    isActive
                      ? `bg-${prototype.color}-500/20 border-${prototype.color}-500`
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isActive ? `bg-${prototype.color}-500` : 'bg-white/10'
                    }`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1">{prototype.name}</h3>
                      <p className="text-sm text-slate-300">{prototype.description}</p>
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`w-6 h-6 rounded-full bg-${prototype.color}-500 flex items-center justify-center`}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Prototype Display */}
      <div className="relative">
        <motion.div
          key={activePrototype}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ActiveComponent />
        </motion.div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white/5 backdrop-blur-lg border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Design Comparison</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(Object.keys(prototypes) as PrototypeType[]).map((key) => {
              const prototype = prototypes[key]
              const Icon = prototype.icon

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * Object.keys(prototypes).indexOf(key) }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/10 p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-${prototype.color}-500 flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-white">{prototype.name}</h3>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Pros
                    </h4>
                    <ul className="space-y-1.5">
                      {prototype.pros.map((pro, index) => (
                        <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                      <X className="w-4 h-4" />
                      Cons
                    </h4>
                    <ul className="space-y-1.5">
                      {prototype.cons.map((con, index) => (
                        <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-blue-500/20 backdrop-blur-lg rounded-xl border border-blue-500/30 p-6">
              <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">Best for Power Users</h3>
              <p className="text-sm text-slate-300">Choose Inline Edit-First if your users edit profiles frequently and value speed over safety.</p>
            </div>

            <div className="bg-purple-500/20 backdrop-blur-lg rounded-xl border border-purple-500/30 p-6">
              <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">Best for First-Time Users</h3>
              <p className="text-sm text-slate-300">Choose Modal-Based if your users are new or cautious, and clear validation is important.</p>
            </div>

            <div className="bg-teal-500/20 backdrop-blur-lg rounded-xl border border-teal-500/30 p-6">
              <div className="w-12 h-12 rounded-lg bg-teal-500 flex items-center justify-center mb-4">
                <Box className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">Best for Scalability</h3>
              <p className="text-sm text-slate-300">Choose Card-Based if your profile will grow with new sections and needs flexibility.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/5 backdrop-blur-lg border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-slate-400 text-sm">
            These prototypes are built with Next.js 15, Tailwind CSS, and Framer Motion
          </p>
        </div>
      </div>
    </div>
  )
}
