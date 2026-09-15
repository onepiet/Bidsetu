import { TenderModel, AuditLogModel } from "@/lib/db/models";
import { TenderStatus } from "@/types";

export const VALID_TENDER_STATUS_TRANSITIONS: Record<TenderStatus, TenderStatus[]> = {
  DRAFT: ["PUBLISHED", "CANCELLED"],
  PUBLISHED: ["PROCESSING", "ACTIVE", "CLOSING_SOON", "CANCELLED"],
  PROCESSING: ["ACTIVE", "UNDER_EVALUATION", "CANCELLED"],
  ACTIVE: ["CLOSING_SOON", "CLOSED", "UNDER_EVALUATION", "CANCELLED"],
  CLOSING_SOON: ["CLOSED", "UNDER_EVALUATION", "CANCELLED"],
  UNDER_EVALUATION: ["AWARDED", "CANCELLED", "CLOSED"],
  CLOSED: ["AWARDED", "ARCHIVED", "CANCELLED"],
  AWARDED: ["ARCHIVED"],
  CANCELLED: ["ARCHIVED"],
  ARCHIVED: [],
};

export class TenderService {
  static isValidStatusTransition(currentStatus: TenderStatus, newStatus: TenderStatus): boolean {
    if (currentStatus === newStatus) return true;
    const allowed = VALID_TENDER_STATUS_TRANSITIONS[currentStatus] || [];
    return allowed.includes(newStatus);
  }

  static async updateTenderStatus(
    tenderId: string,
    newStatus: TenderStatus,
    actorUserId: string,
    actorName: string,
    actorRole: string
  ): Promise<{ success: boolean; tender?: any; error?: string }> {
    const tender = await TenderModel.findOne({
      $or: [{ _id: tenderId }, { tenderId: tenderId }],
    });

    if (!tender) {
      return { success: false, error: "Tender record not found" };
    }

    const currentStatus = tender.status as TenderStatus;
    if (!this.isValidStatusTransition(currentStatus, newStatus)) {
      return {
        success: false,
        error: `Invalid status transition from ${currentStatus} to ${newStatus}`,
      };
    }

    tender.status = newStatus;
    await tender.save();

    await AuditLogModel.create({
      _id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actorUserId,
      actorName,
      actorRole,
      organizationId: tender.organizationId,
      action: "TENDER_STATUS_UPDATED",
      resourceType: "TENDER",
      resourceId: tender._id,
      result: "SUCCESS",
      metadata: { previousStatus: currentStatus, newStatus, tenderId: tender.tenderId },
    });

    return { success: true, tender: tender.toObject() };
  }

  static async getTendersWithFilters(params: {
    search?: string;
    category?: string;
    status?: string;
    authority?: string;
    location?: string;
    minValue?: number;
    maxValue?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (params.category) query.category = params.category;
    if (params.status) query.status = params.status;
    if (params.authority) query.authority = { $regex: params.authority, $options: "i" };
    if (params.location) query.location = { $regex: params.location, $options: "i" };

    if (params.minValue !== undefined || params.maxValue !== undefined) {
      query.estimatedValue = {};
      if (params.minValue !== undefined) query.estimatedValue.$gte = params.minValue;
      if (params.maxValue !== undefined) query.estimatedValue.$lte = params.maxValue;
    }

    if (params.search) {
      const searchRegex = new RegExp(params.search, "i");
      query.$or = [
        { title: searchRegex },
        { tenderId: searchRegex },
        { description: searchRegex },
        { authority: searchRegex },
        { department: searchRegex },
        { category: searchRegex },
      ];
    }

    const sortField = params.sortBy || "createdAt";
    const sortDirection = params.sortOrder === "asc" ? 1 : -1;
    const sortOption: any = { [sortField]: sortDirection };

    const [tenders, total] = await Promise.all([
      TenderModel.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
      TenderModel.countDocuments(query),
    ]);

    return {
      tenders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
