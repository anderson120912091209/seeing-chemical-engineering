// app/components/ui/clickable-underline.tsx
'use client'

import React from 'react'

interface ClickableUnderlineProps {
  children: React.ReactNode
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'pink' | 'orange'
  onClick: () => void
  className?: string
}

const ClickableUnderline: React.FC<ClickableUnderlineProps> = ({
  children,
  color = 'blue',
  onClick,
  className = ''
}) => {
  return (
    <span 
      className={`underline-${color} font-bold cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      onClick={onClick}
    >
      {children}
    </span>
  )
}

export default ClickableUnderline