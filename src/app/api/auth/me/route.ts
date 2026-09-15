import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { UserModel } from "@/lib/db/models";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await UserModel.findById(authUser.userId).select("-passwordHash").lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch profile" }, { status: 500 });
  }
}
