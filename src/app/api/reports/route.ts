import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { ReportModel } from "@/lib/db/models";
import { initializeDatabaseSeed } from "@/lib/db/init";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    await initializeDatabaseSeed();

    const reports = await ReportModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(reports);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const newReport = await ReportModel.create({
      ...body,
      _id: body._id || `rep-${Date.now()}`,
      generatedAt: new Date().toISOString(),
    });

    return NextResponse.json(newReport, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to generate report" }, { status: 500 });
  }
}
