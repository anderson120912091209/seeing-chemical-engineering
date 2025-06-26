"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import SVGLaTeX from '../../ui/svg-latex';

interface Student {
  id: number;
  method: 'A' | 'B' | 'C';
  score: number;
}

interface VarianceCalculationProps {
  students: Student[];
  dimensions: { width: number; height: number };
  groupStats: Record<string, { mean: number; variance: number; count: number }>;
  fStatistic: number;
  isSignificant: boolean;
  currentStep: number; // 0-5 for the 6 steps
}

const METHOD_CONFIG = {
  A: { base: 75, variance: 8, color: '#fca5a5', label: 'Traditional' },
  B: { base: 82, variance: 6, color: '#6ee7b7', label: 'Tech-Enhanced' },
  C: { base: 78, variance: 10, color: '#81a8e7', label: 'Collaborative' }
};

const VarianceCalculationAnimation: React.FC<VarianceCalculationProps> = ({
  students,
  dimensions,
  groupStats,
  fStatistic,
  isSignificant,
  currentStep
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }
    
    if (students.length === 0) {
      return;
    }

    const { width, height } = dimensions;
    // Match exact padding from teaching ANOVA animation
    const padding = { top: 80, bottom: 120, left: 60, right: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const svg = d3.select(svgRef.current);
    
    // Initialize or get the main group
    let mainGroup = svg.select<SVGGElement>(".main-group");
    if (mainGroup.empty()) {
      mainGroup = svg.append("g")
        .attr("class", "main-group");
    }

    // Calculate statistics
    const grandMean = students.reduce((sum, s) => sum + s.score, 0) / students.length;
    
    const ssWithin = d3.sum(students, d => {
      const groupMean = groupStats[d.method]?.mean || d.score;
      return Math.pow(d.score - groupMean, 2);
    });
    
    const ssBetween = d3.sum(Object.entries(groupStats), ([group, stats]) => 
      stats.count * Math.pow(stats.mean - grandMean, 2)
    );
    
    const ssTotal = ssWithin + ssBetween;

    // Match exact student positioning from teaching ANOVA animation
    const getStudentPosition = (student: Student, index: number) => {
      const methodIndex = Object.keys(METHOD_CONFIG).indexOf(student.method);
      const groupWidth = chartWidth / 3;
      const studentX = padding.left + (methodIndex * groupWidth) + (groupWidth / 12) * (index % 12);
      const studentY = padding.top + chartHeight - (student.score / 100) * chartHeight;
      return { x: studentX, y: studentY };
    };

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([chartHeight, 0]);

    // Initial setup - show students and basic structure (always visible)
    if (!isInitialized) {
      // Clear any existing elements
      mainGroup.selectAll("*").remove();
      
      // Add method labels - match exact positioning and styling from teaching ANOVA
      Object.entries(METHOD_CONFIG).forEach(([method, config], i) => {
        const groupX = padding.left + (chartWidth / 3) * (i + 0.5);
        
        mainGroup.append("text")
          .attr("class", "base-element method-label")
          .attr("x", groupX)
          .attr("y", padding.top - 30)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .style("font-size", "18px")
          .style("font-weight", "600")
          .style("opacity", 0.8)
          .text(`Method ${method}`);

        mainGroup.append("text")
          .attr("class", "base-element method-subtitle")
          .attr("x", groupX)
          .attr("y", padding.top - 10)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .style("font-size", "14px")
          .style("opacity", 0.5)
          .text(`(${config.label})`);
      });

      // Add score axis - match exact grid lines and styling from teaching ANOVA
      [0, 50, 100].forEach(score => {
        const y = padding.top + chartHeight - (score / 100) * chartHeight;
        
        mainGroup.append("line")
          .attr("class", "base-element axis-line")
          .attr("x1", padding.left - 10)
          .attr("y1", y)
          .attr("x2", width - padding.right)
          .attr("y2", y)
          .attr("stroke", "white")
          .attr("stroke-width", 1)
          .attr("opacity", 0.1);

        mainGroup.append("text")
          .attr("class", "base-element axis-label")
          .attr("x", padding.left - 20)
          .attr("y", y + 5)
          .attr("text-anchor", "end")
          .attr("fill", "white")
          .style("font-size", "14px")
          .style("opacity", 0.5)
          .text(score.toString());
      });

      // Add student dots - match exact styling from teaching ANOVA
      students.forEach((student, i) => {
        const pos = getStudentPosition(student, i);
        
        mainGroup.append("circle")
          .attr("class", "base-element student-dot")
          .attr("cx", pos.x)
          .attr("cy", pos.y)
          .attr("r", 5)
          .attr("fill", METHOD_CONFIG[student.method].color)
          .attr("stroke", "black")
          .attr("stroke-width", 1)
          .attr("opacity", 0.9);
      });

      // Add statistical annotations - inherit from teaching ANOVA 'analysis' stage
      Object.entries(groupStats).forEach(([method, stats], i) => {
        const groupX = padding.left + (chartWidth / 3) * (i + 0.5);
        const meanY = padding.top + chartHeight - (stats.mean / 100) * chartHeight;
        const sd = Math.sqrt(stats.variance);
        const sdHeight = (sd / 100) * chartHeight;

        // SD Range rectangle - match exact styling
        mainGroup.append("rect")
          .attr("class", "base-element sd-range")
          .attr("x", groupX - (chartWidth / 3) * 0.4)
          .attr("y", meanY - sdHeight)
          .attr("width", (chartWidth / 3) * 0.8)
          .attr("height", sdHeight * 2)
          .attr("fill", METHOD_CONFIG[method as keyof typeof METHOD_CONFIG].color)
          .attr("opacity", 0.1);

        // SD boundary lines - match exact styling
        mainGroup.append("line")
          .attr("class", "base-element sd-line-top")
          .attr("x1", groupX - (chartWidth / 3) * 0.4)
          .attr("y1", meanY - sdHeight)
          .attr("x2", groupX + (chartWidth / 3) * 0.4)
          .attr("y2", meanY - sdHeight)
          .attr("stroke", "white")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "2,2")
          .attr("opacity", 0.2);

        mainGroup.append("line")
          .attr("class", "base-element sd-line-bottom")
          .attr("x1", groupX - (chartWidth / 3) * 0.4)
          .attr("y1", meanY + sdHeight)
          .attr("x2", groupX + (chartWidth / 3) * 0.4)
          .attr("y2", meanY + sdHeight)
          .attr("stroke", "white")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "2,2")
          .attr("opacity", 0.2);

        // Mean line - match exact styling
        mainGroup.append("line")
          .attr("class", "base-element group-mean-base")
          .attr("x1", groupX - (chartWidth / 3) * 0.4)
          .attr("y1", meanY)
          .attr("x2", groupX + (chartWidth / 3) * 0.4)
          .attr("y2", meanY)
          .attr("stroke", METHOD_CONFIG[method as keyof typeof METHOD_CONFIG].color)
          .attr("stroke-width", 2);

        // Mean value label - match exact styling
        mainGroup.append("text")
          .attr("class", "base-element group-mean-label-base")
          .attr("x", groupX + (chartWidth / 3) * 0.4 + 10)
          .attr("y", meanY + 4)
          .attr("fill", "white")
          .style("font-size", "12px")
          .text(`μ = ${stats.mean.toFixed(1)}`);
      });

      setIsInitialized(true);
    }

    // Clear step-specific elements
    mainGroup.selectAll(".step-element").remove();

    // Step 0: Calculate and draw group means
    if (currentStep >= 0) {
      // Highlight group mean lines (they're already drawn as base elements)
      Object.entries(groupStats).forEach(([method, stats], i) => {
        const groupX = padding.left + (chartWidth / 3) * (i + 0.5);
        const meanY = padding.top + chartHeight - (stats.mean / 100) * chartHeight;
        
        // Add animated highlight to existing mean line
        mainGroup.append("line")
          .attr("class", "step-element group-mean-highlight")
          .attr("x1", groupX - (chartWidth / 3) * 0.4)
          .attr("y1", meanY)
          .attr("x2", groupX + (chartWidth / 3) * 0.4)
          .attr("y2", meanY)
          .attr("stroke", METHOD_CONFIG[method as keyof typeof METHOD_CONFIG].color)
          .attr("stroke-width", 4)
          .attr("opacity", 0.8);
      });
    }

    // Step 1: Calculate and show grand mean
    if (currentStep >= 1) {
      // Grand mean line
      const grandMeanY = padding.top + chartHeight - (grandMean / 100) * chartHeight;
      mainGroup.append("line")
        .attr("class", "step-element grand-mean-line")
        .attr("x1", padding.left)
        .attr("y1", grandMeanY)
        .attr("x2", width - padding.right)
        .attr("y2", grandMeanY)
        .attr("stroke", "#34d399")
        .attr("stroke-width", 4)
        .attr("stroke-dasharray", "10,5")
        .attr("opacity", 0.9);

      // Grand mean label
      mainGroup.append("text")
        .attr("class", "step-element grand-mean-label")
        .attr("x", width - padding.right + 10)
        .attr("y", grandMeanY)
        .attr("dy", "0.35em")
        .attr("fill", "#34d399")
        .style("font-size", "16px")
        .style("font-weight", "600")
        .text(`Grand Mean = ${grandMean.toFixed(1)}`)
        .attr("opacity", 1);
    }

    // Step 2: Within-group sum of squares
    if (currentStep >= 2) {
      // Show within-group variance lines
      students.forEach((student, i) => {
        const pos = getStudentPosition(student, i);
        const groupMean = groupStats[student.method]?.mean || student.score;
        const groupMeanY = padding.top + chartHeight - (groupMean / 100) * chartHeight;
        
        mainGroup.append("line")
          .attr("class", "step-element within-variance")
          .attr("x1", pos.x)
          .attr("y1", pos.y)
          .attr("x2", pos.x)
          .attr("y2", groupMeanY)
          .attr("stroke", METHOD_CONFIG[student.method].color)
          .attr("stroke-width", 2)
          .attr("opacity", 0.6);
      });


    }

    // Step 3: Between-group sum of squares
    if (currentStep >= 3) {
      // Show between-group variance lines
      const grandMeanY = padding.top + chartHeight - (grandMean / 100) * chartHeight;
      Object.entries(groupStats).forEach(([method, stats], i) => {
        const groupX = padding.left + (chartWidth / 3) * (i + 0.5);
        const groupMeanY = padding.top + chartHeight - (stats.mean / 100) * chartHeight;
        
        mainGroup.append("line")
          .attr("class", "step-element between-variance")
          .attr("x1", groupX)
          .attr("y1", groupMeanY)
          .attr("x2", groupX)
          .attr("y2", grandMeanY)
          .attr("stroke", "#ff6b6b")
          .attr("stroke-width", 4)
          .attr("opacity", 0.8);
      });


    }

    // Step 5: F-statistic calculation and significance result
    if (currentStep >= 5) {
      // Significance result
      const resultColor = isSignificant ? "#10b981" : "#ef4444";
      const resultText = isSignificant ? "Significant Difference!" : "No Significant Difference";
      
      mainGroup.append("text")
        .attr("class", "step-element result")
        .attr("x", width / 2)
        .attr("y", height - 15)
        .attr("text-anchor", "middle")
        .attr("fill", resultColor)
        .style("font-size", "16px")
        .style("font-weight", "600")
        .text(resultText)
        .attr("opacity", 1);
    }

  }, [currentStep, students, dimensions, groupStats, fStatistic, isSignificant, isInitialized]);

  // Generate LaTeX formulas based on current step
  const getCurrentFormulas = () => {
    const { width, height } = dimensions;
    const grandMean = students.reduce((sum, s) => sum + s.score, 0) / students.length;
    
    const ssWithin = d3.sum(students, d => {
      const groupMean = groupStats[d.method]?.mean || d.score;
      return Math.pow(d.score - groupMean, 2);
    });
    
    const ssBetween = d3.sum(Object.entries(groupStats), ([group, stats]) => 
      stats.count * Math.pow(stats.mean - grandMean, 2)
    );
    
    const ssTotal = ssWithin + ssBetween;
    const dfBetween = Object.keys(groupStats).length - 1;
    const dfWithin = students.length - Object.keys(groupStats).length;
    const msBetween = ssBetween / dfBetween;
    const msWithin = ssWithin / dfWithin;

    switch (currentStep) {
      case 2: // Within-group sum of squares
        return [{
          id: 'ss-within',
          math: `SS_{\\text{Within}} = \\sum(x - \\bar{x}_{\\text{group}})^2 = ${ssWithin.toFixed(1)}`,
          x: width / 2,
          y: height - 60,
          fontSize: 16,
          color: '#6ee7b7',
          textAnchor: 'middle' as const
        }];

      case 3: // Between-group sum of squares
        return [{
          id: 'ss-between',
          math: `SS_{\\text{Between}} = \\sum n(\\bar{x}_{\\text{group}} - \\bar{x}_{\\text{grand}})^2 = ${ssBetween.toFixed(1)}`,
          x: width / 2,
          y: height - 60,
          fontSize: 16,
          color: '#ff6b6b',
          textAnchor: 'middle' as const
        }];

      case 4: // Total sum of squares
        return [
          {
            id: 'ss-total-equation',
            math: `SS_{\\text{Total}} = SS_{\\text{Within}} + SS_{\\text{Between}}`,
            x: width / 2,
            y: height - 80,
            fontSize: 16,
            color: '#ffffff',
            textAnchor: 'middle' as const
          },
          {
            id: 'ss-total-calculation',
            math: `SS_{\\text{Total}} = ${ssWithin.toFixed(1)} + ${ssBetween.toFixed(1)} = ${ssTotal.toFixed(1)}`,
            x: width / 2,
            y: height - 55,
            fontSize: 14,
            color: '#a78bfa',
            textAnchor: 'middle' as const
          }
        ];

      case 5: // F-statistic calculation
        return [
          {
            id: 'ms-between',
            math: `MS_{\\text{Between}} = \\frac{${ssBetween.toFixed(1)}}{${dfBetween}} = ${msBetween.toFixed(2)}`,
            x: width / 2,
            y: height - 100,
            fontSize: 12,
            color: '#d1d5db',
            textAnchor: 'middle' as const
          },
          {
            id: 'ms-within',
            math: `MS_{\\text{Within}} = \\frac{${ssWithin.toFixed(1)}}{${dfWithin}} = ${msWithin.toFixed(2)}`,
            x: width / 2,
            y: height - 80,
            fontSize: 12,
            color: '#d1d5db',
            textAnchor: 'middle' as const
          },
          {
            id: 'f-statistic',
            math: `F = \\frac{MS_{\\text{Between}}}{MS_{\\text{Within}}} = ${fStatistic.toFixed(3)}`,
            x: width / 2,
            y: height - 55,
            fontSize: 16,
            color: '#fbbf24',
            textAnchor: 'middle' as const
          }
        ];

      default:
        return [];
    }
  };

  const currentFormulas = getCurrentFormulas();

  return (
    <div className="w-full h-full relative">
      <svg 
        ref={svgRef} 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-full"
      >
        {/* Render LaTeX formulas for current step only */}
        {currentFormulas.map(formula => (
          <SVGLaTeX
            key={formula.id}
            math={formula.math}
            x={formula.x}
            y={formula.y}
            fontSize={formula.fontSize}
            color={formula.color}
            textAnchor={formula.textAnchor}
          />
        ))}
      </svg>
    </div>
  );
};

export default VarianceCalculationAnimation; 