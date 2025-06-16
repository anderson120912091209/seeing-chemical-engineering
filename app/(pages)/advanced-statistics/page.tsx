'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NavigationBar from '@/app/components/navigation-bar'
import TeachingMethodsAnova, { AnovaState, STAGES } from '@/app/components/animations/ANOVA/teaching-methods-anova'
import NavProgressButton from '@/app/components/ui/nav-progress-button'
import ChapterNavigation from '@/app/components/ui/chapter-navigation'
import AnovaAnimations2 from '@/app/components/animations/ANOVA/anova-animations-2' // Assuming this is for F-Statistic
import CalculateButton from '@/app/components/ui/calculate-button'
import ClickableUnderline from '@/app/components/ui/clickable-underline'
import AnovaDescription from '@/app/components/content/anova-description'
import AnovaAnimation from '@/app/components/animations/ANOVA/anova-animation'



// --- Placeholder Animations ---


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
                {stage === 'variance-setup' && 'Step 1: Calculate Group Means'}
                {stage === 'within-variance' && 'Step 3: Within-Group Sum of Squares'}
                {stage === 'between-variance' && 'Step 4: Between-Group Sum of Squares'}
                {stage === 'f-test' && 'Step 6: F-Statistic Calculation'}
                {stage === 'conclusion' && 'The Verdict'}
                </h3>
                <p className="text-white/70 text-sm mt-1 max-w-2xl mx-auto">
                {stage === 'intro' && 'We have 36 students. Do different teaching methods affect their scores?'}
                {stage === 'grouped' && 'First, we sort students into the three method groups they experienced.'}
                {stage === 'scored' && 'Now, we plot each student\'s score. Higher dots mean better scores.'}
                {stage === 'analysis' && 'ANOVA compares the variation BETWEEN groups to the variation WITHIN groups. The shaded area is one standard deviation.'}
                {stage === 'variance-setup' && 'We draw lines to show the average score for each teaching method group.'}
                {stage === 'within-variance' && 'We measure how much individual scores vary from their group average.'}
                {stage === 'between-variance' && 'We measure how much the group averages differ from the overall average.'}
                {stage === 'f-test' && 'We calculate the F-statistic to determine if the differences are significant.'}
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
  const [currentStage, setCurrentStage] = useState<typeof STAGES[number]>('intro')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const chapters = [
    { id: 'anova', title: 'ANOVA', number: '01' },
    { id: 'ttest', title: 'T-Test', number: '02' },
    { id: 'regression', title: 'Regression', number: '03' }
  ]

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
        return (
          <TeachingMethodsAnova 
            onStateChange={setAnovaState} 
            externalStage={currentStage}
            onStageChange={setCurrentStage}
          />
        )
      case 'test':
        return <AnovaAnimation /> 
      case 'regression':
        return <RegressionAnimationPlaceholder />
      default:
        return (
          <TeachingMethodsAnova 
            onStateChange={setAnovaState} 
            externalStage={currentStage}
            onStageChange={setCurrentStage}
          />
        )
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

  // --- Animation Control Functions ---
  const nextStage = () => {
    const currentIndex = STAGES.indexOf(currentStage)
    if (currentIndex < STAGES.length - 1) {
      setCurrentStage(STAGES[currentIndex + 1])
    }
  }

  const prevStage = () => {
    const currentIndex = STAGES.indexOf(currentStage)
    if (currentIndex > 0) {
      setCurrentStage(STAGES[currentIndex - 1])
    }
  }

  const resetAnimation = () => {
    setCurrentStage('intro')
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
      <ChapterNavigation 
        chapters={chapters}
        activeSection={activeSection} 
        onSectionClick={handleSectionNavigation}
        onSidebarToggle={setIsSidebarOpen}
      />

                      <main 
          className="flex pt-20 transition-all duration-300"
          style={{ 
            paddingLeft: isSidebarOpen ? '270px' : '0px',
            transition: 'padding-left 0.3s ease-in-out'
          }}
        >
          
          {/* Left Column: Scrollable Content */}
          <div ref={contentRef} className="w-full lg:w-1/2 transition-all duration-300">
            <div className={`space-y-12 transition-all duration-300 ${
              isSidebarOpen ? 'max-w-none p-6 lg:pl-6 lg:pr-6 lg:py-12' : 'max-w-4xl mx-auto p-6 lg:p-12'
            }`}>
            
            {/* --- Section 1: ANOVA --- */}
            <section id="anova" ref={anovaRef} className="min-h-screen relative">
              <h2 className="text-responsive-h2 font-bold text-white/90 mb-6">1. Understanding ANOVA</h2>
              <div className="space-y-4 text-responsive-p text-gray-300 font-light">
                <AnovaDescription onBetweenClick={handleBetweenClick} onWithinClick={handleWithinClick} />  
              </div>
              
              {/* Navigation Controls */}
              <div className="mt-8 flex justify-start">
                <div className="w-full max-w-md">
                  <NavProgressButton
                    stage={currentStage}
                    stages={STAGES as unknown as string[]}
                    onPrevious={prevStage}
                    onNext={nextStage}
                    onReset={resetAnimation}
                    variant="relative"
                  />
                </div>
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
        
        {/* Vertical Separator */}
        <div className="hidden lg:block w-px bg-white/10 h-screen sticky top-0"></div>
        
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