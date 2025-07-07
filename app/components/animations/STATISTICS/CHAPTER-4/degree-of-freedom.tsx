'use client'
import React from 'react'
import { useTheme } from '@/app/contexts/theme-context'
import { Construction } from 'lucide-react'

const DegreeOfFreedom = () => {
  const { theme } = useTheme()
  
  const colors = theme === 'dark' ? {
    background: 'oklch(0.19 0 0)',
    card: 'oklch(0.23 0 0)',
    border: '#2a2a2a',
    text: '#e5e5e5',
    textMuted: '#888888',
    accent: '#8b5cf6'
  } : {
    background: '#ffffff',
    card: '#f8fafc',
    border: '#e2e8f0',
    text: '#1e293b',
    textMuted: '#64748b',
    accent: '#7c3aed'
  }

  return (
    <div 
      className="w-full h-full flex items-center justify-center"
      style={{ background: colors.background }}
    >
      <div 
        className="text-center p-12 rounded-xl border-2"
        style={{ 
          backgroundColor: colors.card,
          borderColor: colors.border,
          maxWidth: '600px'
        }}
      >
        <Construction 
          className="mx-auto mb-4" 
          size={64} 
          style={{ color: colors.accent }}
        />
        <h2 
          className="text-2xl font-bold mb-2"
          style={{ 
            color: colors.text,
            fontFamily: 'Aptos, system-ui, sans-serif'
          }}
        >
          Degrees of Freedom Animation
        </h2>
        <p 
          className="text-lg"
          style={{ 
            color: colors.textMuted,
            fontFamily: 'Aptos, system-ui, sans-serif'
          }}
        >
          Coming Soon...
        </p>
      </div>
    </div>
  )
}

export default DegreeOfFreedom 