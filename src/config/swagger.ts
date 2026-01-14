import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

// Objeto de configuración para swagger-jsdoc
const options: swaggerJSDoc.Options = {
  swaggerDefinition: {
    // ← Configuración principal del documento Swagger
    openapi: "3.0.2", // ← Versión de OpenAPI
    tags: [
      // ← Agrupa rutas bajo un nombre
      {
        name: "Products",
        description: "API operations related to Products",
      },
    ],
    info: {
      // ← Información general de la API
      title: "REST API Node.js / Express / Typescript",
      version: "1.0.0",
      description: "API Docs for Products",
    },
  },

  apis: ["./src/router.ts"],
  // ← Archivos donde swagger-jsdoc buscará comentarios @swagger (@openapi)
  // para generar la documentación automáticamente
};

// Generamos la especificación Swagger final basada en "options"
const swaggerSpec = swaggerJSDoc(options);

//Personalizamos Css de Swagger
const swaggerUiOptions: SwaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar {
      background-color: blue
    }
  `,
  customSiteTitle: "Documentacion REST API Express / TypeScript",
};

// Exportamos para usarlo en server.ts
export default swaggerSpec;
export { swaggerUiOptions };

/*
- Importamos swaggerJSDoc de la dependencia
- Configuramos el option -> ver el repo / index.ts / readme.md / types.ts ahi esta la data



*/
