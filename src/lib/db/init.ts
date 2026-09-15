import connectToDatabase from "./mongodb";
import {
  UserModel,
  OrganizationModel,
  TenderModel,
  DocumentModel,
  BidModel,
  ComplianceAnalysisModel,
  RiskAssessmentModel,
  ReportModel,
  AuditLogModel,
} from "./models";
import {
  initialUsers,
  initialOrganizations,
  initialTenders,
  initialDocuments,
  initialBids,
  initialComplianceAnalyses,
  initialRiskAssessments,
  initialReports,
  initialAuditLogs,
} from "./seedData";

export async function initializeDatabaseSeed() {
  try {
    const mongoose = await connectToDatabase();

    // 0. Clean up any legacy/stale id_1 indexes on collections if present
    if (mongoose.connection?.db) {
      try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        for (const col of collections) {
          const collection = db.collection(col.name);
          const indexes = await collection.indexes();
          for (const idx of indexes) {
            if (idx.name === 'id_1') {
              console.log(`[MongoDB Init] Dropping stale id_1 index on collection: ${col.name}`);
              await collection.dropIndex('id_1').catch(() => {});
            }
          }
        }
      } catch (idxErr) {
        // ignore non-critical index check errors
      }
    }

    // 1. Ensure initial users (including Admin) exist in database
    const userCount = await UserModel.countDocuments();
    if (userCount === 0 || userCount < initialUsers.length) {
      console.log("[MongoDB Seed] Verifying & seeding initial user accounts into MongoDB...");
      const bcrypt = require("bcryptjs");

      for (const u of initialUsers) {
        const existing = await UserModel.findOne({ email: u.email.toLowerCase() });
        if (!existing) {
          let rawPass = "officerPass2026";
          if (u.role === "VENDOR") rawPass = "vendorPass2026";
          if (u.role === "ADMIN") rawPass = "adminPass2026";
          const passwordHash = await bcrypt.hash(rawPass, 10);
          await UserModel.create({ ...u, passwordHash });
          console.log(`[MongoDB Seed] Created initial user ${u.email} (${u.role})`);
        }
      }
    }

    // 2. Check and seed other collections if empty
    const tenderCount = await TenderModel.countDocuments();
    if (tenderCount === 0) {
      console.log("[MongoDB Seed] Seeding initial database records into MongoDB...");

      await OrganizationModel.insertMany(initialOrganizations).catch(() => {});
      await TenderModel.insertMany(initialTenders).catch(() => {});
      await DocumentModel.insertMany(initialDocuments).catch(() => {});
      await BidModel.insertMany(initialBids).catch(() => {});
      await ComplianceAnalysisModel.insertMany(initialComplianceAnalyses).catch(() => {});
      await RiskAssessmentModel.insertMany(initialRiskAssessments).catch(() => {});
      await ReportModel.insertMany(initialReports).catch(() => {});
      await AuditLogModel.insertMany(initialAuditLogs).catch(() => {});

      console.log("[MongoDB Seed] Initial database seeding completed successfully!");
    }
  } catch (error) {
    console.error("[MongoDB Seed] Failed to seed database:", error);
  }
}
