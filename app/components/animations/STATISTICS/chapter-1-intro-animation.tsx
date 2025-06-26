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
    
    // Note: Theoretical distribution outline removed - histogram builds from experimental results only

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

    // Prominent success counter in center
    const successCounterGroup = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2 - 50})`)

    // Large success number display
    const successNumberDisplay = successCounterGroup.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .style("fill", colors.accent)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "48px")
      .style("font-weight", "600")
      .style("opacity", 0)
      .text("0")

    // Success counter label
    const successLabel = successCounterGroup.append("text")
      .attr("x", 0)
      .attr("y", 35)
      .attr("text-anchor", "middle")
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "14px")
      .style("font-weight", "400")
      .style("text-transform", "uppercase")
      .style("letter-spacing", "0.1em")
      .style("opacity", 0)
      .text("SUCCESSES")

    // Experiment counter (smaller, bottom)
    const counterGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${height - 25})`)

    const experimentCounter = counterGroup.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .style("fill", colors.textMuted)
      .style("font-family", "Aptos, system-ui, sans-serif")
      .style("font-size", "11px")
      .style("font-weight", "400")
      .style("text-transform", "uppercase")
      .style("letter-spacing", "0.05em")
      .text("experiment: 0 / " + numExperiments)

    // Keep track of counts for each outcome
    const outcomeCounts = new Array(n + 1).fill(0)
    const results: ExperimentResult[] = []

    // Run experiments one by one
    for (let exp = 0; exp < numExperiments; exp++) {
      setCurrentExperiment(exp + 1)
      
      // Run single experiment
      const successCount = runSingleExperiment()
      
      const result = {
        experimentNumber: exp + 1,
        successCount
      }
      results.push(result)

      // Update experiment counter
      experimentCounter.text(`experiment: ${exp + 1} / ${numExperiments}`)

      // Calculate speed factor - gradual acceleration from 1.0 to 0.05
      const speedFactor = exp < 5 
        ? 1.0 - (exp * 0.15)  // Experiments 1-5: 1.0 → 0.85 → 0.70 → 0.55 → 0.40
        : Math.max(0.05, 0.4 - ((exp - 5) / numExperiments) * 0.35)  // Experiments 6+: 0.40 → 0.05
      
      const isDetailedPhase = exp < 10
      
      if (isDetailedPhase) {
        // DETAILED ANIMATION WITH GRADUAL SPEED-UP
        
        // STEP 1: Show the success number prominently (gets faster)
        const emphasisDuration = Math.max(100, 200 * speedFactor)
        const pulseDuration = Math.max(100, 200 * speedFactor)
        
        successNumberDisplay
          .text(successCount)
          .style("opacity", 0)
          .transition()
          .duration(emphasisDuration)
          .style("opacity", 1)
          .style("font-size", "56px")
          .transition()
          .duration(pulseDuration)
          .style("font-size", "48px")

        successLabel
          .style("opacity", 0)
          .transition()
          .duration(emphasisDuration)
          .style("opacity", 1)

        // Wait for emphasis (gets shorter)
        const waitTime = Math.max(200, 400 * speedFactor)
        await new Promise(resolve => setTimeout(resolve, waitTime))

        // STEP 2: Animate the number moving to the histogram (gets faster)
        const movingNumber = svg.append("text")
          .attr("x", width / 2)
          .attr("y", height / 2 - 50)
          .attr("text-anchor", "middle")
          .style("fill", colors.accent)
          .style("font-family", "Aptos, system-ui, sans-serif")
          .style("font-size", "24px")
          .style("font-weight", "600")
          .style("opacity", 1)
          .text(successCount)

        // Target position for the moving number
        const targetX = (xScale(successCount.toString()) || 0) + xScale.bandwidth() / 2 + margin.left
        const targetY = margin.top + chartHeight - 20

        // Animate movement (gets faster)
        const movementDuration = Math.max(200, 600 * speedFactor)
        movingNumber
          .transition()
          .duration(movementDuration)
          .attr("x", targetX)
          .attr("y", targetY)
          .style("font-size", "16px")
          .style("opacity", 0.8)

        // STEP 3: Update histogram after the number arrives (gets faster)
        setTimeout(() => {
          outcomeCounts[successCount]++
          
          const histogramDuration = Math.max(150, 300 * speedFactor)
          g.selectAll(".experimental-bar")
            .data(outcomeCounts)
            .transition()
            .duration(histogramDuration)
            .attr("y", (d: number) => yScale(d))
            .attr("height", (d: number) => chartHeight - yScale(d))

          // Highlight the updated bar (gets faster)
          const highlightDuration = Math.max(100, 200 * speedFactor)
          const currentBar = g.select(`.experimental-bar:nth-child(${successCount + 4})`)
          currentBar
            .transition()
            .duration(highlightDuration)
            .attr("fill", colors.accent)
            .transition()
            .duration(highlightDuration * 1.5)
            .attr("fill", colors.data)

          // Remove the moving number
          movingNumber.remove()
        }, movementDuration)

        // STEP 4: Fade out the main counter (gets faster)
        const fadeDelay = Math.max(300, 800 * speedFactor)
        setTimeout(() => {
          const fadeDuration = Math.max(100, 200 * speedFactor)
          successNumberDisplay
            .transition()
            .duration(fadeDuration)
            .style("opacity", 0.3)
          
          successLabel
            .transition()
            .duration(fadeDuration)
            .style("opacity", 0.3)
        }, fadeDelay)

        // Total wait time decreases progressively
        const totalWaitTime = Math.max(600, 1400 * speedFactor)
        await new Promise(resolve => setTimeout(resolve, totalWaitTime))
        
      } else {
        // ACCELERATED ANIMATION WITH CONTINUED SPEED-UP
        
        // Quick flash of the success number (continues to get faster)
        const flashDuration = Math.max(30, 100 * speedFactor)
        successNumberDisplay
          .text(successCount)
          .style("opacity", 1)
          .style("font-size", "48px")
          .transition()
          .duration(flashDuration)
          .style("opacity", 0.6)

        successLabel.style("opacity", 0.6)

        // Update count immediately
        outcomeCounts[successCount]++
        
        // Quick histogram update (continues to get faster)
        const histogramDuration = Math.max(20, 80 * speedFactor)
        g.selectAll(".experimental-bar")
          .data(outcomeCounts)
          .transition()
          .duration(histogramDuration)
          .attr("y", (d: number) => yScale(d))
          .attr("height", (d: number) => chartHeight - yScale(d))

        // Brief highlight (continues to get faster)
        const highlightDuration = Math.max(15, 60 * speedFactor)
        const currentBar = g.select(`.experimental-bar:nth-child(${successCount + 4})`)
        currentBar
          .transition()
          .duration(highlightDuration)
          .attr("fill", colors.accent)
          .transition()
          .duration(highlightDuration)
          .attr("fill", colors.data)

        // Delay continues to decrease
        const delay = Math.max(10, numExperiments > 100 ? 25 * speedFactor : 40 * speedFactor)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
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
          Binomial Trials 
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
                 min="1"
                 max="300"
                 step="1"
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