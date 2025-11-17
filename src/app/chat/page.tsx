'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UnifiedSleekChat from '../components/AIPathwaysChat/UnifiedSleekChat'
import { Language } from '../components/LanguageSelection'
import { Ripple } from '@/components/ui/shadcn-io/ripple'

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
    <div className={`relative min-h-screen transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Ripple Background */}
      {/*<div className='absolute inset-0 flex justify-end items-center pr-64'>
        <Ripple />
      </div>/*}
      
      {/* Chat Interface */}
      <div className="relative z-10">
        <UnifiedSleekChat selectedLanguage={selectedLanguage} />
      </div>
    </div>
  )
}

export default ChatPage