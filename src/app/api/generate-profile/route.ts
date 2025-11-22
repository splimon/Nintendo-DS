/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/generate-profile/route.ts
// TIER 0: Initial Profile Generation API
// Purpose: Generate comprehensive user profile from early conversation (3+ messages)
// Calls: profile-generation-agent.ts for LLM-based extraction
import { NextRequest, NextResponse } from "next/server";
import { generateComprehensiveProfile } from "@/app/lib/agents/profile-generation-agent";

// Main API handler
export async function POST(request: NextRequest) {
  try {
    const {
      transcript,
      userMessageCount,
      conversationMetrics,
      language = "en",
      structuredAnswers, // New: structured onboarding answers
    } = await request.json();

    console.log(`[Generate Profile API] 🎯 TIER 0 Initial Profile Request (Language: ${language})`);
    if (structuredAnswers) {
      console.log(`[Generate Profile API] 📋 Using structured onboarding answers`);
    }

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "Invalid transcript format" },
        { status: 400 }
      );
    }

    // If structured answers are provided, we can generate profile with fewer messages
    const minMessages = structuredAnswers ? 1 : 3;
    
    // Ensure we have enough conversation content
    if (userMessageCount < minMessages) {
      return NextResponse.json(
        { error: "Insufficient conversation data", needMoreMessages: true },
        { status: 400 }
      );
    }

    // Call the profile generation agent with structured answers if available
    const enhancedProfile = await generateComprehensiveProfile(
      transcript,
      conversationMetrics,
      language,
      structuredAnswers // Pass structured answers
    );

    if (!enhancedProfile) {
      return NextResponse.json(
        { error: "Failed to generate profile" },
        { status: 500 }
      );
    }

    // Only return profile if confidence is reasonable
    if (enhancedProfile.confidence.overall < 10) {
      return NextResponse.json(
        {
          error: "Insufficient information for reliable profile",
          message:
            "Please continue the conversation to gather more information",
          confidenceScore: enhancedProfile.confidence.overall,
        },
        { status: 400 }
      );
    }

    console.log(`[Generate Profile API] ✅ Profile generated - Confidence: ${enhancedProfile.confidence.overall}%`);

    return NextResponse.json({
      profile: enhancedProfile.summary,
      extracted: enhancedProfile.extracted,
      confidence: enhancedProfile.confidence,
      isComplete: true,
      metadata: {
        userMessageCount,
        generatedAt: new Date().toISOString(),
        conversationMetrics,
        language,
      },
    });
  } catch (error) {
    console.error("[Generate Profile API] ❌ Error:", error);
    console.error("[Generate Profile API] ❌ Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    console.error("[Generate Profile API] ❌ Error message:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { 
        error: "Failed to generate profile",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "profile-generation",
    version: "4.0",
    tier: "TIER 0 - Initial Profile Generation",
    features: {
      comprehensiveExtraction: true,
      confidenceScoring: true,
      hawaiiContextAware: true,
      fallbackProcessing: true,
      detailedAnalysis: true,
      multiLanguageSupport: true,
      supportedLanguages: ["en", "haw", "hwp", "tl"],
      agentBased: true,
    },
    architecture: {
      pattern: "Agent-based",
      agent: "profile-generation-agent.ts",
      route: "Thin wrapper with validation",
    },
    profileUpdateTiers: {
      tier0: "Initial profile generation (this API, 3+ messages)",
      tier1: "Instant micro-updates (FREE, in orchestrator)",
      tier2: "Smart incremental updates (future)",
      tier3: "Deep profile refresh (update-profile API, messages 20, 40, 60)",
    },
    timestamp: new Date().toISOString(),
  });
}
