'use client'

import React, { useState } from 'react'
import NavigationBar from '@/app/components/navigation-bar'
import AnovaAnimation from '@/app/components/animations/ANOVA/anova-animation';
import AnovaAnimations2 from '@/app/components/animations/ANOVA/anova-animations-2';
import CalculateButton from '@/app/components/ui/calculate-button';
import ClickableUnderline from '@/app/components/ui/clickable-underline'


const AdvancedStatistics = () => {
  // State management
  const [selectedConcept, setSelectedConcept] = useState<'between' | 'within' | null>(null)

  const handleBetweenClick = () => {
    setSelectedConcept('between')
    console.log('Between groups clicked')
  }

  const handleWithinClick = () => {
    setSelectedConcept('within')
    console.log('Within groups clicked')
  }

  //Handle the Calculation, Computing Variance and Turning the Results into Animations. 
  const CalculateVariance = () => {
    console.log('calculate')
  }

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-40 p-6 md:p-4">
        <NavigationBar />
      </header>

      {/* Page Content */}
      <main className="container mx-auto mt-24 px-4 text-white font-light" style={{ fontFamily: 'Aptos' }}>
        <h1 className="text-4xl font-bold text-white/80 mb-4">Understanding ANOVA</h1>
        <p className="mb-8 text-lg text-gray-300">
          Analysis of Variance (ANOVA) helps us understand if there are{' '}
          <ClickableUnderline color="blue" onClick={handleBetweenClick}>
          significant differences
          </ClickableUnderline>{' '}
          between the means of several groups. 
          The animation below visualizes the core concept: comparing the variation{' '}
          <ClickableUnderline color="green" onClick={handleBetweenClick}>
            between
          </ClickableUnderline>{' '}
          the groups to the variation{' '}
          <ClickableUnderline color="red" onClick={handleWithinClick}>
            within
          </ClickableUnderline>{' '}
          each group.
        </p>
        
        {/* ANOVA Section Animation */}
        <div className="flex justify-left">
            <AnovaAnimation />
            <span> <CalculateButton size="lg" variant="default" onClick={CalculateVariance}>Calculate</CalculateButton> </span>
        </div>

      </main>
    </div>
  )
}

export default AdvancedStatistics; 