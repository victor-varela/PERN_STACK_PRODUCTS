import { Request, Response } from "express";
import Product from "../models/Product.model";

//1- Escribimos el codigo de crear productos
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
  try {
    const product = await Product.create(req.body); // crea la instancia y almacena en Db. Esperamos la insercion en la Db y ya tenemos en la variable el id

    //Retornamos la 'respuesta' res
    res.json({ data: product }); // es mas directo
  } catch (error) {
    console.log(error);
  }
};

//2. Ahora que hemos creado producots podemos escribir el codigo para obtener productos
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
     attributes:{exclude:['createdAt', 'updatedAt', 'availability']}
    });

    res.json({ data: products });
  } catch (error) {
    console.log(error);
  }
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
- Todos los handlers estan en este archivo. .get -> obtenerProductos, .post-> crearProductos, etc..

- Estas funciones (handlers- product.ts) reemplazan req, res de router.ts por eso las importamos de Express para tener autocompletado de Ts y no tener any.

- Para ingresar los datos a la base de datos: usamos el modelo que habiamos creado. Entonces Sequelize entra en accion con sus metodos (save, create, etc) que son los que van a traducir a SQL. SIEMPRE QUE INTERACTUAMOS CON EL MODELO (sequelize) las funciones deben ser async

error: TypeError: Class constructor Model cannot be invoked without &#39;new&#39;<br> &nbsp; &nbsp;at new Product--> Solucion: en tsConfig.json agregar "target":"EsNext" - "moduleResolution":"nodeNext" - "module":"nodeNext"

- Para borrar de Dbeaver se usa esta sentencia SQL: TRUNCATE TABLE products RESTART IDENTITY; reincia los Id's tambien. - En el panel SQL escribir el codigo y click en la flecha naranja, ejecutar comando SQL

- Para validar los datos que recibimos (es decir los req-> request) usamos la dependencia npm i express-validator. Esta tiene entre otras funciones 'check' y 'validationResult' -> ve la documentacion (igual no esta exactamente como lo hace el profe.. ojo).  La validacionse puede hacer tanto aca mismo en el handler como en el router.

- La funcion check es asincrona por eso va con AWAIT y al final necesita .run(req) 'si te paras arriba de run ves lo que es'. Las validaciones se recuperan en la funcion validationResult. Podemos anidar los metodos de validacion isNumeric(), notEmpty(), y al final el .run(req).

- Si hacemos la validacion en este archivo (handler) quedaria asi: 

      //Validacion : name - price
  await check("name").notEmpty().withMessage("El nombre no puede estar vacio").run(req) // .RUN(REQ) VA AL FINAL DEL CHECK;
  await check("price")
    .custom(value => value > 0)
    .withMessage("Valor no valido")
    .isNumeric()
    .withMessage("Valor no valido")
    .notEmpty()
    .withMessage("El precio no puede estar vacio")
    .run(req); // .RUN(REQ) VA AL FINAL DEL CHECK

    /* 
    ⚙️ ¿Por qué usamos await check(...).run(req)?

Porque .run(req) devuelve una Promise, y necesitamos esperar a que todas las validaciones terminen antes de leer los resultados con validationResult(req).

Si no usás await, el código sigue ejecutándose y validationResult(req) puede correr antes de que las validaciones terminen, dando resultados inconsistentes (por ejemplo, errores que no aparecen o validaciones que no se ejecutan).
    
    
    await check("name").notEmpty().withMessage("El nombre no puede estar vacio").run(req);

significa:

“Ejecuta la validación de name sobre req, espera-await a que termine y solo entonces continúa”. **

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() }); //status(400) para indicar error
  }

  - Nos llevamos el codigo de validacion al Router y ahi se hacen algunos cambios, no se usa check sino body, no hace falta el await, entre otros

  - Luego el hanlder quedaria con este codigo medio 'colgado': 
      const result = validationResult(req)

      if(!result.isEmpty()){
        return ....
      }
  "esto no forma parte de la logica del negocio. El hanlder es para crear el producto por eso ese codigo puede ir en su propio middleware asi que lo movemos para que en el handler quede mas limpio. Lo movemos el index.ts de la carpeta middelware y lo llamamos en el Router.ts"

  -Finalmente se envuelve el codigo ya limpio, relacionado a lo que debe hacer esta funcion 'crear producto' en un try catch para tener control por errores que no sean de validacion.

  - Para el metodo .findAll() se le pueden pasar opciones dentro de la funcion:
      .findAll({
        order:[

          ['id', 'DESC'] ordena descendiente por Ids. Puedes usar 'price', 'DESC' etc y , limit 10

        ]
        })




  - Si entras en la funcion .findAll({}) cuando abres llaves VsCode te muestra las opciones que tiene. Luego puedes buscar en la doc. https://sequelize.org/docs/v6/core-concepts/model-querying-basics/ y hacer ctrl + f 'order' y para excluir campos usa 'exclude' en la doc esta la sintaxis. ==  attributes:{exclude:['createdAt', 'updatedAt', 'availability']} queda mas legible y limpia la respuesta.


*/
