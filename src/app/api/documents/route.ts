import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { DocumentModel } from "@/lib/db/models";
import { initializeDatabaseSeed } from "@/lib/db/init";

export async function GET() {
  try {
    await connectToDatabase();
    await initializeDatabaseSeed();

    const documents = await DocumentModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(documents);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch documents" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const newDoc = await DocumentModel.create({
      ...body,
      _id: body._id || `doc-${Date.now()}`,
    });

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to save document" }, { status: 500 });
  }
}
