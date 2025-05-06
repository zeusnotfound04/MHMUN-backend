import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  school: z.string().min(1),
  email: z.string(),
  formId: z.string().min(1),
  phone: z.string().min(0).max(10)
});

export  async function POST(request: Request) {
    try {
        const body = await request.json()
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

        const participant = await prisma.participant.create({
            data: {
                name,
                email,
                phone,
                school,
                formId
            }
        })

        console.log("Participant created:", participant)
        NextResponse.json({ message: "Participant created successfully" }, { status: 201 })
    } catch (error :any) {
        console.error("Error in registration route:", error)
        return new Response("Internal Server Error", { status: 500 })   
        
    }

}