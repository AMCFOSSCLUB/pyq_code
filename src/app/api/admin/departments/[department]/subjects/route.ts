import { NextResponse } from "next/server";
import { addSubject } from "@/backend/services/department";
import { getAdminSession } from "@/backend/services/auth";

export async function POST(
  req: Request,
  { params }: { params: { department: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    await addSubject(params.department, body);

    return NextResponse.json({
      success: true,
      subject: body,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to add subject",
      },
      { status: 500 }
    );
  }
}
