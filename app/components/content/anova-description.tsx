import React from 'react'
import ClickableUnderline from '../ui/clickable-underline'
import { Button } from '@/components/ui/button'
import TeachingMethodsAnova from '@/app/components/animations/ANOVA/teaching-methods-anova'
interface AnovaDescriptionProps {
  onBetweenClick: () => void;
  onWithinClick: () => void;
}

const AnovaDescription = ({ onBetweenClick, onWithinClick }: AnovaDescriptionProps) => {
  return (
    <>
      <p>
        Analysis of Variance (ANOVA) helps us understand if there are{' '}
        <ClickableUnderline color="blue" onClick={onBetweenClick}>
          significant differences
        </ClickableUnderline>{' '}
        between the means of several groups. 
        The core concept is to compare the variation{' '}
        <ClickableUnderline color="green" onClick={onBetweenClick}>
          between
        </ClickableUnderline>{' '}
        the groups to the variation{' '}
        <ClickableUnderline color="red" onClick={onWithinClick}>
          within
        </ClickableUnderline>{' '}
        each group.
      </p>
      <p>
        Imagine you're an educational researcher comparing <span className="font-bold   "> three teaching methods </span> (A, B, C) to see 
        which yields the best <span className="font-bold"> exam scores.</span>
      </p>
      <p>
        <span className="font-bold underline-green"> Key Question</span>: the measured average score differ, but is that due a real "
        <span className="font-bold underline-red">method effect</span>" in teaching methods or is it just random chance?
      </p>
      <p>
        If the variation between groups is much larger than within them, it's a strong indicator that the groups are genuinely different.
      </p>

      <Button>
        Calculate the Sum of Squares 
      </Button>

    </>
  )
}

export default AnovaDescription