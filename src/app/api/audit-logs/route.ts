import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { AuditLogModel } from "@/lib/db/models";
import { initializeDatabaseSeed } from "@/lib/db/init";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    await initializeDatabaseSeed();

    const authUser = await getAuthenticatedUser(req);
    const searchParams = req.nextUrl.searchParams;

    const requestedUserId = searchParams.get("userId") || authUser?.userId;
    const requestedRole = searchParams.get("role") || authUser?.role;
    const requestedOrgId = searchParams.get("organizationId") || authUser?.organizationId;
    const filterMode = searchParams.get("mode") || "MY_LOGS"; // "MY_LOGS" | "ORG_LOGS" | "SYSTEM"

    let query: any = {};

    if (filterMode === "SYSTEM" && requestedRole === "ADMIN") {
      // Admins in SYSTEM mode can view all logs
      query = {};
    } else if (filterMode === "ORG_LOGS" && requestedOrgId) {
      // Filter by Organization
      query = { organizationId: requestedOrgId };
    } else if (filterMode === "MY_LOGS" && requestedUserId) {
      // Filter strictly by User (My Activity Logs)
      query = {
        $or: [
          { actorUserId: requestedUserId },
          { "metadata.userId": requestedUserId },
        ],
      };
    } else if (requestedRole === "VENDOR") {
      // Vendor default: return logs for vendor user or organization
      const vendorUser = requestedUserId || "usr-ven-001";
      query = {
        $or: [
          { actorUserId: vendorUser },
          { organizationId: requestedOrgId || "org-ven-001" },
        ],
      };
    } else if (requestedRole === "PROCUREMENT_OFFICER") {
      // Officer default: return officer user logs or organization logs
      const officerUser = requestedUserId || "usr-off-001";
      query = {
        $or: [
          { actorUserId: officerUser },
          { organizationId: requestedOrgId || "org-gov-001" },
        ],
      };
    } else if (requestedUserId) {
      query = { actorUserId: requestedUserId };
    }

    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const logs = await AuditLogModel.find(query).sort({ createdAt: -1 }).limit(limit).lean();

    return NextResponse.json({
      success: true,
      data: logs,
      meta: {
        total: logs.length,
        filterMode,
        userId: requestedUserId,
        role: requestedRole,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch audit logs" }, { status: 500 });
  }
}
