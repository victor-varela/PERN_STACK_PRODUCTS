import {Sequelize} from 'sequelize-typescript'
import dotenv from "dotenv";

dotenv.config({ path: ".env" });//para inicializar dontenv

export const db = new Sequelize(process.env.DB_URL, {
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  models:[__dirname + '/../models/**/*.ts'],
  logging:false
});

/*
- Hacemos la conexion con render a traves del metodo URI.--> es la External DB URL que nos dice Render. Ese string tiene lo que sequelize necesita.

db = sequelize

- En la conexion con Render nos va a dar un error de SSL/TLS Required ** se debe configurar el objeto dialecOptions:{ ssl:{ required: true, rejectUnauthorized: false}}

- El string connection es una dato sensible debe ir en una variable de entorno. Para eso usamos la dependency dotenv--> esto facilita leer las variables que se crean en .env
- Para crear una instancia de dotenv hay que ejecutar dotenv.config({path:'./src/.env'}) para darle la ruta del .env y poder usar la configuracion de ssl.

- Recuerda agregar en gitignore el .env --> crea el archivo en la raiz del proyecto .gitignore

- Se armo tremendo problema porque ya habia pusheado este archivo con los datos de la DB expuesto. Para arreglarlo estuve 2 dias con el chat y al final lo resolvi haciendo un git rebase y cuando salio el conflicto lei lo que proponia git e hice git add /src/config/db.ts (que es el archivo que estaba correcto) y luego git push force.. ahi se elimino el commit de github y ya no lo puede ver nadie.

- Este archivo es, como dice su nombre, la CONFIGURACION de la DB. Para arrancar la conexion con la DB lo hacemos desde server.ts

- Despues de crear el modelo Product en /models agrego la direccion a las opciones de la Db con: models:[__dirname + /../models/++/+.ts ] y me va a dar este error: TypeError: Cannot convert undefined or null to object. Por eso debemos agregar unas propiedades a tsconfig.json. 

- Se agrega loggin:false para evitar errores en el test.


*/
