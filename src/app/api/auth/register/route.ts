import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { UserModel, OrganizationModel, AuditLogModel } from "@/lib/db/models";
import { hashPassword, signJwtToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { email, password, fullName, phone, role, organizationName, organizationType, registrationNumber } = body;

    if (!email || !password || !fullName || !role) {
      return NextResponse.json({ error: "Missing required registration fields" }, { status: 400 });
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const userId = `usr-${Date.now()}`;
    let orgId = `org-${Date.now()}`;

    if (organizationName) {
      const newOrg = await OrganizationModel.create({
        _id: orgId,
        name: organizationName,
        type: organizationType || "PRIVATE_ENTERPRISE",
        registrationNumber: registrationNumber || `REG-${Date.now()}`,
        address: {
          line1: body.addressLine1 || "Corporate Office",
          city: body.city || "New Delhi",
          state: body.state || "Delhi",
          pinCode: body.pinCode || "110001",
        },
        status: "VERIFIED",
      });
      orgId = newOrg._id;
    }

    const newUser = await UserModel.create({
      _id: userId,
      email: email.toLowerCase(),
      passwordHash,
      role: role || "VENDOR",
      organizationId: orgId,
      profile: {
        fullName,
        phone: phone || "+91 98765 43210",
      },
      status: "ACTIVE",
    });

    await AuditLogModel.create({
      _id: `aud-${Date.now()}`,
      actorUserId: userId,
      actorName: fullName,
      actorRole: role || "VENDOR",
      organizationId: orgId,
      action: "USER_REGISTERED",
      resourceType: "USER",
      resourceId: userId,
      result: "SUCCESS",
    });

    const tokenPayload = {
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
      organizationId: newUser.organizationId,
      name: fullName,
    };

    const token = signJwtToken(tokenPayload);

    const response = NextResponse.json(
      {
        success: true,
        user: {
          _id: newUser._id,
          email: newUser.email,
          role: newUser.role,
          profile: newUser.profile,
          organizationId: newUser.organizationId,
        },
        token,
      },
      { status: 201 }
    );

    response.cookies.set("bidsetu_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("[Register API Error]", error);
    return NextResponse.json({ error: error?.message || "Registration failed" }, { status: 500 });
  }
}
