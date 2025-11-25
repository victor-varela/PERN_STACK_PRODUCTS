import request from "supertest";
import server from "../../server";

//Probamos el endpoint de crear productos
describe("POST /api/products", () => {
  //simulamos crear un producto vacio y probamos la validacion
  it("should display validation errors", async () => {
    const response = await request(server).post("/api/products").send({});

    //que esperamos?
    expect(response.status).toBe(400); //codigo de bad request
    expect(response.body).toHaveProperty("errors"); //deberia aparecer esta propiedad
    expect(response.body.errors).toHaveLength(4); //son los 4 errores que deben aparecer segun nuestro codigo en el router(donde hacemos la validacion)

    //que no debe hacer?
    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  //simulamos crear un producto con el precio incorrecto
  it("should validate that the price is greater than 0 ", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Impresora- testing",
      price: 0,
    });

    //que nos dice postman cuando hacemos esto?
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);

    //que no esperamos?
    expect(response.status).not.toEqual(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  //simulamos crear un producto con el precio distinto de numerosd
  it("should validate that price is a number", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Impresora- Testing",
      price: "hola",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(3);
  });

  //simulamos crear un producto correctamente
  it("should create a new product", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Tablet- test",
      price: 20,
    });

    //que esperamos que sea?
    expect(response.status).toEqual(201); //tambien se usa toBe
    expect(response.body).toHaveProperty("data");

    //que no debe ser?
    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("errors"); // en handleInputError la propiedad se llama 'errors' en plural.
  });
});

//Probamos el endpoint de OBTENER TODOS los  productos
describe("GET /api/products", () => {
  //validamos que la url existe
  it("should check if /api/products url exits", async () => {
    const response = await request(server).get("/api/products");

    expect(response.status).not.toBe(404);
  });

  //Simulamos obtener todos los productos
  it("should get a json response with products", async () => {
    const response = await request(server).get("/api/products");

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveLength(1);

    expect(response.body).not.toHaveProperty("errors");
  });
});

//Probamos el endpoint para obtener un producto por su Id
describe("GET /api/products/:id", () => {
  //simulamos pedir un Id que no existe
  it("should return a 404 response for a non-existent product", async () => {
    const productId = 2000; //usamos un Id no existente
    const response = await request(server).get(`/api/products/${productId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Product not found");
  });

  //simulamos pedir un ID no valido (string)
  it("should check if id is valid", async () => {
    const response = await request(server).get("/api/products/not-valid-id");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Id no es valido");
  });

  //simulamos pedir un producto por su Id correcto
  it("get a JSON response for a single product", async () => {
    const response = await request(server).get("/api/products/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });
});

//Probamos el endpoint para actualizar un producto
describe("PUT /api/products/:id", () => {
  //simulamos actualizar un producto con id no existente
  it("should return a 404 response for a non existent product", async () => {
    const productID = 2000;
    const response = await request(server).put(`/api/products/${productID}`).send({
      name: "Monitor curvo - ACTUALIZADO",
      price: 400,
      availability: true,
    });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Product not found");

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  //simulamos actualizar un producto con id no valido
  it("should return a 400 response for a not valid id param", async () => {
    const response = await request(server).put("/api/products/not-valid-id-param").send({
      name: "Monitor curvo - ACTUALIZADO",
      price: 400,
      availability: true,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe("Id no valido");
  });

  //simulamos actualizar un producto vacio
  it("should display validation error messages when updating a product with empty fields", async () => {
    const response = await request(server).put("/api/products/1").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy(); //hace lo mismo que toHaveProperty()
    expect(response.body.errors).toHaveLength(7);

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  //simulamos actualizar un producto con precio incorrecto
  it("should validate that the price is greater than 0", async () => {
    const response = await request(server).put("/api/products/1").send({
      name: "Monitor curvo - ACTUALIZADO",
      price: 0,
      availability: true,
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors[0].msg).toBe("El precio debe ser un número mayor a 0");
  });

  //simulamos actualizar correctamente un producto
  it("should update an existing product with valid data", async () => {
    const response = await request(server).put("/api/products/1").send({
      name: "Monitor curvo - ACTUALIZADO",
      price: 20,
      availability: true,
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toBeTruthy();

    expect(response.status).not.toBe(400);
    expect(response.body.errors).toBeFalsy();
  });
});

//probamos el endpoint para actualizar availability de un producto
describe('PATCH/api/products/:id',()=>{

  //simulamos actualizar un id no valido
  it('should return 400 for a not valid id', async()=>{
    const response= await request(server).patch('/api/products/not-valid-id')

    expect(response.status).toBe(400)
    expect(response.body.errors).toBeTruthy()
  })

  //simulamos actualizar availability de  un producto con id inexistente
  it('should return 404 not found', async()=>{
    const productID= 2000
    const response = await request(server).patch(`/api/products/${productID}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Product not found')

    expect(response.status).not.toBe(200)
  })

  //simulamos actualizar availability de  un producto correctamente
  it('should update product availability',async ()=>{
    const response = await request(server).patch('/api/products/1')

    expect(response.status).toBe(200)
    expect(response.body.data).toBeTruthy()
    expect(response.body.data.availability).toBe(false)
    
    expect(response.status).not.toBe(400)
    expect(response.status).not.toBe(404)
    expect(response.body).not.toHaveProperty('error')
  })
})


//probamos el endpoint para eliminar un producto
describe("DELETE /api/products/:id", () => {
  //simulamos un id no valido
  it("should return a 400 response for a not valid id", async () => {
    const response = await request(server).delete("/api/products/not-valid-id");

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors[0].msg).toBe("Id no valido");
  });

  //simulamos un id que no existe/no encontrado
  it("should return a 404 response for a not found product", async () => {
    const productId = 2000;
    const response = await request(server).delete(`/api/products/${productId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
    expect(response.body.error).toBe("Product not found");
  });

  //simulamos eliminar un producto
  it("should delete a product", async () => {
    const response = await request(server).delete("/api/products/1");

    expect(response.status).toBe(200);
    expect(response.body.data).toBeTruthy();
    expect(response.body.data).toBe("Producto eliminado");

    expect(response.status).not.toBe(400);
  });
});





/*

- Al igual que cuando hicimos el routing y fuimos creando las funciones de cada uno, PRIMERO creamos POST, porque hay que crear productos para despues GET, PUT, PATCH, DELETE. Probamos el ENDPOINT de crear productos. Por eso el describe es POST/api/products. TIene la forma del router del server.ts === > server.use("/api/products", router);

- IMPORTANTE: el testing se debe hacer a la base de datos de PRUEBAS no a la DB real!
- Fijate que la sintaxis de supertest es una SIMULACION de POSTMAN, le decimos await request-> llamamos a server . metodo HTTP-> post. send--> funcion de postman y los datos que enviamos. EN supertest enviamos un objeto ts no un Json como en postman.

Este es el codigo del handler:
export const createProduct = async (req: Request, res: Response) => {

  //instaciamos el modelo
  try {
    const product = await Product.create(req.body); // crea la instancia y almacena en Db. Esperamos la insercion en la Db y ya tenemos en la variable el id

    //Retornamos la 'respuesta' res
    res.status(201).json({ data: product }); // es mas directo. 201 convencion http para 'creacion'--> doc en MDN-> http response status codes

    **Para el testing vemos lo que retorna el handler y lo adaptamos al testing res.status(201) .json({data:product})--> esto mismo es lo que verificamos en la prueba y lo CONTRARIO.. errors es la propiedad que usamos en handlerInputErrors*****

  } catch (error) {
    console.log(error);
  }
};

- El testing es dejar por escrito en codigo lo que probamos con postman o el simulador de cliente mientras no hay un frontend. Cuando enviamos un producto vacio, con el nombre incorrecto, precio incorrecto, etc vemos que devuelve el servidor/postman, la respuesta que nos da y eso es lo que 'ESPERAMOS' - expect() en el codigo del testing.

- Fijate que para saber que pruebas hacer basta con ver el router.ts. Ahi estan las rutas precisamente que forman la API y cada una es una prueba. Si miras router.ts y este archivo veras la conexion que tienen. 

- La dinamica para escribir los test es asi: ves en el router la validacion que tiene, haces la peticion con postman forzando cada validacion a que se cumpla y ves que devuelve. La peticion es el it, lo que devuelve es el expect

- Ojo que las pruebas deben ir en orden: POST - GET- PUT- PATCH- DELETE, eso afecta la ejecucion de las pruebas. Como hicimos de ultimo para mostrar el codecoverage el PATCH luego se ejecutaba el DELETE y no pasaba la prueba para actualizar el availability, movi en el codigo el PATCH antes del DELETE y ahi si paso la prueba.



*/
