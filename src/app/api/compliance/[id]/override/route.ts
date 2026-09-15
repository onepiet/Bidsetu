import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { ComplianceEngine } from "@/lib/services/complianceEngine";
import { repository } from "@/lib/db/repository";
import { getAuthenticatedUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthenticatedUser(req);
    const body = await req.json();
    const { action, resultId, newResult, decision, reason } = body;

    const officerUserId = user?.userId || "usr-off-001";
    const officerName = user?.name || "Prayag Kaushik (Procurement Officer)";

    let updatedAnalysis: any = null;

    if (action === "ITEM_OVERRIDE") {
      if (!resultId || !newResult || !reason) {
        return NextResponse.json(
          { success: false, error: { message: "resultId, newResult, and reason are required" } },
          { status: 400 }
        );
      }

      // Update in-memory repository first
      updatedAnalysis = repository.updateComplianceItem(params.id, resultId, newResult, reason, officerName);

      // Attempt MongoDB update
      try {
        await connectToDatabase();
        const mongoResult = await ComplianceEngine.overrideItemResult(
          params.id,
          resultId,
          newResult,
          reason,
          officerUserId,
          officerName
        );
        if (mongoResult) updatedAnalysis = mongoResult;
      } catch (dbErr) {
        console.warn("[Override DB Warning]", dbErr);
      }

      return NextResponse.json({ success: true, data: updatedAnalysis });
    } else if (action === "FINAL_DECISION") {
      if (!decision || !reason) {
        return NextResponse.json(
          { success: false, error: { message: "decision and reason are required" } },
          { status: 400 }
        );
      }

      // Update in-memory repository first
      updatedAnalysis = repository.recordFinalOfficerDecision(params.id, decision, reason, officerName);

      // Attempt MongoDB update
      try {
        await connectToDatabase();
        const mongoResult = await ComplianceEngine.recordFinalDecision(
          params.id,
          decision,
          reason,
          officerUserId,
          officerName
        );
        if (mongoResult) updatedAnalysis = mongoResult;
      } catch (dbErr) {
        console.warn("[Final Decision DB Warning]", dbErr);
      }

      return NextResponse.json({ success: true, data: updatedAnalysis });
    }

    return NextResponse.json(
      { success: false, error: { message: "Invalid action. Supported: ITEM_OVERRIDE, FINAL_DECISION" } },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[Compliance Override Error]", error);
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
