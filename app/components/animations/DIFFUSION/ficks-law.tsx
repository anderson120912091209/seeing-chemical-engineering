'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'high' | 'low';
  opacity: number;
}

const FicksLawAnimation: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEquation, setShowEquation] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 400;
    const containerWidth = width - 80;
    const containerHeight = height - 100;
    const containerX = 40;
    const containerY = 50;

    const svg = d3.select(svgRef.current);
    svg.attr("viewBox", `0 0 ${width} ${height}`)
       .attr("preserveAspectRatio", "xMidYMid meet");

    // Clear previous content
    svg.selectAll("*").remove();

    // Create main group
    const g = svg.append("g");

    // Draw container (cylinder cross-section)
    g.append("rect")
      .attr("x", containerX)
      .attr("y", containerY)
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("opacity", 0.6);

    // Draw section dividers
    const sectionWidth = containerWidth / 3;
    
    // Vertical divider lines (dashed)
    [1, 2].forEach(i => {
      const x = containerX + sectionWidth * i;
      g.append("line")
        .attr("x1", x)
        .attr("y1", containerY)
        .attr("x2", x)
        .attr("y2", containerY + containerHeight)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "5,5")
        .attr("opacity", 0.4);
    });

    // Section labels with background rectangles
    const labels = [
      { text: "Section 1", subtext: "High Concentration C₁", x: containerX + sectionWidth * 0.5 },
      { text: "Section 2", subtext: "Medium Concentration", x: containerX + sectionWidth * 1.5 },
      { text: "Section 3", subtext: "Low Concentration C₂", x: containerX + sectionWidth * 2.5 }
    ];

    labels.forEach(label => {
      // Background rectangle for readability
      const textBg = g.append("rect")
        .attr("x", label.x - 60)
        .attr("y", containerY - 35)
        .attr("width", 120)
        .attr("height", 30)
        .attr("fill", "rgba(0,0,0,0.3)")
        .attr("rx", 4);

      g.append("text")
        .attr("x", label.x)
        .attr("y", containerY - 20)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .style("font-size", "14px")
        .style("font-weight", "600")
        .style("opacity", 0.9)
        .text(label.text);

      g.append("text")
        .attr("x", label.x)
        .attr("y", containerY - 6)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .style("font-size", "11px")
        .style("opacity", 0.6)
        .text(label.subtext);
    });

    // Concentration gradient arrow
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "concentrationGradient")
      .attr("x1", "0%")
      .attr("x2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#fbbf24") // amber-400
      .attr("stop-opacity", 0.8);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#f59e0b") // amber-500
      .attr("stop-opacity", 0.3);

    // Gradient arrow below container
    const arrowY = containerY + containerHeight + 30;
    g.append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("markerWidth", 10)
      .attr("markerHeight", 7)
      .attr("refX", 9)
      .attr("refY", 3.5)
      .attr("orient", "auto")
      .append("polygon")
      .attr("points", "0 0, 10 3.5, 0 7")
      .attr("fill", "#34d399"); // emerald-400

    g.append("line")
      .attr("x1", containerX + 20)
      .attr("y1", arrowY)
      .attr("x2", containerX + containerWidth - 20)
      .attr("y2", arrowY)
      .attr("stroke", "#34d399")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)")
      .attr("opacity", 0.8);

    g.append("text")
      .attr("x", containerX + containerWidth / 2)
      .attr("y", arrowY + 20)
      .attr("text-anchor", "middle")
      .attr("fill", "#34d399")
      .style("font-size", "14px")
      .style("font-weight", "500")
      .text("Direction of Net Diffusion");

    // Initialize particles
    const initializeParticles = () => {
      const particles: Particle[] = [];
      let id = 0;

      // High concentration particles (left section)
      for (let i = 0; i < 60; i++) {
        particles.push({
          id: id++, 
          x: containerX + Math.random() * sectionWidth,
          y: containerY + 10 + Math.random() * (containerHeight - 20),
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          type: 'high',
          opacity: 0.8
        });
      }

      // Medium concentration particles (middle section)
      for (let i = 0; i < 30; i++) {
        particles.push({
          id: id++,
          x: containerX + sectionWidth + Math.random() * sectionWidth,
          y: containerY + 10 + Math.random() * (containerHeight - 20),
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          type: 'high',
          opacity: 0.6
        });
      }

      // Low concentration particles (right section)
      for (let i = 0; i < 15; i++) {
        particles.push({
          id: id++,
          x: containerX + sectionWidth * 2 + Math.random() * sectionWidth,
          y: containerY + 10 + Math.random() * (containerHeight - 20),
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          type: 'low',
          opacity: 0.4
        });
      }

      return particles;
    };

    particlesRef.current = initializeParticles();

    // Create particle circles
    const particleGroup = g.append("g").attr("class", "particles");

    const updateParticles = () => {
      const particles = particlesRef.current;

      // Update particle positions and apply diffusion
      particles.forEach(particle => {
        // Brownian motion
        particle.vx += (Math.random() - 0.5) * 0.01;
        particle.vy += (Math.random() - 0.5) * 0.01;

        // Diffusion force (concentration gradient effect)
        const currentSection = Math.floor((particle.x - containerX) / sectionWidth);
        const diffusionForce = 0.002; // Subtle but consistent force

        if (currentSection === 0) {
          // High concentration - bias towards right
          particle.vx += diffusionForce;
        } else if (currentSection === 2) {
          // Low concentration - slight bias towards left
          particle.vx -= diffusionForce * 0.3;
        }

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary conditions
        if (particle.x <= containerX) {
          particle.x = containerX;
          particle.vx = Math.abs(particle.vx);
        }
        if (particle.x >= containerX + containerWidth) {
          particle.x = containerX + containerWidth;
          particle.vx = -Math.abs(particle.vx);
        }
        if (particle.y <= containerY + 5) {
          particle.y = containerY + 5;
          particle.vy = Math.abs(particle.vy);
        }
        if (particle.y >= containerY + containerHeight - 5) {
          particle.y = containerY + containerHeight - 5;
          particle.vy = -Math.abs(particle.vy);
        }

        // Update opacity based on local density simulation
        const section = Math.floor((particle.x - containerX) / sectionWidth);
        if (section === 0) {
          particle.opacity = Math.max(0.3, particle.opacity - 0.001); // Gradually decrease in high conc area
        } else if (section === 2) {
          particle.opacity = Math.min(0.8, particle.opacity + 0.001); // Gradually increase in low conc area
        }
      });

             // Update visualization
       const circles = particleGroup.selectAll<SVGCircleElement, Particle>("circle")
         .data(particles, d => d.id);

       const circlesEnter = circles.enter()
         .append("circle")
         .attr("r", 3)
         .attr("fill", d => d.type === 'high' ? "#fbbf24" : "#f59e0b") // amber colors
         .attr("stroke", "rgba(255,255,255,0.2)")
         .attr("stroke-width", 0.5);

       circlesEnter.merge(circles)
         .attr("cx", d => d.x)
         .attr("cy", d => d.y)
         .attr("opacity", d => d.opacity);

       circles.exit().remove();
    };

    // Animation loop
    const animate = () => {
      if (isPlaying) {
        updateParticles();
        setCurrentTime(prev => prev + 1);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const resetAnimation = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    // Re-initialize particles by triggering useEffect
    setTimeout(() => {
      const particles = [];
      let id = 0;
      
      // Reset to initial distribution
      for (let i = 0; i < 60; i++) {
        particles.push({
          id: id++,
          x: 40 + Math.random() * ((800-80)/3),
          y: 60 + Math.random() * 280,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          type: 'high' as const,
          opacity: 0.8
        });
      }
      
      for (let i = 0; i < 30; i++) {
        particles.push({
          id: id++,
          x: 40 + ((800-80)/3) + Math.random() * ((800-80)/3),
          y: 60 + Math.random() * 280,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          type: 'high' as const,
          opacity: 0.6
        });
      }
      
      for (let i = 0; i < 15; i++) {
        particles.push({
          id: id++,
          x: 40 + ((800-80)/3) * 2 + Math.random() * ((800-80)/3),
          y: 60 + Math.random() * 280,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          type: 'low' as const,
          opacity: 0.4
        });
      }
      
      particlesRef.current = particles;
    }, 100);
  };

  return (
    <div className="w-full h-full bg-transparent relative">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-white/90 mb-2">Fick's Law of Diffusion</h2>
        <p className="text-sm text-white/60 font-light">
          Molecular diffusion from high to low concentration
        </p>
      </div>

      {/* Equation Panel */}
      {showEquation && (
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 mb-4 border border-white/10">
          <h3 className="text-lg font-semibold text-white/80 mb-2">Fick's First Law:</h3>
          <div className="text-xl font-mono bg-white/5 p-3 rounded border border-white/10 text-center">
            <span className="text-white/90">J = -D(∂C/∂x)</span>
          </div>
          <div className="text-sm text-white/60 mt-3 space-y-1">
            <p><strong>J</strong> = Diffusion flux (mol/m²·s)</p>
            <p><strong>D</strong> = Diffusion coefficient (m²/s)</p>
            <p><strong>∂C/∂x</strong> = Concentration gradient (mol/m⁴)</p>
          </div>
        </div>
      )}

      {/* Animation Container */}
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
        <svg ref={svgRef} className="w-full h-auto"></svg>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
            isPlaying 
              ? 'bg-red-500/80 hover:bg-red-500/90 text-white border border-red-400/50' 
              : 'bg-green-500/80 hover:bg-green-500/90 text-white border border-green-400/50'
          }`}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <button
          onClick={resetAnimation}
          className="px-6 py-2 bg-blue-500/80 hover:bg-blue-500/90 text-white rounded-lg font-medium transition-all duration-200 border border-blue-400/50"
        >
          Reset
        </button>
        
        <button
          onClick={() => setShowEquation(!showEquation)}
          className="px-6 py-2 bg-purple-500/80 hover:bg-purple-500/90 text-white rounded-lg font-medium transition-all duration-200 border border-purple-400/50"
        >
          {showEquation ? 'Hide' : 'Show'} Equation
        </button>
      </div>

      {/* Legend */}
      <div className="mt-6 text-center">
        <h3 className="text-lg font-medium text-white/80 mb-3">Particle Legend:</h3>
        <div className="flex justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-400 rounded-full opacity-80 border border-white/20"></div>
            <span className="text-white/70 text-sm">High Concentration Particles</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full opacity-60 border border-white/20"></div>
            <span className="text-white/70 text-sm">Lower Concentration Particles</span>
          </div>
        </div>
        <p className="text-white/50 text-xs mt-3 font-light">
          Time: {Math.floor(currentTime / 60)}s • Particles naturally diffuse from high → low concentration
        </p>
      </div>
    </div>
  );
};

export default FicksLawAnimation;
