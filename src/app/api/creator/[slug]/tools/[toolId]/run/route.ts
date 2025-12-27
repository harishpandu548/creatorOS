import { getCreatorContext } from "@/lib/creator-context";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest,{params}:{params:{slug:string;toolId:string};}) {
    try{
        const {user,creator}=await getCreatorContext(params.slug) // here user and creator we get and this tells user belongs to this creator
        //check active subscription
        const subscription=await prisma.subscription.findFirst({
            where:{
                userId:user.id,
                creatorId:creator.id,
                status:"ACTIVE"
            }
        })
        if(!subscription){
            return NextResponse.json({
                error:"No Active Subscription"
            },{status:403})
        }
        //check tools ownership
        const tool=await prisma.tool.findFirst({
            where:{
                id:params.toolId,
                creatorId:creator.id,
                isActive:true,
            }
        })
        if(!tool){
            return NextResponse.json({error:"Tool not found or inactive"},{status:404})
        }

        //count usage for this subscription + tool
        const usageCount=await prisma.usageLog.count({
            where:{
                userId:user.id,
                subscriptionId:subscription.id,
                toolId:tool.id
            }
        })
        if(usageCount>=tool.monthlyLimit){
            return NextResponse.json({
                error:"Usage Limit Exceeded"
            },{status:429})
        }
        //log usage
        await prisma.usageLog.create({
            data:{
                userId:user.id,
                creatorId:creator.id,
                toolId:tool.id,
                subscriptionId:subscription.id,
                count:1
            }
        })
        //calculate updated usage
        const updatedUsed=usageCount+1
        const remaining=tool.monthlyLimit-updatedUsed

        //execute tool
        return NextResponse.json({
            message:"Tool Executed Successfully",
            success:true,
            used:updatedUsed,
            remaining
        })
    }
    catch(error:any){
        return NextResponse.json({error:error.message||"Internal Server Error"},{status:500})
    }
}