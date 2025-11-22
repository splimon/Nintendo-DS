/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AIPathwaysChat/OnboardingFlow.tsx
import React, { useState } from "react";
import { Language } from "../LanguageSelection";

export interface OnboardingAnswers {
  interests: string;
  skills: string;
  experiences: string;
  careerTrack: string;
}

interface OnboardingFlowProps {
  selectedLanguage: Language | null;
  onComplete: (answers: OnboardingAnswers) => void;
  onSkip?: () => void;
}

interface Question {
  id: keyof OnboardingAnswers;
  question: {
    en: string;
    haw: string;
    hwp: string;
    tl: string;
  };
  placeholder: {
    en: string;
    haw: string;
    hwp: string;
    tl: string;
  };
  suggestions: {
    en: string[];
    haw: string[];
    hwp: string[];
    tl: string[];
  };
}

const ONBOARDING_QUESTIONS: Question[] = [
  {
    id: "interests",
    question: {
      en: "What are you interested in?",
      haw: "He aha kou makemake?",
      hwp: "What you interested in?",
      tl: "Ano ang iyong interes?",
    },
    placeholder: {
      en: "e.g., technology, healthcare, business, environment, creative arts...",
      haw: "e.g., kekepania, mālama ola, ʻoihana pākaukau, kaiapuni, hana noʻeau...",
      hwp: "e.g., tech stuff, health care, business, environment, art kine...",
      tl: "e.g., teknolohiya, healthcare, negosyo, kapaligiran, sining...",
    },
    suggestions: {
      en: ["Technology & Computers", "Healthcare", "Business & Management", "Environment & Sustainability", "Creative Arts & Design"],
      haw: ["Kekepania a me nā Kamepiula", "Mālama Ola", "ʻOihana Pākaukau", "Kaiapuni a me ka Hoʻomau", "Hana Noʻeau"],
      hwp: ["Tech & Computers", "Healthcare", "Business", "Environment", "Creative Arts"],
      tl: ["Teknolohiya at Kompyuter", "Healthcare", "Negosyo at Pamamahala", "Kapaligiran", "Sining at Disenyo"],
    },
  },
  {
    id: "skills",
    question: {
      en: "What are your skills?",
      haw: "He aha kou mau hana maikaʻi?",
      hwp: "What kine skills you get?",
      tl: "Ano ang iyong mga kasanayan?",
    },
    placeholder: {
      en: "e.g., coding, communication, problem-solving, leadership, writing...",
      haw: "e.g., hoʻolālā kamepiula, kamaʻilio, hoʻoponopono pilikia, alakaʻi, kākau...",
      hwp: "e.g., coding, talking to people, fixing problems, being leader, writing...",
      tl: "e.g., programming, komunikasyon, paglutas ng problema, pamumuno, pagsusulat...",
    },
    suggestions: {
      en: ["Technical Skills (coding, data analysis)", "Communication & Teamwork", "Problem Solving & Critical Thinking", "Leadership & Organization", "Creative & Design Skills"],
      haw: ["Hana Kekepania", "Kamaʻilio a me ka Hana Hui", "Hoʻoponopono Pilikia", "Alakaʻi a me ka Hoʻonohonoho", "Hana Noʻeau"],
      hwp: ["Tech Skills", "Communication & Teamwork", "Problem Solving", "Leadership", "Creative Skills"],
      tl: ["Mga Teknikal na Kasanayan", "Komunikasyon at Pagtutulungan", "Paglutas ng Problema", "Pamumuno", "Mga Kasanayan sa Pagdisenyo"],
    },
  },
  {
    id: "experiences",
    question: {
      en: "What are your experiences?",
      haw: "He aha kou mau ʻike?",
      hwp: "What kine experience you get?",
      tl: "Ano ang iyong mga karanasan?",
    },
    placeholder: {
      en: "e.g., volunteering, internships, school projects, part-time jobs, clubs...",
      haw: "e.g., hana aloha, hoʻokolohua, papahana kula, hana manawa pōkole, hui...",
      hwp: "e.g., volunteer work, internships, school projects, part-time jobs, clubs...",
      tl: "e.g., boluntaryo, internship, proyekto sa paaralan, part-time na trabaho, mga club...",
    },
    suggestions: {
      en: ["High School Student", "Some College/University Experience", "Working Professional", "Career Changer", "Recent Graduate"],
      haw: ["Haumāna Kula Kiʻekiʻe", "Haumāna Kulanui", "Hana Paʻa", "Hoʻololi ʻOihana", "Puka Hou"],
      hwp: ["High School", "College Student", "Working Already", "Changing Career", "Just Graduated"],
      tl: ["Estudyante ng High School", "May Karanasan sa Kolehiyo", "Propesyonal na Nagtatrabaho", "Nagpapalit ng Karera", "Bagong Nagtapos"],
    },
  },
  {
    id: "careerTrack",
    question: {
      en: "What is your desired career track or job title?",
      haw: "He aha kou ʻoihana makemake?",
      hwp: "What kine career or job you like do?",
      tl: "Ano ang nais mong karera o posisyon?",
    },
    placeholder: {
      en: "e.g., software developer, nurse, business owner, environmental scientist...",
      haw: "e.g., mea hoʻomohala polokalamu kamepiula, kahu mālama, poʻo ʻoihana, ʻepekema kaiapuni...",
      hwp: "e.g., programmer, nurse, own business, environmental scientist...",
      tl: "e.g., software developer, nurse, may-ari ng negosyo, environmental scientist...",
    },
    suggestions: {
      en: ["Software Developer/Engineer", "Healthcare Professional", "Business/Project Manager", "Environmental Specialist", "Creative Professional"],
      haw: ["Mea Hoʻomohala Polokalamu", "Kahu Mālama", "Luna ʻOihana", "ʻEpekema Kaiapuni", "Hana Noʻeau"],
      hwp: ["Tech/Software Developer", "Healthcare Worker", "Manager", "Environmental Specialist", "Creative Professional"],
      tl: ["Software Developer/Engineer", "Healthcare Professional", "Business/Project Manager", "Environmental Specialist", "Creative Professional"],
    },
  },
];

export default function OnboardingFlow({
  selectedLanguage,
  onComplete,
  onSkip,
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    interests: "",
    skills: "",
    experiences: "",
    careerTrack: "",
  });
  const [currentInput, setCurrentInput] = useState("");

  const lang = selectedLanguage?.code || "en";
  const currentQuestion = ONBOARDING_QUESTIONS[currentStep];
  const totalSteps = ONBOARDING_QUESTIONS.length;

  const handleNext = () => {
    if (!currentInput.trim()) return;

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: currentInput.trim(),
    };
    setAnswers(newAnswers);

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentInput("");
    } else {
      // All questions answered, complete onboarding
      onComplete(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Restore previous answer
      const previousQuestion = ONBOARDING_QUESTIONS[currentStep - 1];
      setCurrentInput(answers[previousQuestion.id]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentInput(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  const getTranslation = (field: any) => {
    return field[lang as keyof typeof field] || field.en;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 max-w-3xl mx-auto">
      {/* Progress Indicator */}
      <div className="w-full mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">
            {lang === "en" && `Question ${currentStep + 1} of ${totalSteps}`}
            {lang === "haw" && `Nīnau ${currentStep + 1} o ${totalSteps}`}
            {lang === "hwp" && `Question ${currentStep + 1} of ${totalSteps}`}
            {lang === "tl" && `Tanong ${currentStep + 1} ng ${totalSteps}`}
          </span>
          <span className="text-sm text-gray-400">
            {Math.round(((currentStep + 1) / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-pink-500 to-violet-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">
          {getTranslation(currentQuestion.question)}
        </h2>
        <p className="text-gray-400 text-sm">
          {lang === "en" && "Tell us about yourself to get personalized recommendations"}
          {lang === "haw" && "E haʻi mai e pili ana iā ʻoe no nā manaʻo kūpono"}
          {lang === "hwp" && "Tell us bout yourself fo get personalized recommendations"}
          {lang === "tl" && "Sabihin sa amin ang tungkol sa iyo para sa personalized na mga rekomendasyon"}
        </p>
      </div>

      {/* Input Area */}
      <div className="w-full mb-6">
        <textarea
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={getTranslation(currentQuestion.placeholder)}
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none min-h-[120px]"
          autoFocus
        />
      </div>

      {/* Suggestions */}
      <div className="w-full mb-8">
        <p className="text-sm text-gray-400 mb-3">
          {lang === "en" && "Quick suggestions:"}
          {lang === "haw" && "Manaʻo wikiwiki:"}
          {lang === "hwp" && "Quick suggestions:"}
          {lang === "tl" && "Mga mabilis na suhestiyon:"}
        </p>
        <div className="flex flex-wrap gap-2">
          {currentQuestion.suggestions[lang as keyof typeof currentQuestion.suggestions].map(
            (suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm text-white rounded-full border border-gray-600 transition-colors"
              >
                {suggestion}
              </button>
            )
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 w-full justify-between">
        <div className="flex gap-2">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {lang === "en" && "← Back"}
              {lang === "haw" && "← Hoʻi"}
              {lang === "hwp" && "← Go Back"}
              {lang === "tl" && "← Bumalik"}
            </button>
          )}
          {onSkip && (
            <button
              onClick={onSkip}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
            >
              {lang === "en" && "Skip for now"}
              {lang === "haw" && "Lele i kēia manawa"}
              {lang === "hwp" && "Skip dis"}
              {lang === "tl" && "Laktawan muna"}
            </button>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!currentInput.trim()}
          className="px-8 py-3 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentStep < totalSteps - 1 ? (
            <>
              {lang === "en" && "Next →"}
              {lang === "haw" && "Ma mua →"}
              {lang === "hwp" && "Next →"}
              {lang === "tl" && "Susunod →"}
            </>
          ) : (
            <>
              {lang === "en" && "Complete ✓"}
              {lang === "haw" && "Pau ✓"}
              {lang === "hwp" && "Done ✓"}
              {lang === "tl" && "Tapos ✓"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
