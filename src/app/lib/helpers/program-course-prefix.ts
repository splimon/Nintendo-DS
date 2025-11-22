/**
 * Program to Course/Department Mapping
 * Maps program names to their corresponding course prefixes AND department names
 * This ensures courses are ALWAYS found for recommended programs
 */

export interface ProgramSearchTerms {
  coursePrefixes: string[];
  departmentNames: string[];
}

/**
 * Comprehensive program-to-course/department mapping
 * KEY: Lowercase program keywords
 * VALUE: Course prefixes AND department names to search
 */
export const PROGRAM_SEARCH_MAP: Record<string, ProgramSearchTerms> = {
  // ============================================
  // COMPUTER SCIENCE & IT PROGRAMS
  // ============================================
  "computer science": {
    coursePrefixes: ["ICS", "CS"],
    departmentNames: ["Information and Computer Sciences", "Computer Science"]
  },
  "information and computer sciences": {
    coursePrefixes: ["ICS"],
    departmentNames: ["Information and Computer Sciences"]
  },
  "information technology": {
    coursePrefixes: ["ITS", "IT"],
    departmentNames: ["Information Technology", "COMPUTING, SECURITY, AND NETWORKING TECHNOLOGY"]
  },
  "comp electronicsandnetwork tech": {
    coursePrefixes: ["CSNT", "ICS", "IT"],
    departmentNames: ["COMPUTING, SECURITY, AND NETWORKING TECHNOLOGY", "Computer Electronics and Networking Technology", "Information Technology"]
  },
  "comp securityandnetwork tech": {
    coursePrefixes: ["CSNT", "ICS", "IT"],
    departmentNames: ["COMPUTING, SECURITY, AND NETWORKING TECHNOLOGY", "Information Technology", "Cybersecurity"]
  },
  "computing": {
    coursePrefixes: ["ICS", "IT", "CSNT"],
    departmentNames: ["COMPUTING, SECURITY, AND NETWORKING TECHNOLOGY", "Information and Computer Sciences"]
  },
  "programming": {
    coursePrefixes: ["ICS", "IT"],
    departmentNames: ["Information and Computer Sciences", "COMPUTING, SECURITY, AND NETWORKING TECHNOLOGY"]
  },
  "software": {
    coursePrefixes: ["ICS", "CS"],
    departmentNames: ["Information and Computer Sciences", "Computer Science"]
  },
  "data science": {
    coursePrefixes: ["ICS", "MATH", "STAT"],
    departmentNames: ["Information and Computer Sciences", "Mathematics", "Statistics"]
  },
  "digital media": {
    coursePrefixes: ["DM", "NMA", "CINE", "ART"],
    departmentNames: ["Digital Media", "New Media Arts", "Cinema"]
  },
  "web": {
    coursePrefixes: ["ICS", "DM"],
    departmentNames: ["Information and Computer Sciences", "Digital Media"]
  },

  // ============================================
  // ENGINEERING PROGRAMS
  // ============================================
  "electrical engineering": {
    coursePrefixes: ["EE", "ECE", "ENGR"],
    departmentNames: ["Electrical Engineering", "Engineering"]
  },
  "mechanical engineering": {
    coursePrefixes: ["ME", "ENGR"],
    departmentNames: ["Mechanical Engineering", "Engineering"]
  },
  "civil engineering": {
    coursePrefixes: ["CE", "ENGR"],
    departmentNames: ["Civil and Environmental Engineering", "CIVIL ENGINEERING"]
  },
  "engineering": {
    coursePrefixes: ["ENGR", "EE", "ME", "CE"],
    departmentNames: ["Engineering", "Electrical Engineering"]
  },
  "engineering technology": {
    coursePrefixes: ["ET", "ELET"],
    departmentNames: ["Engineering Technology", "Electronics Technology"]
  },

  // ============================================
  // BUSINESS PROGRAMS
  // ============================================
  "business administration": {
    coursePrefixes: ["BUS", "BUSA", "FIN", "MKT", "MGT"],
    departmentNames: ["Business", "Business Administration"]
  },
  "business": {
    coursePrefixes: ["BUS", "BUSA"],
    departmentNames: ["Business", "Business Administration"]
  },
  "accounting": {
    coursePrefixes: ["ACC", "ACCT"],
    departmentNames: ["Accounting", "ACCOUNTING"]
  },
  "marketing": {
    coursePrefixes: ["MKT", "MKTG", "BUS"],
    departmentNames: ["Marketing", "Business"]
  },
  "finance": {
    coursePrefixes: ["FIN", "BUS"],
    departmentNames: ["Finance", "Business"]
  },
  "management": {
    coursePrefixes: ["MGT", "BUS"],
    departmentNames: ["Management", "Business"]
  },
  "hospitality": {
    coursePrefixes: ["HOST", "TIM", "HTM"],
    departmentNames: ["Hospitality and Tourism", "Travel Industry Management"]
  },
  "tourism": {
    coursePrefixes: ["TIM", "HOST"],
    departmentNames: ["Travel Industry Management", "Hospitality and Tourism"]
  },

  // ============================================
  // HEALTHCARE & NURSING PROGRAMS
  // ============================================
  "nursing": {
    coursePrefixes: ["NURS"],
    departmentNames: ["Nursing", "School of Nursing and Dental Hygiene"]
  },
  "medical assistant": {
    coursePrefixes: ["MEDA", "HLTH"],
    departmentNames: ["Medical Assisting", "Health Sciences"]
  },
  "dental": {
    coursePrefixes: ["DH", "DENT"],
    departmentNames: ["Dental Hygiene", "School of Nursing and Dental Hygiene"]
  },
  "health": {
    coursePrefixes: ["HLTH", "PHYL"],
    departmentNames: ["Health Sciences", "Allied Health"]
  },

  // ============================================
  // ARTS & HUMANITIES
  // ============================================
  "art": {
    coursePrefixes: ["ART"],
    departmentNames: ["Art", "ART"]
  },
  "music": {
    coursePrefixes: ["MUS"],
    departmentNames: ["Music"]
  },
  "english": {
    coursePrefixes: ["ENG", "ENGL"],
    departmentNames: ["English", "ENGLISH"]
  },
  "hawaiian": {
    coursePrefixes: ["HAW", "HWST"],
    departmentNames: ["Hawaiian", "Hawaiian Studies"]
  },

  // ============================================
  // SCIENCES
  // ============================================
  "biology": {
    coursePrefixes: ["BIOL", "BIO"],
    departmentNames: ["Biology", "BIOL"]
  },
  "chemistry": {
    coursePrefixes: ["CHEM"],
    departmentNames: ["Chemistry", "CHEM"]
  },
  "physics": {
    coursePrefixes: ["PHYS"],
    departmentNames: ["Physics", "Physics and Astronomy"]
  },
  "environmental": {
    coursePrefixes: ["NREM", "SUST"],
    departmentNames: ["Natural Resources and Environmental Management", "Environmental Science"]
  },
  "marine": {
    coursePrefixes: ["BOT", "ZOOL", "OCN"],
    departmentNames: ["Botany", "Zoology", "Oceanography"]
  },

  // ============================================
  // EDUCATION
  // ============================================
  "education": {
    coursePrefixes: ["ED", "EDUC"],
    departmentNames: ["Education", "Teacher Education"]
  },
  "teaching": {
    coursePrefixes: ["ED", "EDUC"],
    departmentNames: ["Teacher Education", "Education"]
  },
  "early childhood": {
    coursePrefixes: ["ECE", "FAMR"],
    departmentNames: ["Early Childhood Education", "Family Resources"]
  },

  // ============================================
  // CULINARY & FOOD SERVICE
  // ============================================
  "culinary": {
    coursePrefixes: ["CULN", "FSHE"],
    departmentNames: ["Culinary Arts", "Food Service"]
  },

  // ============================================
  // SOCIAL SCIENCES
  // ============================================
  "psychology": {
    coursePrefixes: ["PSY", "PSYCH"],
    departmentNames: ["Psychology", "PSYCH"]
  },
  "sociology": {
    coursePrefixes: ["SOC"],
    departmentNames: ["Sociology"]
  },
  "history": {
    coursePrefixes: ["HIST"],
    departmentNames: ["History"]
  },
  "anthropology": {
    coursePrefixes: ["ANTH"],
    departmentNames: ["Anthropology", "ANTH"]
  },

  // ============================================
  // LIBERAL ARTS
  // ============================================
  "liberal arts": {
    coursePrefixes: ["LA"],
    departmentNames: ["Liberal Arts", "Arts and Sciences"]
  }
};

/**
 * Get ALL search terms (course prefixes + department names) for a program
 * This ensures maximum course matching
 * 
 * @param programName - Full program name (e.g., "Computer Science (Bachelor of Science)")
 * @returns Array of search terms (prefixes and department names)
 */
export function getAllSearchTermsForProgram(programName: string): string[] {
  const programLower = programName.toLowerCase();
  const searchTerms = new Set<string>();

  // Check each keyword in the map
  for (const [keyword, terms] of Object.entries(PROGRAM_SEARCH_MAP)) {
    if (programLower.includes(keyword)) {
      // Add course prefixes
      terms.coursePrefixes.forEach(prefix => searchTerms.add(prefix));
      // Add department names
      terms.departmentNames.forEach(dept => searchTerms.add(dept));
    }
  }

  // If no matches found, extract base program name as fallback
  if (searchTerms.size === 0) {
    const baseName = extractBaseProgramName(programName);
    searchTerms.add(baseName);
  }

  return Array.from(searchTerms);
}

/**
 * Get only course prefixes for a program (backward compatible with old code)
 * 
 * @param programName - Full program name
 * @returns Array of course prefixes
 */
export function getCoursePrefixesForProgram(programName: string): string[] {
  const programLower = programName.toLowerCase();
  const prefixes = new Set<string>();

  for (const [keyword, terms] of Object.entries(PROGRAM_SEARCH_MAP)) {
    if (programLower.includes(keyword)) {
      terms.coursePrefixes.forEach(prefix => prefixes.add(prefix));
    }
  }

  return Array.from(prefixes);
}

/**
 * Get only department names for a program
 * 
 * @param programName - Full program name
 * @returns Array of department names
 */
export function getDepartmentNamesForProgram(programName: string): string[] {
  const programLower = programName.toLowerCase();
  const departments = new Set<string>();

  for (const [keyword, terms] of Object.entries(PROGRAM_SEARCH_MAP)) {
    if (programLower.includes(keyword)) {
      terms.departmentNames.forEach(dept => departments.add(dept));
    }
  }

  return Array.from(departments);
}

/**
 * Extract base program name from full program title
 * e.g., "Computer Science (Bachelor of Science - Data Science)" → "Computer Science"
 */
function extractBaseProgramName(fullName: string): string {
  return fullName.replace(/\s*\([^)]*\)\s*/g, '').trim().replace(/\s+/g, ' ');
}

// ============================================
// LEGACY EXPORT (for backward compatibility)
// ============================================
export const PROGRAM_PREFIX_MAP: Record<string, string[]> = Object.fromEntries(
  Object.entries(PROGRAM_SEARCH_MAP).map(([key, value]) => [key, value.coursePrefixes])
);
