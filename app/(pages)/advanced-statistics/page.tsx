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
import BinomialBasketballAnimation from '@/app/components/animations/STATISTICS/CHAPTER-1/binomial-distribution'

//Import Contents (Left Column)
import Introduction from '@/app/components/content/chapter-1-intro-content'  
import AnovaDescription from '@/app/components/content/anova-description'   

//Import Utils Functions 
import { 
  createStageControls,
  
} from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const AdvancedStatisticsPage = () => {
// =========================================
// ========== State Management =============
// =========================================

  const [activeSection, setActiveSection] = useState("introduction")
  const [activeSubchapter, setActiveSubchapter] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const animationContainerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Chapter configuration
  const chapters = [
    //Chapter 1 Configuration 
    { title: "Introduction & The Basics", 
      id: "introduction", 
      number: "1",
      subchapters: [
        { title: "Normal Distribution", id: "normal", number: "1.1" },
        { title: "Binomial Distribution", id: "binomial", number: "1.2" },
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
    { title: "Regression", 
      id: "regression", 
      number: "3" }
  ]

  // Navigation handler
  const handleSectionNavigation = (section: string, subchapter?: string) => {
    setActiveSection(section)
    setActiveSubchapter(subchapter || null)
  }

  // Distribution animation activation handler
  const handleDistributionClick = (distributionId: string, distributionName: string) => {
    setActiveSection('introduction')
    setActiveSubchapter(distributionId)
  }

  // Scroll progress handler
  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current
      const maxScroll = scrollHeight - clientHeight
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0
      setScrollProgress(Math.min(progress, 100))
    }
  }

  // Set up scroll listener
  useEffect(() => {
    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll)
      return () => contentElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  /* Animation Rendering Function 
  1. Renders Different Animations depending on activeSection */
  const renderAnimation = () => {
    switch(activeSection) {
      case 'introduction':
        switch(activeSubchapter) {
          case 'normal':
            return (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground">Normal Distribution Animation - Coming Soon</p>
              </div>
            )
          case 'binomial':
            return (
              <BinomialBasketballAnimation />
            )
          case 'poisson':
            return (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground">Poisson Distribution Animation - Coming Soon</p>
              </div>
            )
          case 'gamma-beta':
            return (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground">Gamma/Beta Distribution Animation - Coming Soon</p>
              </div>
            )
          case 'chi-squared': 
            return (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground">Chi-Squared Distribution Animation - Coming Soon</p>
              </div>
            )
          case 't-distribution':
            return (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground">t-Distribution Animation - Coming Soon</p>
              </div>
            )
          default:
            return (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground/60">Select a distribution to view animations</p>
              </div>
            )
        }
      case 'statistical-inference':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground">Statistical Inference Animation - Coming Soon</p>
            {/* Replace with <AnovaAnimation /> */}
          </div>
        )
      case 'regression':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground">Regression Animation - Coming Soon</p>
            {/* Replace with <RegressionAnimation /> */}
          </div>
        )
      default:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground/60">Select a section to view animations</p>
          </div>
        )
    }
    }
  

return (
    <div className='h-screen bg-background text-foreground'>
      {/* Navigation Bar - Matching Front Page Exactly */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background">
        <NavigationBar />
        
        {/* Horizontal Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted/10">
          <motion.div
            className="h-full bg-blue-300"
            animate={{ width: `${scrollProgress}%` }}
            transition={{ 
              type: "tween", 
              ease: "easeOut",
              duration: 0.2 
            }}
          />
        </div>
      </header>

      

      {/* Chapter Navigation Menu  */}
      <ChapterNavigation
        chapters={chapters}
        activeSection={activeSection}
        onSectionClick={handleSectionNavigation}
      />
      <main 
        className="h-screen"
        style={{ paddingTop: '80px' }} // Account for navigation bar height
      >
        <Splitter className="h-full">
          {/* Left Column */}
          <SplitterPanel size={50} minSize={30}> 
            <div className="h-full flex flex-col bg-[your-background-color]">
              <div 
                ref={contentRef} 
                className="flex-1 overflow-y-auto custom-scrollbar"
                style={{ 
                  scrollBehavior: 'smooth',
                  height: 'calc(100vh - 80px)' // Ensure proper height calculation
                }}
              >
                <div className="space-y-12 p-6 lg:p-12 academic-body">
                  {/*Scrollable Content with ./Content Integrations*/}
                  <section>
                    <Introduction 
                      onDistributionClick={handleDistributionClick}
                      activeDistribution={activeSection === 'introduction' ? activeSubchapter : null}
                    />
                  </section>
                  <section>
                    <AnovaDescription />
                  </section>
                  
                  {/* Add some extra content to demonstrate scrolling when needed */}
                  <section className="pb-8">
                    <div className="text-center text-muted-foreground text-sm">
                      {/* This ensures there's always scroll space when content grows */}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </SplitterPanel>

          {/* Right Column */}
          <SplitterPanel size={50} minSize={30}>
            <div className="h-full flex flex-col bg-[your-background-color]">
              <div 
                className="flex-1 overflow-y-auto custom-scrollbar"
                style={{ 
                  scrollBehavior: 'smooth',
                  height: 'calc(100vh - 80px)' // Ensure proper height calculation
                }}
              >
                                 <div className="h-full flex flex-col items-center justify-start p-8">
                   <div className="w-full max-w-4xl bg-background-accent/40 rounded-2xl p-4 flex flex-col items-center justify-center min-h-full">
                     <div ref={animationContainerRef} className="w-full flex-grow relative">
                       {renderAnimation()}
                     </div>
                   </div>
                   {/* Extra space at bottom for comfortable scrolling */}
                   <div style={{ height: '100px' }}></div>
                 </div>
              </div>
            </div>        
          </SplitterPanel>
        </Splitter>
      </main>
    </div>
    
  )
}
export default AdvancedStatisticsPage
