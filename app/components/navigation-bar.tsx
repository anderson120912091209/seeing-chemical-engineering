'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ui/theme-toggle'

const NavigationBar = () => {
    const pathname = usePathname()

  return (
    <div className="p-4 flex items-center justify-between">
        {/* Navigation Bar - Left Logo Part */}
        <div className="flex-1">
            <div className="text-sm font-light text-white/60">
                seeing science - chemical engineering edition.
            </div>  
        </div>

        {/* Centered Navigation */}
        <nav className="hidden md:flex flex-shrink-0 space-x-8 text-sm items-center justify-center text-white/60 font-light">
            <Link href="/" className={`hover:text-white/80 transition-colors ${pathname === '/' ? 'text-white' : ''}`}>home</Link>
            <Link href="/advanced-statistics" className={`hover:text-white/80 transition-colors ${pathname === '/advanced-statistics' ? 'text-white' : ''}`}>advanced statistics</Link>
            <Link href="/mass-diffusion" className={`hover:text-white/80 transition-colors ${pathname === '/mass-diffusion' ? 'text-white' : ''}`}>mass & diffusion</Link>
            <Link href="/thermodynamics" className={`hover:text-white/80 transition-colors ${pathname === '/thermodynamics' ? 'text-white' : ''}`}>thermodynamics</Link>
        </nav>

        {/* Right-side with theme toggle and about link */}
        <div className="flex-1 flex justify-end items-center gap-4">
            <ThemeToggle size="sm" />
            <Link href="/about-the-author" className={`text-sm text-white/60 hover:text-white/80 transition-colors ${pathname === '/about-the-author' ? 'text-white' : ''}`}>
                about the author.
            </Link>
        </div>
    </div>
  )
}

export default NavigationBar