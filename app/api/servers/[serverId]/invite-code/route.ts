import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {v4 as uuidv4} from 'uuid'

type RequestData = {
    inviteCode: string
  }
export async function PATCH(req: Request | NextRequest,{params}:{params:{serverId:string}}){
    try {
        
        const profile=await currentProfile();
        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }
        let inviteCode = uuidv4()
            
        if(!params.serverId){
            return new NextResponse("Server Id missing",{status:400})
        }
        try {
            const server = await db.server.update({
                where: {
                    id: params.serverId,
                    profileId: profile.id,
                },
                data: {
                    inviteCode:inviteCode,
                },
            });
            
            if (!server) {
                return new NextResponse("Server not found", { status: 404 });
            }
            return NextResponse.json(server)
        } catch (error) {
            console.error("Database error:", error);
            return new NextResponse("Internal Error", { status: 500 });
        }
        
        
    } catch (error) {
        console.log("[ServerId]",error);
        return new NextResponse("Internal Error",{status:500})
    }
}