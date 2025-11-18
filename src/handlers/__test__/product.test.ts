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
    expect(response.body.errors).toHaveLength(1)

    //que no esperamos?
    expect(response.status).not.toEqual(404);
    expect(response.body.errors).not.toHaveLength(2)
  });

  //simulamos crear un producto con el precio distinto de numerosd
  it('should validate that price is a number', async()=>{
    const response = await request(server).post('/api/products').send({
      name: "Impresora- Testing",
      price:"hola"
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)

    expect(response.status).not.toBe(404)
    expect(response.body.errors).not.toHaveLength(3)
  })

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

  //Probamos el endpoint de OBTENER productos
  describe("GET /api/products", ()=>{
    //validamos que la url existe
    it('should check if /api/products url exits', async ()=>{
      const response = await request(server).get("/api/products")

      expect(response.status).not.toBe(404)

    })

    //Simulamos obtener todos los productos
    it('should get a json response with products', async()=>{
      const response = await request(server).get('/api/products')

      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveLength(1)

      expect(response.body).not.toHaveProperty('errors')
    })
  })
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



*/
