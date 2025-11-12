import request from "supertest";
import server from "../../server";

//Probamos el endpoint de crear productos
describe("POST /api/products", () => {
  it("should create a new product", async () => {
    const response = await request(server).post("/api/products").send({
      name: "",
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



*/
