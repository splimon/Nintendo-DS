import { NextResponse } from "next/server";
/**
 * write a GET API route that searches for courses across multiple campus JSON files
 * Dahyun Kwon
 */
// import all campus course data JSON files
import hawaiiCC from "@/app/lib/data/json_format/hawaiicc_courses.json";
import hilo from "@/app/lib/data/json_format/hilo_courses.json";
import honoluluCC from "@/app/lib/data/json_format/honolulucc_courses.json";
import kapiolani from "@/app/lib/data/json_format/kapiolani_courses.json";
import kauai from "@/app/lib/data/json_format/kauai_courses.json";
import leeward from "@/app/lib/data/json_format/leeward_courses.json";
import manoa from "@/app/lib/data/json_format/manoa_courses.json";
import maui from "@/app/lib/data/json_format/maui_courses.json";
import pcatt from "@/app/lib/data/json_format/pcatt_courses.json";
import westOahu from "@/app/lib/data/json_format/west_oahu_courses.json";

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
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase() || "";

    if (!query) {
      return NextResponse.json({
        success: true,
        total: 0,
        message: "Please include a search query (e.g., ?q=data)",
        results: [],
      });
    }

    // ✅ safer version: handle JSON that may be parsed as {} instead of []
    const addCampus = (data: unknown, name: string): Course[] => {
      const courses = Array.isArray(data) ? (data as Course[]) : [];
      return courses.map(c => ({ ...c, campus: name }));
    };

    const allCourses: Course[] = [
      ...addCampus(hawaiiCC, "Hawai‘i Community College"),
      ...addCampus(hilo, "University of Hawai‘i at Hilo"),
      ...addCampus(honoluluCC, "Honolulu Community College"),
      ...addCampus(kapiolani, "Kapi‘olani Community College"),
      ...addCampus(kauai, "Kaua‘i Community College"),
      ...addCampus(leeward, "Leeward Community College"),
      ...addCampus(manoa, "University of Hawai‘i at Mānoa"),
      ...addCampus(maui, "University of Hawai‘i Maui College"),
      ...addCampus(
        pcatt,
        "Pacific Center for Advanced Technology Training (PCATT)"
      ),
      ...addCampus(westOahu, "University of Hawai‘i – West O‘ahu"),
    ];

    // filter by title or department name
    const results = allCourses.filter(c =>
      // c.course_title?.toLowerCase().includes(query) ||
      c.dept_name?.toLowerCase().includes(query)
    );

    // return top 20 results
    return NextResponse.json({
      success: true,
      total: results.length,
      results: results.slice(0, 20),
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
