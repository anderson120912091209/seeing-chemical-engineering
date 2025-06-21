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

// State Management 


// Design 

const AdvancedStatisticsPage = () => {
  return (
    <section className='flex flex-col h-screen'>
      <header>
        <NavigationBar />
      </header>
      <Splitter>

      {/* Left Column */}
      <SplitterPanel> 
        
        
      </SplitterPanel>

      {/* Right Column */}
      <SplitterPanel>

      </SplitterPanel>
    </Splitter>

    </section>
    
  )
}

export default AdvancedStatisticsPage