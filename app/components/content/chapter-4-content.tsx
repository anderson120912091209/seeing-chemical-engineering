import React, {useEffect, useState, useRef} from 'react'
import { useTheme } from '@/app/contexts/theme-context'

const Chapter4 = () => {

    // State Management 

    const { theme } = useTheme()
    const colors = { 
        text: theme === "dark" ? "text-white/90" : "text-gray-900",
        textSecondary: theme === "dark" ? "text-gray-300" : "text-gray-700",
    }

    // Components 
  return (
    <div> 
        <h2 className = {`text-2xl font-bold mb-6 ${colors.text}`}>
            04. Concepts You Know But Never Understood 
        </h2>
        <div className = {`space-y-4 text-md font-light ${colors.textSecondary}`}>
            <div className = "font-semibold"> 
                Placeholder.
                <ul>
                    <li>
                        hello
                    </li>
                    <li>
                        helo
                    </li>
                    <li>
                        hello
                    </li>
                    <li>
                        hello
                    </li>
                </ul>
            </div>
        </div>
    </div>
        

  )
}

export default Chapter4