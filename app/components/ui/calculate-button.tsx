'use client'

import React from 'react'
import {Button} from '@/components/ui/button'

interface CalculatorButtonProps {
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  className?: string
  onClick: () => void
  children: React.ReactNode  // This is the button text/content
}

const CalculateButton: React.FC<CalculatorButtonProps> = ({
  size = 'default',
  variant = 'default', 
  className,
  onClick,
  children
}) => {

  return (
    <Button 
      size={size} 
      variant={variant} 
      className={className} 
      onClick={onClick}
      style={{ fontFamily: 'Aptos' }}
    >
      {children}
    </Button>
  )
}

export default CalculateButton