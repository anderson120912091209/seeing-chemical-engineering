'use client'

import NavigationBar from '@/app/components/navigation-bar'
import ChapterNavigation from '@/app/components/ui/chapter-navigation'  
import React from 'react'
import FicksLawAnimation from '@/app/components/animations/DIFFUSION/ficks-law'
import BrownianMotion from '@/app/components/animations/DIFFUSION/brownian-motion'
const MassDiffusion = () => {
  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-40 p-6 md:p-4">
        <NavigationBar />
      </header>
      <section>
        <BrownianMotion/>  
      </section>
      
    </div>
  )
}

export default MassDiffusion