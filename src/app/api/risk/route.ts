import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { RiskAssessmentModel, ComplianceAnalysisModel } from "@/lib/db/models";
import { initializeDatabaseSeed } from "@/lib/db/init";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    await initializeDatabaseSeed();

    const risks = await RiskAssessmentModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(risks);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch risk assessments" }, { status: 500 });
  }
}
