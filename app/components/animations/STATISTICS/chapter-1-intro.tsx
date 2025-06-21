'use client'

import React from 'react'

export const DISTRIBUTIONS = ['binomial','normal'] as const 
type Stage = typeof DISTRIBUTIONS[number];

const Chapter1IntroAnimation = () => {
  return (
    <div>Chapter1IntroAnimation</div>
  )
}

export default Chapter1IntroAnimation