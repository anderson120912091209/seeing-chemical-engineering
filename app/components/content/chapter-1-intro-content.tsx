import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useTheme } from '@/app/contexts/theme-context';

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
    name: 'Normal Distribution',
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
    name: 'Poisson Distribution',
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
    name: 't-Distribution',
    explanation: 'Similar to normal distribution but with heavier tails. Used when sample size is small or population standard deviation is unknown. Approaches normal as degrees of freedom increase.',
    keyPoints: [
      'Symmetric, bell-shaped like normal',
      'Heavier tails than normal distribution',
      'Parameter: degrees of freedom',
      'Used for small sample hypothesis tests'
    ]
  }
];

const Introduction = ({ onBetweenClick, onWithinClick, onDistributionClick, activeDistribution }: {
  onBetweenClick?: () => void;
  onWithinClick?: () => void;
  onDistributionClick?: (distributionId: string, distributionName: string) => void;
  activeDistribution?: string | null;
} = {}) => {
  const { theme } = useTheme();
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Clean, minimal theme colors for educational design
  const colors = {
    text: theme === 'dark' ? 'text-white/90' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
    textMuted: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    textMuted2: theme === 'dark' ? 'text-gray-500' : 'text-gray-500',
    textActive: theme === 'dark' ? 'text-sky-300' : 'text-[#9EC6F3]',
    
    // Subtle 3D card styling with gentle depth
    cardBg: theme === 'dark' 
      ? 'bg-gradient-to-br from-gray-800 to-gray-850 shadow-sm shadow-black/10' 
      : 'bg-gradient-to-br from-white to-gray-25 shadow-sm shadow-gray-300/30',
    cardBorder: theme === 'dark' ? 'border-gray-600/40' : 'border-gray-200/60',
    cardHover: theme === 'dark' 
      ? 'hover:shadow-md hover:shadow-black/15 hover:-translate-y-px' 
      : 'hover:shadow-md hover:shadow-gray-400/30 hover:-translate-y-px',
    
    // Active state - same as default cards, no special background
    cardActiveBg: theme === 'dark' 
      ? 'bg-gradient-to-br from-gray-800 to-gray-850 shadow-sm shadow-black/10' 
      : 'bg-gradient-to-br from-white to-gray-25 shadow-sm shadow-gray-300/30',
    cardActiveBorder: theme === 'dark' ? 'border-gray-600/40' : 'border-gray-200/60',
    
    // Other elements
    iconColor: theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleDistributionExpand = (distribution: typeof distributionData[0]) => {
    // Only toggle expansion, don't trigger animation
    toggleExpanded(distribution.id);
  };

  const handleAnimationActivate = (distribution: typeof distributionData[0]) => {
    // Only trigger animation on right side
    if (onDistributionClick) {
      onDistributionClick(distribution.id, distribution.name);
    }
  };

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-6 ${colors.text}`}>01. Introduction & Basics</h2>
      <div className={`space-y-4 text-md font-light ${colors.textSecondary}`}>
        <p>
          <span className="font-medium"> Welcome to the Statistics Page of Seeing Science!</span>
          <br/>
          This page is designed for the engineers & students who already have a basic
          understanding of statistics and want to further explore advanced statistics with visualizations.
          This course assumes familiarity with basic statistical concepts and calculus. For some refresher on basic statistics, Brown University's{" "}
          Seeing Theory is a really good source of reference. 
          <br/>
          Let's get started with some distributions 
        </p>
        <p className={colors.textMuted}>
          (Click on the expandable bullet points for explanations and animations)
        </p>
        
        <h3 className={`text-lg font-semibold mb-2 ${colors.text}`}>
          Distributions
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
          {distributionData.map((distribution) => {
            const isActive = activeDistribution === distribution.id;
            
            return (
              <div 
                key={distribution.id} 
                onClick={() => onDistributionClick?.(distribution.id, distribution.name)}
                className={`
                  group cursor-pointer border rounded-lg transition-all duration-200 ease-out transform
                  p-3 sm:p-2 md:p-3 min-h-[60px] sm:min-h-[80px] md:min-h-[100px]
                  ${isActive 
                    ? `${colors.cardActiveBorder} ${colors.cardActiveBg}` 
                    : `${colors.cardBorder} ${colors.cardBg}`
                  }
                  ${colors.cardHover}
                `}
              >
                <div className="flex sm:flex-col justify-between h-full space-x-3 sm:space-x-0 space-y-0 sm:space-y-2 md:space-y-3 overflow-hidden">
                  {/* Title and status */}
                  <div className="flex items-start justify-between gap-2 flex-1 sm:flex-initial min-w-0">
                    <h3 
                      className={`text-sm sm:text-xs md:text-sm font-semibold leading-tight transition-colors duration-200 line-clamp-2 truncate ${
                        isActive ? colors.textActive : colors.textSecondary
                      }`}
                      title={distribution.name}
                    >
                      {distribution.name}
                    </h3>
                    {isActive && (
                      <div className="w-2 h-2 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full flex-shrink-0 mt-1"></div>
                    )}
                  </div>

                  {/* Simple action indicator - contained within card */}
                  <div className="flex items-center justify-between sm:mt-auto flex-shrink-0 min-w-0 relative z-0">
                    <span className={`text-xs truncate pr-2 ${colors.textMuted2}`}>
                      {isActive ? 'Active' : 'Click to view'}
                    </span>
                    <div className={`transition-transform duration-200 group-hover:translate-x-1 flex-shrink-0 relative z-0 ${
                      isActive ? colors.textActive : colors.iconColor
                    }`}>
                      →
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Introduction;