/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQRCodeWithFormId } from "@/actions";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';
interface ParticipantModel {
  id: string;
  name: string;
  school: string;
  email: string;
  phone: string;
  qrImageUrl: string;
  formId: string;
  committee: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const formSchema = z.object({
    name: z.string().min(1),
    school: z.string().min(1),
    class: z.string().min(1),
    email: z.string().email(),
    formId: z.string().min(1),
    phone: z.string(),
    committee: z.string(),
    delegationType: z.string().optional(),
    profilePicture: z.string().optional()
});

type ParticipantFormData = z.infer<typeof formSchema>;

// Type for search parameters in GET requests
interface ParticipantSearchParams {
  school?: string;
  name?: string;
  committee?: string;
}

// Type for search where clause
interface ParticipantWhereInput {
  school?: {
    contains: string;
    mode: 'insensitive';
  };
  name?: {
    contains: string;
    mode: 'insensitive';
  };
  committee?: string;
}

// Type for API responses
interface ApiResponse<T> {
  message?: string;
  error?: string;
  details?: unknown;
  participant?: T;
  qrImageUrl?: string;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const school = url.searchParams.get("school");
    const name = url.searchParams.get("name");
    const committee = url.searchParams.get("committee");
    
    const whereClause: ParticipantWhereInput = {};
    
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
    return NextResponse.json<ApiResponse<never>>(
      { error: "Failed to retrieve participants" },
      { status: 500 }
    );
  }
}

// Type for Prisma errors
interface PrismaError {
  code?: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received form data:", body);

    const validation = formSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<ApiResponse<never>>(
        {
          error: "Invalid form data",
          details: validation.error.errors
        },
        { status: 400 }
      );
    }    const { 
      name, 
      email, 
      phone, 
      school,
      class: studentClass,
      formId, 
      committee, 
      profilePicture
    }: ParticipantFormData = validation.data;
    
    console.log("Form data:", validation.data);

    const participantId =  uuidv4();
    const qrImageUrl = await generateQRCodeWithFormId(formId , participantId); ;
    console.log("QR Code image URL:", qrImageUrl);    const participant = await prisma.participant.create({
      data: {
        id: participantId,
        name,
        email,
        phone,
        school,
        class: studentClass,
        formId,
        qrImageUrl,
        committee,
        profilePicture
      },
    });

    return NextResponse.json<ApiResponse<ParticipantModel>>(
      {
        message: "Participant created successfully",
        participant,
        qrImageUrl
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error in registration route:", error);
    
    // Type guard for Prisma errors
    const prismaError = error as PrismaError;
    if (prismaError.code === 'P2002') {
      return NextResponse.json<ApiResponse<never>>(
        { error: "A participant with this form ID already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json<ApiResponse<never>>(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
