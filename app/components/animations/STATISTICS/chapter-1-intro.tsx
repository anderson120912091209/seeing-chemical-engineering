'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Play, RotateCcw, Settings } from 'lucide-react'

export const DISTRIBUTIONS = ['binomial', 'normal'] as const
type Stage = typeof DISTRIBUTIONS[number]

interface ExperimentResult {
  experimentNumber: number
  successCount: number
}

const BinomialDistributionAnimation = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [n, setN] = useState(20) // shots per experiment
  const [p, setP] = useState(0.7) // probability of success per shot
  const [numExperiments, setNumExperiments] = useState(100) // number of experiments to run
  const [experiments, setExperiments] = useState<ExperimentResult[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentExperiment, setCurrentExperiment] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  const width = 800
  const height = 600
  const margin = { top: 80, right: 60, bottom: 80, left: 80 }
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  // 3B1B color palette
  const colors = {
    background: '#0d1117',
    primary: '#58a6ff',
    secondary: '#f85149', 
    theoretical: '#a5a5a5',
    experimental: '#10b981',
    grid: '#21262d',
    text: '#f0f6fc',
    accent: '#ffa657'
  }

  const binomialPMF = (k: number, n: number, p: number): number => {
    if (k < 0 || k > n) return 0
    const logCoeff = logFactorial(n) - logFactorial(k) - logFactorial(n - k)
    const logProb = k * Math.log(p) + (n - k) * Math.log(1 - p)
    return Math.exp(logCoeff + logProb)
  }

  const logFactorial = (n: number): number => {
    if (n <= 1) return 0
    let result = 0
    for (let i = 2; i <= n; i++) {
      result += Math.log(i)
    }
    return result
  }

  const runSingleExperiment = (): number => {
    let successes = 0
    for (let i = 0; i < n; i++) {
      if (Math.random() < p) successes++
    }
    return successes
  }

  const initializeVisualization = () => {
    const svg = d3.select(svgRef.current)
    if (!svg.node()) return

    svg.selectAll("*").remove()
    svg.attr("viewBox", `0 0 ${width} ${height}`)
       .attr("preserveAspectRatio", "xMidYMid meet")
       .style("background", colors.background)

    // Main group
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)

    // Scales
    const xScale = d3.scaleBand()
      .domain(d3.range(0, n + 1).map(d => d.toString()))
      .range([0, chartWidth])
      .padding(0.05)

    // Calculate theoretical distribution for y-scale
    const theoreticalData = d3.range(0, n + 1).map(k => ({
      k,
      prob: binomialPMF(k, n, p),
      theoreticalCount: binomialPMF(k, n, p) * numExperiments
    }))

    const maxTheoreticalCount = d3.max(theoreticalData, d => d.theoreticalCount) || 0
    const yScale = d3.scaleLinear()
      .domain([0, maxTheoreticalCount * 1.2])
      .range([chartHeight, 0])

    // Grid lines
    const yTicks = yScale.ticks(8)
    g.selectAll('.grid-line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', chartWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', colors.grid)
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.3)

    // Axes
    g.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("fill", colors.text)
      .style("font-family", "SF Mono, Monaco, monospace")
      .style("font-size", "12px")

    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("fill", colors.text)
      .style("font-family", "SF Mono, Monaco, monospace")
      .style("font-size", "12px")

    // Axis styling
    g.selectAll(".domain, .tick line")
      .style("stroke", colors.text)
      .style("opacity", 0.6)

    // Labels
    g.append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + 50)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-family", "SF Mono, Monaco, monospace")
      .style("font-size", "14px")
      .text("Number of Successes per Experiment")

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -chartHeight / 2)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-family", "SF Mono, Monaco, monospace")
      .style("font-size", "14px")
      .text("Frequency")

    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-family", "SF Mono, Monaco, monospace")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text(`Binomial Distribution: ${numExperiments} experiments of ${n} trials (p=${p})`)

    // Subtitle
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 50)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-family", "SF Mono, Monaco, monospace")
      .style("font-size", "12px")
      .style("opacity", 0.7)
      .text(`Each experiment: ${n} shots with ${(p*100).toFixed(0)}% success rate`)

    // Theoretical distribution (outline)
    g.selectAll(".theoretical-bar")
      .data(theoreticalData)
      .enter()
      .append("rect")
      .attr("class", "theoretical-bar")
      .attr("x", d => xScale(d.k.toString()) || 0)
      .attr("y", d => yScale(d.theoreticalCount))
      .attr("width", xScale.bandwidth())
      .attr("height", d => chartHeight - yScale(d.theoreticalCount))
      .attr("fill", "none")
      .attr("stroke", colors.theoretical)
      .attr("stroke-width", 2)
      .attr("opacity", 0.5)

    // Experimental bars (start at 0)
    g.selectAll(".experimental-bar")
      .data(d3.range(0, n + 1))
      .enter()
      .append("rect")
      .attr("class", "experimental-bar")
      .attr("x", d => xScale(d.toString()) || 0)
      .attr("y", chartHeight)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", colors.experimental)
      .attr("opacity", 0.8)

    return { g, xScale, yScale }
  }

  const animateExperiments = async () => {
    setIsAnimating(true)
    setExperiments([])
    setCurrentExperiment(0)

    const svg = d3.select(svgRef.current)
    const { g, xScale, yScale } = initializeVisualization()!

    // Experiment counter
    const counterGroup = svg.append("g")
      .attr("transform", "translate(50, 500)")

    const experimentCounter = counterGroup.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .style("fill", colors.accent)
      .style("font-family", "SF Mono, Monaco, monospace")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Experiment: 0 / " + numExperiments)

    const currentResultText = counterGroup.append("text")
      .attr("x", 0)
      .attr("y", 25)
      .style("fill", colors.primary)
      .style("font-family", "SF Mono, Monaco, monospace")
      .style("font-size", "14px")
      .text("Current result: -")

    // Keep track of counts for each outcome
    const outcomeCounts = new Array(n + 1).fill(0)
    const results: ExperimentResult[] = []

    // Run experiments one by one
    for (let exp = 0; exp < numExperiments; exp++) {
      setCurrentExperiment(exp + 1)
      
      // Run single experiment
      const successCount = runSingleExperiment()
      outcomeCounts[successCount]++
      
      const result = {
        experimentNumber: exp + 1,
        successCount
      }
      results.push(result)

      // Update counters
      experimentCounter.text(`Experiment: ${exp + 1} / ${numExperiments}`)
      currentResultText.text(`Current result: ${successCount}/${n} successes`)

      // Update histogram
      g.selectAll(".experimental-bar")
        .data(outcomeCounts)
        .transition()
        .duration(50)
        .attr("y", (d: number) => yScale(d))
        .attr("height", (d: number) => chartHeight - yScale(d))

      // Highlight current result briefly
      const currentBar = g.select(`.experimental-bar:nth-child(${successCount + n + 8})`) // offset for grid lines and axes
      currentBar
        .transition()
        .duration(100)
        .attr("fill", colors.accent)
        .transition()
        .duration(100)
        .attr("fill", colors.experimental)

      // Variable delay - faster as we go
      const delay = Math.max(20, 200 - (exp / numExperiments) * 150)
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    setExperiments(results)
    setIsAnimating(false)

    // Final animation - show comparison with theoretical
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 30)
      .attr("text-anchor", "middle")
      .style("fill", colors.accent)
      .style("font-family", "SF Mono, Monaco, monospace")
      .style("font-size", "14px")
      .text(`Completed ${numExperiments} experiments. Gray outline shows theoretical distribution.`)
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1)
  }

  const resetAnimation = () => {
    setExperiments([])
    setCurrentExperiment(0)
    setIsAnimating(false)
    initializeVisualization()
  }

  useEffect(() => {
    initializeVisualization()
  }, [n, p, numExperiments])

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="text-center mb-4 px-4">
        <h3 className="text-xl font-bold mb-2" style={{ color: colors.text }}>
          Binomial Distribution from Repeated Experiments
        </h3>
        <p className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
          Watch the distribution emerge from many repeated experiments
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4 mb-4">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
          style={{ 
            backgroundColor: showSettings ? colors.accent : 'rgba(255, 255, 255, 0.1)',
            color: colors.text 
          }}
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>

        <button
          onClick={animateExperiments}
          disabled={isAnimating}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          style={{
            backgroundColor: isAnimating ? 'rgba(255, 255, 255, 0.1)' : colors.experimental,
            color: colors.text
          }}
        >
          <Play className="w-5 h-5" />
          {isAnimating ? `Running... (${currentExperiment}/${numExperiments})` : 'Run Experiments'}
        </button>

        <button
          onClick={resetAnimation}
          className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: colors.text 
          }}
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mx-4 mb-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Shots per Experiment (n): {n}
              </label>
              <input
                type="range"
                min="5"
                max="30"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value))}
                className="w-full"
                disabled={isAnimating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Success Probability (p): {p.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={p}
                onChange={(e) => setP(parseFloat(e.target.value))}
                className="w-full"
                disabled={isAnimating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Number of Experiments: {numExperiments}
              </label>
              <input
                type="range"
                min="50"
                max="500"
                step="50"
                value={numExperiments}
                onChange={(e) => setNumExperiments(parseInt(e.target.value))}
                className="w-full"
                disabled={isAnimating}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Visualization */}
      <div className="flex-1 flex items-center justify-center">
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ maxHeight: '450px' }}
        />
      </div>

      {/* Results Summary */}
      {experiments.length > 0 && (
        <div className="mx-4 mb-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="text-center">
            <div className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
              Completed {experiments.length} experiments | Expected: {(n * p).toFixed(1)} successes per experiment
            </div>
            <div className="text-sm mt-1" style={{ color: colors.text, opacity: 0.7 }}>
              Actual average: {(experiments.reduce((sum, exp) => sum + exp.successCount, 0) / experiments.length).toFixed(1)} successes per experiment
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BinomialDistributionAnimation