import {Server as IOServer} from "socket.io"

let io:IOServer|null=null;

export function getIO(server:any){
    if(!io){
        io=new IOServer(server,{
            cors:{
                origin:"*",
            }
        })
        io.on("connection",(socket)=>{
            console.log("Socket connected:",socket.id)
            socket.on("join",(room)=>{
                socket.join(room)
            })
        })
    }
    return io;
}