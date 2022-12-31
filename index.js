import { Server } from "socket.io";
import http from "http";
import express from 'express';

const app = express();
const httpServer=http.createServer(app);
 const io = new Server(httpServer,{
    cors: {
        origin:'*',
       
       
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
httpServer.listen(9000);
