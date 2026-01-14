import express from "express";
import colors from 'colors'
import swaggerUi from 'swagger-ui-express'
import { router } from "./router";
import { db } from "./config/db";
import swaggerSpec, {swaggerUiOptions} from "./config/swagger";


//Instancia de Express
const server = express();

//Middelware que permite leer JSON en el body
server.use(express.json())

//2-Conecting DB- Sequelize / PostreSql / Render
export const connectDb = async () => {
  try {
    await db.authenticate();
    db.sync()//para actualizar las tablas cada vez que se autentique
    // console.log(colors.blue("Connection has been established successfully."));// se comenta para evitar error en el Test por el console.log
  } catch (error) {
    console.error(colors.red.bold("Unable to connect to the database:"), error);
  }
};

connectDb();

//1-Routing

//Enlazamos las rutas principales
server.use("/api/products", router);

// //Creamos una ruta para Test del server
server.get('/api', (req, res)=>{
  res.json({"msg":"Desde API"})
})

//Creamos ruta pra la Documentacion 
//swaggerUi.serve -->	Sirve archivos estáticos del UI
//swaggerUi.setup(swaggerSpec)-->	Renderiza la UI con tu especificación

server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions)) 

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

- Para documentar la API, importamos swaggerUiExpress y swaggerJsDoc. Entonces tenemos la ruta para que cree la pagina de documentacion.


*/
