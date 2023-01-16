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

var users=[];

function addUser (userData,socketId)
{

     users.push({...userData,socketId});

        
 for(let i=0;i<users.length;i++)
 {
      
    if(users[i].sub===userData.sub)
    {
     
        if(users[i].socketId===socketId)
      {     
          
           io.emit("getUsers",users);    
      }
    
    else  if(users[i].socketId!==socketId)
      {     
            users.splice(i,1);
             i--;
      }
    }
    
  else if(users[i].sub!==userData.sub && users[i].socketId!==socketId)
  {
               continue;
  }    
 }      
}

const deleteUser=(socketId)=>
{
    for(let i=0;i<users.length;i++)
    {
        if(users[i].socketId===socketId)
        {
              users.splice(i,1);
              i--;
             io.emit("getUsers",users);
            
        }
        
    }
   
       
}


const getUser = (userId)=>
{
     return users.find(user =>user.sub === userId);
    
}

io.on('connection',(socket)=>{
     
      
         socket.on("addUsers",userData=>{ 
           
                addUser(userData, socket.id);
                console.log('User Connected');

     })
   
     socket.on('sentMessage',data=>{

         const user = getUser(data.receiverId);
         io.to(user.socketId).emit("getMessage",data);
     })

     socket.on('disconnect',(userData,socketId)=>
     {
         deleteUser(socket.id);
         console.log('User Disconnected');
     })
     
})

  
httpServer.listen(9000);
