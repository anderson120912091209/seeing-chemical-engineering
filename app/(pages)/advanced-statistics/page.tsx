'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NavigationBar from '@/app/components/navigation-bar'
import TeachingMethodsAnova, { AnovaState } from '@/app/components/animations/ANOVA/teaching-methods-anova'
import AnovaAnimations2 from '@/app/components/animations/ANOVA/anova-animations-2' // Assuming this is for F-Statistic
import CalculateButton from '@/app/components/ui/calculate-button'
import ClickableUnderline from '@/app/components/ui/clickable-underline'
import AnovaDescription from '@/app/components/content/anova-description'
import AnovaAnimation from '@/app/components/animations/ANOVA/anova-animation'

// --- Chapter Navigation Component ---
const ChapterNavigation = ({ activeSection, onSectionClick }: { activeSection: string, onSectionClick: (section: string) => void }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const chapters = [
    { id: 'anova', title: 'ANOVA', number: '01' },
    { id: 'ttest', title: 'T-Test', number: '02' },
    { id: 'regression', title: 'Regression', number: '03' }
  ]

  const handleSectionClick = (sectionId: string) => {
    onSectionClick(sectionId)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="hidden lg:block fixed left-4 top-1/2 transform -translate-y-1/2 z-40 bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-2 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
        style={{ 
          left: isSidebarOpen ? '84px' : '16px',
          transition: 'left 0.3s ease-in-out, background-color 0.2s, color 0.2s'
        }}
      >
        <motion.div
          animate={{ rotate: isSidebarOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-4 h-4"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </motion.div>
      </button>

      {/* Desktop Full-Height Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          x: isSidebarOpen ? 0 : -80,
          opacity: isSidebarOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:block fixed left-0 top-0 h-full w-20 bg-white/5 backdrop-blur-md border-r border-white/10 z-30"
      >
        <div className="flex flex-col items-center justify-center h-full py-8">
          <div className="space-y-8">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                onClick={() => handleSectionClick(chapter.id)}
                className={`group transition-all duration-300 ${
                  activeSection === chapter.id ? 'opacity-100' : 'opacity-60 hover:opacity-80'
                }`}
                title={chapter.title}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-mono transition-all duration-300 ${
                    activeSection === chapter.id 
                      ? 'bg-white/20 text-white border border-white/30 scale-110' 
                      : 'bg-white/5 text-white/60 border border-white/10 group-hover:bg-white/10 group-hover:text-white/80 group-hover:scale-105'
                  }`}>
                    {chapter.number}
                  </div>
                  
                  {/* Vertical progress indicator */}
                  <div className="w-px h-8 bg-white/10 relative">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ 
                        height: activeSection === chapter.id ? '100%' : '0%'
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="w-full bg-gradient-to-b from-white/40 to-white/20 absolute bottom-0"
                    />
                  </div>
                  
                  {/* Chapter title - appears on hover */}
                  <div className={`text-xs font-medium transition-all duration-300 text-center ${
                    activeSection === chapter.id ? 'text-white opacity-100' : 'text-white/70 opacity-0 group-hover:opacity-100'
                  }`}>
                    {chapter.title}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mobile Hamburger Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed left-4 top-24 z-40 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
        aria-label="Toggle chapter menu"
      >
        <div className="w-5 h-5 flex flex-col justify-center items-center">
          <motion.div
            animate={isMobileMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            className="w-4 h-0.5 bg-current mb-1 origin-center transition-colors"
          />
          <motion.div
            animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-4 h-0.5 bg-current mb-1"
          />
          <motion.div
            animate={isMobileMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            className="w-4 h-0.5 bg-current origin-center"
          />
        </div>
      </button>

      {/* Mobile Chapter Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-35"
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 bg-black/40 backdrop-blur-xl border-r border-white/10 z-40 pt-20"
            >
              <div className="p-8">
                <h3 className="text-white/60 text-xs uppercase tracking-wider font-medium mb-8">Chapters</h3>
                <div className="space-y-6">
                  {chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => handleSectionClick(chapter.id)}
                      className={`w-full text-left group transition-all duration-300 ${
                        activeSection === chapter.id ? 'opacity-100' : 'opacity-70 hover:opacity-90'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-mono transition-all duration-300 ${
                          activeSection === chapter.id 
                            ? 'bg-white/20 text-white border border-white/30' 
                            : 'bg-white/5 text-white/60 border border-white/10 group-hover:bg-white/10'
                        }`}>
                          {chapter.number}
                        </div>
                        <div>
                          <div className={`font-medium transition-colors duration-300 ${
                            activeSection === chapter.id ? 'text-white' : 'text-white/80 group-hover:text-white'
                          }`}>
                            {chapter.title}
                          </div>
                        </div>
                      </div>
                      {/* Progress indicator */}
                      <div className="mt-3 ml-14">
                        <div className="w-full h-px bg-white/10">
                          <div 
                            className={`h-full bg-gradient-to-r from-white/40 to-white/20 transition-all duration-500 ${
                              activeSection === chapter.id ? 'w-full' : 'w-0'
                            }`}
                          />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

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

const AnovaInfoPanel = ({ stage, fStatistic, isSignificant }: AnovaState) => {
    return (
        <div className="w-full px-4 pt-4 text-center">
            <AnimatePresence mode="wait">
            <motion.div
                key={stage}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="text-center"
            >
                <h3 className="text-lg text-white font-semibold">
                {stage === 'intro' && 'Comparing Teaching Methods'}
                {stage === 'grouped' && 'Grouping by Method'}
                {stage === 'scored' && 'Visualizing Exam Scores'}
                {stage === 'analysis' && 'Analyzing the Variance'}
                {stage === 'conclusion' && 'The Verdict'}
                </h3>
                <p className="text-white/70 text-sm mt-1 max-w-2xl mx-auto">
                {stage === 'intro' && 'We have 36 students. Do different teaching methods affect their scores?'}
                {stage === 'grouped' && 'First, we sort students into the three method groups they experienced.'}
                {stage === 'scored' && 'Now, we plot each student\'s score. Higher dots mean better scores.'}
                {stage === 'analysis' && 'ANOVA compares the variation BETWEEN groups to the variation WITHIN groups. The shaded area is one standard deviation.'}
                {stage === 'conclusion' && `The F-statistic of ${fStatistic.toFixed(2)} suggests there is a ${isSignificant ? 'SIGNIFICANT' : 'NON-SIGNIFICANT'} difference between the methods.`}
                </p>
            </motion.div>
            </AnimatePresence>
        </div>
    )
}

const AdvancedStatistics = () => {
  const [activeSection, setActiveSection] = useState('anova')
  const [selectedConcept, setSelectedConcept] = useState<'between' | 'within' | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [anovaState, setAnovaState] = useState<AnovaState>({
      stage: 'intro',
      fStatistic: 0,
      isSignificant: false,
  })

  const contentRef = useRef<HTMLDivElement>(null)
  const anovaRef = useRef<HTMLDivElement>(null)
  const ttestRef = useRef<HTMLDivElement>(null)
  const regressionRef = useRef<HTMLDivElement>(null)
  
  const animationContainerRef = useRef<HTMLDivElement>(null);
  const [animationDimensions, setAnimationDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
        if (entries[0]) {
            const { width, height } = entries[0].contentRect;
            setAnimationDimensions({ width, height });
        }
    });
    const currentRef = animationContainerRef.current;
    if (currentRef) {
        observer.observe(currentRef);
    }
    return () => {
        if (currentRef) {
            observer.unobserve(currentRef);
        }
    };
  }, []);

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

  const handleSectionNavigation = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const renderAnimation = () => {
    switch (activeSection) {
      case 'anova':
        return animationDimensions.width > 0 && <TeachingMethodsAnova onStateChange={setAnovaState} />
      case 'ttest':
        return <AnovaAnimation /> 
      case 'regression':
        return <RegressionAnimationPlaceholder />
      default:
        return animationDimensions.width > 0 && <TeachingMethodsAnova onStateChange={setAnovaState} />
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

      {/* Chapter Navigation */}
      <ChapterNavigation activeSection={activeSection} onSectionClick={handleSectionNavigation} />

      <main className="flex pt-20 transition-all duration-300" style={{ paddingLeft: '0px' }}>
        
        {/* Left Column: Scrollable Content */}
        <div ref={contentRef} className="w-full lg:w-1/2 transition-all duration-300" style={{ marginLeft: '80px' }}>
          <div className="max-w-xl ml-auto p-6 lg:p-12 space-y-12">
            
            {/* --- Section 1: ANOVA --- */}
            <section id="anova" ref={anovaRef} className="min-h-screen">
              <h2 className="text-responsive-h2 font-bold text-white/90 mb-6">1. Understanding ANOVA</h2>
              <div className="space-y-4 text-responsive-p text-gray-300 font-light">
                <AnovaDescription onBetweenClick={handleBetweenClick} onWithinClick={handleWithinClick} />  
              </div>
            </section>
            
            {/* --- Section 2: T-Test --- */}
            <section id="ttest" ref={ttestRef} className="min-h-screen">
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
            <section id="regression" ref={regressionRef} className="min-h-screen">
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
        
        {/* Right Column: Sticky Animations */}
        <div className="hidden lg:block w-1/2 h-screen sticky top-0 flex-col items-center justify-center p-8">
            <div className="w-full h-full max-w-4xl max-h-[80vh] bg-background-accent/40 rounded-2xl p-4 flex flex-col items-center justify-center">
              {activeSection === 'anova' && <AnovaInfoPanel {...anovaState} />}
              <div ref={animationContainerRef} className="w-full flex-grow relative">
                {renderAnimation()}
              </div>
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

export default AdvancedStatistics