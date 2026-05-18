import { NextResponse } from "next/server";
import { db } from "@/db";
import { websites } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, ...values } = data;

    // Helper to safely parse date
    const parseDate = (dateVal: any) => {
      if (!dateVal) return null;
      const d = new Date(dateVal);
      return isNaN(d.getTime()) ? null : d;
    };

    const payload: any = {
      title: values.title,
      theme: values.theme || "barfi",
      status: values.status || "draft",
      eventDate: parseDate(values.eventDate),
      eventTime: values.eventTime || null,
      endDate: parseDate(values.endDate),
      endTime: values.endTime || null,
      content: values.content,
      lastModifiedBy: values.lastModifiedBy || "Anonymous",
      updatedAt: new Date(),
    };

    console.log("Saving website with payload:", JSON.stringify(payload, null, 2));

    if (id) {
      // Update existing website
      const updated = await db.update(websites)
        .set(payload)
        .where(eq(websites.id, parseInt(id)))
        .returning();
      return NextResponse.json(updated[0]);
    } else {
      // Create new website
      const newWebsite = await db.insert(websites).values(payload).returning();
      return NextResponse.json(newWebsite[0]);
    }
  } catch (error: any) {
    console.error("CRITICAL ERROR in /api/websites POST:", error);
    // Return specific error message if possible
    return NextResponse.json({ 
      error: "Failed to save website", 
      details: error.message,
      hint: "Check if your database schema is up to date (run npx drizzle-kit push)"
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allWebsites = await db.select().from(websites).orderBy(desc(websites.updatedAt));
    return NextResponse.json(allWebsites);
  } catch (error) {
    console.error("Error fetching websites:", error);
    return NextResponse.json({ error: "Failed to fetch websites" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Website ID is required" }, { status: 400 });
    }

    await db.delete(websites).where(eq(websites.id, parseInt(id)));
    
    return NextResponse.json({ success: true, message: "Website deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting website:", error);
    return NextResponse.json({ error: "Failed to delete website", details: error.message }, { status: 500 });
  }
}

