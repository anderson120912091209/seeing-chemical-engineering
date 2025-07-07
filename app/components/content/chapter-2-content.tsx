import React, {useState, useEffect} from 'react'
import { useTheme } from '@/app/contexts/theme-context'

const Chapter2 = () => {

// State Management 
const { theme } = useTheme();
// Colors State Management Defined
const colors = { 
    text: theme=== "dark" ? "text-white/90" : "text-gray-900",
    textSecondary: theme === "dark" ? "text-gray-300" : "text-gray-700",
    
}
const [sampleMean, setSampleMean] = useState(0);
const [sampleSize, setSampleSize] = useState(0);
const [sampleVariance, setSampleVariance] = useState(0);

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
                    When we observe data, we need a systematic method if patterns we observe are real or just due to random chance. 
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
                <p>
                    Let's play with the animation on the right to collect some sample data: 
                </p>
                
                {/* Sample Statistics Card */}
                <div className={`mt-6 p-6 rounded-lg border ${
                    theme === 'dark' 
                        ? 'bg-gray-800/50 border-gray-700' 
                        : 'bg-blue-50 border-blue-200'
                }`}>
                    <h3 className={`text-lg font-semibold mb-4 ${colors.text}`}>
                        Sample Statistics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`text-center p-4 rounded-md ${
                            theme === 'dark' 
                                ? 'bg-gray-700/50' 
                                : 'bg-white'
                        }`}>
                            <div className={`text-2xl font-bold ${colors.text}`}>
                                {sampleMean.toFixed(2)}g
                            </div>
                            <div className={`text-sm ${colors.textSecondary}`}>
                                Sample Mean
                            </div>
                        </div>
                        <div className={`text-center p-4 rounded-md ${
                            theme === 'dark' 
                                ? 'bg-gray-700/50' 
                                : 'bg-white'
                        }`}>
                            <div className={`text-2xl font-bold ${colors.text}`}>
                                {sampleSize}
                            </div>
                            <div className={`text-sm ${colors.textSecondary}`}>
                                Sample Count
                            </div>
                        </div>
                        <div className={`text-center p-4 rounded-md ${
                            theme === 'dark' 
                                ? 'bg-gray-700/50' 
                                : 'bg-white'
                        }`}>
                            <div className={`text-2xl font-bold ${colors.text}`}>
                                {Math.sqrt(sampleVariance).toFixed(2)}g
                            </div>
                            <div className={`text-sm ${colors.textSecondary}`}>
                                Sample Std Dev
                            </div>
                        </div>
                    </div>
                </div>

                
            
                   
    
            </div>
            <div> 
                
            </div>
        </div>
    </div>
  )
}

export default Chapter2