import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { AuditLogModel } from "@/lib/db/models";
import { initializeDatabaseSeed } from "@/lib/db/init";

export async function GET() {
  try {
    await connectToDatabase();
    await initializeDatabaseSeed();

    const logs = await AuditLogModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch audit logs" }, { status: 500 });
  }
}
