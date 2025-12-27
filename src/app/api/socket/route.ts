import { getIO } from "@/lib/socket"
import { NextResponse } from "next/server"

export async function GET(req:any) {
    const server=req.socket.server
    getIO(server)
    return NextResponse.json({status:"ok"})
    
}