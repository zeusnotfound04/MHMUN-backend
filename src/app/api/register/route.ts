import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { UTApi } from 'uploadthing/server';

const formSchema = z.object({
  name: z.string().min(1),
  school: z.string().min(1),
  email: z.string(),
  formId: z.string().min(1),
  phone: z.string()
});

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log("Received form data:", body);
        const validation = formSchema.safeParse(body);
        console.log("Validation result:", validation);
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
        const qrCode = uuidv4();
        const qrData = `${process.env.BASE_URL}/participant/${qrCode}`;
    
        
        const qrImageDataUrl = await QRCode.toDataURL(qrData);
        console.log("QR Code Data URL:", qrImageDataUrl);
       
        const base64Data = qrImageDataUrl.split(",")[1];
        const imageBuffer = Buffer.from(base64Data, "base64");
        
       
        const file = new File([imageBuffer], `qr-${qrCode}.png`, {
          type: "image/png",
        });
    
        
        const utapi = new UTApi();
        const uploadResponse = await utapi.uploadFiles([file]);
        console.log("Upload response:", uploadResponse);
    
        if (!uploadResponse || uploadResponse.length === 0) {
          return NextResponse.json(
            { error: "Failed to upload QR code image" },
            { status: 500 }
          );
        }
    
        const uploadedFile = uploadResponse[0];
        
        if (!uploadedFile || !uploadedFile.data) {
          return NextResponse.json(
            { error: "Failed to get upload data" },
            { status: 500 }
          );
        }
        
        const qrImageUrl = uploadedFile.data.ufsUrl;
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
    } catch (error :any) {
        console.error("Error in registration route:", error)
        return new Response("Internal Server Error", { status: 500 })   
        
    }
}