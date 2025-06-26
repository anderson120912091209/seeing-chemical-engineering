import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Mock ClickableUnderline component
const ClickableUnderline = ({ children, color, onClick }: {
  children: React.ReactNode;
  color: string;
  onClick?: () => void;
}) => (
  <span 
    className={`underline cursor-pointer text-${color}-400 hover:text-${color}-300`}
    onClick={onClick}
  >
    {children}
  </span>
);

const distributionData = [
  {
    id: 'normal',
    name: 'Normal/Gaussian Distribution',
    explanation: 'The normal distribution is a continuous probability distribution characterized by its bell-shaped curve. It\'s symmetric around the mean and is fundamental in statistics due to the Central Limit Theorem.',
    keyPoints: [
      'Bell-shaped curve symmetric around the mean',
      'Defined by mean (μ) and standard deviation (σ)',
      '68-95-99.7 rule for standard deviations',
      'Foundation for many statistical tests'
    ]
  },
  {
    id: 'binomial',
    name: 'Binomial Distribution',
    explanation: 'Models the number of successes in a fixed number of independent trials with constant probability of success. Essential for hypothesis testing and quality control.',
    keyPoints: [
      'Discrete distribution for binary outcomes',
      'Parameters: n (trials) and p (success probability)',
      'Mean = np, Variance = np(1-p)',
      'Approaches normal distribution for large n'
    ]
  },
  {
    id: 'poisson',
    name: 'Poisson/Exponential Distribution',
    explanation: 'Poisson models rare events occurring at a constant rate, while exponential models time between events. Both are crucial for queueing theory and reliability analysis.',
    keyPoints: [
      'Poisson: discrete, models count of rare events',
      'Exponential: continuous, models waiting times',
      'Parameter λ (rate) for both distributions',
      'Memoryless property for exponential'
    ]
  },
  {
    id: 'gamma-beta',
    name: 'Gamma / Beta Distribution',
    explanation: 'Gamma distribution generalizes exponential distribution and models waiting times. Beta distribution is bounded between 0 and 1, perfect for modeling proportions and probabilities.',
    keyPoints: [
      'Gamma: continuous, positive values only',
      'Beta: continuous, bounded between 0 and 1',
      'Gamma used for modeling lifetimes',
      'Beta used for Bayesian prior distributions'
    ]
  },
  {
    id: 'chi-squared',
    name: 'Chi-Squared Distribution',
    explanation: 'A special case of the gamma distribution used primarily in hypothesis testing. Essential for goodness-of-fit tests and testing independence in contingency tables.',
    keyPoints: [
      'Sum of squared standard normal variables',
      'Parameter: degrees of freedom (df)',
      'Always positive, right-skewed',
      'Used in goodness-of-fit and independence tests'
    ]
  },
  {
    id: 't-distribution',
    name: 'Student\'s t-Distribution',
    explanation: 'Similar to normal distribution but with heavier tails. Used when sample size is small or population standard deviation is unknown. Approaches normal as degrees of freedom increase.',
    keyPoints: [
      'Symmetric, bell-shaped like normal',
      'Heavier tails than normal distribution',
      'Parameter: degrees of freedom',
      'Used for small sample hypothesis tests'
    ]
  }
];

const Introduction = ({ onBetweenClick, onWithinClick, onDistributionClick }: {
  onBetweenClick?: () => void;
  onWithinClick?: () => void;
  onDistributionClick?: (distributionId: string, distributionName: string) => void;
} = {}) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleDistributionClick = (distribution: typeof distributionData[0]) => {
    // Toggle expansion
    toggleExpanded(distribution.id);
    
    // Trigger animation on right side
    if (onDistributionClick) {
      onDistributionClick(distribution.id, distribution.name);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white/90 mb-6">01. Introduction & Basics</h2>
      <div className="space-y-4 text-md text-gray-300 font-light">
        <p>
          <span className="font-medium"> Welcome to the Statistics Page of Seeing Science!</span>
          <br/>
          This page is designed for the engineers & students who already have a basic
          understanding of statistics and want to further explore advanced statistics with visualizations.
          This course assumes familiarity with basic statistical concepts and calculus. For some refresher on basic statistics, Brown University's{" "}
          <ClickableUnderline color="blue" onClick={() => onBetweenClick?.()}>
            Seeing Theory
          </ClickableUnderline>{" "}
          is a really good source of reference. 
          <br/>
          Let's get started with some distributions 
        </p>
        <p className="text-white/60">
          (Click on the expandable bullet points for explanations and animations)
        </p>
        
        <h3 className="text-xl font-semibold text-white/80 mb-2">
          Distributions
        </h3>
        
        <div className="space-y-1">
          {distributionData.map((distribution) => {
            const isExpanded = expandedItems.has(distribution.id);
            
            return (
              <div key={distribution.id} className="border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleDistributionClick(distribution)}
                  className="w-full flex items-center gap-2 p-2 text-left hover:bg-white/5 transition-colors duration-200"
                >
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3 text-white/60" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-white/60" />
                    )}
                  </div>
                  <span className="text-sm text-white/70 hover:text-white/90 transition-colors duration-200">
                    {distribution.name}
                  </span>
                </button>
                
                {isExpanded && (
                  <div className="px-3 pb-3 ml-5 space-y-2 animate-in slide-in-from-top duration-200">
                    <p className="text-white/60 text-xs leading-relaxed">
                      {distribution.explanation}
                    </p>
                    
                    <div className="space-y-1">
                      <h4 className="text-white/70 text-xs font-medium">Key Points:</h4>
                      <ul className="space-y-0.5">
                        {distribution.keyPoints.map((point, index) => (
                          <li key={index} className="text-white/50 text-xs flex items-start gap-1.5">
                            <span className="text-white/30 mt-0.5">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Introduction;