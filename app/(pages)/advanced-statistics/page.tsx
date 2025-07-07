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
import CerealMachineAnimation from '@/app/components/animations/STATISTICS/CHAPTER-2/defaultanimation'

//Import Contents (Left Column)
import Introduction from '@/app/components/content/chapter-1-intro-content'  
import Chapter2 from '@/app/components/content/chapter-2-content'
  

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
  
  // Refs for section detection
  const introductionRef = useRef<HTMLElement>(null)
  const chapter2Ref = useRef<HTMLElement>(null)
  const regressionRef = useRef<HTMLElement>(null)

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

  // Enhanced scroll handler with section detection
  const handleScroll = () => {
    if (!contentRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current
    const maxScroll = scrollHeight - clientHeight
    const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0
    setScrollProgress(Math.min(progress, 100))

    // Calculate which section is currently in view
    const sections = [
      { ref: introductionRef, id: 'introduction' },
      { ref: chapter2Ref, id: 'statistical-inference' },
      { ref: regressionRef, id: 'regression' }
    ]

    let currentSection = 'introduction' // default

    sections.forEach((section) => {
      if (section.ref.current) {
        const element = section.ref.current
        const rect = element.getBoundingClientRect()
        const containerRect = contentRef.current!.getBoundingClientRect()
        
        // Calculate relative position within the scroll container
        const elementTop = rect.top - containerRect.top
        const elementBottom = rect.bottom - containerRect.top
        
        // Check if section is in the middle portion of the viewport
        const viewportMiddle = containerRect.height / 2
        
        if (elementTop <= viewportMiddle && elementBottom >= viewportMiddle) {
          currentSection = section.id
        }
      }
    })

    // Only update if section actually changed
    if (currentSection !== activeSection) {
      console.log('Scroll detected section change:', currentSection)
      setActiveSection(currentSection)
      setActiveSubchapter(null) // Reset subchapter when auto-switching
    }
  }

  // Intersection Observer as backup (simplified)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const sectionId = entry.target.getAttribute('data-section')
            if (sectionId) {
              console.log('Intersection Observer backup:', sectionId)
            }
          }
        })
      },
      {
        root: contentRef.current,
        threshold: [0.1, 0.3, 0.5],
        rootMargin: '-10% 0px -10% 0px'
      }
    )

    // Observe sections with a delay to ensure refs are ready
    setTimeout(() => {
      const sections = [introductionRef.current, chapter2Ref.current, regressionRef.current]
      sections.forEach((section) => {
        if (section) {
          observer.observe(section)
        }
      })
    }, 100)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Set up scroll listener with throttling
  useEffect(() => {
    const contentElement = contentRef.current
    if (!contentElement) return

    // Throttle scroll events for better performance
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    contentElement.addEventListener('scroll', throttledScroll, { passive: true })
    
    // Initial call to set correct section
    setTimeout(() => {
      handleScroll()
    }, 200)

    return () => {
      contentElement.removeEventListener('scroll', throttledScroll)
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
              <CerealMachineAnimation />
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
              <BinomialBasketballAnimation />
            )
        }
      case 'statistical-inference':
        return ( 
          <CerealMachineAnimation/>
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
                  <section 
                    ref={introductionRef}
                    data-section="introduction"
                    className="min-h-screen"
                  >
                    <Introduction 
                      onDistributionClick={handleDistributionClick}
                      activeDistribution={activeSection === 'introduction' ? activeSubchapter : null}
                    />
                  </section>
                  <section 
                    ref={chapter2Ref}
                    data-section="statistical-inference"
                    className="min-h-screen"
                  >
                    <Chapter2 />  
                  </section>
                  
                  <section 
                    ref={regressionRef}
                    data-section="regression"
                    className="min-h-screen"
                  >
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold">03. Regression Analysis</h2>
                      <p className="text-muted-foreground">
                        Explore linear and non-linear regression techniques, model validation, 
                        and advanced regression methods.
                      </p>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Topics Covered:</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Simple and Multiple Linear Regression</li>
                          <li>• Model Assumptions and Diagnostics</li>
                          <li>• Polynomial and Non-linear Regression</li>
                          <li>• Regularization Techniques (Ridge, Lasso)</li>
                          <li>• Cross-validation and Model Selection</li>
                        </ul>
                      </div>
                    </div>
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
                  {/* Animation Section Indicator */}
                  <div className="w-full max-w-4xl mb-4">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-muted-foreground">
                        {activeSection === 'introduction' && 'Chapter 1: Distribution Animations'}
                        {activeSection === 'statistical-inference' && 'Chapter 2: Hypothesis Testing'}
                        {activeSection === 'regression' && 'Chapter 3: Regression Analysis'}
                      </h3>
                      {activeSubchapter && (
                        <p className="text-sm text-muted-foreground/70 mt-1">
                          {activeSubchapter}.
                        </p>
                      )}
                      {/* Debug indicator */}
                      <div className="mt-2 text-xs text-muted-foreground/50">
                        Active Section: {activeSection} | Progress: {scrollProgress.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full max-w-4xl bg-background-accent/40 rounded-2xl p-4 flex flex-col items-center justify-center min-h-full">
                    <div ref={animationContainerRef} className="w-full flex-grow relative">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${activeSection}-${activeSubchapter}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="w-full h-full"
                        >
                          {renderAnimation()}
                        </motion.div>
                      </AnimatePresence>
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
