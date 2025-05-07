import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { generateQRCodeWithFormId } from "@/actions";

const formSchema = z.object({
  name: z.string().min(1),
  school: z.string().min(1),
  email: z.string().email(),
  formId: z.string().min(1),
  phone: z.string()
});


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

    const { name, email, phone, school, formId } = validation.data;
    console.log("Form data:", name, email, phone, school, formId);

    

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
