'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Play, RotateCcw, Settings } from 'lucide-react'
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
  const { theme } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [sampleSize, setSampleSize] = useState(12)
  const [targetMean, setTargetMean] = useState(50)
  const [boxes, setBoxes] = useState<CerealBox[]>([])
  const [sampleData, setSampleData] = useState<number[]>([])

  const width = 800
  const height = 500

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
    boxSampled: '#ff6b35'
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
    boxSampled: '#ff6b35'
  }

  const generateWeight = (): number => {
    // Simple normal distribution
    const u1 = Math.random()
    const u2 = Math.random()
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    return targetMean + 4 * z0
  }

  const initializeVisualization = () => {
    const svg = d3.select(svgRef.current)
    if (!svg.node()) return

    svg.selectAll("*").remove()
    svg.attr("viewBox", `0 0 ${width} ${height}`)
       .style("background", colors.background)

    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "14px")
      .style("font-weight", "500")
      .text(`Cereal Box Sampling • Target: ${sampleSize} samples`)

    // Machine body
    svg.append("rect")
      .attr("x", 50)
      .attr("y", 60)
      .attr("width", 100)
      .attr("height", 60)
      .attr("fill", colors.machine)
      .attr("stroke", colors.border)
      .attr("stroke-width", 2)
      .attr("rx", 8)

    // Machine label
    svg.append("text")
      .attr("x", 100)
      .attr("y", 55)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "10px")
      .text("MACHINE")

    // Conveyor belt
    const beltY = 100
    svg.append("line")
      .attr("x1", 150)
      .attr("y1", beltY)
      .attr("x2", 650)
      .attr("y2", beltY)
      .attr("stroke", colors.belt)
      .attr("stroke-width", 8)
      .attr("stroke-linecap", "round")

    // Sample gate
    const gateX = 450
    svg.append("line")
      .attr("x1", gateX)
      .attr("y1", beltY - 30)
      .attr("x2", gateX)
      .attr("y2", beltY + 30)
      .attr("stroke", colors.accent)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "8,4")

    svg.append("text")
      .attr("x", gateX + 10)
      .attr("y", beltY - 15)
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "10px")
      .text("GATE")

    // Histogram area
    const histY = 200
    const histHeight = 200
    const histWidth = 500

    svg.append("rect")
      .attr("x", 150)
      .attr("y", histY)
      .attr("width", histWidth)
      .attr("height", histHeight)
      .attr("fill", colors.surface)
      .attr("stroke", colors.border)
      .attr("stroke-width", 1)
      .attr("rx", 4)

    svg.append("text")
      .attr("x", 400)
      .attr("y", histY + 20)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .text("Sample Distribution")

    // Simple histogram setup
    const xScale = d3.scaleLinear()
      .domain([40, 60])
      .range([170, 630])

    const yScale = d3.scaleLinear()
      .domain([0, sampleSize])
      .range([histY + histHeight - 20, histY + 40])

    // Axes
    svg.append("g")
      .attr("transform", `translate(0, ${histY + histHeight - 20})`)
      .call(d3.axisBottom(xScale).ticks(10))
      .selectAll("text")
      .style("fill", colors.text)
      .style("font-size", "10px")

    svg.append("g")
      .attr("transform", `translate(170, 0)`)
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll("text")
      .style("fill", colors.text)
      .style("font-size", "10px")

    // Progress
    svg.append("text")
      .attr("class", "progress-text")
      .attr("x", width - 100)
      .attr("y", 60)
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "12px")
      .text(`0 / ${sampleSize}`)

    return { svg, xScale, yScale, histY, histHeight }
  }

  const initializeBoxes = () => {
    const newBoxes: CerealBox[] = []
    for (let i = 0; i < 15; i++) {
      newBoxes.push({
        id: i,
        weight: generateWeight(),
        x: 100 - (i * 40),
        y: 100,
        sampled: false
      })
    }
    setBoxes(newBoxes)
  }

  const startAnimation = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setSampleData([])
    
    const result = initializeVisualization()
    if (!result) return

    const { svg, xScale, yScale, histY } = result
    let sampledCount = 0
    const binCounts: Record<number, number> = {}

    const animate = () => {
      if (sampledCount >= sampleSize) {
        setIsAnimating(false)
        return
      }

      setBoxes(prevBoxes => {
        return prevBoxes.map(box => {
          if (!box.sampled) {
            const newX = box.x + 2

            // Check if at gate
            if (newX >= 445 && newX <= 455 && sampledCount < sampleSize) {
              box.sampled = true
              sampledCount++

              // Add to data
              setSampleData(prev => [...prev, box.weight])

              // Update progress
              svg.select(".progress-text")
                .text(`${sampledCount} / ${sampleSize}`)

              // Animate to histogram
              const weight = Math.round(box.weight)
              binCounts[weight] = (binCounts[weight] || 0) + 1

              const sample = svg.append("circle")
                .attr("cx", box.x)
                .attr("cy", box.y)
                .attr("r", 3)
                .attr("fill", colors.boxSampled)

              const targetX = xScale(weight)
              const targetY = yScale(binCounts[weight])

              sample.transition()
                .duration(600)
                .attr("cx", targetX)
                .attr("cy", targetY)
                .attr("r", 0)
                .remove()

                             // Update bar
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
                   .transition()
                   .duration(300)
                   .attr("y", targetY)
                   .attr("height", yScale(0) - targetY)
               } else {
                 existingBar
                   .transition()
                   .duration(300)
                   .attr("y", targetY)
                   .attr("height", yScale(0) - targetY)
               }
            }

            return { ...box, x: newX > 700 ? 100 : newX }
          }
          return box
        })
      })

      requestAnimationFrame(animate)
    }

    animate()
  }

  const renderBoxes = () => {
    const svg = d3.select(svgRef.current)
    svg.selectAll(".box").remove()

    const visibleBoxes = boxes.filter(box => !box.sampled && box.x > 50 && box.x < 700)

    const boxGroups = svg.selectAll(".box")
      .data(visibleBoxes)
      .enter()
      .append("g")
      .attr("class", "box")
      .attr("transform", d => `translate(${d.x}, ${d.y - 10})`)

    boxGroups.append("rect")
      .attr("width", 20)
      .attr("height", 15)
      .attr("fill", colors.box)
      .attr("stroke", colors.border)
      .attr("rx", 2)

    boxGroups.append("text")
      .attr("x", 10)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .style("fill", "#333")
      .style("font-size", "8px")
      .style("font-family", "Aptos, system-ui, sans-serif")
      .text(d => Math.round(d.weight))
  }

  const resetAnimation = () => {
    setIsAnimating(false)
    setSampleData([])
    initializeBoxes()
    initializeVisualization()
  }

  useEffect(() => {
    initializeVisualization()
    initializeBoxes()
  }, [theme, sampleSize, targetMean])

  useEffect(() => {
    renderBoxes()
  }, [boxes])

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1" style={{ background: colors.background }}>
        {/* Control bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={startAnimation}
              disabled={isAnimating}
              className="flex items-center gap-2 px-4 py-2 transition-all duration-200 hover:bg-opacity-80 disabled:opacity-50"
              style={{ 
                backgroundColor: colors.surface,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '14px'
              }}
            >
              <Play className="w-4 h-4" />
              {isAnimating ? 'Sampling...' : 'Start'}
            </button>

            <button
              onClick={resetAnimation}
              disabled={isAnimating}
              className="flex items-center gap-2 px-4 py-2 transition-all duration-200 hover:bg-opacity-80 disabled:opacity-50"
              style={{ 
                backgroundColor: 'transparent',
                color: colors.text,
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '14px'
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              disabled={isAnimating}
              className="flex items-center gap-2 px-4 py-2 transition-all duration-200 hover:bg-opacity-80 disabled:opacity-50"
              style={{ 
                backgroundColor: showSettings ? colors.surface : 'transparent',
                color: colors.text,
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '14px'
              }}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="mx-6 mb-4 p-4" style={{ 
            backgroundColor: colors.surface, 
            borderRadius: '8px', 
            border: `1px solid ${colors.border}`
          }}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ 
                  color: colors.textMuted, 
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  Sample Size: {sampleSize}
                </label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={sampleSize}
                  onChange={(e) => setSampleSize(parseInt(e.target.value))}
                  disabled={isAnimating}
                  style={{ accentColor: colors.accent }}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ 
                  color: colors.textMuted,
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  Target Mean: {targetMean}g
                </label>
                <input
                  type="range"
                  min="40"
                  max="60"
                  value={targetMean}
                  onChange={(e) => setTargetMean(parseInt(e.target.value))}
                  disabled={isAnimating}
                  style={{ accentColor: colors.accent }}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Main visualization */}
        <div className="flex-1 flex items-center justify-center p-4">
          <svg
            ref={svgRef}
            className="w-full h-full max-w-4xl"
            style={{ maxHeight: '500px' }}
          />
        </div>
      </div>
    </div>
  )
}

export default CerealMachineAnimation

