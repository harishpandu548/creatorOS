import { getCurrentUser } from "./auth";


export async function getCreatorContext(creatorSlug:string) {
    const user=await getCurrentUser()

    const creator=await prisma.creator.findUnique({
        where:{slug:creatorSlug}
    })
    if(!creator){
        throw new Error("Creator Not Found")
    }
    const membership=await prisma.membership.findUnique({
        where:{
            userId_creatorId:{
                userId:user.id,
                creatorId:creator.id
            }
        }
    })
    if(!membership){
        throw new Error("Access Denied")
    }
    return{
        user,creator,membership
    }
}