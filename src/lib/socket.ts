import {Server as IOServer} from "socket.io"

let io:IOServer|null=null;

export function getIO(server:any){
    if(!io){
        io=new IOServer(server,{
            cors:{
                origin:"*",
            }
        })
    }
    return io;
}