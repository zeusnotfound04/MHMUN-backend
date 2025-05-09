import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQRCodeWithFormId } from "@/actions";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(1),
    school: z.string().min(1),
    email: z.string().email(),
    formId: z.string().min(1),
    phone: z.string(),
    committee: z.string().optional(),
    experience: z.string().optional(),
    countryPreferences: z.string().optional(),
    delegationType: z.string().optional()
  });

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const school = url.searchParams.get("school");
    const name = url.searchParams.get("name");
    const committee = url.searchParams.get("committee");
    
    const whereClause: any = {};
    
    if (school) {
      whereClause.school = {
        contains: school,
        mode: 'insensitive'
      };
    }
    
    if (name) {
      whereClause.name = {
        contains: name,
        mode: 'insensitive'
      };
    }
    
    if (committee) {
      whereClause.committee = committee;
    }
    
    const participants = await prisma.participant.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(participants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json(
      { error: "Failed to retrieve participants" },
      { status: 500 }
    );
  }
}




export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received form data:", body);

    const validation = formSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid form data",
          details: validation.error.errors
        },
        { status: 400 }
      );
    }

    const { 
      name, 
      email, 
      phone, 
      school, 
      formId, 
      committee, 
      experience, 
      countryPreferences, 
      delegationType 
    } = validation.data;
    
    console.log("Form data:", validation.data);

    const qrImageUrl = await generateQRCodeWithFormId(formId);
    console.log("QR Code image URL:", qrImageUrl);

    const participant = await prisma.participant.create({
      data: {
        name,
        email,
        phone,
        school,
        formId,
        qrImageUrl,
        committee,
        experience,
        countryPreferences,
        delegationType
      },
    });

    return NextResponse.json(
      {
        message: "Participant created successfully",
        participant,
        qrImageUrl
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in registration route:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
