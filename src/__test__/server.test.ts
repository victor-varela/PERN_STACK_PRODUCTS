import request from "supertest";
import server from "../server";


//👉 Es equivalente a que vos abras Postman y hagas esa misma petición, pero automatizada.
//Simulamos una peticion al servidor para ver si esta 'vivo'
describe("GET/api", () => {
  it("should send back a json response", async () => {
    const response = await request(server).get("/api");

    //Se valida lo que debe hacer

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.msg).toBe("Desde API");

    //Se valida tambien por la contraria, lo que no debe hacer --> not 'sin parentesis'
    expect(response.status).not.toBe(404);
    expect(response.body.msg).not.toBe("desde api"); //en minusculas...
  });
});





/*
- Vamos a hacer pruebas al servidor (Conexion con Db, Endpoints, etc) por eso el archivo es server.test.ts

- describe agrupa las pruebas --> test / it son las pruebas individuales. Ver la doc para ver las sintaxis === describe('nombre de la prueba' ()=>{
    it('que hace la prueba', ()=>{
    
    expect().tobe()

    })
})


- las funciones describe, expect, toBe.. etc    no necesitan importacion. Jest ya las tiene en forma global

- Agregamos la ruta del script en el packageJson--> "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "test": "jest" --> 'Esto'
  },

- Para correr la prueba --> npm test

- Hay que deshabilitar los console.log porque da este error sino se hace:  Cannot log after tests are done. Did you forget to wait for something async in your test?--> para ello comentamos el console.log en server.ts y en config/db.ts se agrega logging:false

- Para evitar el siguiente error debido a que puede ser lenta la respuesta de render: Jest did not exit one second after the test run has completed: 'This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue. --> agregamos lo que nos dice en el packageJson.
quedaria asi===>  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "test": "jest --detectOpenHandles" -> esto
  },


  - Por que se hace este test ? :

  📦 ¿Es relevante para tu proyecto actual?

👉 Sí, pero solo como test de conexión o “smoke test”.


Pero sirve como test inicial para comprobar que:

el servidor Express arranca correctamente,

el endpoint raíz /api responde bien, --> Crucial

y tu configuración de Supertest/Jest funciona.

Por eso se le llama a veces "smoke test" o "ping test" — un test mínimo para saber que “la API está viva”.




*/
