import { NextResponse } from "next/server";
import { getDepartments, addDepartment } from "@/backend/services/department";

export async function GET() {
  try {
    const departments = await getDepartments();

    return NextResponse.json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load departments",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await addDepartment(body);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create department",
      },
      { status: 500 }
    );
  }
}