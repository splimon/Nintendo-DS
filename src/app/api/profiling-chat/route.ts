// app/api/profiling-chat/route.ts (Updated for conversational 4-question flow)
import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface OnboardingProgress {
  questionsAsked: number; // 0-5
  interests: string;
  skills: string;
  experiences: string;
  careerTrack: string;
  educationLevel: string;
}

const ONBOARDING_QUESTIONS = {
  en: [
    "Hi! I'm here to help you discover the perfect educational pathway in Hawaii. Let's start with the first question: **What are you interested in?** \n\nTell me about the subjects, fields, or topics that excite you!",
    "Great! Now, **what are your skills?** \n\nThink about both technical abilities (like coding or data analysis) and soft skills (like communication or teamwork).",
    "Excellent! Now, **what is your current education level?**",
    "Awesome! Next, **what are your experiences?** \n\nTell me about your education background, work experience, volunteer activities, or any relevant experiences you have.",
    "Perfect! Finally, **what is your desired career track or job title?** \n\nWhat career are you interested in pursuing? It's okay if you're still exploring options!",
  ],
  haw: [
    "Aloha! Ke kōkua nei au iā ʻoe e ʻimi i ka ala hoʻonaʻauao pono ma Hawaiʻi. E hoʻomaka kākou me ka nīnau mua: **He aha kou makemake?** \n\nE haʻi mai e pili ana i nā kumuhana e hoihoi ai ʻoe!",
    "Maikaʻi! Eia hou, **he aha kou mau hana maikaʻi?** \n\nE noʻonoʻo e pili ana i nā hana kekepania a me nā hana ʻē aʻe.",
    "Maikaʻi! Eia hou, **he aha kou papa hoʻonaʻauao?**",
    "Maikaʻi loa! A laila, **he aha kou mau ʻike?** \n\nE haʻi mai e pili ana i kou hoʻonaʻauao, hana, a me nā ʻike ʻē aʻe.",
    "Hemolele! Ma hope, **he aha kou ʻoihana makemake?** \n\nHe aha ka ʻoihana āu e makemake ai e hoʻomau?",
  ],
  hwp: [
    "Howzit! I going help you find da perfect educational pathway in Hawaii. Let's start with da first question: **What you interested in?** \n\nTell me bout da kine subjects or topics you like!",
    "Good! Now, **what kine skills you get?** \n\nThink bout both technical stuff (like coding) and people skills (like working wit oddas).",
    "Good! Now, **what stay your education level?**",
    "Nice! Next one, **what kine experience you get?** \n\nTell me bout your education, work, volunteer stuff, or anyting relevant.",
    "Perfect! Last one, **what kine career or job you like do?** \n\nWhat career you interested in? Stay cool if you still exploring!",
  ],
  tl: [
    "Kumusta! Tutulungan kitang makahanap ng perpektong landas ng edukasyon sa Hawaii. Magsimula tayo sa unang tanong: **Ano ang iyong interes?** \n\nSabihin mo sa akin ang mga paksa o larangan na pumupukaw sa iyo!",
    "Mahusay! Ngayon, **ano ang iyong mga kasanayan?** \n\nIsipin ang teknikal (tulad ng coding) at soft skills (tulad ng komunikasyon).",
    "Mahusay! Ngayon, **ano ang iyong antas ng edukasyon?**",
    "Napakagaling! Susunod, **ano ang iyong mga karanasan?** \n\nSabihin mo ang tungkol sa iyong edukasyon, trabaho, boluntaryo, o anumang nauugnay na karanasan.",
    "Perpekto! Panghuli, **ano ang nais mong karera o posisyon?** \n\nAnong karera ang gusto mong sundin? Okay lang kung nag-e-explore ka pa!",
  ],
};

// Analyze which onboarding question the user is on
function analyzeOnboardingProgress(messages: ChatMessage[]): OnboardingProgress {
  const progress: OnboardingProgress = {
    questionsAsked: 0,
    interests: "",
    skills: "",
    experiences: "",
    educationLevel: "",
    careerTrack: "",
  };

  const userMessages = messages.filter(m => m.role === "user");
  
  // Determine which question we're on based on conversation flow
  if (userMessages.length === 0) {
    progress.questionsAsked = 0; // Ask first question
  } else if (userMessages.length === 1) {
    progress.questionsAsked = 1; // Answered interests, ask skills
    progress.interests = userMessages[0].content;
  } else if (userMessages.length === 2) {
    progress.questionsAsked = 2; // Answered skills, ask experiences
    progress.interests = userMessages[0].content;
    progress.skills = userMessages[1].content;
  } else if (userMessages.length === 3) {
    progress.questionsAsked = 3; // Answered education level, ask experiences
    progress.interests = userMessages[0].content;
    progress.skills = userMessages[1].content;
    progress.educationLevel = userMessages[2].content;
  } else if (userMessages.length === 4) {
    progress.questionsAsked = 4; // Answered experiences, ask career track
    progress.interests = userMessages[0].content;
    progress.skills = userMessages[1].content;
    progress.educationLevel = userMessages[2].content;
    progress.experiences = userMessages[3].content;
  } else if (userMessages.length >= 5) {
    progress.questionsAsked = 5; // All questions answered
    progress.interests = userMessages[0].content;
    progress.skills = userMessages[1].content;
    progress.educationLevel = userMessages[2].content;
    progress.experiences = userMessages[3].content;
    progress.careerTrack = userMessages[4].content;
  }

  return progress;
}

// Generate dynamic suggestions based on user's interests
function generateSkillSuggestions(interests: string, language: string = "en"): string[] {
  const interestsLower = interests.toLowerCase();
  
  // Define skill mappings for different interest areas (expanded to 8+ options)
  const skillMappings: Record<string, Record<string, string[]>> = {
    en: {
      technology: [
        "Programming (Python, JavaScript)",
        "Data Structures & Algorithms",
        "Web Development",
        "Database Management",
        "Cloud Computing",
        "Machine Learning/AI",
        "Cybersecurity",
        "Problem Solving",
        "Technical Communication",
        "Teamwork & Collaboration"
      ],
      computer: [
        "Programming (Python, JavaScript)",
        "Data Structures & Algorithms",
        "Web Development",
        "Software Testing",
        "Version Control (Git)",
        "API Development",
        "Mobile App Development",
        "Problem Solving",
        "Technical Writing",
        "Teamwork & Collaboration"
      ],
      healthcare: [
        "Patient Care",
        "Medical Terminology",
        "Clinical Skills",
        "Compassion & Empathy",
        "Communication",
        "Critical Thinking",
        "Attention to Detail",
        "Time Management",
        "Stress Management",
        "Teamwork & Collaboration"
      ],
      nursing: [
        "Patient Care",
        "Clinical Assessment",
        "Medication Administration",
        "Communication",
        "Critical Thinking",
        "Compassion & Empathy",
        "Emergency Response",
        "Documentation",
        "Teamwork & Collaboration",
        "Cultural Competence"
      ],
      business: [
        "Leadership",
        "Financial Analysis",
        "Strategic Planning",
        "Communication",
        "Project Management",
        "Data Analysis",
        "Negotiation",
        "Problem Solving",
        "Marketing",
        "Teamwork & Collaboration"
      ],
      entrepreneurship: [
        "Business Planning",
        "Marketing & Sales",
        "Financial Management",
        "Leadership",
        "Innovation & Creativity",
        "Networking",
        "Risk Management",
        "Problem Solving",
        "Communication",
        "Resilience & Adaptability"
      ],
      engineering: [
        "Problem Solving",
        "Mathematics",
        "CAD/Design Software",
        "Technical Drawing",
        "Physics & Mechanics",
        "Project Management",
        "Critical Thinking",
        "Teamwork & Collaboration",
        "Communication",
        "Attention to Detail"
      ],
      construction: [
        "Blueprint Reading",
        "Safety Protocols",
        "Manual Dexterity",
        "Problem Solving",
        "Mathematics",
        "Equipment Operation",
        "Project Management",
        "Teamwork & Collaboration",
        "Physical Stamina",
        "Attention to Detail"
      ],
      art: [
        "Creativity",
        "Visual Design",
        "Adobe Creative Suite",
        "Drawing & Sketching",
        "Color Theory",
        "Attention to Detail",
        "Communication",
        "Time Management",
        "Critical Thinking",
        "Collaboration"
      ],
      design: [
        "Creativity",
        "Adobe Creative Suite",
        "User Experience (UX)",
        "User Interface (UI)",
        "Prototyping",
        "Communication",
        "Problem Solving",
        "Typography",
        "Teamwork & Collaboration",
        "Attention to Detail"
      ],
      education: [
        "Communication",
        "Patience",
        "Lesson Planning",
        "Public Speaking",
        "Classroom Management",
        "Creativity",
        "Empathy",
        "Organization",
        "Adaptability",
        "Critical Thinking"
      ],
      teaching: [
        "Communication",
        "Patience",
        "Curriculum Development",
        "Public Speaking",
        "Classroom Management",
        "Empathy",
        "Assessment & Evaluation",
        "Technology Integration",
        "Cultural Competence",
        "Problem Solving"
      ],
      hospitality: [
        "Customer Service",
        "Communication",
        "Organization",
        "Cultural Awareness",
        "Problem Solving",
        "Time Management",
        "Teamwork & Collaboration",
        "Attention to Detail",
        "Multitasking",
        "Conflict Resolution"
      ],
      culinary: [
        "Cooking Techniques",
        "Food Safety",
        "Creativity",
        "Time Management",
        "Recipe Development",
        "Knife Skills",
        "Menu Planning",
        "Teamwork & Collaboration",
        "Attention to Detail",
        "Physical Stamina"
      ],
      psychology: [
        "Active Listening",
        "Research Methods",
        "Empathy",
        "Critical Thinking",
        "Data Analysis",
        "Communication",
        "Ethics & Confidentiality",
        "Problem Solving",
        "Cultural Competence",
        "Report Writing"
      ],
      science: [
        "Research Methods",
        "Data Analysis",
        "Critical Thinking",
        "Laboratory Skills",
        "Scientific Writing",
        "Mathematics",
        "Problem Solving",
        "Attention to Detail",
        "Collaboration",
        "Ethics & Safety"
      ],
      mathematics: [
        "Problem Solving",
        "Analytical Thinking",
        "Logic & Reasoning",
        "Attention to Detail",
        "Data Analysis",
        "Mathematical Modeling",
        "Communication",
        "Critical Thinking",
        "Software Tools (MATLAB, R)",
        "Teaching & Tutoring"
      ],
      default: [
        "Communication",
        "Problem Solving",
        "Teamwork & Collaboration",
        "Time Management",
        "Critical Thinking",
        "Adaptability",
        "Leadership",
        "Organization",
        "Creativity",
        "Attention to Detail"
      ],
    },
    haw: {
      technology: ["Hoʻokele kamepiula", "Nānā ʻikepili", "Hoʻoponopono pilikia", "Kamaʻilio kekepania", "Hana pū", "Noʻonoʻo koʻikoʻi"],
      computer: ["Hoʻokele kamepiula", "Nā kikoʻī ʻikepili", "Hana pūnaewele", "Hana pū", "Noʻonoʻo", "Kamaʻilio"],
      healthcare: ["Mālama maʻi", "Hua ʻōlelo lāʻau", "Aloha", "Kamaʻilio", "Noʻonoʻo koʻikoʻi", "Nānā pono"],
      nursing: ["Mālama maʻi", "Hana lāʻau", "Kamaʻilio", "Noʻonoʻo koʻikoʻi", "Aloha", "Hana pū"],
      business: ["Alakaʻi", "Loiloi kālā", "Kamaʻilio", "Hoʻokele papahana", "Hoʻolaha", "Hana pū"],
      default: ["Kamaʻilio", "Hoʻoponopono pilikia", "Hana pū", "Hoʻokele manawa", "Noʻonoʻo koʻikoʻi", "Hoʻololi"],
    },
    hwp: {
      technology: ["Programming stuffs", "Look at da data", "Fix problems", "Talk technical", "Work wit oddas", "Cloud computing", "Cybersecurity", "Think hard"],
      computer: ["Programming (Python, JavaScript)", "Data structures", "Make websites", "Git version control", "Testing", "Work wit oddas", "Problem solving", "APIs"],
      healthcare: ["Take care patients", "Medical words", "Compassion", "Talk good", "Think critical", "Handle stress", "Work wit team", "Detail oriented"],
      nursing: ["Patient care", "Clinical skills", "Give medicine", "Communication", "Think critical", "Emergency response", "Documentation", "Work wit team"],
      business: ["Be da leader", "Money analysis", "Strategic planning", "Communication", "Run projects", "Marketing", "Negotiation", "Problem solving"],
      default: ["Communication", "Fix problems", "Work wit oddas", "Handle time", "Think critical", "Be flexible", "Leadership", "Organization"],
    },
    tl: {
      technology: ["Programming (Python, JavaScript)", "Data Analysis", "Problem Solving", "Cloud Computing", "Machine Learning", "Cybersecurity", "Web Development", "Komunikasyon"],
      computer: ["Programming", "Data Structures", "Web Development", "Version Control", "Testing", "Mobile Development", "Pagtutulungan", "Problem Solving"],
      healthcare: ["Pag-aalaga ng Pasyente", "Medikal na Terminolohiya", "Pakikiramay", "Komunikasyon", "Kritikal na Pag-iisip", "Clinical Skills", "Atensyon sa Detalye", "Pagtutulungan"],
      nursing: ["Pag-aalaga ng Pasyente", "Clinical Assessment", "Medication Administration", "Komunikasyon", "Kritikal na Pag-iisip", "Emergency Response", "Documentation", "Pagtutulungan"],
      business: ["Pamumuno", "Pagsusuri ng Pananalapi", "Strategic Planning", "Komunikasyon", "Pamamahala ng Proyekto", "Marketing", "Negotiation", "Problem Solving"],
      default: ["Komunikasyon", "Paglutas ng Problema", "Pagtutulungan", "Pamamahala ng Oras", "Kritikal na Pag-iisip", "Kakayahang Umangkop", "Pamumuno", "Organisasyon"],
    },
  };

  // Get language-specific mappings
  const langMappings = skillMappings[language] || skillMappings.en;
  
  // Check for matching interest areas
  for (const [key, skills] of Object.entries(langMappings)) {
    if (key !== 'default' && interestsLower.includes(key)) {
      return skills;
    }
  }
  
  // Return default suggestions if no match found
  return langMappings.default;
}

// Generate dynamic experience suggestions based on interests and education level
function generateExperienceSuggestions(interests: string, educationLevel: string, language: string = "en"): string[] {
  const interestsLower = interests.toLowerCase();
  const educationLower = educationLevel.toLowerCase();
  
  // Define experience mappings based on interest area and education level
  const experienceMappings: Record<string, Record<string, Record<string, string[]>>> = {
    en: {
      // High School level experiences
      high_school: {
        technology: [
          "Completed AP Computer Science or coding courses",
          "Built personal projects or websites",
          "Member of robotics or tech club",
          "Participated in hackathons or coding competitions",
          "Self-taught programming through online courses",
        ],
        computer: [
          "Completed programming courses in school",
          "Built apps or websites as hobby projects",
          "Participated in computer science competitions",
          "Member of coding club or STEM activities",
          "Online coding bootcamp or tutorials",
        ],
        healthcare: [
          "Volunteered at hospital or clinic",
          "Completed health science courses",
          "Member of HOSA or health career club",
          "Shadowed healthcare professionals",
          "CPR/First Aid certified",
        ],
        business: [
          "Completed business or economics courses",
          "Participated in DECA or FBLA",
          "Started small business or online store",
          "Volunteered for nonprofit organization",
          "Led school club or student organization",
        ],
        default: [
          "Completed relevant coursework in area of interest",
          "Participated in extracurricular activities",
          "Volunteer experience in community",
          "Part-time job or internship",
          "Self-directed learning and personal projects",
        ],
      },
      // College level experiences
      college: {
        technology: [
          "Completed internship at tech company",
          "Built multiple projects using modern frameworks",
          "Contributed to open-source projects",
          "Research assistant in CS lab",
          "Freelance development work",
          "Teaching assistant for CS courses",
        ],
        computer: [
          "Software engineering internship",
          "Developed full-stack web applications",
          "Participated in hackathons and won awards",
          "Campus tech club leadership role",
          "Research in computer science",
          "Part-time developer position",
        ],
        healthcare: [
          "Clinical rotations or practicums",
          "Volunteered at hospital for 100+ hours",
          "Research assistant in health sciences",
          "Certified Nursing Assistant (CNA)",
          "Medical scribe or patient care technician",
          "Campus health organization leadership",
        ],
        business: [
          "Business internship at corporation",
          "Started and ran student business",
          "Marketing or consulting project experience",
          "Business competition finalist",
          "Campus business club president/officer",
          "Financial analysis or accounting internship",
        ],
        default: [
          "Relevant internship in field of study",
          "Leadership role in student organization",
          "Part-time job related to career goals",
          "Research assistant or academic project",
          "Volunteer coordinator or community service",
          "Study abroad or cross-cultural experience",
        ],
      },
      // Graduate Student experiences
      graduate: {
        technology: [
          "2+ years industry experience as developer",
          "Published research in CS conferences",
          "Led technical team or major project",
          "Multiple internships at top tech companies",
          "Specialized in AI/ML, cybersecurity, or cloud",
        ],
        healthcare: [
          "Clinical experience in specialized setting",
          "Research publications in medical journals",
          "Advanced certifications (ACLS, PALS, etc.)",
          "Supervised patient care teams",
          "Quality improvement project leadership",
        ],
        business: [
          "3+ years professional business experience",
          "Managed team or department",
          "Led strategic initiatives or projects",
          "Consulting or client-facing role",
          "Entrepreneurial venture experience",
        ],
        default: [
          "3+ years professional experience",
          "Advanced certifications or training",
          "Research and publications",
          "Leadership or management experience",
          "Specialized expertise in field",
        ],
      },
      // Working Professional experiences
      working: {
        technology: [
          "5+ years as software engineer/developer",
          "Led development teams or projects",
          "Expertise in multiple programming languages",
          "Architect or senior technical role",
          "Mentored junior developers",
        ],
        healthcare: [
          "5+ years clinical experience",
          "Specialized certifications and credentials",
          "Leadership role in healthcare setting",
          "Continuing education and training",
          "Quality improvement or patient safety work",
        ],
        business: [
          "5+ years in business/management role",
          "Led cross-functional teams",
          "P&L responsibility or budget management",
          "Strategic planning and execution",
          "Industry-specific expertise",
        ],
        default: [
          "5+ years professional experience",
          "Management or leadership roles",
          "Subject matter expert in field",
          "Multiple promotions or career growth",
          "Professional certifications and development",
        ],
      },
      // Career Changer experiences
      career_changer: {
        technology: [
          "Completed coding bootcamp or training",
          "Built portfolio of projects",
          "Transferable skills from previous career",
          "Self-taught through online courses",
          "Contributing to open-source projects",
        ],
        healthcare: [
          "Prerequisite healthcare courses completed",
          "Volunteer healthcare experience",
          "Transferable patient-facing skills",
          "Healthcare certification programs",
          "Shadowing or observing professionals",
        ],
        business: [
          "Business courses or MBA preparation",
          "Transferable management experience",
          "Entrepreneurial or side business",
          "Professional development programs",
          "Industry networking and research",
        ],
        default: [
          "Transferable skills from previous career",
          "Completed relevant training or courses",
          "Built portfolio or demonstrated interest",
          "Professional network in new field",
          "Volunteer or part-time work in target area",
        ],
      },
    },
    // Hawaiian translations
    haw: {
      high_school: {
        default: [
          "Ua pau nā papa e pili ana i ka makemake",
          "Hana ma nā hui haumāna",
          "Hana aloha ma ka hui",
          "Hana paʻa hapa manawa",
          "Aʻo ponoʻī ma ka pūnaewele",
        ],
      },
      college: {
        default: [
          "Hana hoʻolauna e pili ana",
          "Alakaʻi ma ka hui haumāna",
          "Hana paʻa hapa manawa e pili ana",
          "Kokua hoʻonaʻauao",
          "Hana aloha a luna",
        ],
      },
      graduate: {
        default: [
          "3+ makahiki hana paʻa",
          "Noi kiʻekiʻe",
          "Hoʻopaʻa palapala a me ka hoʻolaha",
          "Alakaʻi hui hana",
          "Ike kiʻekiʻe ma ka ʻoihana",
        ],
      },
      working: {
        default: [
          "5+ makahiki hana paʻa",
          "Alakaʻi hui a luna",
          "Ike kiʻekiʻe ma ka hana",
          "Hoʻomaikaʻi piha",
          "Noi paʻa a me ka hoʻomohala",
        ],
      },
      career_changer: {
        default: [
          "Pau nā papa e pili ana",
          "Hana portfolio",
          "Mana hoʻololi mai ka ʻoihana mua",
          "Papa hoʻomohala paʻa",
          "Hana aloha ma ka ʻano hou",
        ],
      },
    },
    // Hawaiian Pidgin translations
    hwp: {
      high_school: {
        technology: [
          "Took computer classes in school",
          "Made websites or apps for fun",
          "Was in robotics or coding club",
          "Went hackathons or competitions",
          "Learned coding from YouTube or online",
        ],
        healthcare: [
          "Volunteered at hospital",
          "Took health science classes",
          "Was in HOSA club",
          "Shadowed doctors or nurses",
          "Got CPR/First Aid certificate",
        ],
        default: [
          "Took classes bout what I like",
          "Did school clubs and activities",
          "Volunteered in da community",
          "Had part-time job",
          "Learned stuffs on my own",
        ],
      },
      college: {
        technology: [
          "Did internship at tech company",
          "Made plenty projects wit code",
          "Helped wit open-source projects",
          "Was research assistant",
          "Did freelance programming",
        ],
        healthcare: [
          "Did clinical rotations",
          "Volunteered at hospital fo long time",
          "Was research assistant",
          "Got CNA certificate",
          "Worked as medical scribe",
        ],
        default: [
          "Did internship in my field",
          "Was leader in student club",
          "Had job related to my major",
          "Did research project",
          "Volunteered or did community service",
        ],
      },
      graduate: {
        default: [
          "Worked in da field for 3+ years",
          "Got advanced certificates",
          "Did research and published",
          "Was supervisor or team lead",
          "Get specialized skills",
        ],
      },
      working: {
        default: [
          "Working in da field 5+ years",
          "Managed team or department",
          "Stay expert in what I do",
          "Got promotions and moved up",
          "Get professional certificates",
        ],
      },
      career_changer: {
        default: [
          "Took classes fo da new career",
          "Get skills from old job dat help",
          "Made portfolio or projects",
          "Network wit people in new field",
          "Volunteered or worked part-time",
        ],
      },
    },
    // Tagalog translations
    tl: {
      high_school: {
        technology: [
          "Kumpleto ang computer science courses",
          "Gumawa ng personal projects o websites",
          "Miyembro ng robotics o tech club",
          "Sumali sa hackathons o competitions",
          "Nag-aral ng programming online",
        ],
        healthcare: [
          "Nag-volunteer sa hospital o clinic",
          "Kumpleto ang health science courses",
          "Miyembro ng HOSA o health club",
          "Nag-shadow ng healthcare professionals",
          "May CPR/First Aid certification",
        ],
        default: [
          "Kumpleto ang relevant coursework",
          "Sumali sa extracurricular activities",
          "Nag-volunteer sa komunidad",
          "May part-time job o internship",
          "Nag-aral ng sarili",
        ],
      },
      college: {
        technology: [
          "Nag-internship sa tech company",
          "Gumawa ng maraming projects",
          "Nag-contribute sa open-source",
          "Research assistant sa CS lab",
          "Nag-freelance development",
        ],
        healthcare: [
          "May clinical rotations",
          "Nag-volunteer ng 100+ oras",
          "Research assistant",
          "May CNA certification",
          "Medical scribe o patient care tech",
        ],
        default: [
          "May internship sa field of study",
          "Leadership role sa organization",
          "Part-time job related sa career",
          "Research assistant o project",
          "Volunteer coordinator",
        ],
      },
      graduate: {
        default: [
          "3+ taon ng professional experience",
          "Advanced certifications",
          "Research at publications",
          "Leadership o management experience",
          "Specialized expertise",
        ],
      },
      working: {
        default: [
          "5+ taon ng professional experience",
          "Management o leadership roles",
          "Expert sa field",
          "Maraming promotions",
          "Professional certifications",
        ],
      },
      career_changer: {
        default: [
          "Kumpleto ang training o courses",
          "Transferable skills mula previous career",
          "Gumawa ng portfolio",
          "Professional network sa new field",
          "Volunteer o part-time sa target area",
        ],
      },
    },
  };

  // Determine education category
  let eduCategory = "default";
  if (educationLower.includes("high school") || educationLower.includes("kula kiʻekiʻe")) {
    eduCategory = "high_school";
  } else if (educationLower.includes("college") || educationLower.includes("kulanui") || educationLower.includes("kolehiyo") ||
             educationLower.includes("freshman") || educationLower.includes("sophomore") || 
             educationLower.includes("junior") || educationLower.includes("senior")) {
    eduCategory = "college";
  } else if (educationLower.includes("graduate") || educationLower.includes("papa kiʻekiʻe")) {
    eduCategory = "graduate";
  } else if (educationLower.includes("working") || educationLower.includes("professional") || 
             educationLower.includes("limahana") || educationLower.includes("propesyonal")) {
    eduCategory = "working";
  } else if (educationLower.includes("career changer") || educationLower.includes("changer") || 
             educationLower.includes("hoʻololi") || educationLower.includes("nagpapalit")) {
    eduCategory = "career_changer";
  }

  const langMappings = experienceMappings[language] || experienceMappings.en;
  const eduLevelMappings = langMappings[eduCategory];
  
  if (!eduLevelMappings) {
    // Fallback to default if category not found
    return langMappings.default?.default || experienceMappings.en.college.default;
  }

  // Check for matching interest areas
  for (const [key, experiences] of Object.entries(eduLevelMappings)) {
    if (key !== 'default' && interestsLower.includes(key)) {
      return experiences;
    }
  }
  
  // Return default for that education level
  return eduLevelMappings.default || experienceMappings.en.college.default;
}

// Generate education level suggestions
function generateEducationLevelSuggestions(language: string = "en"): string[] {
  const suggestionsByLanguage: Record<string, string[]> = {
    en: [
      "High School",
      "College",
      "Graduate Student",
      "Working Professional",
      "Career Changer",
    ],
    haw: [
      "Kula Kiʻekiʻe",
      "Kulanui",
      "Papa Kiʻekiʻe",
      "Limahana Paʻa",
      "Hoʻololi ʻOihana",
    ],
    hwp: [
      "High School",
      "College",
      "Graduate School",
      "Working Already",
      "Changing Career",
    ],
    tl: [
      "High School",
      "Kolehiyo",
      "Graduate Student",
      "Propesyonal na Nagtatrabaho",
      "Nagpapalit ng Karera",
    ],
  };
  
  return suggestionsByLanguage[language] || suggestionsByLanguage.en;
}

// Generate college year sub-options (for when user selects "College")
function generateCollegeYearSuggestions(language: string = "en"): string[] {
  const suggestionsByLanguage: Record<string, string[]> = {
    en: [
      "Freshman",
      "Sophomore",
      "Junior",
      "Senior",
    ],
    haw: [
      "Makahiki 1",
      "Makahiki 2",
      "Makahiki 3",
      "Makahiki 4",
    ],
    hwp: [
      "Freshman",
      "Sophomore",
      "Junior",
      "Senior",
    ],
    tl: [
      "Freshman",
      "Sophomore",
      "Junior",
      "Senior",
    ],
  };
  
  return suggestionsByLanguage[language] || suggestionsByLanguage.en;
}

// Generate career suggestions based on interests
function generateCareerSuggestions(interests: string, language: string = "en"): string[] {
  const interestsLower = interests.toLowerCase();
  
  const careerMappings: Record<string, Record<string, string[]>> = {
    en: {
      technology: ["Software Engineer", "Data Scientist", "IT Specialist", "Cybersecurity Analyst"],
      computer: ["Software Developer", "Web Developer", "Systems Analyst", "Database Administrator"],
      healthcare: ["Registered Nurse", "Physician", "Healthcare Administrator", "Medical Technician"],
      nursing: ["Registered Nurse", "Nurse Practitioner", "Clinical Nurse Specialist", "Nurse Educator"],
      business: ["Business Analyst", "Marketing Manager", "Financial Advisor", "Operations Manager"],
      entrepreneurship: ["Business Owner", "Startup Founder", "Consultant", "Product Manager"],
      engineering: ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Project Manager"],
      construction: ["Construction Manager", "Civil Engineer", "Architect", "Project Supervisor"],
      arts: ["Graphic Designer", "Art Director", "Multimedia Artist", "Creative Director"],
      creative: ["Content Creator", "Video Producer", "UX Designer", "Digital Artist"],
      media: ["Videographer", "Social Media Manager", "Film Editor", "Broadcast Producer"],
      education: ["Teacher", "School Counselor", "Curriculum Developer", "Education Administrator"],
      teaching: ["Elementary Teacher", "High School Teacher", "Special Education Teacher", "Instructional Coordinator"],
      hospitality: ["Hotel Manager", "Event Coordinator", "Tourism Director", "Guest Services Manager"],
      tourism: ["Tour Guide", "Travel Coordinator", "Resort Manager", "Cultural Program Director"],
      science: ["Research Scientist", "Laboratory Technician", "Environmental Scientist", "Marine Biologist"],
      research: ["Research Analyst", "Lab Manager", "Clinical Research Coordinator", "Data Analyst"],
      law: ["Attorney", "Paralegal", "Legal Advisor", "Compliance Officer"],
      public: ["Social Worker", "Community Organizer", "Public Administrator", "Policy Analyst"],
      service: ["Case Manager", "Program Coordinator", "Outreach Specialist", "Nonprofit Director"],
      agriculture: ["Agricultural Manager", "Farm Supervisor", "Crop Consultant", "Sustainable Farming Specialist"],
      environment: ["Environmental Scientist", "Conservation Officer", "Sustainability Coordinator", "Wildlife Biologist"],
      default: ["Career Counselor", "Program Coordinator", "Analyst", "Specialist"],
    },
    haw: {
      technology: ["Enekinia Polokalamu", "ʻEpekialisika ʻIkepili", "Luna IT", "ʻAna Pale"],
      computer: ["Hana Polokalamu", "Hana Pūnaewele", "ʻAna Māhele", "Luna Waihona"],
      healthcare: ["Kahu Mālama", "Kauka", "Luna Mālama", "Limahana Lāʻau"],
      arts: ["Mea Hana Kiʻi", "Luna Hana Noʻeau", "Mea Hana Multimedia", "Luna Hana Mākaukau"],
      education: ["Kumu", "Kūkākūkā Kula", "Mea Hana Kumumanaʻo", "Luna Hoʻonaʻauao"],
      hospitality: ["Luna Hale Hoʻokipa", "Hoʻonohonoho Hanana", "Luna Huakaʻi", "Luna Lawelawe Malihini"],
      science: ["ʻEpekema Noiʻi", "Limahana Lako Hana", "ʻEpekema Kaiāulu", "ʻEpekema Kai"],
      law: ["Loio", "Kokua Loio", "Kūkākūkā Kānāwai", "Luna Malama Kānāwai"],
      agriculture: ["Luna Mahiʻai", "Luna Māla", "Kūkākūkā Mahiʻai", "ʻEpekialisika Mahiʻai Paʻa"],
      default: ["Kūkākūkā ʻOihana", "Luna Papahana", "ʻAna", "ʻEpekialisika"],
    },
    hwp: {
      technology: ["Software Engineer", "Data guy", "IT Specialist", "Cybersecurity"],
      computer: ["Software Developer", "Web Developer", "Systems Analyst", "Database guy"],
      healthcare: ["Registered Nurse", "Doctor", "Healthcare Boss", "Medical Tech"],
      arts: ["Graphic Designer", "Art Boss", "Creative guy", "Media Artist"],
      education: ["Teacher", "School Counselor", "Curriculum guy", "Principal"],
      hospitality: ["Hotel Manager", "Event Coordinator", "Tourism Boss", "Guest Services"],
      science: ["Scientist", "Lab Tech", "Environmental guy", "Marine Biologist"],
      law: ["Lawyer", "Paralegal", "Legal Advisor", "Compliance guy"],
      agriculture: ["Farm Manager", "Farm Boss", "Crop guy", "Farming Specialist"],
      default: ["Career helper", "Program coordinator", "Analyst", "Specialist"],
    },
    tl: {
      technology: ["Software Engineer", "Data Scientist", "IT Specialist", "Cybersecurity Analyst"],
      computer: ["Software Developer", "Web Developer", "Systems Analyst", "Database Administrator"],
      healthcare: ["Registered Nurse", "Doktor", "Healthcare Administrator", "Medical Technician"],
      arts: ["Graphic Designer", "Direktor ng Sining", "Multimedia Artist", "Creative Director"],
      education: ["Guro", "School Counselor", "Curriculum Developer", "Administrador ng Edukasyon"],
      hospitality: ["Hotel Manager", "Event Coordinator", "Direktor ng Turismo", "Guest Services Manager"],
      science: ["Research Scientist", "Laboratory Technician", "Environmental Scientist", "Marine Biologist"],
      law: ["Abogado", "Paralegal", "Legal Advisor", "Compliance Officer"],
      agriculture: ["Agricultural Manager", "Farm Supervisor", "Crop Consultant", "Sustainable Farming Specialist"],
      default: ["Career Counselor", "Program Coordinator", "Analyst", "Specialist"],
    },
  };

  const langMappings = careerMappings[language] || careerMappings.en;
  
  for (const [key, careers] of Object.entries(langMappings)) {
    if (key !== 'default' && interestsLower.includes(key)) {
      return careers;
    }
  }
  
  return langMappings.default;
}

// Main handler
export async function POST(request: NextRequest) {
  try {
    console.log("=== PROFILING CHAT API CALLED ===");
    const body = await request.json();
    const { messages, language = "en" } = body;

    console.log("Language requested:", language);

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const progress = analyzeOnboardingProgress(messages);
    console.log("Onboarding progress:", progress);

    // If all 5 questions have been answered, trigger profile generation
    if (progress.questionsAsked >= 5) {
      console.log("=== ALL 5 QUESTIONS ANSWERED - GENERATING PROFILE ===");

      const transitionMessages: Record<string, string> = {
        en: "Perfect! I've captured your profile. Let me find the best programs and pathways for you...",
        haw: "Maikaʻi loa! Ua loaʻa iaʻu kou moʻolelo. E ʻimi nei au i nā papahana maikaʻi loa nōu...",
        hwp: "Shoots! I got your profile. Lemme find da best programs for you...",
        tl: "Perpekto! Nakuha ko na ang iyong profile. Hanapin ko ang mga pinakamahusay na programa para sa iyo...",
      };

      return NextResponse.json({
        message: transitionMessages[language] || transitionMessages.en,
        suggestedQuestions: [], // No quick actions - will auto-trigger
        readyForProfile: true,
        profilingComplete: true,
        autoTriggerPathway: true, // New flag to trigger automatic pathway search
        structuredAnswers: {
          interests: progress.interests,
          skills: progress.skills,
          experiences: progress.experiences,
          educationLevel: progress.educationLevel,
          careerTrack: progress.careerTrack,
        },
        debug: {
          questionsAnswered: 5,
          allQuestionsComplete: true,
        },
      });
    }

    // Otherwise, ask the next question
    const nextQuestionIndex = progress.questionsAsked;
    const questions = ONBOARDING_QUESTIONS[language as keyof typeof ONBOARDING_QUESTIONS] || ONBOARDING_QUESTIONS.en;
    const nextQuestion = questions[nextQuestionIndex];

    console.log(`=== ASKING QUESTION ${nextQuestionIndex + 1} OF 5 ===`);

    // Generate dynamic suggestions based on the question
    let dynamicSuggestions: string[] = [];
    let hasNestedOptions = false;
    let nestedOptionsFor: string | null = null;
    
    if (nextQuestionIndex === 1) {
      // Question 2: Skills - based on interests from Question 1
      dynamicSuggestions = generateSkillSuggestions(progress.interests, language);
    } else if (nextQuestionIndex === 2) {
      // Question 3: Education Level - predefined options with nested "College" option
      dynamicSuggestions = generateEducationLevelSuggestions(language);
      hasNestedOptions = true;
      nestedOptionsFor = language === "haw" ? "Kulanui" : 
                        language === "tl" ? "Kolehiyo" : "College";
    } else if (nextQuestionIndex === 3) {
      // Question 4: Experiences - based on interests and education level
      dynamicSuggestions = generateExperienceSuggestions(progress.interests, progress.educationLevel, language);
    } else if (nextQuestionIndex === 4) {
      // Question 5: Career Track - based on interests from Question 1
      dynamicSuggestions = generateCareerSuggestions(progress.interests, language);
    }

    return NextResponse.json({
      message: nextQuestion,
      suggestedQuestions: dynamicSuggestions,
      hasNestedOptions,
      nestedOptionsFor,
      nestedOptions: hasNestedOptions ? generateCollegeYearSuggestions(language) : undefined,
      profilingState: {
        progress: Math.round(((nextQuestionIndex + 1) / 5) * 100),
        currentQuestion: nextQuestionIndex + 1,
        totalQuestions: 5,
      },
      readyForProfile: false,
      debug: {
        questionsAsked: nextQuestionIndex,
        nextQuestion: nextQuestionIndex + 1,
        generatedSuggestions: dynamicSuggestions.length > 0,
      },
    });
  } catch (error) {
    console.log("Profiling chat API error:", error);

    const interestOptions = [
      "💻 Technology & Computer Science",
      "🏥 Healthcare & Nursing",
      "💼 Business & Entrepreneurship",
      "🏗️ Engineering & Construction",
      "🎨 Arts & Creative Media",
      "📚 Education & Teaching",
      "🏨 Hospitality & Tourism",
      "🔬 Science & Research",
      "⚖️ Law & Public Service",
      "🌱 Agriculture & Environment",
    ];

    console.log("[Profiling Chat] Returning interest options count:", interestOptions.length);

    return NextResponse.json(
      {
        message:
          "Hi! I'm here to help you explore career paths in Hawaii. What are you interested in?",
        suggestedQuestions: interestOptions,
        profilingState: {
          progress: 0,
          currentQuestion: 1,
          totalQuestions: 5,
        },
        readyForProfile: false,
      },
      { status: 200 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "profiling-chat-conversational-5-questions-with-dynamic-suggestions",
    version: "4.0",
    timestamp: new Date().toISOString(),
  });
}
