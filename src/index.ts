import colors from 'colors'
import server from "./server";
const port= process.env.Port || 4000 //creamos de una vez la variable de entorno que va a tener el puerto cuando el servidor nos asigne el numero. Sino sera 4000 cuando estemos en local.

server.listen(4000, ()=>{
  console.log(colors.cyan.bold(`REST API en el puerto ${port}`))
  
    
})





/*
    Server tiene ahora los metodos de express, entre ellos listen que recibe un puerto y un callback. Ahi queda 'montado' escuchando el servidor. Se maneja desde aca de index, es para que quede mas limpio el proyecto. Index llama a server y server tiene el routing.


*/