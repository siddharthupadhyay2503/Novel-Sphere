import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(req:Request,{params}:{params:{channelId:string}}) {
    try {
        const profile=await currentProfile();
        const channelId=params.channelId;
        if(!profile){
            return new NextResponse("Unauthoriized",{status:401 })
        }
        if(!channelId){
            return new NextResponse("Channel id missing",{status:400 })
        }
        const {searchParams}=new URL(req.url);
        const serverId=searchParams.get('serverId');
        
        if(!serverId){
            return new NextResponse("Server id missing",{status:400 })
        }        
        const server=await db.server.update({
            where:{
                id:serverId,
                members:{
                    some:{
                        profileId:profile.id,
                        role:{
                            in:[MemberRole.MODERATOR ,MemberRole.ADMIN],
                        }
                    }
                }
            },
            data:{
                channels:{
                    delete:{
                        id:channelId,
                        name:{
                            not:'general'
                        }
                    }
                }
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("CHANNELS_DELETE",error);
    return new NextResponse("CHANNELS_DELETE_ERROR",{status:500})
        
    }
    
}
export async function PATCH(req:Request,{params}:{params:{channelId:string}}) {
    try {
        const profile=await currentProfile();
        const channelId=params.channelId;
        if(!profile){
            return new NextResponse("Unauthoriized",{status:401 })
        }
        if(!channelId){
            return new NextResponse("Channel id missing",{status:400 })
        }
        const {searchParams}=new URL(req.url);
        const serverId=searchParams.get('serverId');
        if(!serverId){
            return new NextResponse("Server id missing",{status:400 })
        } 
        const {name,type}=await req.json()
        const server = await db.server.update({
            where: {
              id: serverId,
              members: {
                some: {
                  profileId: profile.id,
                  role: {
                    in: [MemberRole.MODERATOR, MemberRole.ADMIN],
                  },
                },
              },
            },
            data: {
              channels: {
                update: {
                  where: {
                    id: channelId,
                    name:{
                        not:"general"
                    }
                  },
                  data: {
                    name, 
                    type, 
                  },
                },
              },
            },
          });
          return NextResponse.json(server)
          
    } catch (error) {
        console.log("CHANNELS_PATCH",error);
        return new NextResponse("CHANNELS_PATCH_ERROR",{status:500})
    }
    
}