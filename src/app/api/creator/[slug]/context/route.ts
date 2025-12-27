// thunks/creatorThunk.ts call api and that api is this
import { getCreatorContext } from "@/lib/creator-context";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest,{params}:{params:{slug:string}}) {
    try {
        //from getcreatorconetxt we are getting user creator and the membership
        const {user,creator}=await getCreatorContext(params.slug)

        //fetch the subscription of user if it is active or not
        const subscription=await prisma.subscription.findFirst({
            where:{
                userId:user.id,
                creatorId:creator.id,
                status:"ACTIVE"
                
            },
            //meaning not send all related data of subs only just send the selected fields 
            select:{
                id:true,
                planName:true,
                status:true,
                usageLimit:true,
                creatorId:true
            }
        })
        //returning context
        return NextResponse.json({
            creator:{
                id:creator.id,
                slug:creator.slug,
                name:creator.name,
                status:creator.status
            },
            subscription:subscription||null
        })  
    } catch (error:any) {
        return NextResponse.json({error:error.message||"Unauthorized"},{status:500})
        
    }
    
}