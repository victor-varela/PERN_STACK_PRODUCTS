import { Router } from "express";
import { createProduct } from "./handlers/product";
export const router = Router();

router.get("/", (req, res) => {
  res.json("Desde GET postman");
});

//se reemplazo para codigo mas compacto (req,res)=>{} por su handler
router.post("/", createProduct)

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



*/
