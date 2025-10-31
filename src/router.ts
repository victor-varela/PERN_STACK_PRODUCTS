import { Router } from "express";
import { body } from "express-validator";
import { createProduct, getProducts } from "./handlers/product";
import { handleInputError } from "./middelware";
export const router = Router();


//se reemplazo para codigo mas compacto (req,res)=>{} por su handler antes era router.get('/', (req, res)=>{res.json('desde get')}) --> getProducts

router.get("/", getProducts);

//se reemplazo para codigo mas compacto (req,res)=>{} por su handler
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

router.put("/", (req, res) => {
  res.json("Desde PUT");
});

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


🔁 3. Flujo real de ejecución

1️⃣ El cliente envía el POST.
2️⃣ Express pasa el req y res al primer middleware (body("name")...).
3️⃣ Ese middleware hace su validación y llama next().
4️⃣ Express pasa al siguiente middleware (body("price")...).
5️⃣ Ese hace su validación y llama next().
6️⃣ Finalmente llega a createProduct, donde se obtiene el resultado.

- Una vez que ya creamos algunos productos (.post/ ) podemos escribir el codigo del endpoint .get (obtener productos.)





*/
