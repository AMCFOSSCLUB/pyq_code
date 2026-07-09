import { NextResponse } from "next/server";
import {
  updateSubject,
  deleteSubject,
} from "@/backend/services/department";
import { getAdminSession } from "@/backend/services/auth";

export async function PUT(
  req: Request,
  { params }: { params: { department: string; subject: string } }
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
    const subject = await updateSubject(
      params.department,
      params.subject,
      body
    );

    return NextResponse.json({
      success: true,
      subject,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update subject",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { department: string; subject: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await deleteSubject(params.department, params.subject);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete subject",
      },
      { status: 500 }
    );
  }
}
