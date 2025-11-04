import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const handleInputError = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() }); //.status(400) codigo http usado para errores 'bad request' result.array() para guardar los errores en un array
  }

  next();
};

/*
    Este middleware verifica si la validación de los datos de entrada (inputs) —hecha con express-validator— tuvo errores.
  Si hay errores, devuelve una respuesta con código 400 (Bad Request).
  Si no hay errores, llama a next() para continuar con el flujo normal (por ejemplo, pasar al siguiente middleware o al controlador).

  🧠 Por qué se hace en un middleware separado

1-Reutilización:
Podés usar handleInputError en todas las rutas que tengan validaciones, sin repetir el mismo bloque validationResult + if en cada handler.

2-Orden y limpieza:
Se separa la validación de la lógica del negocio (crear producto, actualizar, etc.).

3-Flujo controlado:
Express ejecuta los middlewares de izquierda a derecha, lo que permite aplicar filtros o verificaciones paso a paso.





*/
