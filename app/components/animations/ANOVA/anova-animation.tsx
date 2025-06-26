"use client";

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Define the structure of our data points
interface DataPoint {
  group: string;
  value: number;
}

const AnovaAnimation = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // --- Use a FIXED aspect ratio for drawing ---
    const width = 800;
    const height = 500;
    
    const svg = d3.select(svgRef.current);
    
    // Set viewBox and preserveAspectRatio for responsive scaling
    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Clear previous renders before drawing
    svg.selectAll("*").remove();
      
    // Create a group for chart elements and apply margins
    const g = svg.append("g")
      .attr("transform", `translate(${40},${40})`);

    // Data that matches the distribution in the image
    const data: DataPoint[] = [
        // Group A (blue) - middle range values
        { group: 'A', value: 7.2 }, { group: 'A', value: 6.8 }, { group: 'A', value: 7.5 }, { group: 'A', value: 6.5 }, 
        { group: 'A', value: 7.8 }, { group: 'A', value: 6.2 }, { group: 'A', value: 7.0 }, { group: 'A', value: 6.9 },
        
        // Group B (orange) - lower range values  
        { group: 'B', value: 3.5 }, { group: 'B', value: 3.0 }, { group: 'B', value: 3.8 }, { group: 'B', value: 2.8 },
        { group: 'B', value: 4.0 }, { group: 'B', value: 2.5 }, { group: 'B', value: 3.2 }, { group: 'B', value: 2.2 },
        
        // Group C (pink) - higher range values
        { group: 'C', value: 9.2 }, { group: 'C', value: 8.8 }, { group: 'C', value: 9.5 }, { group: 'C', value: 8.5 },
        { group: 'C', value: 9.8 }, { group: 'C', value: 8.2 }, { group: 'C', value: 9.0 }, { group: 'C', value: 8.9 },
    ];

    const margin = { top: 40, right: 200, bottom: 80, left: 80 };
    
    // Add x positions for left-to-right scatter
    const dataWithX = data.map((d, i) => ({
        ...d,
        x: (i / (data.length - 1)) * (width - margin.left - margin.right - 40) + 20
    }));

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, width - margin.left - margin.right])
      .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, 11])
      .range([height - margin.top - margin.bottom, 0]);

    // Lighter, more aesthetic colors
    const pointColors = {
      'A': '#93c5fd', // blue-300 (lighter blue)
      'B': '#fdba74', // orange-300 (lighter orange)
      'C': '#f9a8d4'  // pink-300 (lighter pink)
    };

    const meanLineColors = {
      'A': '#60a5fa', // blue-400
      'B': '#fb923c', // orange-400
      'C': '#f472b6'  // pink-400
    };

    // Calculate means
    const means = d3.rollup(data, v => d3.mean(v, d => d.value), d => d.group);
    const grandMean = d3.mean(data, d => d.value)!;

    // X-axis
    g.append("line")
        .attr("x1", 0)
        .attr("y1", height - margin.top - margin.bottom)
        .attr("x2", width - margin.left - margin.right)
        .attr("y2", height - margin.top - margin.bottom)
        .attr("stroke", "#d1d5db")
        .attr("stroke-width", 2);
    
    // X-axis arrow
    g.append("path")
        .attr("d", d3.symbol().type(d3.symbolTriangle).size(80))
        .attr("transform", `translate(${width - margin.left - margin.right + 5}, ${height - margin.top - margin.bottom}) rotate(90)`)
        .attr("fill", "#d1d5db");

    // Y-axis
    g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height - margin.top - margin.bottom)
        .attr("stroke", "#d1d5db")
        .attr("stroke-width", 2);
    
    // Y-axis arrow
    g.append("path")
        .attr("d", d3.symbol().type(d3.symbolTriangle).size(80))
        .attr("transform", `translate(0, -5)`)
        .attr("fill", "#d1d5db");

    // Y-axis labels
    const yTicks = [0, 2, 4, 6, 8, 10];
    yTicks.forEach(tick => {
      g.append("text")
        .attr("x", -15)
        .attr("y", yScale(tick))
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("fill", "#d1d5db")
        .style("font-size", "12px")
        .style("font-family", "Aptos")
        .text(tick);
      
      // Tick marks
      g.append("line")
        .attr("x1", -5)
        .attr("x2", 0)
        .attr("y1", yScale(tick))
        .attr("y2", yScale(tick))
        .attr("stroke", "#d1d5db")
        .attr("stroke-width", 1);
    });

    // X-axis label
    g.append("text")
      .attr("x", (width - margin.left - margin.right) / 2)
      .attr("y", height - margin.top - margin.bottom + 40)
      .attr("text-anchor", "middle")
      .attr("fill", "#d1d5db")
      .style("font-size", "16px")
      .style("font-weight", "lighter")
      .style("font-family", "Aptos")
      .text("Data Points");

    // Y-axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -(height - margin.top - margin.bottom) / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "#d1d5db")
      .style("font-size", "16px")
      .style("font-weight", "lighter")
      .style("font-family", "Aptos")
      .text("Values");

    // Animate data points appearing one by one
    const circles = g.selectAll("circle")
      .data(dataWithX)
      .enter().append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => yScale(d.value))
      .attr("r", 0)
      .attr("fill", d => pointColors[d.group as keyof typeof pointColors])
      .style("opacity", 0.9);

    // Animate circles appearing
    circles.transition()
      .duration(300)
      .delay((d, i) => i * 150)
      .attr("r", 5);

    const pointsAnimationDuration = dataWithX.length * 150 + 300;

    // Animate group mean lines
    const groupMeansData = Array.from(means.entries())
      .map(([group, mean]) => ({ group, mean: mean! }))
      .sort((a, b) => b.mean - a.mean); // Sort by mean value descending

    groupMeansData.forEach((d, i) => {
      // Mean line
      g.append("line")
        .attr("x1", 0)
        .attr("y1", yScale(d.mean))
        .attr("y2", yScale(d.mean))
        .attr("stroke", meanLineColors[d.group as keyof typeof meanLineColors])
        .attr("stroke-width", 3)
        .attr("x2", 0)
        .transition()
        .duration(600)
        .delay(pointsAnimationDuration + i * 400)
        .attr("x2", width - margin.left - margin.right);

      // Mean line label
      g.append("text")
        .attr("x", width - margin.left - margin.right + 15)
        .attr("y", yScale(d.mean))
        .attr("dy", "0.35em")
        .attr("fill", "#e5e7eb")
        .style("font-size", "14px")
        .style("font-weight", "lighter")
        .style("font-family", "Aptos")
        .text(`Group ${d.group} Mean`)
        .attr("opacity", 0)
        .transition()
        .duration(600)
        .delay(pointsAnimationDuration + i * 400)
        .attr("opacity", 1);
    });

    const groupMeansAnimationDuration = groupMeansData.length * 400 + 600;

    // Animate grand mean line
    g.append("line")
      .attr("x1", 0)
      .attr("y1", yScale(grandMean))
      .attr("y2", yScale(grandMean))
      .attr("stroke", "#34d399") // emerald-400 (lighter green)
      .attr("stroke-width", 3)
      .attr("x2", 0)
      .transition()
      .duration(800)
      .delay(pointsAnimationDuration + groupMeansAnimationDuration)
      .attr("x2", width - margin.left - margin.right);

    // Grand mean label
    g.append("text")
      .attr("x", width - margin.left - margin.right + 15)
      .attr("y", yScale(grandMean))
      .attr("dy", "0.35em")
      .attr("fill", "#e5e7eb")
      .style("font-size", "14px")
      .style("font-weight", "lighter")
      .style("font-family", "Aptos")
      .text("Total Grand Mean") 
      .attr("opacity", 0)
      .transition()
      .duration(800)
      .delay(pointsAnimationDuration + groupMeansAnimationDuration)
      .attr("opacity", 1);

  }, []);

  return (
    // The container div defines the area the SVG will fit into
    <div className="w-full h-full">
      {/* The SVG will scale to fit this div while maintaining its 800x500 aspect ratio */}
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default AnovaAnimation; 