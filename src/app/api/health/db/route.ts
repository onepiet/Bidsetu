import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { initializeDatabaseSeed } from "@/lib/db/init";
import {
  TenderModel,
  BidModel,
  DocumentModel,
  ComplianceAnalysisModel,
  UserModel,
  OrganizationModel,
  AuditLogModel,
} from "@/lib/db/models";

export async function GET() {
  try {
    await connectToDatabase();
    await initializeDatabaseSeed();

    const [
      tendersCount,
      bidsCount,
      documentsCount,
      complianceCount,
      usersCount,
      organizationsCount,
      auditLogsCount,
    ] = await Promise.all([
      TenderModel.countDocuments(),
      BidModel.countDocuments(),
      DocumentModel.countDocuments(),
      ComplianceAnalysisModel.countDocuments(),
      UserModel.countDocuments(),
      OrganizationModel.countDocuments(),
      AuditLogModel.countDocuments(),
    ]);

    return NextResponse.json({
      connected: true,
      databaseName: process.env.MONGODB_DB_NAME || "bidsetu",
      metrics: {
        tenders: tendersCount,
        bids: bidsCount,
        documents: documentsCount,
        complianceAnalyses: complianceCount,
        users: usersCount,
        organizations: organizationsCount,
        auditLogs: auditLogsCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        connected: false,
        error: error?.message || "Failed to connect to MongoDB",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
