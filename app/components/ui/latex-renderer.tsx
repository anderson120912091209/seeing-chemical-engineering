"use client";

import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface LaTeXRendererProps {
  math: string;
  inline?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const LaTeXRenderer: React.FC<LaTeXRendererProps> = ({ 
  math, 
  inline = true, 
  className = "",
  style = {}
}) => {
  try {
    if (inline) {
      return (
        <span className={className} style={style}>
          <InlineMath math={math} />
        </span>
      );
    } else {
      return (
        <div className={className} style={style}>
          <BlockMath math={math} />
        </div>
      );
    }
  } catch (error) {
    console.error('LaTeX rendering error:', error);
    return (
      <span className={`text-red-500 ${className}`} style={style}>
        [LaTeX Error: {math}]
      </span>
    );
  }
};

export default LaTeXRenderer; 