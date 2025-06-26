'use client'

import NavigationBar from '@/app/components/navigation-bar'
import ChapterNavigation from '@/app/components/ui/chapter-navigation'  
import React from 'react'
import FicksLawAnimation from '@/app/components/animations/DIFFUSION/ficks-law'
import BrownianMotion from '@/app/components/animations/DIFFUSION/brownian-motion'
import { Splitter, SplitterPanel } from 'primereact/splitter'


const MassDiffusion = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <header>
        <div>
          <NavigationBar />
        </div>
      {/* Horizontal Progress Bar */}
      
      </header>

      {/*Chapter Navigation*/}

      <Splitter>
        <SplitterPanel size={50} minSize={30}>


        
        {/* Left Column */}
        {/* Right Column */}
        </SplitterPanel>
      </Splitter>
  
      <section>
        <div className="flex justify-between items-center p-6 md:p-4">
          <BrownianMotion/>  
        </div>
      </section>
      
    </div>
  )
}

export default MassDiffusion