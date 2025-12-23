import { getCreatorContext } from "@/lib/creator-context";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest,{params}:{params:{slug:string;toolId:string};}) {
    try{
        const {user,creator}=await getCreatorContext(params.slug) //till here user and creator exists and user belongs to this creator
        //check active subscription
        const subscription=await Prisma.subscription.findFirst({
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
        const tool=await Prisma.tool.findFirst({
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
        const usageCount=await Prisma.usageLog.count({
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
        await Prisma.usageLog.create({
            data:{
                userId:user.id,
                creatorId:creator.id,
                toolId:tool.id,
                subscriptionId:subscription.id,
                count:1
            }
        })
        //execute tool
        const result={
            message:"Tool Executed Successfully"
        }
        return NextResponse.json(result)
    }
    catch{

    }
}