'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NavigationBar from '@/app/components/navigation-bar'
import AnovaAnimation from '@/app/components/animations/ANOVA/anova-animation'
import AnovaAnimations2 from '@/app/components/animations/ANOVA/anova-animations-2' // Assuming this is for F-Statistic
import CalculateButton from '@/app/components/ui/calculate-button'
import ClickableUnderline from '@/app/components/ui/clickable-underline'

// --- Placeholder Animations ---
const TTestAnimationPlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center bg-blue-900/20 rounded-lg p-8">
    <div className="text-center">
      <div className="text-6xl mb-4">📊</div>
      <h3 className="text-2xl text-blue-300 font-semibold">T-Test Animation</h3>
      <p className="text-sm text-gray-400 mt-2">(Placeholder)</p>
    </div>
  </div>
)

const RegressionAnimationPlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center bg-purple-900/20 rounded-lg p-8">
    <div className="text-center">
      <div className="text-6xl mb-4">📈</div>
      <h3 className="text-2xl text-purple-300 font-semibold">Regression Analysis</h3>
      <p className="text-sm text-gray-400 mt-2">(Placeholder)</p>
    </div>
  </div>
)
// ----------------------------

const AdvancedStatistics = () => {
  const [activeSection, setActiveSection] = useState('anova')
  const [selectedConcept, setSelectedConcept] = useState<'between' | 'within' | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const contentRef = useRef<HTMLDivElement>(null)
  const anovaRef = useRef<HTMLDivElement>(null)
  const ttestRef = useRef<HTMLDivElement>(null)
  const regressionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sectionRefs = [
      { id: 'anova', ref: anovaRef },
      { id: 'ttest', ref: ttestRef },
      { id: 'regression', ref: regressionRef }
    ]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
      }
    )

    sectionRefs.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = window.scrollY / totalHeight
      setScrollProgress(progress)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      sectionRefs.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const renderAnimation = () => {
    switch (activeSection) {
      case 'anova':
        return <AnovaAnimation />
      case 'ttest':
        return <TTestAnimationPlaceholder />
      case 'regression':
        return <RegressionAnimationPlaceholder />
      default:
        return <AnovaAnimation />
    }
  }

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
    <div className="bg-background text-white" style={{ fontFamily: 'Aptos' }}>
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 md:px-4 py-4">
          <NavigationBar />
          {/* Horizontal Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/10">
            <motion.div 
              className="h-full"
              style={{ 
                width: `${scrollProgress * 100}%`,
                backgroundColor: '#81a8e7'
              }}
            />
          </div>
        </div>
      </header>

      <main className="flex pt-20">
        
        {/* Left Column: Scrollable Content */}
        <div ref={contentRef} className="w-1/2">
          <div className="max-w-xl ml-auto p-12 space-y-12">
            
            {/* --- Section 1: ANOVA --- */}
            <section ref={anovaRef} id="anova" className="min-h-screen">
              <h2 className="text-responsive-h2 font-bold text-white/90 mb-6">1. Understanding ANOVA</h2>
              <div className="space-y-4 text-responsive-p text-gray-300 font-light">
                <p>
                  Analysis of Variance (ANOVA) helps us understand if there are{' '}
                  <ClickableUnderline color="blue" onClick={handleBetweenClick}>
                    significant differences
                  </ClickableUnderline>{' '}
                  between the means of several groups. 
                  The core concept is to compare the variation{' '}
                  <ClickableUnderline color="green" onClick={handleBetweenClick}>
                    between
                  </ClickableUnderline>{' '}
                  the groups to the variation{' '}
                  <ClickableUnderline color="red" onClick={handleWithinClick}>
                    within
                  </ClickableUnderline>{' '}
                  each group.
                </p>
                <p>
                  If the variation between groups is much larger than within them, it's a strong indicator that the groups are genuinely different.
                </p>
              </div>
            </section>

            {/* --- Section 2: T-Test --- */}
            <section ref={ttestRef} id="ttest" className="min-h-screen">
              <h2 className="text-responsive-h2 font-bold text-white/90 mb-6">2. The T-Test</h2>
              <div className="space-y-4 text-responsive-p text-gray-300 font-light">
                <p>
                  While ANOVA compares three or more groups, a T-Test is typically used to compare the means of just{' '}
                  <ClickableUnderline color="blue" onClick={handleBetweenClick}>
                    two groups
                  </ClickableUnderline>.
                </p>
                <p>
                  It helps determine if the two groups come from the same population or if they are statistically different from one another.
                </p>
              </div>
            </section>

            {/* --- Section 3: Regression Analysis --- */}
            <section ref={regressionRef} id="regression" className="min-h-screen">
              <h2 className="text-responsive-h2 font-bold text-white/90 mb-6">3. Regression Analysis</h2>
              <div className="space-y-4 text-responsive-p text-gray-300 font-light">
                <p>
                  Regression analysis is used to understand the relationship between a dependent variable and one or more independent variables.
                </p>
                <p>
                  It's often used for{' '}
                  <ClickableUnderline color="purple" onClick={handleBetweenClick}>
                    forecasting and prediction
                  </ClickableUnderline>, allowing us to see how variables influence each other.
                </p>
              </div>
            </section>
            
          </div>
        </div>

        {/* Right Column: Sticky Animation */}
        <div className="w-1/2 h-screen sticky top-0 flex items-center justify-center p-12">
          <div className="w-full max-w-3xl aspect-[8/5]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderAnimation()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
      </main>

      {/* Calculate Button */}
      <div className="pt-6">
        <CalculateButton size="lg" variant="default" onClick={CalculateVariance}>
          Calculate ANOVA
        </CalculateButton>
      </div>
    </div>
  )
}

export default AdvancedStatistics; 