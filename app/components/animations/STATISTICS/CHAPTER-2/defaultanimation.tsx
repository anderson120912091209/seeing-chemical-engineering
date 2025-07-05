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
  const animationRef = useRef<number>()
  const { theme } = useTheme()
  const [phase, setPhase] = useState<'selection' | 'animation' | 'completed'>('selection')
  const [selectedSamples, setSelectedSamples] = useState(25)
  const [boxes, setBoxes] = useState<CerealBox[]>([])
  const [sampleData, setSampleData] = useState<number[]>([])
  const [sampledCount, setSampledCount] = useState(0)
  const [totalBoxes, setTotalBoxes] = useState(0)

  // Scaled up dimensions
  const width = 1000
  const height = 700

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
    return 50 + 4 * z0
  }, [])

  const renderSelectionInterface = useCallback(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()
    svg.attr("viewBox", `0 0 ${width} ${height}`)
       .style("background", colors.background)

    // Main title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 150)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "32px")
      .style("font-weight", "700")
      .text("Random Sampling Experiment")

    // Question
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 220)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "18px")
      .style("font-weight", "500")
      .text("How many samples do you think we should collect?")

    // Description
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 260)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "14px")
      .text("150 cereal boxes will move along the conveyor belt")

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 280)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "14px")
      .text("Each box that passes the sampling gate will become a data point")

    // Sample size display
    const sampleDisplay = svg.append("g")
      .attr("transform", `translate(${width / 2}, 350)`)

    sampleDisplay.append("rect")
      .attr("x", -100)
      .attr("y", -25)
      .attr("width", 200)
      .attr("height", 50)
      .attr("fill", colors.surface)
      .attr("stroke", colors.border)
      .attr("stroke-width", 2)
      .attr("rx", 8)

    sampleDisplay.append("text")
      .attr("class", "sample-count")
      .attr("y", 8)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-family", "JetBrains Mono, monospace")
      .style("font-size", "24px")
      .style("font-weight", "700")
      .text(`${selectedSamples} samples`)

    // Slider
    const sliderGroup = svg.append("g")
      .attr("transform", `translate(${width / 2}, 450)`)

    // Slider track
    sliderGroup.append("line")
      .attr("x1", -150)
      .attr("x2", 150)
      .attr("stroke", colors.border)
      .attr("stroke-width", 4)
      .attr("stroke-linecap", "round")

    // Slider handle
    const handle = sliderGroup.append("circle")
      .attr("class", "slider-handle")
      .attr("r", 12)
      .attr("fill", colors.button)
      .attr("stroke", colors.background)
      .attr("stroke-width", 3)
      .attr("cursor", "pointer")

    // Slider labels
    sliderGroup.append("text")
      .attr("x", -150)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "12px")
      .text("10")

    sliderGroup.append("text")
      .attr("x", 150)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "12px")
      .text("50")

    // Update slider position
    const updateSlider = () => {
      const x = ((selectedSamples - 10) / 40) * 300 - 150
      handle.attr("cx", x)
    }
    updateSlider()

    // Slider interaction
    sliderGroup.append("rect")
      .attr("x", -150)
      .attr("y", -15)
      .attr("width", 300)
      .attr("height", 30)
      .attr("fill", "transparent")
      .attr("cursor", "pointer")
      .on("click", function(event) {
        const [mouseX] = d3.pointer(event)
        const value = Math.round(((mouseX + 150) / 300) * 40 + 10)
        setSelectedSamples(Math.max(10, Math.min(50, value)))
      })

    // Start button
    const startButton = svg.append("g")
      .attr("transform", `translate(${width / 2}, 550)`)
      .attr("cursor", "pointer")
      .on("click", startExperiment)

    startButton.append("rect")
      .attr("x", -80)
      .attr("y", -20)
      .attr("width", 160)
      .attr("height", 40)
      .attr("fill", colors.button)
      .attr("stroke", colors.border)
      .attr("stroke-width", 2)
      .attr("rx", 8)
      .on("mouseover", function() {
        d3.select(this).attr("fill", colors.buttonHover)
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", colors.button)
      })

    startButton.append("text")
      .attr("y", 5)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "16px")
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
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "18px")
      .style("font-weight", "600")
      .text(`Collecting ${selectedSamples} samples from 150 cereal boxes`)

    // Machine body
    const machineX = 80
    const machineY = 120
    const machineWidth = 160
    const machineHeight = 100

    // Machine shadow
    svg.append("rect")
      .attr("x", machineX + 4)
      .attr("y", machineY + 4)
      .attr("width", machineWidth)
      .attr("height", machineHeight)
      .attr("fill", "rgba(0,0,0,0.1)")
      .attr("rx", 12)

    // Machine body
    svg.append("rect")
      .attr("x", machineX)
      .attr("y", machineY)
      .attr("width", machineWidth)
      .attr("height", machineHeight)
      .attr("fill", colors.machine)
      .attr("stroke", colors.border)
      .attr("stroke-width", 3)
      .attr("rx", 12)

    // Machine label
    svg.append("text")
      .attr("x", machineX + machineWidth / 2)
      .attr("y", 110)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .text("CEREAL MACHINE")

    // Conveyor belt
    const beltY = 170
    const beltStartX = machineX + machineWidth
    const beltEndX = 850

    // Belt shadow
    svg.append("line")
      .attr("x1", beltStartX)
      .attr("y1", beltY + 2)
      .attr("x2", beltEndX)
      .attr("y2", beltY + 2)
      .attr("stroke", "rgba(0,0,0,0.1)")
      .attr("stroke-width", 14)
      .attr("stroke-linecap", "round")

    // Main belt
    svg.append("line")
      .attr("x1", beltStartX)
      .attr("y1", beltY)
      .attr("x2", beltEndX)
      .attr("y2", beltY)
      .attr("stroke", colors.belt)
      .attr("stroke-width", 12)
      .attr("stroke-linecap", "round")

    // Belt direction arrows
    for (let i = beltStartX + 40; i < beltEndX - 40; i += 80) {
      svg.append("polygon")
        .attr("points", `${i},${beltY-4} ${i+12},${beltY} ${i},${beltY+4}`)
        .attr("fill", colors.border)
        .attr("opacity", 0.6)
    }

    // Sample gate
    const gateX = 600
    svg.append("line")
      .attr("x1", gateX)
      .attr("y1", beltY - 50)
      .attr("x2", gateX)
      .attr("y2", beltY + 50)
      .attr("stroke", colors.accent)
      .attr("stroke-width", 4)
      .attr("stroke-dasharray", "12,6")
      .attr("opacity", 0.9)

    // Gate label
    svg.append("text")
      .attr("x", gateX + 20)
      .attr("y", beltY - 25)
      .style("fill", colors.text)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "11px")
      .style("font-weight", "500")
      .text("SAMPLING GATE")

    // Histogram area
    const histY = 300
    const histHeight = 300
    const histWidth = 700
    const histX = 150

    // Histogram background
    svg.append("rect")
      .attr("x", histX)
      .attr("y", histY)
      .attr("width", histWidth)
      .attr("height", histHeight)
      .attr("fill", colors.surface)
      .attr("stroke", colors.border)
      .attr("stroke-width", 2)
      .attr("rx", 8)

    // Chart title
    svg.append("text")
      .attr("x", histX + histWidth / 2)
      .attr("y", histY + 30)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .text("Sample Weight Distribution")

    // Histogram setup
    const xScale = d3.scaleLinear()
      .domain([38, 62])
      .range([histX + 40, histX + histWidth - 40])

    const yScale = d3.scaleLinear()
      .domain([0, Math.max(8, Math.ceil(selectedSamples / 5))])
      .range([histY + histHeight - 40, histY + 60])

    // Axes
    svg.append("g")
      .attr("transform", `translate(0, ${histY + histHeight - 40})`)
      .call(d3.axisBottom(xScale).ticks(12))
      .selectAll("text")
      .style("fill", colors.text)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "11px")

    svg.append("g")
      .attr("transform", `translate(${histX + 40}, 0)`)
      .call(d3.axisLeft(yScale).ticks(6))
      .selectAll("text")
      .style("fill", colors.text)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "11px")

    // Axis labels
    svg.append("text")
      .attr("x", histX + histWidth / 2)
      .attr("y", histY + histHeight - 8)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "13px")
      .text("Weight (grams)")

    // Progress indicator
    const progressGroup = svg.append("g")
      .attr("transform", `translate(${width - 200}, 120)`)

    progressGroup.append("rect")
      .attr("x", -10)
      .attr("y", -10)
      .attr("width", 180)
      .attr("height", 60)
      .attr("fill", colors.surface)
      .attr("stroke", colors.border)
      .attr("rx", 6)

    progressGroup.append("text")
      .attr("class", "progress-text")
      .attr("x", 85)
      .attr("y", 5)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "14px")
      .style("font-weight", "600")
      .text(`0 / ${selectedSamples}`)

    progressGroup.append("text")
      .attr("x", 85)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "10px")
      .text("SAMPLES COLLECTED")

    progressGroup.append("text")
      .attr("class", "total-boxes-text")
      .attr("x", 85)
      .attr("y", 35)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "10px")
      .text(`0 / 150 BOXES`)

    return { svg, xScale, yScale, beltY, gateX }
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
        x: 240 - (i * 30), // Spread them out on the belt
        y: 170,
        sampled: false
      })
    }
    setBoxes(initialBoxes)

    const result = initializeAnimation()
    if (!result) return

    const { svg, xScale, yScale, beltY, gateX } = result
    const binCounts: Record<number, number> = {}
    let sampledSoFar = 0
    let isAnimating = true

    const animate = () => {
      if (!isAnimating) return

      setBoxes(prevBoxes => {
        const newBoxes = prevBoxes.map(box => {
          if (!box.sampled) {
            const newX = box.x + 2 // Move boxes along belt

            // Check if box passes gate and we need more samples
            if (newX >= gateX - 2 && newX <= gateX + 2 && sampledSoFar < selectedSamples) {
              const updatedBox = { ...box, sampled: true, x: newX }
              sampledSoFar++
              
              setSampledCount(sampledSoFar)
              setSampleData(prev => [...prev, box.weight])

              // Update progress
              svg.select(".progress-text").text(`${sampledSoFar} / ${selectedSamples}`)

              // Animate box to histogram
              const weight = Math.round(box.weight)
              binCounts[weight] = (binCounts[weight] || 0) + 1

              const sample = svg.append("circle")
                .attr("cx", box.x)
                .attr("cy", box.y)
                .attr("r", 6)
                .attr("fill", colors.boxSampled)

              const targetX = xScale(weight)
              const targetY = yScale(binCounts[weight])

              sample.transition()
                .duration(800)
                .ease(d3.easeCubicOut)
                .attr("cx", targetX)
                .attr("cy", targetY)
                .transition()
                .duration(200)
                .attr("r", 0)
                .remove()

              // Update histogram bar
              const barId = `bar-${weight}`
              const existingBar = svg.select(`#${barId}`)
              
              if (existingBar.empty()) {
                svg.append("rect")
                  .attr("id", barId)
                  .attr("x", targetX - 8)
                  .attr("y", yScale(0))
                  .attr("width", 16)
                  .attr("height", 0)
                  .attr("fill", colors.data)
                  .attr("stroke", colors.border)
                  .attr("rx", 2)
                  .transition()
                  .duration(400)
                  .attr("y", targetY)
                  .attr("height", yScale(0) - targetY)
              } else {
                existingBar
                  .transition()
                  .duration(400)
                  .attr("y", targetY)
                  .attr("height", yScale(0) - targetY)
              }

              // Check if sampling is complete
              if (sampledSoFar >= selectedSamples) {
                isAnimating = false
                setTimeout(() => setPhase('completed'), 1000)
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

    const visibleBoxes = boxes.filter(box => !box.sampled && box.x > 200 && box.x < 900)

    const boxGroups = svg.selectAll(".box")
      .data(visibleBoxes)
      .enter()
      .append("g")
      .attr("class", "box")
      .attr("transform", d => `translate(${d.x}, ${d.y - 15})`)

    // Box shadow
    boxGroups.append("rect")
      .attr("x", 2)
      .attr("y", 2)
      .attr("width", 26)
      .attr("height", 20)
      .attr("fill", "rgba(0,0,0,0.1)")
      .attr("rx", 3)

    // Main box
    boxGroups.append("rect")
      .attr("width", 26)
      .attr("height", 20)
      .attr("fill", colors.box)
      .attr("stroke", colors.border)
      .attr("stroke-width", 1)
      .attr("rx", 3)

    // Weight label
    boxGroups.append("text")
      .attr("x", 13)
      .attr("y", 13)
      .attr("text-anchor", "middle")
      .style("fill", "#333")
      .style("font-size", "10px")
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
        const x = ((selectedSamples - 10) / 40) * 300 - 150
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
            style={{ maxHeight: '700px', maxWidth: '1000px' }}
          />
        </div>
      </div>
    </div>
  )
}

export default CerealMachineAnimation

