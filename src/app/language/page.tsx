'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LanguageSelection, { Language } from '../components/LanguageSelection'

const LanguagePage = () => {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  // Fade in animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100) // Slight delay for smoother transition
    return () => clearTimeout(timer)
  }, [])

  const handleLanguageSelect = (language: Language) => {
    // Store selected language in localStorage
    localStorage.setItem('selectedLanguage', JSON.stringify(language))
    
    // Fade out before navigating
    setIsVisible(false)
    setTimeout(() => {
      router.push('/chat')
    }, 500)
  }

  const handleBack = () => {
    setIsVisible(false)
    setTimeout(() => {
      router.push('/')
    }, 500)
  }

  return (
    <div 
      className={`h-screen flex items-center justify-center bg-gradient-to-br from-green-800 to-green-900 transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <LanguageSelection 
        onLanguageSelect={handleLanguageSelect} 
        onBack={handleBack}
      />
    </div>
  )
}

export default LanguagePage
