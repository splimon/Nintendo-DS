'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UnifiedSleekChat from '../components/AIPathwaysChat/UnifiedSleekChat'
import { Language } from '../components/LanguageSelection'

const ChatPage = () => {
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Load selected language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage')
    if (savedLanguage) {
      try {
        const language = JSON.parse(savedLanguage)
        setSelectedLanguage(language)
        // Fade in after language is loaded
        setTimeout(() => {
          setIsVisible(true)
        }, 50)
      } catch (error) {
        console.error('Failed to load language:', error)
        // Redirect to language selection if no valid language
        router.push('/language')
      }
    } else {
      // Redirect to language selection if no language saved
      router.push('/language')
    }
  }, [router])

  // Don't render anything until language is loaded
  if (!selectedLanguage) {
    return null
  }

  return (
    <div className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <UnifiedSleekChat selectedLanguage={selectedLanguage} />
    </div>
  )
}

export default ChatPage