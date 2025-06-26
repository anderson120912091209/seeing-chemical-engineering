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

  // Minimal dark theme palette
  const colors = {
    background: '#0a0a0a',
    surface: '#151515',
    border: '#2a2a2a',
    text: '#e5e5e5',
    textMuted: '#888888',
    accent: '#ffffff',
    data: '#666666',
    dataHighlight: '#999999'
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
      .attr('stroke', colors.border)
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.3)

    // Axes
    g.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("fill", colors.text)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "12px")

    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("fill", colors.text)
      .style("font-family", "Aptos, system-ui, sans-serif")
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
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "14px")
      .text("Number of Successes per Experiment")

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -chartHeight / 2)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "14px")
      .text("Frequency")

    // Minimal title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 35)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "12px")
      .style("font-weight", "400")
      .style("text-transform", "uppercase")
      .style("letter-spacing", "0.05em")
      .text(`n=${n} • p=${p} • ${numExperiments} experiments`)

    // Tooltip for hover (will be moved to highest z-layer later)
    const tooltip = svg.append("g")
      .attr("class", "bar-tooltip")
      .style("opacity", 0)
      .style("pointer-events", "none");

    tooltip.append("rect")
      .attr("width", 80)
      .attr("height", 25)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("y", -28)
      .style("fill", colors.surface)
      .style("stroke", colors.border);

    tooltip.append("text")
      .attr("x", 40)
      .attr("y", -12)
      .attr("text-anchor", "middle")
      .style("fill", colors.text)
      .style("font-size", "12px")
      .style("font-family", "Aptos, system-ui, sans-serif");
    
    // Theoretical distribution (minimal outline)
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
      .attr("stroke", colors.data)
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.6)

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
      .attr("fill", colors.data)
      .attr("opacity", 0.9)

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
      .attr("transform", `translate(${margin.left}, ${height - 40})`)

    const experimentCounter = counterGroup.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "12px")
      .style("font-weight", "400")
      .style("text-transform", "uppercase")
      .style("letter-spacing", "0.05em")
      .text("experiment: 0 / " + numExperiments)

    const currentResultText = counterGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .style("fill", colors.text)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "13px")
      .style("font-weight", "400")
      .text("-")

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
      experimentCounter.text(`experiment: ${exp + 1} / ${numExperiments}`)
      currentResultText.text(`${successCount}/${n}`)

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
        .attr("fill", colors.data)

      // Variable delay - faster as we go, and faster for larger experiment counts
      const baseDelay = numExperiments > 300? 20 : numExperiments > 200 ? 50 : numExperiments > 100 ? 80 : 120
      const delay = Math.max(5, baseDelay - (exp / numExperiments) * (baseDelay * 0.8))
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    setExperiments(results)
    setIsAnimating(false)

    const tooltip = svg.select<SVGGElement>(".bar-tooltip");

    g.selectAll<SVGRectElement, { k: number, count: number }>(".experimental-bar")
      .data(outcomeCounts.map((count, k) => ({ k, count })))
      .on("mouseover", function(event, d) {
        if (d.count > 0) {
          const xPos = (xScale(d.k.toString()) || 0) + xScale.bandwidth() / 2 + margin.left;
          const yPos = yScale(d.count) + margin.top;

          tooltip.attr("transform", `translate(${xPos - 40}, ${yPos})`);
          tooltip.select("text").text(`Count: ${d.count}`);
          tooltip.transition().duration(200).style("opacity", 1);

          d3.select(this).attr("fill", colors.dataHighlight);
        }
      })
      .on("mouseout", function() {
        tooltip.transition().duration(200).style("opacity", 0);
        d3.select(this).attr("fill", colors.data);
      });

    // Final animation - show comparison with theoretical
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 20)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "11px")
      .style("text-transform", "uppercase")
      .style("letter-spacing", "0.05em")
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
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: colors.background, fontFamily: 'Aptos, system-ui, sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-8 px-6">
        <h3 className="text-lg font-medium mb-3" style={{ color: colors.text, fontFamily: 'Aptos, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
          Binomial Distribution
        </h3>
        <p className="text-sm" style={{ color: colors.textMuted, fontFamily: 'Aptos, system-ui, sans-serif', fontWeight: '400' }}>
          Repeated experiments visualization
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-3 mb-8">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 px-4 py-2 transition-all duration-200 hover:bg-opacity-80 focus:outline-none"
          style={{ 
            backgroundColor: showSettings ? colors.surface : 'transparent',
            color: showSettings ? colors.accent : colors.text,
            border: `1px solid ${colors.border}`,
            borderRadius: '6px',
            fontFamily: 'Aptos, system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '400',
            outline: 'none'
          }}
        >
          <Settings className="w-4 h-4" style={{ color: showSettings ? colors.accent : colors.text }} />
          Try Me
        </button>

        <button
          onClick={animateExperiments}
          disabled={isAnimating}
          className="flex items-center gap-2 px-5 py-2 transition-all duration-200 hover:bg-opacity-90 disabled:opacity-60"
          style={{
            backgroundColor: colors.accent,
            color: colors.background,
            border: 'none',
            borderRadius: '6px',
            fontFamily: 'Aptos, system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <Play className="w-4 h-4" />
          {isAnimating ? `${currentExperiment}/${numExperiments}` : 'Run'}
        </button>

        <button
          onClick={resetAnimation}
          className="flex items-center gap-2 px-4 py-2 transition-all duration-200 hover:bg-opacity-80"
          style={{ 
            backgroundColor: 'transparent',
            color: colors.textMuted,
            border: `1px solid ${colors.border}`,
            borderRadius: '6px',
            fontFamily: 'Aptos, system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '400'
          }}
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mx-6 mb-8 p-4" style={{ 
          backgroundColor: colors.surface, 
          borderRadius: '8px', 
          border: `1px solid ${colors.border}`
        }}>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ 
                color: colors.textMuted, 
                fontFamily: 'Aptos, system-ui, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Trials: <span style={{ color: colors.text, fontWeight: '500' }}>{n}</span>
              </label>
                             <input
                 type="range"
                 min="5"
                 max="30"
                 value={n}
                 onChange={(e) => setN(parseInt(e.target.value))}
                 className="w-full h-1 rounded appearance-none cursor-pointer focus:outline-none"
                 style={{
                   background: colors.border,
                   outline: 'none',
                   accentColor: colors.accent
                 }}
                 disabled={isAnimating}
               />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ 
                color: colors.textMuted, 
                fontFamily: 'Aptos, system-ui, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Probability: <span style={{ color: colors.text, fontWeight: '500' }}>{p.toFixed(2)}</span>
              </label>
                             <input
                 type="range"
                 min="0.1"
                 max="0.9"
                 step="0.05"
                 value={p}
                 onChange={(e) => setP(parseFloat(e.target.value))}
                 className="w-full h-1 rounded appearance-none cursor-pointer focus:outline-none"
                 style={{
                   background: colors.border,
                   outline: 'none',
                   accentColor: colors.accent
                 }}
                 disabled={isAnimating}
               />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ 
                color: colors.textMuted, 
                fontFamily: 'Aptos, system-ui, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Experiments: <span style={{ color: colors.text, fontWeight: '500' }}>{numExperiments}</span>
              </label>
                             <input
                 type="range"
                 min="50"
                 max="500"
                 step="50"
                 value={numExperiments}
                 onChange={(e) => setNumExperiments(parseInt(e.target.value))}
                 className="w-full h-1 rounded appearance-none cursor-pointer focus:outline-none"
                 style={{
                   background: colors.border,
                   outline: 'none',
                   accentColor: colors.accent
                 }}
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


    </div>
  )
}

export default BinomialDistributionAnimation