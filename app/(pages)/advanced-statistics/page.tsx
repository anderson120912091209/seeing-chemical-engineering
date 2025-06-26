'use client'

//Import UI
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NavigationBar from '@/app/components/navigation-bar'
import TeachingMethodsAnova, { AnovaState, STAGES } from '@/app/components/animations/ANOVA/teaching-methods-anova'
import NavProgressButton from '@/app/components/ui/nav-progress-button'
import ChapterNavigation from '@/app/components/ui/chapter-navigation'
import ClickableUnderline from '@/app/components/ui/clickable-underline'
import { Splitter, SplitterPanel } from 'primereact/splitter'

//Import Animations (Right)
import AnovaAnimation from '@/app/components/animations/ANOVA/anova-animation'
import TeachingRegressionAnimation, { RegressionState, STAGES as REGRESSION_STAGES } from '@/app/components/animations/ANOVA/regression-animation'
import BinomialBasketballAnimation from '@/app/components/animations/STATISTICS/chapter-1-intro-animation'

//Import Contents (Left Column)
import Introduction from '@/app/components/content/chapter-1-intro-content'  
import AnovaDescription from '@/app/components/content/anova-description'   

//Import Utils Functions 
import { 
  createStageControls,
  
} from '@/lib/utils'

const AdvancedStatisticsPage = () => {
// =========================================
// ========== State Management =============
// =========================================

  const [activeSection, setActiveSection] = useState("introduction")
  const contentRef = useRef<HTMLDivElement>(null)
  const animationContainerRef = useRef<HTMLDivElement>(null)

  // Chapter configuration
  const chapters = [
    //Chapter 1 Configuration 
    { title: "Introduction & The Basics", 
      id: "introduction", 
      number: "1",
      subchapters: [
        { title: "Binomial Distribution", id: "normal", number: "1.1" },
        { title: "Normal Distribution", id: "binomial", number: "1.2" },
        { title: "Poisson/Exponential Distribution", id: "poisson", number: "1.3" },
        { title: "Gamma/Beta Distribution", id: "gamma-beta", number: "1.4" },
        { title: "Chi-Squared Distribution", id: "chi-squared", number: "1.5" },
        { title: "Student's t-Distribution", id: "t-distribution", number: "1.6" }
      ]
    },
    //Chapter 2 Configuration 
    { 
      title: "Statistical Inference", 
      id: "statistical-inference", 
      number: "2",
      subchapters: [
        {title: "Testing Statistical Hypothesis", id: "chap-2-sub-1", number: "2.1"},
        {title: "Inference on the Mean of a Population", id: "chap-2-sub-2", number: "2.2"},
        {title: "Inference on the Variance of a Population" ,id: "chap-2-sub-3", number: "2.3"}
      ]
    },
    //Chapter 3 Configuration 
    { title: "Regression", id: "regression", number: "3" }
  ]

  // Navigation handler
  const handleSectionNavigation = (section: string) => {
    setActiveSection(section)
  }

  /* Animation Rendering Function 
  1. Renders Different Animations depending on activeSection */
  const renderAnimation = () => {
    switch(activeSection) {
      case 'introduction':
        return (
          <BinomialBasketballAnimation />
        )
      case 'statistical-inference':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white/60">Statistical Inference</p>
            {/* Replace with <AnovaAnimation /> */}
          </div>
        )
      case 'regression':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white/60">Regression animations</p>
            {/* Replace with <RegressionAnimation /> */}
          </div>
        )
      default:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white/40">Select a section to view animations</p>
          </div>
        )
    }
    }
  

return (
    <div className='flex flex-col h-screen'>
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 md:px-4 py-4">
          <NavigationBar />
        </div>

        {/* Horizontal Progress Bar for Tracking Page Progress */}
        
      </header>

      {/* Chapter Navigation Menu  */}
      <ChapterNavigation
        chapters={chapters}
        activeSection={activeSection}
        onSectionClick={handleSectionNavigation}
      />
      <main 
        className="pt-20 h-screen"
      >
        <Splitter className="h-full">
          {/* Left Column */}
          <SplitterPanel size={50} minSize={30}> 
                          <div ref={contentRef} className="h-full overflow-y-auto custom-scrollbar">
                <div className="space-y-12 p-6 lg:p-12">
                  {/*Scrollable Content with ./Content Integrations*/}
                <section>
                  <Introduction />
                </section>
                <section>
                  <AnovaDescription />
                </section>
              </div>
            </div>
          </SplitterPanel>

          {/* Right Column */}
          <SplitterPanel size={50} minSize={30}>
            <section>
              <div className="h-full flex flex-col items-center justify-center p-8">
                <div className="w-full h-full max-w-4xl max-h-[80vh] bg-background-accent/40 rounded-2xl p-4 flex flex-col items-center justify-center">
                  <div ref={animationContainerRef} className="w-full flex-grow relative">
                    {renderAnimation()}
                  </div>
                </div>
              </div>        
            </section>
          </SplitterPanel>
        </Splitter>
      </main>
    </div>
    
  )
}
export default AdvancedStatisticsPage
