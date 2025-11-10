/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import UnifiedSleekChat from "./components/AIPathwaysChat/UnifiedSleekChat";
// import LanguageSelection, { Language } from "./components/LanguageSelection";
import { Language } from "./components/LanguageSelection";
import OnboardingWizard from "./components/AIPathwaysChat/Onboarding/OnboardingWizard";
import Particles from "./components/Particles";

// Captures info gathered during onboarding (can expand later).
type UserProfile = {
  status: "high-school" | "community-college" | "undergrad" | "other";
  goals?: string;
};

export default function MainPage() {
  const [currentView, setCurrentView] = useState<"home" | "onboarding" | "language" | "chat">(
    "home"
  );
  const [selectedLanguage] = useState<Language | null>({
    code: "en",
    name: "English",
    nativeName: "English",
    greeting: "Hello! Let's explore your educational journey.",
    description: "Standard English conversation",
  }); // Auto-set to English
  // reserve space for onboarding answers
  const [, setUserProfile] = useState<UserProfile | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStartChat = () => {
    setCurrentView("onboarding");

    // Skip language selection and go directly to chat
    // setCurrentView("chat");
    // setCurrentView("language");
  };

  // Placeholder completion handler so chat can still open.
  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentView("chat");
  };

  // const handleLanguageSelect = (language: Language) => {
  //   setSelectedLanguage(language);
  //   setCurrentView("chat");
  // };

  // const handleBackFromLanguage = () => {
  //   setCurrentView("home");
  // };

  // Language selection view - commented out for now
  // if (currentView === "language") {
  //   return (
  //     <LanguageSelection
  //       onLanguageSelect={handleLanguageSelect}
  //       onBack={handleBackFromLanguage}
  //     />
  //   );
  // }

  if (currentView === "onboarding") {
    return (
      <OnboardingWizard
        onComplete={handleOnboardingComplete}
        onCancel={() => setCurrentView("home")}
      />
    );
  }

  if (currentView === "chat") {
    return <UnifiedSleekChat 
    selectedLanguage={selectedLanguage} />;
  }

  return (
    <div
      className="relative h-screen w-screen bg-emerald-900 flex items-center justify-center overflow-hidden"
      style={{
        fontFamily:
          '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <Particles
        className="pointer-events-none absolute inset-0 z-0"
        particleColors={["#ffffff", "#ffffff"]}
        particleCount={400}
        particleSpread={30}
        speed={0.1}
        particleBaseSize={200}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      />

      {/* Simple corner logo */}
      <div className="absolute top-8 left-8 z-20">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-200">
            UH Pathways
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`relative z-20 max-w-3xl px-8 text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Main heading */}
        <h1 className="text-white text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Find your path in
          <span className="block mt-2">Hawaiʻi</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-white mb-12 max-w-2xl mx-auto font-light">
          Have a conversation with AI about your interests and discover
          education and career opportunities tailored to you.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleStartChat}
            className="text-white bg-emerald-600 px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 hover:scale-105 flex items-center gap-3 min-w-[200px] justify-center shadow-[0_10px_30px_rgba(34,197,94,0.25)]"
          >
            <span>Start talking</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Bottom corner info */}
      <div className="absolute bottom-8 left-8 text-xs text-gray-500 z-20">
        Free • No signup required
      </div>

      <div className="absolute bottom-8 right-8 text-xs text-gray-500 z-20">
        Built for Hawaiʻi students
      </div>

      {/* Green glow background */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at center, rgba(34,197,94,0.25) 0%, rgba(0,0,0,0) 55%)",
        }}
      />
    </div>
  );
}
