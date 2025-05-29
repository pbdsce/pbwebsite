import { NextResponse } from "next/server";

export async function POST(request: Request){
    try{
        const {email} = await request.json();

        if(!email){
            return NextResponse.json({error: "Email is required"}, {status: 400});
        }

        if(!email.endsWith("@pointblank.club")) {
            return NextResponse.json({error: "Access not granted!"}, {status: 403})
        }

        return NextResponse.json({message: "Valid email"}, {status: 200}); 
    }catch(error){
        console.error("Validation error:", error);
        return NextResponse.json(
            {error: "Server error during email validation"},
            {status: 500}
        );
    }
}
