'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/app/contexts/theme-context'

const CerealMachineAnimation = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const { theme } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)
  const [scene, setScene] = useState(1)
  const [sampleSize, setSampleSize] = useState(12)
  const [alpha, setAlpha] = useState(0.05)
  const [trueMean, setTrueMean] = useState(500)
  const [stats, setStats] = useState({
    n: 0,
    mean: 0,
    sd: 0,
    tStat: 0,
    pValue: 0,
    reject: false
  })

  // Animation data
  const [boxes, setBoxes] = useState<Array<{
    id: number
    weight: number
    x: number
    y: number
    sampled: boolean
    frozen: boolean
  }>>([])

  const [sampleData, setSampleData] = useState<number[]>([])

  useEffect(() => {
    if (!svgRef.current) return
    initializeAnimation()
  }, [theme])

  const initializeAnimation = () => {
    const svg = svgRef.current
    if (!svg) return

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild)
    }

    const width = 800
    const height = 600
    svg.setAttribute('width', width.toString())
    svg.setAttribute('height', height.toString())
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    setupSVGStructure(svg, width, height)
    startConveyorAnimation()
  }

  const setupSVGStructure = (svg: SVGSVGElement, width: number, height: number) => {
    // Background
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    background.setAttribute('width', width.toString())
    background.setAttribute('height', height.toString())
    background.setAttribute('fill', theme === 'dark' ? '#1a1a1a' : '#f8f9fa')
    svg.appendChild(background)

    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    title.setAttribute('x', (width / 2).toString())
    title.setAttribute('y', '30')
    title.setAttribute('text-anchor', 'middle')
    title.setAttribute('font-family', 'Inter, sans-serif')
    title.setAttribute('font-size', '24')
    title.setAttribute('font-weight', '600')
    title.setAttribute('fill', theme === 'dark' ? '#ffffff' : '#1a1a1a')
    title.textContent = 'Has the cereal machine drifted?'
    svg.appendChild(title)

    // Subtitle
    const subtitle = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    subtitle.setAttribute('x', (width / 2).toString())
    subtitle.setAttribute('y', '50')
    subtitle.setAttribute('text-anchor', 'middle')
    subtitle.setAttribute('font-family', 'Inter, sans-serif')
    subtitle.setAttribute('font-size', '14')
    subtitle.setAttribute('fill', theme === 'dark' ? '#a0a0a0' : '#666666')
    subtitle.setAttribute('id', 'subtitle')
    subtitle.textContent = `Type I error capped at ${alpha}. Current sample mean = ${stats.mean.toFixed(1)} g.`
    svg.appendChild(subtitle)

    // Scene 1: Conveyor Belt
    if (scene === 1 || scene === 2) {
      setupConveyorBelt(svg, width)
    }

    // Scene 2: Histogram area
    if (scene === 2 || scene === 3) {
      setupHistogramArea(svg, width, height)
    }

    // Scene 3: t-test visualization
    if (scene === 3) {
      setupTTestVisualization(svg, width, height)
    }

    // Controls
    setupControls(svg, width, height)
  }

  const setupConveyorBelt = (svg: SVGSVGElement, width: number) => {
    // Conveyor belt
    const belt = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    belt.setAttribute('x', '50')
    belt.setAttribute('y', '120')
    belt.setAttribute('width', (width - 100).toString())
    belt.setAttribute('height', '60')
    belt.setAttribute('rx', '30')
    belt.setAttribute('fill', '#4a4a4a')
    belt.setAttribute('stroke', theme === 'dark' ? '#666666' : '#333333')
    belt.setAttribute('stroke-width', '2')
    svg.appendChild(belt)

    // Sample gate (vertical dashed line)
    const gate = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    gate.setAttribute('x1', (width / 2).toString())
    gate.setAttribute('y1', '110')
    gate.setAttribute('x2', (width / 2).toString())
    gate.setAttribute('y2', '190')
    gate.setAttribute('stroke', '#ff6b35')
    gate.setAttribute('stroke-width', '3')
    gate.setAttribute('stroke-dasharray', '5,5')
    svg.appendChild(gate)

    // Gate label
    const gateLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    gateLabel.setAttribute('x', (width / 2 + 10).toString())
    gateLabel.setAttribute('y', '105')
    gateLabel.setAttribute('font-family', 'Inter, sans-serif')
    gateLabel.setAttribute('font-size', '12')
    gateLabel.setAttribute('fill', '#ff6b35')
    gateLabel.textContent = 'Sample Gate'
    svg.appendChild(gateLabel)
  }

  const setupHistogramArea = (svg: SVGSVGElement, width: number, height: number) => {
    // Histogram background
    const histBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    histBg.setAttribute('x', '50')
    histBg.setAttribute('y', '220')
    histBg.setAttribute('width', '300')
    histBg.setAttribute('height', '200')
    histBg.setAttribute('fill', theme === 'dark' ? '#2a2a2a' : '#ffffff')
    histBg.setAttribute('stroke', theme === 'dark' ? '#444444' : '#e0e0e0')
    histBg.setAttribute('stroke-width', '1')
    histBg.setAttribute('rx', '5')
    svg.appendChild(histBg)

    // Histogram title
    const histTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    histTitle.setAttribute('x', '200')
    histTitle.setAttribute('y', '240')
    histTitle.setAttribute('text-anchor', 'middle')
    histTitle.setAttribute('font-family', 'Inter, sans-serif')
    histTitle.setAttribute('font-size', '14')
    histTitle.setAttribute('font-weight', '600')
    histTitle.setAttribute('fill', theme === 'dark' ? '#ffffff' : '#1a1a1a')
    histTitle.textContent = 'Sample Distribution'
    svg.appendChild(histTitle)

    // Stats sidebar
    setupStatsSidebar(svg, width, height)
  }

  const setupStatsSidebar = (svg: SVGSVGElement, width: number, height: number) => {
    const statsX = 400
    const statsY = 250

    // Stats background
    const statsBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    statsBg.setAttribute('x', statsX.toString())
    statsBg.setAttribute('y', (statsY - 20).toString())
    statsBg.setAttribute('width', '180')
    statsBg.setAttribute('height', '120')
    statsBg.setAttribute('fill', theme === 'dark' ? '#2a2a2a' : '#f8f9fa')
    statsBg.setAttribute('stroke', theme === 'dark' ? '#444444' : '#e0e0e0')
    statsBg.setAttribute('stroke-width', '1')
    statsBg.setAttribute('rx', '5')
    svg.appendChild(statsBg)

    // Stats text
    const statsLabels = ['n:', 'x̄:', 's:', 't:', 'p-value:']
    const statsValues = [stats.n, stats.mean.toFixed(2), stats.sd.toFixed(2), stats.tStat.toFixed(3), stats.pValue.toFixed(4)]

    statsLabels.forEach((label, i) => {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', (statsX + 10).toString())
      text.setAttribute('y', (statsY + i * 20).toString())
      text.setAttribute('font-family', 'Inter, sans-serif')
      text.setAttribute('font-size', '12')
      text.setAttribute('fill', theme === 'dark' ? '#ffffff' : '#1a1a1a')
      text.textContent = `${label} ${statsValues[i]}`
      text.setAttribute('id', `stat-${i}`)
      svg.appendChild(text)
    })
  }

  const setupTTestVisualization = (svg: SVGSVGElement, width: number, height: number) => {
    // t-distribution curve area
    const curveArea = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    curveArea.setAttribute('id', 'curve-area')
    svg.appendChild(curveArea)

    // Draw t-distribution curve
    drawTDistribution(curveArea, width, height)
  }

  const drawTDistribution = (container: SVGGElement, width: number, height: number) => {
    const curveX = 50
    const curveY = 450
    const curveWidth = 500
    const curveHeight = 100

    // Axes
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    xAxis.setAttribute('x1', curveX.toString())
    xAxis.setAttribute('y1', (curveY + curveHeight).toString())
    xAxis.setAttribute('x2', (curveX + curveWidth).toString())
    xAxis.setAttribute('y2', (curveY + curveHeight).toString())
    xAxis.setAttribute('stroke', theme === 'dark' ? '#666666' : '#333333')
    xAxis.setAttribute('stroke-width', '2')
    container.appendChild(xAxis)

    // Generate t-distribution curve points
    const df = sampleSize - 1
    const points: string[] = []
    const criticalT = -1.796 // approximate for α = 0.05, df = 11

    for (let i = 0; i <= 100; i++) {
      const t = -4 + (8 * i / 100) // t from -4 to 4
      const density = tDistributionPDF(t, df)
      const x = curveX + (i / 100) * curveWidth
      const y = curveY + curveHeight - (density * curveHeight * 8) // scale factor
      points.push(`${x},${y}`)
    }

    // Draw curve
    const curve = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
    curve.setAttribute('points', points.join(' '))
    curve.setAttribute('fill', 'none')
    curve.setAttribute('stroke', theme === 'dark' ? '#60a5fa' : '#2563eb')
    curve.setAttribute('stroke-width', '2')
    container.appendChild(curve)

    // Critical region (α = 0.05)
    const criticalRegion = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    const criticalPoints: string[] = []
    
    for (let i = 0; i <= 100; i++) {
      const t = -4 + (8 * i / 100)
      if (t <= criticalT) {
        const density = tDistributionPDF(t, df)
        const x = curveX + (i / 100) * curveWidth
        const y = curveY + curveHeight - (density * curveHeight * 8)
        criticalPoints.push(`${x},${y}`)
      }
    }
    
    if (criticalPoints.length > 0) {
      criticalPoints.push(`${curveX + ((criticalT + 4) / 8) * curveWidth},${curveY + curveHeight}`)
      criticalPoints.push(`${curveX},${curveY + curveHeight}`)
    }

    criticalRegion.setAttribute('points', criticalPoints.join(' '))
    criticalRegion.setAttribute('fill', 'rgba(239, 68, 68, 0.3)')
    criticalRegion.setAttribute('stroke', '#ef4444')
    criticalRegion.setAttribute('stroke-width', '1')
    container.appendChild(criticalRegion)

    // t-statistic marker
    if (stats.tStat !== 0) {
      const tX = curveX + ((stats.tStat + 4) / 8) * curveWidth
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      marker.setAttribute('x1', tX.toString())
      marker.setAttribute('y1', curveY.toString())
      marker.setAttribute('x2', tX.toString())
      marker.setAttribute('y2', (curveY + curveHeight).toString())
      marker.setAttribute('stroke', '#10b981')
      marker.setAttribute('stroke-width', '3')
      marker.setAttribute('stroke-dasharray', '3,3')
      container.appendChild(marker)

      // t-value label
      const tLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      tLabel.setAttribute('x', tX.toString())
      tLabel.setAttribute('y', (curveY - 10).toString())
      tLabel.setAttribute('text-anchor', 'middle')
      tLabel.setAttribute('font-family', 'Inter, sans-serif')
      tLabel.setAttribute('font-size', '12')
      tLabel.setAttribute('fill', '#10b981')
      tLabel.textContent = `t = ${stats.tStat.toFixed(3)}`
      container.appendChild(tLabel)
    }

    // Verdict
    const verdict = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    verdict.setAttribute('x', (curveX + curveWidth + 20).toString())
    verdict.setAttribute('y', (curveY + curveHeight / 2).toString())
    verdict.setAttribute('font-family', 'Inter, sans-serif')
    verdict.setAttribute('font-size', '16')
    verdict.setAttribute('font-weight', '600')
    verdict.setAttribute('fill', stats.reject ? '#ef4444' : '#10b981')
    verdict.textContent = stats.reject ? 'Reject H₀' : 'Fail to reject H₀'
    container.appendChild(verdict)
  }

  const setupControls = (svg: SVGSVGElement, width: number, height: number) => {
    // This would typically be implemented as HTML controls overlaying the SVG
    // For this example, we'll add basic control indicators
    
    const controlsY = height - 100
    
    // Control labels
    const controls = [
      { label: `n = ${sampleSize}`, x: 50 },
      { label: `α = ${alpha}`, x: 150 },
      { label: `μ = ${trueMean}g`, x: 250 }
    ]

    controls.forEach(control => {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', control.x.toString())
      text.setAttribute('y', controlsY.toString())
      text.setAttribute('font-family', 'Inter, sans-serif')
      text.setAttribute('font-size', '12')
      text.setAttribute('fill', theme === 'dark' ? '#a0a0a0' : '#666666')
      text.textContent = control.label
      svg.appendChild(text)
    })
  }

  const startConveyorAnimation = () => {
    if (isAnimating) return
    setIsAnimating(true)
    
    // Generate 30 cereal boxes
    const newBoxes = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      weight: generateNormalRandom(trueMean, 5),
      x: -50 - (i * 40), // Start off-screen to the left
      y: 140,
      sampled: false,
      frozen: false
    }))
    
    setBoxes(newBoxes)
    animateBoxes(newBoxes)
  }

  const animateBoxes = (boxList: typeof boxes) => {
    let animationId: number
    let sampledCount = 0
    
    const animate = () => {
      if (!svgRef.current) return

      const updatedBoxes = boxList.map(box => {
        if (!box.frozen) {
          box.x += 2 // Move right
          
          // Check if box hits sample gate
          if (!box.sampled && box.x >= 390 && box.x <= 410 && sampledCount < sampleSize) {
            box.sampled = true
            sampledCount++
            
            // Add to sample data
            setSampleData(prev => {
              const newData = [...prev, box.weight]
              updateStats(newData)
              return newData
            })
            
            if (sampledCount >= sampleSize) {
              // Transition to scene 2
              setTimeout(() => setScene(2), 1000)
              setTimeout(() => setScene(3), 3000)
            }
          }
          
          // Reset position when off-screen
          if (box.x > 850) {
            box.x = -50
          }
        }
        
        return box
      })
      
      setBoxes([...updatedBoxes])
      renderBoxes(updatedBoxes)
      
      if (sampledCount < sampleSize) {
        animationId = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }
    
    animationId = requestAnimationFrame(animate)
  }

  const renderBoxes = (boxList: typeof boxes) => {
    const svg = svgRef.current
    if (!svg) return

    // Remove existing boxes
    const existingBoxes = svg.querySelectorAll('.cereal-box')
    existingBoxes.forEach(box => box.remove())

    boxList.forEach(box => {
      const boxElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      boxElement.setAttribute('class', 'cereal-box')
      boxElement.setAttribute('x', box.x.toString())
      boxElement.setAttribute('y', box.y.toString())
      boxElement.setAttribute('width', '30')
      boxElement.setAttribute('height', '20')
      boxElement.setAttribute('rx', '3')
      boxElement.setAttribute('fill', '#deb887') // tan color
      boxElement.setAttribute('stroke', box.sampled ? '#ff6b35' : '#8b7355')
      boxElement.setAttribute('stroke-width', box.sampled ? '2' : '1')
      
      // Add weight label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      label.setAttribute('x', (box.x + 15).toString())
      label.setAttribute('y', (box.y + 14).toString())
      label.setAttribute('text-anchor', 'middle')
      label.setAttribute('font-family', 'Inter, sans-serif')
      label.setAttribute('font-size', '8')
      label.setAttribute('fill', '#000000')
      label.textContent = box.weight.toFixed(0)
      
      svg.appendChild(boxElement)
      svg.appendChild(label)
    })
  }

  const updateStats = (data: number[]) => {
    if (data.length === 0) return

    const n = data.length
    const mean = data.reduce((a, b) => a + b, 0) / n
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1)
    const sd = Math.sqrt(variance)
    const tStat = (mean - 500) / (sd / Math.sqrt(n))
    const pValue = 2 * (1 - tCDF(Math.abs(tStat), n - 1)) // two-tailed
    const reject = Math.abs(tStat) > 2.201 // approximate critical value for α = 0.05, df = 11

    setStats({
      n,
      mean,
      sd,
      tStat,
      pValue,
      reject
    })
  }

  // Statistical helper functions
  const generateNormalRandom = (mean: number, sd: number): number => {
    // Box-Muller transform
    const u1 = Math.random()
    const u2 = Math.random()
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    return mean + sd * z0
  }

  const tDistributionPDF = (t: number, df: number): number => {
    // Simplified t-distribution PDF
    const gamma1 = gammaFunction((df + 1) / 2)
    const gamma2 = gammaFunction(df / 2)
    const coefficient = gamma1 / (Math.sqrt(df * Math.PI) * gamma2)
    return coefficient * Math.pow(1 + (t * t) / df, -(df + 1) / 2)
  }

  const gammaFunction = (z: number): number => {
    // Stirling's approximation for gamma function
    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gammaFunction(1 - z))
    z -= 1
    let x = 0.99999999999980993
    const coefficients = [
      676.5203681218851, -1259.1392167224028, 771.32342877765313,
      -176.61502916214059, 12.507343278686905, -0.13857109526572012,
      9.9843695780195716e-6, 1.5056327351493116e-7
    ]
    
    for (let i = 0; i < coefficients.length; i++) {
      x += coefficients[i] / (z + i + 1)
    }
    
    const t = z + coefficients.length - 0.5
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x
  }

  const tCDF = (t: number, df: number): number => {
    // Simplified t-distribution CDF approximation
    if (df === 1) return 0.5 + Math.atan(t) / Math.PI
    if (df === 2) return 0.5 + t / (2 * Math.sqrt(2 + t * t))
    
    // For other df, use normal approximation for simplicity
    return normalCDF(t)
  }

  const normalCDF = (z: number): number => {
    // Standard normal CDF approximation
    return 0.5 * (1 + erf(z / Math.sqrt(2)))
  }

  const erf = (x: number): number => {
    // Error function approximation
    const a1 =  0.254829592
    const a2 = -0.284496736
    const a3 =  1.421413741
    const a4 = -1.453152027
    const a5 =  1.061405429
    const p  =  0.3275911

    const sign = x >= 0 ? 1 : -1
    x = Math.abs(x)

    const t = 1.0 / (1.0 + p * x)
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

    return sign * y
  }

  const resetAnimation = () => {
    setIsAnimating(false)
    setScene(1)
    setSampleData([])
    setStats({
      n: 0,
      mean: 0,
      sd: 0,
      tStat: 0,
      pValue: 0,
      reject: false
    })
    initializeAnimation()
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="sample-size" className="block text-sm font-medium mb-2">
              Sample Size (n): {sampleSize}
            </label>
            <input
              id="sample-size"
              type="range"
              min="5"
              max="30"
              value={sampleSize}
              onChange={(e) => setSampleSize(Number(e.target.value))}
              className="w-full"
              aria-label="Sample size slider"
            />
          </div>
          
          <div>
            <label htmlFor="alpha" className="block text-sm font-medium mb-2">
              Alpha (α): {alpha}
            </label>
            <input
              id="alpha"
              type="range"
              min="0.01"
              max="0.1"
              step="0.01"
              value={alpha}
              onChange={(e) => setAlpha(Number(e.target.value))}
              className="w-full"
              aria-label="Alpha level slider"
            />
          </div>
          
          <div>
            <label htmlFor="true-mean" className="block text-sm font-medium mb-2">
              True Mean (μ): {trueMean}g
            </label>
            <input
              id="true-mean"
              type="range"
              min="490"
              max="510"
              value={trueMean}
              onChange={(e) => setTrueMean(Number(e.target.value))}
              className="w-full"
              aria-label="True mean slider"
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={startConveyorAnimation}
            disabled={isAnimating}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Start animation"
          >
            {isAnimating ? 'Running...' : 'Start Animation'}
          </button>
          
          <button
            onClick={resetAnimation}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            aria-label="Reset animation"
          >
            Reset
          </button>
          
          <button
            onClick={() => {
              const csv = `Weight\n${sampleData.map(w => w.toFixed(2)).join('\n')}`
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'cereal_weights.csv'
              a.click()
            }}
            disabled={sampleData.length === 0}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Export data as CSV"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* SVG Animation */}
      <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
        <svg
          ref={svgRef}
          className="w-full h-auto"
          role="img"
          aria-label="Cereal machine hypothesis test animation"
        />
      </div>

      {/* Status */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Scene {scene}/3: {
          scene === 1 ? 'Conveyor belt sampling' :
          scene === 2 ? 'Building histogram' :
          'Statistical analysis'
        }
      </div>
    </div>
  )
}

export default CerealMachineAnimation
