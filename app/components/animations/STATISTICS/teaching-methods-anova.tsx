'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// --- Interfaces ---
interface Student {
  id: number;
  method: 'A' | 'B' | 'C';
  score: number;
}

interface GroupStats {
  mean: number;
  variance: number;
  count: number;
}

export const STAGES = ['intro', 'grouped', 'scored', 'analysis', 
  'variance-setup', 'within-variance', 'between-variance', 'f-test', 'conclusion'] as const
type Stage = typeof STAGES[number];

export interface AnovaState {
  stage: Stage;
  fStatistic: number;
  isSignificant: boolean;
}

interface TeachingMethodsAnovaProps {
  onStateChange: (state: AnovaState) => void;
  externalStage?: Stage;
  onStageChange?: (stage: Stage) => void;
}

const METHOD_CONFIG = {
  A: { base: 75, variance: 8, color: '#fca5a5', label: 'Traditional' },
  B: { base: 82, variance: 6, color: '#6ee7b7', label: 'Tech-Enhanced' },
  C: { base: 78, variance: 10, color: '#81a8e7', label: 'Collaborative' }
}

// --- Main Component ---
const TeachingMethodsAnova = ({ onStateChange, externalStage, onStageChange }: TeachingMethodsAnovaProps) => {
  const [internalStage, setInternalStage] = useState<Stage>('intro')
  const stage = externalStage || internalStage
  const [students, setStudents] = useState<Student[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  // --- Responsive Sizing ---
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect
        setDimensions({ width, height })
      }
    })
    const currentRef = containerRef.current
    if (currentRef) observer.observe(currentRef)
    return () => {
        if(currentRef) observer.unobserve(currentRef)
    }
  }, [])

  // --- Data Generation ---
  useEffect(() => {
    const generateStudents = (): Student[] => {
      let id = 0
      return Object.entries(METHOD_CONFIG).flatMap(([method, config]) => 
        Array.from({ length: 12 }, () => ({
          id: id++,
          method: method as 'A' | 'B' | 'C',
          score: Math.round(Math.max(0, Math.min(100, 
            config.base + (Math.random() - 0.5) * config.variance * 2
          )))
        }))
      )
    }
    setStudents(generateStudents())
  }, [])

  // --- Memoized Calculations for Performance ---
  const { groupStats, fStatistic, isSignificant } = useMemo(() => {
    if (students.length === 0) return { groupStats: {}, fStatistic: 0, isSignificant: false }

    const stats: Record<string, GroupStats> = {}
    Object.keys(METHOD_CONFIG).forEach(method => {
      const methodStudents = students.filter(s => s.method === method)
      if (methodStudents.length === 0) return
      const scores = methodStudents.map(s => s.score)
      const mean = scores.reduce((a, b) => a + b, 0) / scores.length
      const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / (scores.length -1)
      stats[method] = { mean, variance, count: methodStudents.length }
    })

    const totalMean = students.reduce((sum, s) => sum + s.score, 0) / students.length
    
    const betweenGroupVariance = Object.values(stats).reduce((sum, s) => 
      sum + s.count * Math.pow(s.mean - totalMean, 2), 0
    ) / (Object.keys(stats).length - 1)

    const withinGroupVariance = Object.values(stats).reduce((sum, s) => 
      sum + (s.count - 1) * s.variance, 0
    ) / (students.length - Object.keys(stats).length)
    
    const f = withinGroupVariance > 0 ? betweenGroupVariance / withinGroupVariance : 0
    return { 
      groupStats: stats, 
      fStatistic: f, 
      isSignificant: f > 3.2,
    }
  }, [students])

  // --- State Reporting ---
  useEffect(() => {
    onStateChange({ stage, fStatistic, isSignificant })
  }, [stage, fStatistic, isSignificant, onStateChange])

  // If we're in the variance calculation stages, show the variance calculation animation
  const varianceStages = ['variance-setup', 'within-variance', 'between-variance', 'f-test', 'conclusion'];
  if (varianceStages.includes(stage)) {
    // Map stage to animation step (0-5)
    const stageToStep: Record<string, number> = {
      'variance-setup': 0,    // Step 1: Calculate Group Means
      'within-variance': 2,   // Step 3: Within-Group Sum of Squares  
      'between-variance': 3,  // Step 4: Between-Group Sum of Squares
      'f-test': 5,           // Step 6: F-Statistic Calculation
      'conclusion': 5        // Step 6: F-Statistic Calculation (final)
    };
    
    const currentStep = stageToStep[stage] || 0;
    
    // Ensure we have valid dimensions
    const validDimensions = {
      width: dimensions.width > 0 ? dimensions.width : 800,
      height: dimensions.height > 0 ? dimensions.height : 600
    };
    
    return (
      <div ref={containerRef} className="w-full h-full">
        <VarianceCalculationAnimation 
          students={students}
          dimensions={validDimensions}
          groupStats={groupStats}
          fStatistic={fStatistic}
          isSignificant={isSignificant}
          currentStep={currentStep}
        />
      </div>
    )
  }

  // --- Dynamic Positioning ---
  const { width, height } = dimensions
  const padding = { top: 80, bottom: 120, left: 60, right: 60 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  const getStudentPosition = (student: Student, index: number) => {
    const methodIndex = Object.keys(METHOD_CONFIG).indexOf(student.method)
    
    switch (stage) {
      case 'intro':
        return { x: padding.left + (index / (students.length - 1)) * chartWidth, y: height / 2 }
      case 'grouped':
      case 'scored':
      case 'analysis':
        const groupWidth = chartWidth / 3
        const studentX = padding.left + (methodIndex * groupWidth) + (groupWidth / 12) * (index % 12)
        const studentY = stage === 'grouped' 
          ? height / 2 
          : padding.top + chartHeight - (student.score / 100) * chartHeight
        return { x: studentX, y: studentY }
      default: return {x: 0, y: 0}
    }
  }

  // --- UI Handlers ---
  const setStage = (newStage: Stage) => {
    if (onStageChange) {
      onStageChange(newStage)
    } else {
      setInternalStage(newStage)
    }
  }

  const nextStage = () => {
    const currentIndex = STAGES.indexOf(stage)
    if (currentIndex < STAGES.length - 1) {
      setStage(STAGES[currentIndex + 1])
    }
  }

  const prevStage = () => {
    const currentIndex = STAGES.indexOf(stage)
    if (currentIndex > 0) {
      setStage(STAGES[currentIndex - 1])
    }
  }

  const resetAnimation = () => {
    setStage('intro')
  }

  return (
    <div ref={containerRef} className="w-full h-full bg-transparent relative">
      {/* Main Animation SVG */}
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        {/* Method Labels */}
        <AnimatePresence>
        {stage !== 'intro' && Object.entries(METHOD_CONFIG).map(([method, config], i) => (
          <motion.g 
            key={method}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <text 
              x={padding.left + (chartWidth / 3) * (i + 0.5)} 
              y={padding.top - 30} 
              textAnchor="middle" 
              className="fill-white/80 font-semibold text-lg"
            >
              Method {method}
            </text>
            <text 
              x={padding.left + (chartWidth / 3) * (i + 0.5)} 
              y={padding.top - 10} 
              textAnchor="middle" 
              className="fill-white/50 text-sm"
            >
              ({config.label})
            </text>
          </motion.g>
        ))}
        </AnimatePresence>
        
        {/* Score Axis */}
        <AnimatePresence>
        {(stage !== 'intro' && stage !== 'grouped') && (
          <motion.g
            initial={{ opacity: 0, x: padding.left - 20 }}
            animate={{ opacity: 1, x: padding.left }}
            exit={{ opacity: 0, x: padding.left - 20 }}
          >
            {[0, 50, 100].map(score => (
              <g key={score}>
                <line 
                  x1={padding.left - 10} y1={padding.top + chartHeight - (score / 100) * chartHeight}
                  x2={width - padding.right} y2={padding.top + chartHeight - (score / 100) * chartHeight}
                  className="stroke-white/10" strokeWidth="1"
                />
                <text x={padding.left - 20} y={padding.top + chartHeight - (score / 100) * chartHeight + 5} className="fill-white/50 text-sm" textAnchor="end">{score}</text>
              </g>
            ))}
          </motion.g>
        )}
        </AnimatePresence>
        
        {/* Statistical Annotations */}
        <AnimatePresence>
        {stage === 'analysis' && Object.entries(groupStats).map(([method, stats], i) => {
          const groupX = padding.left + (chartWidth / 3) * (i + 0.5)
          const meanY = padding.top + chartHeight - (stats.mean / 100) * chartHeight
          const sd = Math.sqrt(stats.variance)
          const sdHeight = (sd / 100) * chartHeight

          return (
            <motion.g 
              key={method}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
            >
              {/* SD Range */}
              <rect 
                x={groupX - (chartWidth / 3) * 0.4}
                y={meanY - sdHeight}
                width={(chartWidth / 3) * 0.8}
                height={sdHeight * 2}
                fill={METHOD_CONFIG[method as 'A'|'B'|'C'].color}
                opacity="0.1"
              />
              <line 
                 x1={groupX - (chartWidth / 3) * 0.4} y1={meanY - sdHeight}
                 x2={groupX + (chartWidth / 3) * 0.4} y2={meanY - sdHeight}
                 className="stroke-white/20" strokeDasharray="2,2"
              />
               <line 
                 x1={groupX - (chartWidth / 3) * 0.4} y1={meanY + sdHeight}
                 x2={groupX + (chartWidth / 3) * 0.4} y2={meanY + sdHeight}
                 className="stroke-white/20" strokeDasharray="2,2"
              />

              {/* Mean Line */}
              <line 
                x1={groupX - (chartWidth / 3) * 0.4} y1={meanY}
                x2={groupX + (chartWidth / 3) * 0.4} y2={meanY}
                stroke={METHOD_CONFIG[method as 'A'|'B'|'C'].color}
                strokeWidth="2"
              />
              <text x={groupX + (chartWidth / 3) * 0.4 + 10} y={meanY + 4} fill="white" className="text-xs">μ = {stats.mean.toFixed(1)}</text>
            </motion.g>
          )
        })}
        </AnimatePresence>

        {/* Student Dots */}
        {students.map((student, i) => {
          const pos = getStudentPosition(student, i)
          return (
            <motion.circle
              key={student.id}
              animate={{ cx: pos.x, cy: pos.y }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              r="5"
              fill={METHOD_CONFIG[student.method].color}
              className="stroke-black/50"
              strokeWidth="1"
            >
              <title>Score: {student.score}</title>
            </motion.circle>
          )
        })}
      </svg>
      
     
    </div>
  )
}

export default TeachingMethodsAnova 