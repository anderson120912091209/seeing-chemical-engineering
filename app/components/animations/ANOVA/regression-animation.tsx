'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// --- Data ---
const class_1_points = [ 
  [0.650526, 2.54101], [2.660671, 4.824527], [2.407531, 4.142076], [5.347189, 5.727929], 
  [0.035045, 2.793226], [8.731453, 8.917979], [2.06364, 2.276924], [7.472808, 9.486961], 
  [5.771891, 7.203936], [2.607232, 5.997121], [0.572134, 2.899932], [8.66576, 8.753885], 
  [3.589203, 7.457017], [2.544127, 6.150239], [0.421066, 4.129729], [4, 4]
];

// --- Interfaces ---
interface DataPoint {
  id: number;
  x: number;
  y: number;
  class: 0 | 1;
  color: string;
}

export const STAGES = ['scatter', 'position', 'slope', 'intercept', 'rsquared', 'residuals'] as const
type Stage = typeof STAGES[number];

export interface RegressionState {
  stage: Stage;
  slope: number;
  intercept: number;
  rSquared: number;
}

interface TeachingRegressionAnimationProps {
  onStateChange: (state: RegressionState) => void;
  externalStage?: Stage;
  onStageChange?: (stage: Stage) => void;
}

// --- Utility Functions ---
const calculateLinearRegression = (points: DataPoint[]) => {
  const n = points.length;
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);
  
  const meanX = sumX / n;
  const meanY = sumY / n;
  const meanXY = sumXY / n;
  const meanXX = sumXX / n;
  
  const slope = (meanXY - meanX * meanY) / (meanXX - meanX * meanX);
  const intercept = meanY - slope * meanX;
  
  // Calculate R²
  const yMean = meanY;
  const totalSumSquares = points.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
  const residualSumSquares = points.reduce((sum, p) => {
    const predicted = slope * p.x + intercept;
    return sum + Math.pow(p.y - predicted, 2);
  }, 0);
  const rSquared = 1 - (residualSumSquares / totalSumSquares);
  
  return { slope, intercept, rSquared, meanX, meanY, meanXY, meanXX };
};

// --- Main Component ---
const TeachingRegressionAnimation = ({ onStateChange, externalStage, onStageChange }: TeachingRegressionAnimationProps) => {
  const [internalStage, setInternalStage] = useState<Stage>('scatter')
  const stage = externalStage || internalStage
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

  // --- Data Processing ---
  const dataPoints: DataPoint[] = useMemo(() => {
    const allPoints: DataPoint[] = [];
    let id = 0;
    
    class_1_points.forEach(([x, y]) => {
      allPoints.push({ id: id++, x, y, class: 1, color: '#81a8e7' });
    });
    
    return allPoints;
  }, []);

  // --- Regression Calculations ---
  const { slope, intercept, rSquared, meanX, meanY, meanXY, meanXX } = useMemo(() => 
    calculateLinearRegression(dataPoints), [dataPoints]
  );

  // --- State Reporting ---
  useEffect(() => {
    onStateChange({ stage, slope, intercept, rSquared })
  }, [stage, slope, intercept, rSquared, onStateChange])

  // --- Dynamic Positioning ---
  const { width, height } = dimensions
  const padding = { top: 30, bottom: 150, left: 60, right: 40 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = Math.min(height - padding.top - padding.bottom, 400) // Limit chart height

  // Scale functions with adaptive bounds
  const dataXMin = Math.min(...dataPoints.map(p => p.x));
  const dataXMax = Math.max(...dataPoints.map(p => p.x));
  const dataYMin = Math.min(...dataPoints.map(p => p.y));
  const dataYMax = Math.max(...dataPoints.map(p => p.y));
  
  const xRange = dataXMax - dataXMin;
  const yRange = dataYMax - dataYMin;
  
  const xMin = dataXMin - xRange * 0.1; // 10% padding
  const xMax = dataXMax + xRange * 0.1;
  const yMin = dataYMin - yRange * 0.1;
  const yMax = dataYMax + yRange * 0.1;

  const xScale = (x: number) => padding.left + ((x - xMin) / (xMax - xMin)) * chartWidth;
  const yScale = (y: number) => padding.top + chartHeight - ((y - yMin) / (yMax - yMin)) * chartHeight;
  const bottomYScale = padding.top + chartHeight;
  const getPointPosition = (point: DataPoint) => {
    switch (stage) {
      case 'scatter':
        return { x: xScale(point.x), y: bottomYScale}
      case 'position':
        return { x: xScale(point.x), y: yScale(point.y)}
      case 'slope':
      case 'intercept':
      case 'rsquared':
      case 'residuals':
        return { x: xScale(point.x), y: yScale(point.y) }
      default:
        return { x: xScale(point.x), y: yScale(point.y) }
    }
  }

  // Line equation for current stage
  const getLineEquation = () => {
    switch (stage) {
      case 'slope':
        return { slope, intercept: 0 } // Correct slope, no intercept
      case 'intercept':
        return { slope, intercept: 0 } // Correct slope, no intercept (will animate to full)
      case 'rsquared':
      case 'residuals':
        return { slope, intercept } // Full equation
      default:
        return null
    }
  }

  const animatedLine = getLineEquation()
  const finalLine = { slope, intercept }

  return (
    <div ref={containerRef} className="w-full h-full bg-transparent relative">
      {/* Main Animation SVG */}
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        
        {/* Axes */}
        <g className="axes">
          {/* X-axis */}
          <line 
            x1={padding.left} y1={padding.top + chartHeight}
            x2={padding.left + chartWidth} y2={padding.top + chartHeight}
            className="stroke-white/30" strokeWidth="2"
          />
          {/* Y-axis */}
          <line 
            x1={padding.left} y1={padding.top}
            x2={padding.left} y2={padding.top + chartHeight}
            className="stroke-white/30" strokeWidth="2"
          />
          
          {/* Axis labels */}
           <text x={padding.left + chartWidth/2} y={padding.top + chartHeight + 40} textAnchor="middle" className="fill-white/70 text-xs">
             X Variable
           </text>
           <text x={15} y={padding.top + chartHeight/2} textAnchor="middle" className="fill-white/70 text-xs" transform={`rotate(-90, 15, ${padding.top + chartHeight/2})`}>
             Y Variable
           </text>
        </g>

                 {/* Grid lines */}
         <g className="grid">
           {[...Array(5)].map((_, i) => {
             const x = xMin + (i / 4) * (xMax - xMin);
             const y = yMin + (i / 4) * (yMax - yMin);
             return (
               <g key={i}>
                 <line 
                   x1={xScale(x)} y1={padding.top}
                   x2={xScale(x)} y2={padding.top + chartHeight}
                   className="stroke-white/10" strokeWidth="1"
                 />
                 <line 
                   x1={padding.left} y1={yScale(y)}
                   x2={padding.left + chartWidth} y2={yScale(y)}
                   className="stroke-white/10" strokeWidth="1"
                 />
                 <text x={xScale(x)} y={padding.top + chartHeight + 20} textAnchor="middle" className="fill-white/50 text-xs">
                   {x.toFixed(1)}
                 </text>
                 <text x={padding.left - 15} y={yScale(y) + 4} textAnchor="end" className="fill-white/50 text-xs">
                   {y.toFixed(1)}
                 </text>
               </g>
             )
           })}
         </g>

        {/* Regression Line */}
        <AnimatePresence>
          {(stage === 'slope' || stage === 'intercept' || stage === 'rsquared' || stage === 'residuals') && animatedLine && (
            <motion.line
              initial={stage === 'slope' ? {
                x1: xScale(xMin),
                y1: yScale(xMin), // Start with x = y line
                x2: xScale(xMax),
                y2: yScale(xMax),
                opacity: 0
              } : {
                x1: xScale(xMin),
                y1: yScale(animatedLine.slope * xMin + animatedLine.intercept),
                x2: xScale(xMax),
                y2: yScale(animatedLine.slope * xMax + animatedLine.intercept),
                opacity: 1
              }}
              animate={{
                x1: xScale(xMin),
                y1: yScale(finalLine.slope * xMin + (stage === 'intercept' || stage === 'rsquared' || stage === 'residuals' ? finalLine.intercept : 0)),
                x2: xScale(xMax),
                y2: yScale(finalLine.slope * xMax + (stage === 'intercept' || stage === 'rsquared' || stage === 'residuals' ? finalLine.intercept : 0)),
                opacity: 1
              }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              stroke="#22c55e"
              strokeWidth="3"
            />
          )}
        </AnimatePresence>

        {/* Residual Lines */}
        <AnimatePresence>
          {stage === 'residuals' && 
            dataPoints.map((point) => {
              const predictedY = slope * point.x + intercept;
              return (
                <motion.line
                  key={`residual-${point.id}`}
                  initial={{ 
                    x1: xScale(point.x), 
                    y1: yScale(point.y),
                    x2: xScale(point.x), 
                    y2: yScale(point.y),
                    opacity: 0
                  }}
                  animate={{ 
                    x1: xScale(point.x), 
                    y1: yScale(point.y),
                    x2: xScale(point.x), 
                    y2: yScale(predictedY),
                    opacity: 0.7
                  }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
              )
            })
          }
        </AnimatePresence>

        {/* Data Points */}
        {dataPoints.map((point) => {
          const pos = getPointPosition(point)
          return (
            <motion.circle
              key={point.id}
              animate={{ cx: pos.x, cy: pos.y }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
                             r="4"
              fill={point.color}
              className="stroke-black/50"
              strokeWidth="1"
              opacity={0.8}
            >
              <title>Class {point.class}: ({point.x.toFixed(2)}, {point.y.toFixed(2)})</title>
            </motion.circle>
          )
        })}

        {/* Statistical Table for intermediate stage */}
        <AnimatePresence>
          {stage === 'slope' && (
            <motion.g
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.5 }}
            >
            {/* Background */}
               <rect
                 x={width - 240}
                 y={padding.top}
                 width={220}
                 height={140}
                 fill="rgba(0,0,0,0.8)"
                 stroke="rgba(255,255,255,0.3)"
                 strokeWidth="1"
                 rx="6"
               />
               {/* Table content */}
               <text x={width - 230} y={padding.top + 18} className="fill-blue-300 text-xs font-semibold">Statistical Calculations</text>
               <text x={width - 230} y={padding.top + 35} className="fill-white text-xs">⟨x⟩ = {meanX.toFixed(3)}</text>
               <text x={width - 230} y={padding.top + 50} className="fill-white text-xs">⟨y⟩ = {meanY.toFixed(3)}</text>
               <text x={width - 230} y={padding.top + 65} className="fill-white text-xs">⟨xy⟩ = {meanXY.toFixed(3)}</text>
               <text x={width - 230} y={padding.top + 80} className="fill-white text-xs">⟨x²⟩ = {meanXX.toFixed(3)}</text>
               <text x={width - 230} y={padding.top + 95} className="fill-white text-xs">⟨x⟩² = {(meanX * meanX).toFixed(3)}</text>
               <text x={width - 230} y={padding.top + 115} className="fill-green-300 text-xs font-semibold">
                 slope = {slope.toFixed(3)}
               </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* Equations Display */}
      <div className="absolute bottom-4 left-4 space-y-2">
        <AnimatePresence>
          {stage === 'slope' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-black/80 px-4 py-2 rounded border border-white/20"
            >
              <div className="text-white text-sm">
                <div className="text-green-300 font-mono">slope (m) = (⟨xy⟩ - ⟨x⟩⟨y⟩) / (⟨x²⟩ - ⟨x⟩²)</div>
                <div className="text-white/70 text-xs mt-1">m = {slope.toFixed(4)}</div>
              </div>
            </motion.div>
          )}
          
          {stage === 'intercept' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-black/80 px-4 py-2 rounded border border-white/20"
            >
              <div className="text-white text-sm">
                <div className="text-blue-300 font-mono">intercept (b) = ⟨y⟩ - m⟨x⟩</div>
                <div className="text-white/70 text-xs mt-1">b = {intercept.toFixed(4)}</div>
                <div className="text-yellow-300 text-xs mt-2">y = {slope.toFixed(3)}x + {intercept.toFixed(3)}</div>
              </div>
            </motion.div>
          )}
          
          {stage === 'rsquared' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-black/80 px-4 py-2 rounded border border-white/20"
            >
              <div className="text-white text-sm">
                <div className="text-purple-300 font-mono">R² = 1 - (SS_res / SS_tot)</div>
                <div className="text-white/70 text-xs mt-1">R² = {rSquared.toFixed(4)}</div>
                <div className="text-white/50 text-xs mt-2">
                  {(rSquared * 100).toFixed(1)}% of variance explained
                </div>
              </div>
            </motion.div>
          )}
          
          {stage === 'residuals' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-black/80 px-4 py-2 rounded border border-white/20"
            >
              <div className="text-white text-sm">
                <div className="text-orange-300 font-mono">residual = y_actual - y_predicted</div>
                <div className="text-white/70 text-xs mt-1">Dashed lines show residuals</div>
                <div className="text-white/50 text-xs mt-2">
                  Smaller residuals = better fit
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TeachingRegressionAnimation
