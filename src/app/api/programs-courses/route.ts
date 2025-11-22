import { NextResponse } from "next/server";
import { getAllSearchTermsForProgram } from "@/app/lib/helpers/program-course-prefix";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * write a GET API route that searches for courses across multiple campus JSON files
 * ENHANCED: Now uses intelligent program-to-course mappings to ensure courses are always found
 * FIXED: Load JSON files dynamically at runtime to avoid Turbopack issues with large files
 * Dahyun Kwon (Enhanced by AI Assistant)
 */

// Helper function to load JSON files dynamically at runtime
function loadCourseJSON(filename: string): Course[] {
  try {
    const filePath = join(process.cwd(), 'src/app/lib/data/json_format', filename);
    const fileContent = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`[Programs-Courses API] Error loading ${filename}:`, error);
    return [];
  }
}

// Define Course interface
interface Course {
  // course_id?: string;
  course_prefix?: string;
  course_number?: string;
  course_title?: string;
  course_desc?: string;
  num_units?: string;
  dept_name?: string;
  metadata?: string;
  campus?: string; // Added by addCampus function
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const campus = searchParams.get("campus") || "";
    const limit = parseInt(searchParams.get("limit") || "100", 10); // Default to 100, respect URL param

    if (!query) {
      return NextResponse.json({
        success: true,
        total: 0,
        message: "Please include a search query (e.g., ?q=data)",
        results: [],
      });
    }

    console.log(`[Programs-Courses API] Searching for: "${query}" at campus: "${campus || 'all'}"`);

    // ✅ Get intelligent search terms using program mappings
    const searchTerms = getAllSearchTermsForProgram(query);
    console.log(`[Programs-Courses API] Enhanced search terms: ${searchTerms.join(", ")}`);

    // ✅ Load courses dynamically at runtime to avoid Turbopack issues with large JSON files
    const addCampus = (courses: Course[], name: string): Course[] => {
      return courses.map(c => ({ ...c, campus: name }));
    };

    const allCourses: Course[] = [
      ...addCampus(loadCourseJSON('hawaiicc_courses.json'), "Hawai'i Community College"),
      ...addCampus(loadCourseJSON('hilo_courses.json'), "University of Hawai'i at Hilo"),
      ...addCampus(loadCourseJSON('honolulucc_courses.json'), "Honolulu Community College"),
      ...addCampus(loadCourseJSON('kapiolani_courses.json'), "Kapi'olani Community College"),
      ...addCampus(loadCourseJSON('kauai_courses.json'), "Kaua'i Community College"),
      ...addCampus(loadCourseJSON('leeward_courses.json'), "Leeward Community College"),
      ...addCampus(loadCourseJSON('manoa_courses.json'), "University of Hawai'i at Mānoa"),
      ...addCampus(loadCourseJSON('maui_courses.json'), "University of Hawai'i Maui College"),
      ...addCampus(loadCourseJSON('pcatt_courses.json'), "Pacific Center for Advanced Technology Training (PCATT)"),
      ...addCampus(loadCourseJSON('west_oahu_courses.json'), "University of Hawai'i – West O'ahu"),
    ];

    console.log(`[Programs-Courses API] Loaded ${allCourses.length} total courses across all campuses`);

    // Filter by campus if specified - normalize ALL special characters including regular apostrophes
    let debugCount = 0;
    const coursesToSearch = campus
      ? allCourses.filter(c => {
          const courseCampus = (c.campus || "").toLowerCase()
            .replace(/[ʻ''']/g, "")   // Remove ALL apostrophes (okina + regular + fancy quotes)
            .replace(/[āáàäâ]/g, "a") // Normalize a variants
            .replace(/[–—-]/g, "-")   // Normalize dashes
            .replace(/\s+/g, " ")     // Normalize spaces
            .trim();
          const searchCampus = campus.toLowerCase()
            .replace(/[ʻ''']/g, "")   // Remove ALL apostrophes
            .replace(/[āáàäâ]/g, "a")
            .replace(/[–—-]/g, "-")
            .replace(/\s+/g, " ")
            .trim();
          
          // Debug logging for first few courses
          if (debugCount < 3) {
            console.log(`[Debug] Comparing: "${courseCampus}" vs "${searchCampus}" = ${courseCampus.includes(searchCampus)}`);
            debugCount++;
          }
          
          return courseCampus.includes(searchCampus);
        })
      : allCourses;

    console.log(`[Programs-Courses API] Searching ${coursesToSearch.length} courses (campus filter: "${campus || 'all'}")`);

    // ✅ ENHANCED SEARCH: Use all search terms (prefixes + department names)
    const results = coursesToSearch.filter(course => {
      const courseTitleLower = course.course_title?.toLowerCase() || "";
      const coursePrefixLower = course.course_prefix?.toLowerCase() || "";
      const deptNameLower = course.dept_name?.toLowerCase() || "";
      
      // Match against any search term
      return searchTerms.some(term => {
        const termLower = term.toLowerCase();
        
        // For single/short terms (like "and", "it"), be more strict
        if (termLower.length <= 3) {
          return (
            coursePrefixLower === termLower || // Exact prefix match only for short terms
            deptNameLower === termLower        // Exact department match only
          );
        }
        
        // For longer terms, allow partial matching
        return (
          courseTitleLower.includes(termLower) ||
          deptNameLower.includes(termLower) ||
          coursePrefixLower === termLower ||
          coursePrefixLower.startsWith(termLower)
        );
      });
    });

    console.log(`[Programs-Courses API] Found ${results.length} matching courses`);

    // Return courses up to the specified limit
    return NextResponse.json({
      success: true,
      total: results.length,
      returned: Math.min(results.length, limit),
      results: results.slice(0, limit),
    });
  } catch (err: unknown) {
    console.error("Error in /api/programs-courses:", err);

    if (err instanceof Error) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
