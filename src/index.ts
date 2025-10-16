import server from "./server";

server.listen(4000, ()=>{
  console.log('rest api ');
  
    
})





/*
    Server tiene ahora los metodos de express, entre ellos listen que recibe un puerto y un callback. Ahi queda 'montado' escuchando el servidor. Se maneja desde aca de index, es para que quede mas limpio el proyecto. Index llama a server y server tiene el routing.


*/