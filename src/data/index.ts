import { exit } from "node:process";
import { db } from "../config/db";

const clearDb = async () => {
  try {
    await db.sync({ force: true });
    console.log("Datos eliminados correctamente");
    exit(); //finaliza el proceso de node. Si no tiene argumentos finalizo con exito
  } catch (error) {
    console.log(error);
    exit(1);//si tiene (1) finaliza con error
  }
};
if (process.argv[2] === "--clear") {
  clearDb();
}

/*
- Cuando escribimos npm --> es para correr un script de NODE. Estos estan en el packageJson en "scripts", asi que para personalizarlos basta con agregarlos ahi y luego ejecutarlos. Esto es lo que hacemos para ejecutar la funcion clearDb===> agregamos el script "db:clear": "ts-node ./src/data" ts-node para ejecutar codigo Ts y luego la ubicacion de este archivo. --clear es una bandera que nosotros le damos el nombre y esta en la posicion 2 del arreglo que devuelve process.argv.

Entonces:

process.argv[0] → ruta a Node

process.argv[1] → ruta a arhivo 

process.argv[2] → "--clear"

Por eso el script solo borra la base si explícitamente le pasás --clear.

Finalmente cambiamos db:clear por prestest==> por que? porque prestest se ejecuta ANTES del test y asi borramos lo que tiene la DB antes de hacer una prueba. Cuando escribimos npm test--> node primero ejecuta el script pretest que borran la Db..
  



*/
