'use client'

import React, { useState } from 'react'
import UnifiedSleekChat from '../components/AIPathwaysChat/UnifiedSleekChat'
import LanguageSelection, { Language } from '../components/LanguageSelection'

const ChatPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)

  // If no language selected, show language selection
  if (!selectedLanguage) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-800 to-green-900">
        <LanguageSelection onLanguageSelect={setSelectedLanguage} 
        onBack={function (): void {
                throw new Error('Function not implemented.')
            } } />
      </div>
    )
  }

  // Once language is selected, show chat interface
  return <UnifiedSleekChat selectedLanguage={selectedLanguage} />
}

export default ChatPage