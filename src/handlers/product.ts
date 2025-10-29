import { Request, Response } from "express";
import colors from "colors";
import Product from "../models/Product.model";
import { check, validationResult } from "express-validator";

export const createProduct = async (req: Request, res: Response) => {
  //Crear nuevo producto:

  //     //Forma 1 con new

  //     //instaciamos modelo
  //     const product =  new Product(req.body);//aca se crea un nuevo obj pero no esta el id que nos brinda la Db

  //     //guardamos los datos recibidos de formulario(React)/postman(pruebas)
  //     const savedProduct = await  product.save(); //esperamos la insercion en la Db y guardamos en nueva variable ya con el id

  //   res.json({data: savedProduct});//retornamos un Obj

  //Forma 2 con .create

  //instaciamos el modelo
  const product = await Product.create(req.body); // crea la instancia y almacena en Db. Esperamos la insercion en la Db y ya tenemos en la variable el id

  //Validacion : name - price
  await check("name").notEmpty().withMessage("El nombre no puede estar vacio").run(req);
  await check("price")
    .custom(value => value > 0)
    .withMessage("Valor no valido")
    .isNumeric()
    .withMessage("Valor no valido")
    .notEmpty()
    .withMessage("El precio no puede estar vacio")
    .run(req);

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() }); //status(400) para indicar error
  }

  //Retornamos
  res.json({ data: product }); // es mas directo
};

/*
--ACA EMPIEZA EL BAILE: --

***FLUJO DE LA APP***

npm run dev
↓

index.ts → arranca el servidor con server.listen()
↓

server.ts

Crea instancia de Express

Conecta a la DB

Usa router para manejar /api/products
↓

router.ts

Define POST / y lo asocia con createProduct
↓

product.ts

Se ejecuta createProduct(req, res)

Se leen los datos del cuerpo (req.body)

Se crea el producto en la base de datos

Se responde a Postman

********

- Estas funciones (handlers- product.ts) reemplazan req, res de router.ts por eso las importamos de Express para tener autocompletado de Ts y no tener any.

- Para ingresar los datos a la base de datos: usamos el modelo que habiamos creado. Entonces Sequelize entra en accion con sus metodos (save, create, etc) que son los que van a traducir a SQL. SIEMPRE QUE INTERACTUAMOS CON EL MODELO (sequelize) las funciones deben ser async

error: TypeError: Class constructor Model cannot be invoked without &#39;new&#39;<br> &nbsp; &nbsp;at new Product--> Solucion: en tsConfig.json agregar "target":"EsNext" - "moduleResolution":"nodeNext" - "module":"nodeNext"

- Para borrar de Dbeaver se usa esta sentencia SQL: TRUNCATE TABLE products RESTART IDENTITY; reincia los Id's tambien. - En el panel SQL escribir el codigo y click en la flecha naranja, ejecutar comando SQL

- Para validar los datos que recibimos (es decir los req-> request) usamos la dependencia npm i express-validator. Esta tiene entre otras funciones 'check' y 'validationResult' -> ve la documentacion (igual no esta exactamente como lo hace el profe.. ojo).  La validacionse puede hacer tanto aca mismo en el handler como en el router.

- La funcion check es asincrona por eso va con AWAIT y al final necesita .run(req) 'si te paras arriba de run ves lo que es'. Las validaciones se recuperan en la funcion validationResult.




*/
