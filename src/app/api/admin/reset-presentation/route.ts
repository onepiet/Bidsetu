import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import connectToDatabase from "@/lib/db/mongodb";
import {
  TenderModel,
  BidModel,
  ComplianceAnalysisModel,
  RiskAssessmentModel,
  DocumentModel,
  AuditLogModel,
  UserModel,
  OrganizationModel,
} from "@/lib/db/models";
import {
  initialUsers,
  initialOrganizations,
  initialTenders,
  initialDocuments,
  initialBids,
  initialComplianceAnalyses,
  initialRiskAssessments,
  initialAuditLogs,
} from "@/lib/db/seedData";

export async function POST(req: NextRequest) {
  try {
    // 1. Reset in-memory DataRepository
    repository.resetToPresentationState();

    // 2. If MongoDB is connected, re-seed MongoDB database collections to exact presentation baseline
    try {
      await connectToDatabase();
      await Promise.all([
        UserModel.deleteMany({}),
        OrganizationModel.deleteMany({}),
        TenderModel.deleteMany({}),
        DocumentModel.deleteMany({}),
        BidModel.deleteMany({}),
        ComplianceAnalysisModel.deleteMany({}),
        RiskAssessmentModel.deleteMany({}),
        AuditLogModel.deleteMany({}),
      ]);

      await Promise.all([
        UserModel.insertMany(initialUsers),
        OrganizationModel.insertMany(initialOrganizations),
        TenderModel.insertMany(initialTenders),
        DocumentModel.insertMany(initialDocuments),
        BidModel.insertMany(initialBids),
        ComplianceAnalysisModel.insertMany(initialComplianceAnalyses),
        RiskAssessmentModel.insertMany(initialRiskAssessments),
        AuditLogModel.insertMany(initialAuditLogs),
      ]);
    } catch (dbErr: any) {
      console.warn("[Reset Presentation Mongo Warning]", dbErr?.message || dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "BIDSETU presentation state has been successfully reset to the SIH26100 baseline scenario.",
      scenario: "500MW Grid-Connected Solar Photovoltaic & Energy Storage Infrastructure",
      bidders: [
        { id: "bid-001", name: "Tata Power Renewable Energy Limited", status: "COMPLIANT / LOW RISK", score: 96 },
        { id: "bid-002", name: "Adani Green Energy Systems Ltd", status: "REVIEW REQUIRED / MEDIUM RISK", score: 82 },
        { id: "bid-003", name: "Vertex Infotech & Power Solutions Pvt Ltd", status: "NON-COMPLIANT / HIGH RISK", score: 48 },
        { id: "bid-004", name: "Evergreen Energy Private Limited", status: "REVIEW REQUIRED / MEDIUM RISK", score: 78 },
      ],
      resetAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Reset Presentation Error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to reset presentation state" },
      { status: 500 }
    );
  }
}
