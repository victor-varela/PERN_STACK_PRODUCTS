import express from "express";
import { router } from "./router";
const server = express();

//Routing

server.use("/api/products", router);


export default server;

/*
importamos express from 'express' y lo inicializamos en server. 
Ahora desde INDEX.TS manejamos a server. 
El routing tiene los metodos HTTP. Le damos la direccion 'path' y un callback con req, res
Get--> pide informacion. traeme algo.. el codigo server.'verboHTTP' (get, post, etc) ese codigo funciona pero para SEPARAR LAS RUTAS y dejarlas en su propio archivo (es mas limpio) usamos el metodo ROUTER de EXPRESS. Entonces reemplazamos server.get por router. Y movemos las rutas a un archivo router.ts.

Ahora server.get - server.post, etc se RESUME EN SERVER.USE - donde pasamos el path y el handler router.





*/
