import React, {useState, useEffect} from 'react'
import { useTheme } from '@/app/contexts/theme-context'

const Chapter2 = () => {

// State Management 
const { theme } = useTheme();
// Text Colors State Management Defined
const colors = { 
    text: theme=== "dark" ? "text-white/90" : "text-gray-900",
    textSecondary: theme === "dark" ? "text-gray-300" : "text-gray-700",
    
}

// Components 
  return (
    <div>
        <h2 className={`text-2xl font-bold mb-6 ${colors.text}`}>
            02. Statistical Inference & Hypothesis Testing 
        </h2>
        <div className= {`space-y-4 text-md font-light ${colors.textSecondary}`}>
            <p className = "font-semibold"> 
                Why do we test anything? 
            </p>
            <div className="space-y-4">
                <p>
                    Statistical hypothesis testing is the foundation of evidence-based decision making. When we observe data, 
                    we need systematic methods to determine if patterns we see are real or just due to random chance.
                </p>
                <p>
                    Consider a cereal manufacturing plant. The machines are calibrated to fill boxes with exactly 500 grams 
                    of cereal. But over time, mechanical wear, temperature changes, or other factors might cause the machine 
                    to "drift" - systematically over-filling or under-filling boxes.
                </p>
                <p>
                    How do we detect this drift? We can't weigh every single box (that would be impractical), so we take a 
                    sample and use statistical inference to make conclusions about the entire production process.
                </p>
                <p>
                    This is the essence of hypothesis testing: using sample data to make informed decisions about populations, 
                    while controlling for the risk of making wrong conclusions.
                </p>
            </div>
            
            <div className="mt-8">
                <h3 className={`text-lg font-semibold mb-4 ${colors.text}`}>
                    Interactive Learning
                </h3>
                <p className={colors.textSecondary}>
                    Use the chapter navigation to explore different aspects of statistical inference:
                </p>
                <ul className={`mt-2 space-y-2 text-sm ${colors.textSecondary}`}>
                    <li><strong>2.1 Testing Statistical Hypothesis:</strong> Interactive cereal machine simulation</li>
                    <li><strong>2.2 Inference on Population Mean:</strong> Confidence intervals and t-tests</li>
                    <li><strong>2.3 Inference on Population Variance:</strong> Chi-square tests and F-tests</li>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Chapter2