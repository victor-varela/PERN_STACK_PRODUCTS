import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: "./src/.env" });

export const db = new Sequelize(process.env.DB_URL, {
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
});

/*
- Hacemos la conexion con render a traves del metodo URI.--> es la External DB URL que nos dice Render. Ese string tiene lo que sequelize necesita.

db = sequelize

- En la conexion con Render nos va a dar un error de SSL/TLS Required ** se debe configurar el objeto dialecOptions:{ ssl:{ required: true, rejectUnauthorized: false}}

- El string connection es una dato sensible debe ir en una variable de entorno. Para eso usamos la dependency dotenv--> esto facilita leer las variables que se crean en .env
- Para crear una instancia de dotenv hay que ejecutar dotenv.config({path:'./src/.env'}) para darle la ruta del .env y poder usar la configuracion de ssl.
- Recuerda agregar en gitignore el .env --> crea el archivo en la raiz del proyecto .gitignore
*/
