'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { Play, RotateCcw } from 'lucide-react'
import { useTheme } from '@/app/contexts/theme-context'

interface CerealBox {
  id: number
  weight: number
  x: number
  y: number
  sampled: boolean
}

const CerealMachineAnimation = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const animationRef = useRef<number>(0)
  const { theme } = useTheme()
  const [phase, setPhase] = useState<'selection' | 'animation' | 'completed'>('selection')
  const [selectedSamples, setSelectedSamples] = useState(25)
  const [boxes, setBoxes] = useState<CerealBox[]>([])
  const [sampleData, setSampleData] = useState<number[]>([])
  const [sampledCount, setSampledCount] = useState(0)
  const [totalBoxes, setTotalBoxes] = useState(0)

  // Significantly scaled up dimensions with extra height for horizontal stats
  const width = 1800
  const height = 1300

  // Clean color scheme
  const colors = theme === 'dark' ? {
    background: 'oklch(0.19 0 0)',
    surface: 'oklch(0.23 0 0)',
    border: '#2a2a2a',
    text: '#e5e5e5',
    textMuted: '#888888',
    accent: '#fff',
    data: '#8bb4d8',
    machine: '#333333',
    belt: '#555555',
    box: '#deb887',
    boxSampled: '#ff6b35',
    button: '#0066cc',
    buttonHover: '#0052a3'
  } : {
    background: '#fff',
    surface: '#f6f8fa',
    border: '#e5e7eb',
    text: '#222',
    textMuted: '#888',
    accent: '#111',
    data: '#60a5fa',
    machine: '#d1d5db',
    belt: '#9ca3af',
    box: '#deb887',
    boxSampled: '#ff6b35',
    button: '#0066cc',
    buttonHover: '#0052a3'
  }

  const generateWeight = useCallback((): number => {
    // Simple normal distribution around 50g
    const u1 = Math.random()
    const u2 = Math.random()
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    return 500 + 4 * z0
  }, [])

  const renderSelectionInterface = useCallback(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()
    svg.attr("viewBox", `0 0 ${width} ${height}`)
       .style("background", colors.background)

    // Main title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 220)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "52px")
      .style("font-weight", "700")
      .text("Random Sampling Experiment")

    // Question
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 320)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "28px")
      .style("font-weight", "500")
      .text("How many samples do you think we should collect?")

    // Description
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 380)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "20px")
      .text("150 cereal boxes will move along the conveyor belt")

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 410)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "20px")
      .text("Each box that passes the sampling gate will become a data point")

    // Sample size display
    const sampleDisplay = svg.append("g")
      .attr("transform", `translate(${width / 2}, 520)`)

    sampleDisplay.append("rect")
      .attr("x", -150)
      .attr("y", -40)
      .attr("width", 300)
      .attr("height", 80)
      .attr("fill", colors.surface)
      .attr("stroke", colors.border)
      .attr("stroke-width", 3)
      .attr("rx", 12)

    sampleDisplay.append("text")
      .attr("class", "sample-count")
      .attr("y", 12)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-family", "JetBrains Mono, monospace")
      .style("font-size", "36px")
      .style("font-weight", "700")
      .text(`${selectedSamples} samples`)

    // Slider
    const sliderGroup = svg.append("g")
      .attr("transform", `translate(${width / 2}, 680)`)

    // Slider track
    sliderGroup.append("line")
      .attr("x1", -200)
      .attr("x2", 200)
      .attr("stroke", colors.border)
      .attr("stroke-width", 6)
      .attr("stroke-linecap", "round")

    // Slider handle
    const handle = sliderGroup.append("circle")
      .attr("class", "slider-handle")
      .attr("r", 16)
      .attr("fill", colors.button)
      .attr("stroke", colors.background)
      .attr("stroke-width", 4)
      .attr("cursor", "pointer")

    // Slider labels
    sliderGroup.append("text")
      .attr("x", -200)
      .attr("y", -25)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "16px")
      .text("10")

    sliderGroup.append("text")
      .attr("x", 200)
      .attr("y", -25)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "16px")
      .text("50")

    // Update slider position
    const updateSlider = () => {
      const x = ((selectedSamples - 10) / 40) * 400 - 200
      handle.attr("cx", x)
    }
    updateSlider()

    // Slider interaction
    sliderGroup.append("rect")
      .attr("x", -200)
      .attr("y", -20)
      .attr("width", 400)
      .attr("height", 40)
      .attr("fill", "transparent")
      .attr("cursor", "pointer")
      .on("click", function(event) {
        const [mouseX] = d3.pointer(event)
        const value = Math.round(((mouseX + 200) / 400) * 40 + 10)
        setSelectedSamples(Math.max(10, Math.min(50, value)))
      })

    // Start button
    const startButton = svg.append("g")
      .attr("transform", `translate(${width / 2}, 780)`)
      .attr("cursor", "pointer")
      .on("click", startExperiment)

    startButton.append("rect")
      .attr("x", -100)
      .attr("y", -25)
      .attr("width", 200)
      .attr("height", 50)
      .attr("fill", colors.button)
      .attr("stroke", colors.border)
      .attr("stroke-width", 3)
      .attr("rx", 10)
      .on("mouseover", function() {
        d3.select(this).attr("fill", colors.buttonHover)
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", colors.button)
      })

    startButton.append("text")
      .attr("y", 6)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "20px")
      .style("font-weight", "600")
      .text("Start Experiment")
  }, [selectedSamples, colors, width, height])

  const initializeAnimation = useCallback(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()
    svg.attr("viewBox", `0 0 ${width} ${height}`)
       .style("background", colors.background)

    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 60)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "28px")
      .style("font-weight", "700")
      .text(`Collecting ${selectedSamples} samples from 150 cereal boxes`)

    // Machine body - Much bigger
    const machineX = 80
    const machineY = 120
    const machineWidth = 320
    const machineHeight = 200

    // Machine shadow
    svg.append("rect")
      .attr("x", machineX + 6)
      .attr("y", machineY + 6)
      .attr("width", machineWidth)
      .attr("height", machineHeight)
      .attr("fill", "rgba(0,0,0,0.15)")
      .attr("rx", 16)

    // Machine body
    svg.append("rect")
      .attr("x", machineX)
      .attr("y", machineY)
      .attr("width", machineWidth)
      .attr("height", machineHeight)
      .attr("fill", colors.machine)
      .attr("stroke", colors.border)
      .attr("stroke-width", 4)
      .attr("rx", 16)

    // Machine label
    svg.append("text")
      .attr("x", machineX + machineWidth / 2)
      .attr("y", 115)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "20px")
      .style("font-weight", "500")
      .text("CEREAL MACHINE")

    // Conveyor belt - Much longer
    const beltY = 220
    const beltStartX = machineX + machineWidth
    const beltEndX = 1400

    // Belt shadow
    svg.append("line")
      .attr("x1", beltStartX)
      .attr("y1", beltY + 3)
      .attr("x2", beltEndX)
      .attr("y2", beltY + 3)
      .attr("stroke", "rgba(0,0,0,0.1)")
      .attr("stroke-width", 18)
      .attr("stroke-linecap", "round")

    // Main belt
    svg.append("line")
      .attr("x1", beltStartX)
      .attr("y1", beltY)
      .attr("x2", beltEndX)
      .attr("y2", beltY)
      .attr("stroke", colors.belt)
      .attr("stroke-width", 16)
      .attr("stroke-linecap", "round")

    // Belt direction arrows
    for (let i = beltStartX + 60; i < beltEndX - 60; i += 120) {
      svg.append("polygon")
        .attr("points", `${i},${beltY-6} ${i+16},${beltY} ${i},${beltY+6}`)
        .attr("fill", colors.border)
        .attr("opacity", 0.6)
    }

    // Sample gate - repositioned for longer belt
    const gateX = 950
    svg.append("line")
      .attr("x1", gateX)
      .attr("y1", beltY - 70)
      .attr("x2", gateX)
      .attr("y2", beltY + 70)
      .attr("stroke", colors.accent)
      .attr("stroke-width", 6)
      .attr("stroke-dasharray", "20,10")
      .attr("opacity", 0.9)

    // Gate label
    svg.append("text")
      .attr("x", gateX + 30)
      .attr("y", beltY - 40)
      .style("fill", colors.text)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "16px")
      .style("font-weight", "500")
      .text("SAMPLING GATE")

    // Dashboard Layout - Redesigned with horizontal stats
    const dashboardY = 460
    const dashboardHeight = 450
    const chartWidth = 680  // Much wider charts now
    const chartSpacing = 60
    const statsBarHeight = 80

    // Left Chart - Running Mean
    const leftChartX = 120
    const leftMargin = { top: 80, right: 40, bottom: 100, left: 90 }

    // Left chart background
    svg.append("rect")
      .attr("x", leftChartX)
      .attr("y", dashboardY)
      .attr("width", chartWidth)
      .attr("height", dashboardHeight)
      .attr("fill", colors.surface)
      .attr("stroke", colors.border)
      .attr("stroke-width", 3)
      .attr("rx", 16)

    // Left chart title
    svg.append("text")
      .attr("x", leftChartX + chartWidth / 2)
      .attr("y", dashboardY + 40)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "24px")
      .style("font-weight", "700")
      .text("Running Mean Convergence")

    // Running mean scales
    const meanXScale = d3.scaleLinear()
      .domain([1, selectedSamples])
      .range([leftChartX + leftMargin.left, leftChartX + chartWidth - leftMargin.right])

    const meanYScale = d3.scaleLinear()
      .domain([495, 505])
      .range([dashboardY + dashboardHeight - leftMargin.bottom, dashboardY + leftMargin.top])

    // Mean chart axes
    svg.append("g")
      .attr("transform", `translate(0, ${dashboardY + dashboardHeight - leftMargin.bottom})`)
      .call(d3.axisBottom(meanXScale).ticks(6).tickFormat(d3.format("d")))
      .selectAll("text")
      .style("fill", colors.text)
      .style("font-size", "16px")

    svg.append("g")
      .attr("transform", `translate(${leftChartX + leftMargin.left}, 0)`)
      .call(d3.axisLeft(meanYScale).ticks(8).tickFormat(d3.format(".0f")))
      .selectAll("text")
      .style("fill", colors.text)
      .style("font-size", "16px")

    // Mean target line
    svg.append("line")
      .attr("x1", leftChartX + leftMargin.left)
      .attr("x2", leftChartX + chartWidth - leftMargin.right)
      .attr("y1", meanYScale(500))
      .attr("y2", meanYScale(500))
      .attr("stroke", colors.accent)
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", "8,4")
      .attr("opacity", 0.8)

    // Mean axis labels
    svg.append("text")
      .attr("x", leftChartX + chartWidth / 2)
      .attr("y", dashboardY + dashboardHeight - 25)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "18px")
      .style("font-weight", "600")
      .text("Sample Number")

    svg.append("text")
      .attr("transform", `rotate(-90)`)
      .attr("x", -(dashboardY + dashboardHeight / 2))
      .attr("y", leftChartX + 30)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "18px")
      .style("font-weight", "600")
      .text("Mean Weight (g)")

    // Right Chart - Dot Plot
    const rightChartX = leftChartX + chartWidth + chartSpacing
    const rightMargin = { top: 80, right: 40, bottom: 100, left: 90 }

    // Right chart background
    svg.append("rect")
      .attr("x", rightChartX)
      .attr("y", dashboardY)
      .attr("width", chartWidth)
      .attr("height", dashboardHeight)
      .attr("fill", colors.surface)
      .attr("stroke", colors.border)
      .attr("stroke-width", 3)
      .attr("rx", 16)

    // Right chart title
    svg.append("text")
      .attr("x", rightChartX + chartWidth / 2)
      .attr("y", dashboardY + 40)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "24px")
      .style("font-weight", "700")
      .text("Sample Distribution")

    // Dot plot scales
    const dotXScale = d3.scaleLinear()
      .domain([485, 515])
      .range([rightChartX + rightMargin.left, rightChartX + chartWidth - rightMargin.right])

    // Dot plot axis
    svg.append("g")
      .attr("transform", `translate(0, ${dashboardY + dashboardHeight - rightMargin.bottom})`)
      .call(d3.axisBottom(dotXScale).ticks(8).tickFormat(d3.format(".0f")))
      .selectAll("text")
      .style("fill", colors.text)
      .style("font-size", "16px")

    // Dot plot target line
    svg.append("line")
      .attr("x1", dotXScale(500))
      .attr("x2", dotXScale(500))
      .attr("y1", dashboardY + rightMargin.top)
      .attr("y2", dashboardY + dashboardHeight - rightMargin.bottom)
      .attr("stroke", colors.accent)
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", "8,4")
      .attr("opacity", 0.8)

    // Dot plot axis label
    svg.append("text")
      .attr("x", rightChartX + chartWidth / 2)
      .attr("y", dashboardY + dashboardHeight - 25)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "18px")
      .style("font-weight", "600")
      .text("Weight (grams)")

    // Horizontal Statistics Bar Below Charts
    const statsY = dashboardY + dashboardHeight + 40
    const statsWidth = (chartWidth * 2) + chartSpacing
    
    // Stats background
    svg.append("rect")
      .attr("x", leftChartX)
      .attr("y", statsY)
      .attr("width", statsWidth)
      .attr("height", statsBarHeight)
      .attr("fill", colors.background)
      .attr("stroke", colors.border)
      .attr("stroke-width", 4)
      .attr("rx", 16)

    // Create horizontal statistics layout
    const statSpacing = statsWidth / 3
    const statsData = [
      { label: "COUNT", class: "count", x: leftChartX + statSpacing / 2 },
      { label: "MEAN", class: "mean", x: leftChartX + statSpacing * 1.5 },
      { label: "STD DEV", class: "std", x: leftChartX + statSpacing * 2.5 }
    ]

    statsData.forEach(stat => {
      // Label
      svg.append("text")
        .attr("class", `stat-${stat.class}-label`)
        .attr("x", stat.x)
        .attr("y", statsY + 25)
        .attr("text-anchor", "middle")
        .style("fill", colors.textMuted)
        .style("font-family", "Aptos, system-ui, sans-serif")
        .style("font-size", "16px")
        .style("font-weight", "600")
        .text(stat.label)

      // Value
      svg.append("text")
        .attr("class", `stat-${stat.class}-value`)
        .attr("x", stat.x)
        .attr("y", statsY + 55)
        .attr("text-anchor", "middle")
        .style("fill", stat.class === "mean" ? colors.accent : colors.text)
        .style("font-family", "JetBrains Mono, monospace")
        .style("font-size", stat.class === "mean" ? "24px" : "20px")
        .style("font-weight", "700")
        .text("--")
    })

    // Progress indicator
    const progressGroup = svg.append("g")
      .attr("transform", `translate(${width - 240}, 150)`)

    progressGroup.append("rect")
      .attr("x", -20)
      .attr("y", -20)
      .attr("width", 220)
      .attr("height", 100)
      .attr("fill", colors.surface)
      .attr("stroke", colors.border)
      .attr("stroke-width", 3)
      .attr("rx", 10)

    progressGroup.append("text")
      .attr("class", "progress-text")
      .attr("x", 100)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "20px")
      .style("font-weight", "700")
      .text(`0 / ${selectedSamples}`)

    progressGroup.append("text")
      .attr("x", 100)
      .attr("y", 22)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "15px")
      .style("font-weight", "500")
      .text("SAMPLES COLLECTED")

    progressGroup.append("text")
      .attr("class", "total-boxes-text")
      .attr("x", 100)
      .attr("y", 44)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "15px")
      .style("font-weight", "500")
      .text(`0 / 150 BOXES`)

    return { 
      svg, 
      beltY, 
      gateX, 
      meanXScale, 
      meanYScale, 
      dotXScale, 
      dashboardY, 
      dashboardHeight,
      rightMargin, 
      rightChartWidth: chartWidth, 
      rightChartX,
      leftMargin,
      leftChartX,
      statsY
    }
  }, [selectedSamples, colors, width, height])

  const startExperiment = useCallback(() => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    setPhase('animation')
    setSampleData([])
    setSampledCount(0)
    setTotalBoxes(0)
    
    // Initialize 150 boxes
    const initialBoxes: CerealBox[] = []
    for (let i = 0; i < 150; i++) {
      initialBoxes.push({
        id: i,
        weight: generateWeight(),
        x: 320 - (i * 60), // Spread them out more on the longer belt
        y: 220,
        sampled: false
      })
    }
    setBoxes(initialBoxes)

    const result = initializeAnimation()
    if (!result) return

    const { 
      svg, 
      beltY, 
      gateX, 
      meanXScale, 
      meanYScale, 
      dotXScale, 
      dashboardY, 
      dashboardHeight,
      rightMargin, 
      rightChartWidth, 
      rightChartX 
    } = result
    
    let sampledSoFar = 0
    let isAnimating = true
    let runningSum = 0
    const sampledWeights: number[] = []
    const runningMeans: Array<{x: number, y: number}> = []
    const dotPositions: Record<number, number> = {}

    // Line generator for running mean
    const line = d3.line<{x: number, y: number}>()
      .x(d => meanXScale(d.x))
      .y(d => meanYScale(d.y))
      .curve(d3.curveCatmullRom.alpha(0.5))

    const animate = () => {
      if (!isAnimating) return

      setBoxes(prevBoxes => {
        const newBoxes = prevBoxes.map(box => {
          if (!box.sampled) {
            const newX = box.x + 3 // Move boxes along belt faster for longer conveyor

            // Check if box passes gate and we need more samples
            if (newX >= gateX - 3 && newX <= gateX + 3 && sampledSoFar < selectedSamples) {
              const updatedBox = { ...box, sampled: true, x: newX }
              sampledSoFar++
              runningSum += box.weight
              sampledWeights.push(box.weight)
              
              setSampledCount(sampledSoFar)
              setSampleData(prev => [...prev, box.weight])

              // Update progress
              svg.select(".progress-text").text(`${sampledSoFar} / ${selectedSamples}`)

              // Calculate statistics
              const currentMean = runningSum / sampledSoFar
              const variance = sampledWeights.reduce((acc, val) => acc + Math.pow(val - currentMean, 2), 0) / sampledWeights.length
              const stdDev = Math.sqrt(variance)

              // Update statistics display (only the 3 we're showing)
              svg.select(".stat-count-value").text(`${sampledSoFar}`)
              svg.select(".stat-mean-value")
                .text(`${currentMean.toFixed(1)}`)
                .style("fill", Math.abs(currentMean - 500) < 2 ? colors.accent : colors.data)
              svg.select(".stat-std-value").text(`${stdDev.toFixed(1)}`)

              // Add to running means for line chart
              runningMeans.push({ x: sampledSoFar, y: currentMean })

              // Animate sample point
              const sample = svg.append("circle")
                .attr("cx", box.x)
                .attr("cy", box.y)
                .attr("r", 12)
                .attr("fill", colors.boxSampled)
                .attr("stroke", colors.background)
                .attr("stroke-width", 3)

              // Split animation - send copies to both charts
              
              // 1. Running Mean Chart
              const meanSample = sample.clone(true)
              meanSample.transition()
                .duration(1000)
                .ease(d3.easeCubicOut)
                .attr("cx", meanXScale(sampledSoFar))
                .attr("cy", meanYScale(currentMean))
                .attr("r", 4)
                .attr("fill", colors.data)
                .on("end", () => {
                  // Update running mean line
                  if (runningMeans.length >= 2) {
                    svg.select(".mean-line").remove()
                    svg.insert("path", ".sample-dot")
                      .datum(runningMeans)
                      .attr("class", "mean-line")
                      .attr("fill", "none")
                      .attr("stroke", colors.data)
                      .attr("stroke-width", 2)
                      .attr("stroke-linecap", "round")
                      .attr("d", line)
                      .style("filter", "drop-shadow(0px 1px 2px rgba(0,0,0,0.1))")
                  }
                })

              // 2. Dot Plot Chart
              const weightBin = Math.round(box.weight * 2) / 2
              dotPositions[weightBin] = (dotPositions[weightBin] || 0) + 1
              
              const dotX = dotXScale(box.weight)
              const dotY = dashboardY + dashboardHeight - rightMargin.bottom - (dotPositions[weightBin] * 12) - 6

              const dotSample = sample.clone(true)
              dotSample.transition()
                .duration(1200)
                .ease(d3.easeCubicOut)
                .attr("cx", dotX + (Math.random() - 0.5) * 10) // Small jitter
                .attr("cy", dotY)
                .attr("r", 5)
                .attr("fill", d3.interpolateViridis(Math.random()))
                .attr("opacity", 0.8)

              // Remove original sample
              sample.remove()

              // Check if sampling is complete
              if (sampledSoFar >= selectedSamples) {
                isAnimating = false
                setTimeout(() => setPhase('completed'), 1500)
              }

              return updatedBox
            }

            return { ...box, x: newX }
          }
          return box
        })

        // Update total boxes count
        const boxesPassed = newBoxes.filter(box => box && box.x > gateX).length
        setTotalBoxes(boxesPassed)
        svg.select(".total-boxes-text").text(`${boxesPassed} / 150 BOXES`)

        return newBoxes
      })

      if (isAnimating) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    // Start the animation
    animationRef.current = requestAnimationFrame(animate)
  }, [selectedSamples, colors, initializeAnimation, generateWeight])

  const renderBoxes = useCallback(() => {
    if (phase !== 'animation') return

    const svg = d3.select(svgRef.current)
    svg.selectAll(".box").remove()

    const visibleBoxes = boxes.filter(box => !box.sampled && box.x > 300 && box.x < 1450)

    const boxGroups = svg.selectAll(".box")
      .data(visibleBoxes)
      .enter()
      .append("g")
      .attr("class", "box")
      .attr("transform", d => `translate(${d.x}, ${d.y - 20})`)

    // Box shadow
    boxGroups.append("rect")
      .attr("x", 3)
      .attr("y", 3)
      .attr("width", 34)
      .attr("height", 28)
      .attr("fill", "rgba(0,0,0,0.15)")
      .attr("rx", 4)

    // Main box
    boxGroups.append("rect")
      .attr("width", 40)
      .attr("height", 32)
      .attr("fill", colors.box)
      .attr("stroke", colors.border)
      .attr("stroke-width", 2)
      .attr("rx", 4)

    // Weight label
    boxGroups.append("text")
      .attr("x", 20)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("fill", "#333")
      .style("font-size", "12px")
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-weight", "600")
      .text(d => Math.round(d.weight))
  }, [phase, boxes, colors])

  const resetExperiment = useCallback(() => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    
    setPhase('selection')
    setSelectedSamples(25)
    setBoxes([])
    setSampleData([])
    setSampledCount(0)
    setTotalBoxes(0)
  }, [])

  useEffect(() => {
    if (phase === 'selection') {
      renderSelectionInterface()
    }
  }, [phase, renderSelectionInterface])

  useEffect(() => {
    renderBoxes()
  }, [boxes, renderBoxes])

  useEffect(() => {
    // Update slider position when selectedSamples changes
    if (phase === 'selection') {
      const svg = d3.select(svgRef.current)
      const handle = svg.select(".slider-handle")
      const sampleText = svg.select(".sample-count")
      
      if (!handle.empty()) {
        const x = ((selectedSamples - 10) / 40) * 400 - 200
        handle.attr("cx", x)
      }
      
      if (!sampleText.empty()) {
        sampleText.text(`${selectedSamples} samples`)
      }
    }
  }, [selectedSamples, phase])

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1" style={{ background: colors.background }}>
        {phase === 'completed' && (
          <div className="flex items-center justify-center p-6">
            <button
              onClick={resetExperiment}
              className="flex items-center gap-3 px-6 py-3 transition-all duration-200 hover:bg-opacity-80"
              style={{ 
                backgroundColor: colors.surface,
                color: colors.text,
                border: `2px solid ${colors.border}`,
                borderRadius: '8px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '15px',
                fontWeight: '500'
              }}
            >
              <RotateCcw className="w-5 h-5" />
              Start New Experiment
            </button>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center p-6">
          <svg
            ref={svgRef}
            className="w-full h-full"
            style={{ maxHeight: '1300px', maxWidth: '1800px' }}
          />
        </div>
      </div>
    </div>
  )
}

export default CerealMachineAnimation

