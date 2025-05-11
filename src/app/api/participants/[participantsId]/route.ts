import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
interface RouteParams {
  params: Promise<{
    participantsId: string;
  }>;
}


export async function GET(
  req: NextRequest,
  { params }:  RouteParams 
) {
  try {
    const { participantsId } = await params;

    const participant = await prisma.participant.findUnique({
      where: {
        id: participantsId,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(participant);
  } catch (error) {
    console.error("Error fetching participant:", error);
    return NextResponse.json(
      { error: "Failed to retrieve participant" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: RouteParams 
) {
  try {
    const { participantsId } = await params;
    const body = await req.json();
    
    const existingParticipant = await prisma.participant.findUnique({
      where: {
        id: participantsId,
      },
    });

    if (!existingParticipant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    const updatedParticipant = await prisma.participant.update({
      where: {
        id: participantsId,
      },
      data: {
        name: body.name,
        school: body.school,
        email: body.email,
        phone: body.phone,
        qrImageUrl: body.qrImageUrl,
        ...(body.formId && { formId: body.formId }),
      },
    });

    return NextResponse.json(updatedParticipant);
  } catch (error) {
    console.error("Error updating participant:", error);
    return NextResponse.json(
      { error: "Failed to update participant" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }:RouteParams
) {
  try {
    const { participantsId } = await params;

    const existingParticipant = await prisma.participant.findUnique({
      where: {
        id: participantsId,
      },
    });

    if (!existingParticipant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    await prisma.participant.delete({
      where: {
        id: participantsId,
      },
    });

    return NextResponse.json(
      { message: "Participant deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting participant:", error);
    return NextResponse.json(
      { error: "Failed to delete participant" },
      { status: 500 }
    );
  }
}