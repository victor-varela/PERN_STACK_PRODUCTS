import { request, Router } from "express";
import { body, param } from "express-validator";
import { createProduct, getProductById, getProducts, updateProduct } from "./handlers/product";
import { handleInputError } from "./middelware";
export const router = Router();

//se reemplazo para codigo mas compacto (req,res)=>{} por su handler antes era router.get('/', (req, res)=>{res.json('desde get')}) --> getProducts

//Obtener todos los productos
router.get("/", getProducts);

//Obtener un producto por su Id.-> Usamos el routing dinamico de Express :id-> se nombra id por convencion
router.get(
  "/:id",

  //Validacion Id tiene que ser un numero. Como es routing dinamico usamos param en lugar de body
  param("id").isInt().withMessage("Id no es valido"), //esto es un middelware por eso ,

  //Invocamos nuestro custom middelware que maneja errores
  handleInputError,

  getProductById
);

//Crear un producto. Se reemplazo para codigo mas compacto (req,res)=>{} por su handler
router.post(
  "/",
  //Validacion : name - price
  body("name").notEmpty().withMessage("El nombre no puede estar vacio"), //esto es un middleware

  body("price")
    .custom(value => value > 0)
    .withMessage("Valor no valido")
    .isNumeric()
    .withMessage("Valor no valido")
    .notEmpty()
    .withMessage("El precio no puede estar vacio"), //esto es un middleware

  handleInputError, //esto es un middelware

  createProduct
); //esto es un middleware

//Actualizar un producto
router.put(
  "/:id",

  //Validacion
  body("name")
    .isString()
    .withMessage("El nombre no es valido")
    .notEmpty()
    .withMessage("El nombre no puede estar vacio"),

  body("price")
    .custom(value => value > 0)
    .withMessage("Valor no valido")
    .notEmpty()
    .withMessage("El precio no puede estar vacio")
    .isNumeric()
    .withMessage("El precio no es valido"),

  body("availability")
    .isBoolean()
    .withMessage("Valor no valido")
    .notEmpty()
    .withMessage("El campo no puede estar vacio"),

    //Prevenimos los errors
    handleInputError,

  //Usamos el hanlder
  updateProduct
);

router.patch("/", (req, res) => {
  res.json("Desde PATCH");
});

router.delete("/", (req, res) => {
  res.json("Desde DELETE");
});

/*
- Cuando pegamos las rutas que teniamos en server con server.get, server.post, etc perdemos la referencia de server. Entonces usamos una INSTANCIA del ROUTER de express. Lo importamos y ese lo usamos en server.ts. Entonces Index maneja --> Server maneja--> Router


server.use("/api/products", router) = “Creamos una galaxia llamada /api/products.”

Dentro de esa galaxia, el router define planetas (/, /listar, /crear...).

Si todos los planetas del router se llaman /, entonces todos orbitan directamente alrededor de la galaxia base (/api/products). La / es la entrada general. Despues va a ir cambiando a /crear /listar, etc.. 

- En la ruta .post: adaptamos el codigo de validacion que teniamos en el handler createProduct. Es buena pracica separar ambas cosas:

    El router “filtra” lo que llega, y el controlador “procesa” lo que pasó el filtro.


Ya no usamos check, en su lugar usamos body de express validator. No usamos .run(req), no usamos el await. Cada validacion es una propiedad de un objeto (son middlelwares) por eso termina en ',' 'coma' se separan por ','-- req y res Son los mismos objetos en todos los middlewares--: por eso se pasa req al handler automaticamente (lo hace express)

  Cuando escribís algo como:

      router.post("/", body("name").notEmpty(), createProduct);


Express interpreta esa línea como:

“Cuando llegue una petición POST a /, ejecutá en orden cada middleware que aparezca en esta lista”.

// ✅ Por qué movemos las validaciones al router:
//
// 1. Mantiene el código más limpio y separado:
//    - El router valida la entrada (qué datos llegan).
//    - El controlador maneja la lógica (qué hacer con los datos).
//
// 2. 'body()' es un middleware integrado de express-validator
//    que valida directamente el cuerpo de la petición (req.body).
//
// 3. No necesitamos 'await check().run(req)' porque Express ejecuta
//    estos middlewares automáticamente antes del controlador.
//    express-validator hace internamente el trabajo asincrónico.
//
// 👉 Resultado: mejor organización, menos código repetido,
//    y validaciones más declarativas por cada endpoint.

- Usamos la funcion handleInputError como un middelware que llamamos aparte (Es reutilizable) y ahi esta el codigo de validationResult.


🔁 3. Flujo real de ejecución

1️⃣ El cliente envía el POST.
2️⃣ Express pasa el req y res al primer middleware (body("name")...).
3️⃣ Ese middleware hace su validación y llama next().
4️⃣ Express pasa al siguiente middleware (body("price")...).
5️⃣ Ese hace su validación y llama next().
6️⃣ Finalmente llega a createProduct, donde se obtiene el resultado.

- Una vez que ya creamos algunos productos (.post/ ) podemos escribir el codigo del endpoint .get (obtener productos.)

- Ya que podemos obtener TODOS los productos, avanzamos con una NUEVA RUTA: router.get('/:id')-> para obtener un producto por su id. Usamos el routing dinamico de express donde lo que va despues de : es una variable que creamos (por convencion la nombramos id) y para recuperarla usamos req.params. Ts nos muestra las variables que estan dentro de params. Tenemos que validar que el id sea un numero para evitar que alguien en la URL escriba cualquier cosa y rompa la aplicacion.

- Actualizar un producto: se hacen 2 cosas en 1. Obtener el producto, y actualizar. Agregamos validacion para el campo availability por las dudas porque el usuario podria cambiar o escribir cualquier cosa en ese campo. Ya no esta por default como en la creacion de producto. 

“¿Por qué agregamos validación para todos los campos en el router?”

✅ Porque estamos usando PUT, que semánticamente representa una actualización completa del producto.
De esta forma, nos aseguramos de que todos los datos del recurso sigan siendo válidos después de reemplazarlos.



*/
