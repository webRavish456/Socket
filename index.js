import { Server } from "socket.io";
import { createServer } from "http";

 const httpServer = createServer();
 const io = new Server(httpServer,{
    cors: {
        origin:'https://webravish456.github.io/Whatsapp-clone'
    }
})

let users=[];

const addUser= (userData,socketId)=>
{
   !users.some(user => user.sub == userData.sub) && users.push({...userData, socketId});
}

const getUser = (userId)=>
{
    return users.find(user =>user.sub === userId);
}

io.on('connection',(socket)=>{
     console.log('user connected');

     socket.on("addUsers",userData=>{
         addUser(userData, socket.id);
         io.emit("getUsers",users);
     })

     socket.on('sentMessage',data=>{

         const user = getUser(data.receiverId);
         io.to(user.socketId).emit("getMessage",data);
     })
})
