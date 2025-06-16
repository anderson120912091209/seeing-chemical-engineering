"use client";

import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface SVGLaTeXProps {
  math: string;
  x: number;
  y: number;
  fontSize?: number;
  color?: string;
  textAnchor?: 'start' | 'middle' | 'end';
  className?: string;
}

const SVGLaTeX: React.FC<SVGLaTeXProps> = ({
  math,
  x,
  y,
  fontSize = 14,
  color = 'white',
  textAnchor = 'middle',
  className = ''
}) => {
  const foreignObjectRef = useRef<SVGForeignObjectElement>(null);

  useEffect(() => {
    if (foreignObjectRef.current) {
      try {
        const html = katex.renderToString(math, {
          throwOnError: false,
          displayMode: false,
          output: 'html'
        });
        
        const div = document.createElement('div');
        div.innerHTML = html;
        div.style.color = color;
        div.style.fontSize = `${fontSize}px`;
        div.style.fontFamily = 'KaTeX_Main, Times, serif';
        div.style.textAlign = textAnchor === 'middle' ? 'center' : textAnchor === 'end' ? 'right' : 'left';
        
        // Clear previous content and add new
        foreignObjectRef.current.innerHTML = '';
        foreignObjectRef.current.appendChild(div);
      } catch (error) {
        console.error('LaTeX rendering error:', error);
        if (foreignObjectRef.current) {
          foreignObjectRef.current.innerHTML = `<div style="color: red; font-size: ${fontSize}px;">[LaTeX Error]</div>`;
        }
      }
    }
  }, [math, color, fontSize, textAnchor]);

  // Calculate width and height based on content
  const estimatedWidth = math.length * fontSize * 0.6;
  const estimatedHeight = fontSize * 1.2;
  
  // Adjust x position based on text anchor
  let adjustedX = x;
  if (textAnchor === 'middle') {
    adjustedX = x - estimatedWidth / 2;
  } else if (textAnchor === 'end') {
    adjustedX = x - estimatedWidth;
  }

  return (
    <foreignObject
      ref={foreignObjectRef}
      x={adjustedX}
      y={y - estimatedHeight / 2}
      width={estimatedWidth}
      height={estimatedHeight}
      className={className}
    />
  );
};

export default SVGLaTeX; 