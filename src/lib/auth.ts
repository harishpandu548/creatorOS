
import { getServerSession } from "next-auth";


export async function getCurrentUser() {
    const session=await getServerSession(authOptions)

    if(!session || !session.user?.email){
        throw new Error("Unauthenticated")

    }
    const user=await prisma.user.findUnique({
        where:{email:session.user.email}
    })

    if(!user){
        throw new Error("User not found")
    }
    return user
}