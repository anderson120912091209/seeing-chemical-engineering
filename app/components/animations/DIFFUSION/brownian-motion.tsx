'use client';
/*Brownian Motion animatino is used to simulate the random, movement 
of particles, users will have controls over the UI sliders on the particles count 
as well as the step size*/
import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';

// Data Structue, id for each unique particle, x and y for position, history for the
// trail of the brownian motion. 
interface Particle {
  id: number;
  x: number;
  y: number;
  history: Array<{ x: number; y: number }>;
}

const BrownianMotion: React.FC = () => {
  // State management
  /*1. isPlaying: controls the animation state 
    2. numParticles: number of particles in the simulation
    3. stepSize: size of each step in the random walk
    4. stepCount: number of steps taken in the simulation*/
  const [isPlaying, setIsPlaying] = useState(false);
  const [numParticles, setNumParticles] = useState(50);
  const [stepSize, setStepSize] = useState(2);
  const [stepCount, setStepCount] = useState(0);
  
  // Refs
  const svgRef = useRef<SVGSVGElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  // Initialize particles
  /* useCallback function used for memoization */
  const initializeParticles = useCallback(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < numParticles; i++) {
      const x = 400 + (Math.random() - 0.5) * 100;
      const y = 200 + (Math.random() - 0.5) * 100;
      particles.push({
        id: i,
        x,
        y,
        history: [{ x, y }]
      });
    }
    return particles;
  }, [numParticles]);

  // Update Brownian motion simulation
  const updateBrownianMotion = useCallback(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const particles = particlesRef.current;

    // Update particle positions with random walk
    particles.forEach(particle => {
      const angle = Math.random() * 2 * Math.PI;
      const dx = Math.cos(angle) * stepSize;
      const dy = Math.sin(angle) * stepSize;
      
      particle.x += dx;
      particle.y += dy;
      
      // Boundary conditions with soft reflection
      if (particle.x <= 20) {
        particle.x = 20;
      } else if (particle.x >= 780) {
        particle.x = 780;
      }
      
      if (particle.y <= 20) {
        particle.y = 20;
      } else if (particle.y >= 380) {
        particle.y = 380;
      }
      
      // Store history (limit to last 100 steps for performance)
      particle.history.push({ x: particle.x, y: particle.y });
      if (particle.history.length > 50) {
        particle.history.splice(0, particle.history.length - 100);
      }
    });

    // Update visualization
    const g = svg.select<SVGGElement>('.brownian-group');
    
    // Draw particle trails with gradient fade
    const trails = g.selectAll<SVGPathElement, Particle>('.trail')
      .data(particles, d => d.id);

    trails.enter()
      .append('path')
      .attr('class', 'trail')
      .attr('fill', 'none')
      .attr('stroke', '#f87171') // red-400
      .attr('stroke-width', 1)
      .attr('opacity', 0.4)
      .merge(trails)
      .attr('d', d => {
      if (d.history.length < 2) return '';
      const line = d3.line<{x: number, y: number}>()
        .x(p => p.x)
        .y(p => p.y)
        .curve(d3.curveCardinal.tension(0.3)); // Smooth curves
      return line(d.history) || '';
      });

    // Draw particles with glow effect
    const circles = g.selectAll<SVGCircleElement, Particle>('.particle')
      .data(particles, d => d.id);

    circles.enter()
      .append('circle')
      .attr('class', 'particle')
      .attr('r', 4)
      .attr('fill', '#93c5fd') // blue-300
      .attr('stroke', '#dbeafe') // blue-100
      .attr('stroke-width', 1)
      .style('filter', 'drop-shadow(0 0 3px #60a5fa)')
      .merge(circles)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    setStepCount(prev => prev + 1);
  }, [stepSize]);

  // Initialize visualization
  useEffect(() => {
    if (!svgRef.current) return;

    // Initialize particles
    particlesRef.current = initializeParticles();

    // Setup SVG
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', '0 0 800 400')
       .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Add subtle grid background
    const defs = svg.append('defs');
    const pattern = defs.append('pattern')
      .attr('id', 'grid')
      .attr('width', 40)
      .attr('height', 40)
      .attr('patternUnits', 'userSpaceOnUse');
    
    pattern.append('path')
      .attr('d', 'M 40 0 L 0 0 0 40')
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', 0.4)
      .attr('opacity', 0.3);

    // Background
    svg.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', 'url(#grid)');

    // Create main group
    svg.append('g').attr('class', 'brownian-group');

  }, [initializeParticles]);

  // Handle parameter changes
  useEffect(() => {
    if (particlesRef.current.length !== numParticles) {
      particlesRef.current = initializeParticles();
    }
  }, [numParticles, initializeParticles]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const animate = () => {
      updateBrownianMotion();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, updateBrownianMotion]);

  // Reset simulation
  const resetSimulation = () => {
    setIsPlaying(false);
    setStepCount(0);
    particlesRef.current = initializeParticles();
    
    // Clear visualization
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const g = svg.select('.brownian-group');
      g.selectAll('.trail').remove();
      g.selectAll('.particle').remove();
    }
  };

  return (
    <div className="w-full bg-transparent">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-semibold text-white/90 mb-2">2D Brownian Motion</h2>
        <p className="text-sm text-white/60 font-light">
          Random walk simulation with {numParticles} particles
        </p>
      </div>

      {/* Controls */}
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 mb-4 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          {/* Number of Particles Slider */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white/80">
              Number of Particles: <span className="text-blue-300 font-semibold">{numParticles}</span>
            </label>
            <div className="relative">
              <input
                type="range"
                min="10"
                max="200"
                value={numParticles}
                onChange={(e) => setNumParticles(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400 
                  [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white 
                  [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-all
                  [&::-webkit-slider-thumb]:hover:bg-blue-300 [&::-webkit-slider-thumb]:hover:scale-110
                  [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-blue-400 [&::-moz-range-thumb]:border-2 
                  [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-xs text-white/50 mt-1">
                <span>10</span>
                <span>200</span>
              </div>
            </div>
          </div>

          {/* Step Size Slider */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white/80">
              Step Size σ: <span className="text-blue-300 font-semibold">{stepSize}</span>
            </label>
            <div className="relative">
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={stepSize}
                onChange={(e) => setStepSize(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400 
                  [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white 
                  [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-all
                  [&::-webkit-slider-thumb]:hover:bg-blue-300 [&::-webkit-slider-thumb]:hover:scale-110
                  [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-blue-400 [&::-moz-range-thumb]:border-2 
                  [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-xs text-white/50 mt-1">
                <span>0.5</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg ${
              isPlaying
                ? 'bg-red-500/80 hover:bg-red-500/90 text-white border border-red-400/50 shadow-red-500/25'
                : 'bg-green-500/80 hover:bg-green-500/90 text-white border border-green-400/50 shadow-green-500/25'
            } hover:scale-105 active:scale-95`}
          >
            <span className="flex items-center gap-2">
              {isPlaying ? (
                <>
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                  Pause
                </>
              ) : (
                <>
                  <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
                  Play
                </>
              )}
            </span>
          </button>
          
          <button
            onClick={resetSimulation}
            className="px-6 py-2.5 bg-blue-500/80 hover:bg-blue-500/90 text-white rounded-lg font-medium 
              transition-all duration-200 border border-blue-400/50 shadow-lg shadow-blue-500/25 
              hover:scale-105 active:scale-95"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </span>
          </button>
        </div>
      </div>

      {/* Animation Container */}
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
        <svg 
          ref={svgRef} 
          className="w-full h-auto bg-black/30 rounded-lg border border-white/5"
          style={{ minHeight: '300px' }}
        />
        
        {/* Stats */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
          <div className="text-sm text-white/70">
            <span className="font-medium">Steps:</span> <span className="text-blue-300">{stepCount}</span>
          </div>
          <div className="text-sm text-white/70">
            <span className="font-medium">Step Size:</span> <span className="text-blue-300">σ = {stepSize}</span>
          </div>
          <div className="text-sm text-white/70">
            <span className="font-medium">Particles:</span> <span className="text-blue-300">{numParticles}</span>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-4 bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
        <h3 className="text-sm font-medium text-white/80 mb-2">Random Walk Formula:</h3>
        <div className="font-mono text-sm bg-white/5 p-3 rounded border border-white/10 text-center">
          <span className="text-white/90">Δx = σ × cos(θ), Δy = σ × sin(θ)</span>
        </div>
        <p className="text-xs text-white/60 mt-2">
          Where θ is a random angle ∈ [0, 2π] and σ is the step size
        </p>
      </div>
    </div>
  );
};

export default BrownianMotion;