"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export type UserProfile = {
  status: "high-school" | "community-college" | "undergrad" | "other";
  goals?: string;
};

type Props = {
  onComplete: (profile: UserProfile) => void;
  onCancel: () => void;
};

const STATUS_OPTIONS: Array<{ id: UserProfile["status"]; label: string; icon: string }> = [
  { id: "high-school", label: "High School Student", icon: "🎓" },
  { id: "community-college", label: "Community College Student", icon: "📚" },
  { id: "undergrad", label: "Undergraduate Student", icon: "🎯" },
  { id: "other", label: "Other", icon: "✨" },
];

export default function OnboardingWizard({ onComplete, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    status: "high-school",
    goals: "",
  });

  const progress = ((step + 1) / 2) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl p-10"
      >
        {/* Top-right exit link */}
        <button
          onClick={onCancel}
          className="absolute top-6 right-6 text-sm text-slate-400 hover:text-slate-600"
        >
          Cancel
        </button>

        {/* Progress bar */}
        <div className="mb-6">
          <p className="text-sm text-slate-500 mb-1">Step {step + 1} of 2</p>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              className="h-full bg-emerald-400"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {step === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 mb-2">
                Tell us about yourself
              </h1>
              <p className="text-slate-500">
                This helps us tailor recommendations to your current situation.
              </p>
            </div>

            <div className="space-y-4">
              {STATUS_OPTIONS.map((option) => {
                const isActive = profile.status === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() =>
                      setProfile((prev) => ({ ...prev, status: option.id }))
                    }
                    className={`w-full border rounded-2xl p-4 flex items-center gap-4 text-left transition ${
                      isActive
                        ? "border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-100"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <p className="font-medium text-slate-900">{option.label}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-white font-medium shadow-lg shadow-emerald-200"
              >
                Continue →
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 mb-2">
                What are you hoping to achieve?
              </h2>
              <p className="text-slate-500">
                Mention programs, careers, or campuses you care about.
              </p>
            </div>

            <textarea
              className="w-full min-h-[160px] rounded-2xl border border-slate-200 p-4 text-slate-800 focus:border-emerald-400 focus:ring-emerald-200 outline-none"
              placeholder="e.g. Transfer into cybersecurity, find UH scholarships, explore healthcare careers…"
              value={profile.goals}
              onChange={(event) =>
                setProfile((prev) => ({ ...prev, goals: event.target.value }))
              }
            />

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(0)}
                className="text-slate-500 hover:text-slate-700"
              >
                ← Back
              </button>
              <button
                onClick={() => onComplete(profile)}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-white font-medium shadow-lg shadow-slate-300"
              >
                Start chat
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
