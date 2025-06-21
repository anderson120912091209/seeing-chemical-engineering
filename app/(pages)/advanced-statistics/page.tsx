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

//Import Contents (Left Column)
import Introduction from '@/app/components/content/introduction'
import AnovaDescription from '@/app/components/content/anova-description'   

//Import Utils Functions 
import { 
  createStageControls,
  
} from '@/lib/utils'




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
                {stage === 'variance-setup' && 'Calculate Group Means'}
                {stage === 'within-variance' && 'Within-Group Sum of Squares'}
                {stage === 'between-variance' && 'Between-Group Sum of Squares'}
                {stage === 'f-test' && 'F-Statistic Calculation'}
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
  const [regressionState, setRegressionState] = useState<RegressionState>({
      stage: 'scatter',
      slope: 0,
      intercept: 0,
      rSquared: 0,
  })
  const [currentTtestStage, setCurrentTtestStage] = useState<typeof STAGES[number]>('intro')
  const [currentRegressionStage, setCurrentRegressionStage] = useState<typeof REGRESSION_STAGES[number]>('scatter')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const chapters = [
    { id: 'introduction', title: 'The Basics', number: '01' },
    { id: 'central-limit-theorem', title: 'Central Limit Theorem', number: '02' },
    { id: 'estimation', title: 'Estimation and Confidence Intervals', number: '03' },
    { id: 'hypothesis-testing', title: 'Hypothesis Testing', number: '04'},
    { id: 'hypothesis-test-intro', title: '', number: '05' },
    { id: 'anova', title: 'ANOVA', number: '06' },
    { id: 'ttest', title: 'Case Study', number: '07' },
    { id: 'regression', title: 'Linear Model', number: '08' }
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
          <AnovaAnimation />
        )
      case 'ttest':
        return (
          <TeachingMethodsAnova 
            onStateChange={setAnovaState} 
            externalStage={currentTtestStage}
            onStageChange={setCurrentTtestStage}
          />
        ) 
      case 'regression':
        return (
          <TeachingRegressionAnimation 
            onStateChange={setRegressionState} 
            externalStage={currentRegressionStage}
            onStageChange={setCurrentRegressionStage}
          />
        )
      default:
        return (
          <TeachingMethodsAnova 
            onStateChange={setAnovaState} 
            externalStage={currentTtestStage}
            onStageChange={setCurrentTtestStage}
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
  const ttestControls = createStageControls(STAGES, currentTtestStage, setCurrentTtestStage, 'intro')
  const regressionControls = createStageControls(REGRESSION_STAGES, currentRegressionStage, setCurrentRegressionStage, 'scatter')

  //Handle the Calculation, Computing Variance and Turning the Results into Animations. 
  const CalculateVariance = () => {
    console.log('calculate')
  }

  return (
    <div className="bg-background text-foreground transition-colors duration-300 aptos-font">
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
        className="pt-20 h-screen"
        style={{ 
          paddingLeft: isSidebarOpen ? '270px' : '0px',
          transition: 'padding-left 0.3s ease-in-out'
        }}
      >
        <Splitter className="h-full">
          <SplitterPanel size={50} minSize={30}>
            {/* Left Column: Scrollable Content */}
            <div ref={contentRef} className="h-full overflow-y-auto custom-scrollbar">
              <div className={`space-y-12 transition-all duration-300 ${
                isSidebarOpen ? 'max-w-none p-6 lg:pl-6 lg:pr-6 lg:py-12' : 'max-w-4xl mx-auto p-6 lg:p-12'
              }`}>
              
              {/* --- Section 0: INTRODUCTION --- */}
              <section id="introduction" className="min-h-screen relative">
                <Introduction/>     
              </section>
              {/* --- Section 1: ANOVA --- */}
              <section id="anova" ref={anovaRef} className="min-h-screen relative">
                <h2 className="text-2xl font-bold text-white/90 mb-6">1. Understanding ANOVA</h2>
                <div className="space-y-4 text-sm text-gray-300 font-light">
                  <AnovaDescription onBetweenClick={handleBetweenClick} onWithinClick={handleWithinClick} />  
                </div>
              </section>
              
              {/* --- Section 2: ANOVA Case Study --- */}
              <section id="ttest" ref={ttestRef} className="min-h-screen">
                <h2 className="text-2xl font-bold text-white/90 mb-6">2. ANOVA Case Study: Teaching Methods</h2>
                <div className="space-y-4 text-sm text-gray-300 font-light">
                  <p>
                    Let's examine a real-world example: A professor wants to compare the effectiveness of three different teaching methods on student performance.
                  </p>
                  <p>
                    <strong className="text-white/90">The Study Setup:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>36 students randomly assigned to three groups (12 students each)</li>
                    <li>Group A: Traditional lecture method</li>
                    <li>Group B: Interactive discussion method</li>
                    <li>Group C: Hands-on project method</li>
                  </ul>
                  <p>
                    After one semester, all students take the same standardized test. The question is: Do the different teaching methods produce significantly different learning outcomes?
                  </p>
                  <p>
                    This is where ANOVA helps us determine if the{' '}
                    <ClickableUnderline color="blue" onClick={handleBetweenClick}>
                      differences between groups
                    </ClickableUnderline>{' '}
                    are greater than the{' '}
                    <ClickableUnderline color="green" onClick={handleWithinClick}>
                      variation within each group
                    </ClickableUnderline>.
                  </p>
                  <p>
                    <strong className="text-white/90">The Data:</strong> Test scores ranging from 0-100, with each group showing different means and variations. The animation on the right demonstrates how ANOVA analyzes this data step by step.
                  </p>
                </div>
                {/* Navigation Controls */}
                <div className="mt-8 flex justify-start">
                  <div className="w-full max-w-md">
                    <NavProgressButton
                      stage={currentTtestStage}
                      stages={STAGES as unknown as string[]}
                      onPrevious={ttestControls.prev}
                      onNext={ttestControls.next}
                      onReset={ttestControls.reset}
                      variant="relative"
                    />
                  </div>
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
                  
                  {/* Statistical Notation Table */}
                  <div className="mt-6 bg-gray-900/50 rounded-lg border border-white/20 p-4">
                    <h3 className="text-white text-lg font-semibold mb-3 border-b border-white/20 pb-2">
                      Linear Regression Notation Guide
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Understanding the mathematical symbols used in linear regression calculations:
                    </p>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/20">
                            <th className="text-left py-2 px-3 text-blue-300 font-mono">Notation</th>
                            <th className="text-left py-2 px-3 text-white">Meaning</th>
                            <th className="text-left py-2 px-3 text-gray-400">Example Calculation</th>
                          </tr>
                        </thead>
                        <tbody className="space-y-1">
                          <tr className="border-b border-white/10">
                            <td className="py-2 px-3 text-blue-300 font-mono">&lt;x&gt;</td>
                            <td className="py-2 px-3 text-gray-300">Mean of x values</td>
                            <td className="py-2 px-3 text-gray-400 font-mono text-xs">(x₁ + x₂ + ... + xₙ) / n</td>
                          </tr>
                          <tr className="border-b border-white/10">
                            <td className="py-2 px-3 text-green-300 font-mono">&lt;y&gt;</td>
                            <td className="py-2 px-3 text-gray-300">Mean of y values</td>
                            <td className="py-2 px-3 text-gray-400 font-mono text-xs">(y₁ + y₂ + ... + yₙ) / n</td>
                          </tr>
                          <tr className="border-b border-white/10">
                            <td className="py-2 px-3 text-purple-300 font-mono">&lt;xy&gt;</td>
                            <td className="py-2 px-3 text-gray-300">Mean of x×y products</td>
                            <td className="py-2 px-3 text-gray-400 font-mono text-xs">(x₁y₁ + x₂y₂ + ... + xₙyₙ) / n</td>
                          </tr>
                          <tr className="border-b border-white/10">
                            <td className="py-2 px-3 text-orange-300 font-mono">&lt;x²&gt;</td>
                            <td className="py-2 px-3 text-gray-300">Mean of x² values</td>
                            <td className="py-2 px-3 text-gray-400 font-mono text-xs">(x₁² + x₂² + ... + xₙ²) / n</td>
                          </tr>
                          <tr className="border-b border-white/10">
                            <td className="py-2 px-3 text-red-300 font-mono">&lt;x&gt;²</td>
                            <td className="py-2 px-3 text-gray-300">Square of x mean</td>
                            <td className="py-2 px-3 text-gray-400 font-mono text-xs">(&lt;x&gt;)²</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <p className="mt-4">
                    The animation demonstrates how to calculate these values step by step and build the regression line that best fits the data points.
                  </p>
                </div>

                <div className="mt-8 flex justify-start">
                  <div className="w-full max-w-md">
                    <NavProgressButton
                      stage={currentRegressionStage}
                      stages={REGRESSION_STAGES as unknown as string[]}
                      onPrevious={regressionControls.prev}
                      onNext={regressionControls.next}
                      onReset={regressionControls.reset}
                      variant="relative"
                    />
                  </div>
                </div>
              </section>
              </div>
            </div>
          </SplitterPanel>

          <SplitterPanel size={50} minSize={30}>
            {/* Right Column: Sticky Animations */}
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="w-full h-full max-w-4xl max-h-[80vh] bg-background-accent/40 rounded-2xl p-4 flex flex-col items-center justify-center">
                {activeSection === 'ttest' && <AnovaInfoPanel {...anovaState} />}
                <div ref={animationContainerRef} className="w-full flex-grow relative">
                  {renderAnimation()}
                </div>
              </div>
            </div>
          </SplitterPanel>
        </Splitter>
      </main>
    </div>
  )
}

export default AdvancedStatistics