import { db } from "@/lib/db"
import { currentProfile } from "./current-profile"
export const FindOrCreateConversation=async(memberOneId:string , memberTwoId:string)=>{
    let conversation=await FindConversation(memberOneId,memberTwoId) || await FindConversation(memberTwoId,memberOneId)
    if(!conversation){
        conversation=await CreateNewConversation(memberOneId,memberTwoId)
    }
    return conversation;
}

const FindConversation =async(memberOneId:string , memberTwoId:string)=>{
    try {
    return await db.conversation.findFirst({
        where:{
            AND:[
                {memberOneId:memberOneId},
                {memberTwoId:memberTwoId},
                {memberOneId:{
                    not:memberTwoId
                }}
            ]
            
        },
        include:{
            memberOne:{
                include:{
                    profile:true
                }
            },
            memberTwo:{
                include:{
                    profile:true
                }
            }
        
        }

        
    })
} catch {
    return null
}
} 
const CreateNewConversation =async(memberOneId:string , memberTwoId:string)=>{
    try {
        return await db.conversation.create({
            data:{
                memberOneId,
                memberTwoId
            },
            include:{
                memberOne:{
                    include:{
                        profile:true
                    }
                },
                memberTwo:{
                    include:{
                        profile:true
                    }
                }
            }
        })
    } catch {
        return null;
    }

}