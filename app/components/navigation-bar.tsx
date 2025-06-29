'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ui/theme-toggle'

const NavigationBar = () => {
    const pathname = usePathname()

  return (
    <div className="px-6 py-4 flex items-center justify-between border-b border-muted-foreground/20">
        {/* Navigation Bar - Left Logo Part */}
        <div className="flex-1">
            <div className="text-xs font-mono text-muted-foreground/80 tracking-widest uppercase font-bold">
                seeing science — mathematics edition.
            </div>  
        </div>

        {/* Centered Navigation */}
        <nav className="hidden md:flex flex-shrink-0 space-x-12 text-sm items-center justify-center text-muted-foreground/70 font-mono tracking-wide">
            <Link 
                href="/" 
                className={`hover:text-foreground transition-all duration-300 font-bold tracking-widest uppercase ${
                    pathname === '/' 
                        ? 'text-foreground border-b-2 border-muted-foreground/50 pb-1' 
                        : 'hover:border-b-2 hover:border-muted-foreground/30 hover:pb-1'
                }`}
            >
                home
            </Link>
            <Link 
                href="/advanced-statistics" 
                className={`hover:text-foreground transition-all duration-300 font-bold tracking-widest uppercase ${
                    pathname === '/advanced-statistics' 
                        ? 'text-foreground border-b-2 border-muted-foreground/50 pb-1' 
                        : 'hover:border-b-2 hover:border-muted-foreground/30 hover:pb-1'
                }`}
            >
                statistics
            </Link>
        </nav>

        {/* Right-side with theme toggle and about link */}
        <div className="flex-1 flex justify-end items-center gap-6">
            <ThemeToggle size="sm" />
            <Link 
                href="/about-the-author" 
                className={`text-xs font-mono text-muted-foreground/70 hover:text-foreground transition-all duration-300 font-bold tracking-widest uppercase ${
                    pathname === '/about-the-author' 
                        ? 'text-foreground border-b border-muted-foreground/50' 
                        : 'hover:border-b hover:border-muted-foreground/30'
                }`}
            >
                about author.
            </Link>
        </div>
    </div>
  )
}

export default NavigationBar