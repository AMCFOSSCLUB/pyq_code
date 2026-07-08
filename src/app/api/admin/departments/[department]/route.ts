import { NextResponse } from "next/server";
import {
  getDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/backend/services/department";

export async function GET(
  req: Request,
  { params }: { params: { department: string } }
) {
  try {
    const department = await getDepartment(params.department);

    if (!department) {
      return NextResponse.json(
        {
          success: false,
          message: "Department not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: department,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { department: string } }
) {
  try {
    const body = await req.json();

    await updateDepartment(params.department, body);

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { department: string } }
) {
  try {
    await deleteDepartment(params.department);

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}