import express from "express";
import colors from 'colors'
import { router } from "./router";
import { db } from "./config/db";

//Instancia de Express
const server = express();

//Middelware que permite leer JSON en el body
server.use(express.json())

//2-Conecting DB- Sequelize / PostreSql / Render
const connectDb = async () => {
  try {
    await db.authenticate();
    db.sync()//para actualizar las tablas cada vez que se autentique
    console.log(colors.blue("Connection has been established successfully."));
  } catch (error) {
    console.error(colors.red.bold("Unable to connect to the database:"), error);
  }
};

connectDb();

//1-Routing

//Enlazamos las rutas principales
server.use("/api/products", router);

export default server;

/*
importamos express from 'express' y lo inicializamos en server. 
Ahora desde INDEX.TS manejamos a server. 
El routing tiene los metodos HTTP. Le damos la direccion 'path' y un callback con req, res
Get--> pide informacion. traeme algo.. el codigo server.'verboHTTP' (get, post, etc) ese codigo funciona pero para SEPARAR LAS RUTAS y dejarlas en su propio archivo (es mas limpio) usamos el metodo ROUTER de EXPRESS. Entonces reemplazamos server.get por router. Y movemos las rutas a un archivo router.ts.

Ahora server.get - server.post, etc se RESUME EN SERVER.USE - donde pasamos el path y el handler router.

“Para todas las rutas que empiecen con /api/products, usá las rutas definidas en router.”

- Primero habiamos definido a server.use(path, router(handler)) y declaramos las rutas en el archivo router.ts. Despues inicializamos la DB. Por eso esta en el codigo ese orden /Connecting DB y Despues /Routing
index maneja a --> Server maneja a --> Db

- Este archivo arranca la DB y define la ruta base de la API.


*/
