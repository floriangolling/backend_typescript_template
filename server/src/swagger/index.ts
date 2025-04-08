import * as swagger from "swagger-express-ts";
import "./swagger.token";

export default {
  definition: {
    info: {
      title: "Template - API",
      version: "1.0",
    },
    schemes: ["http", "https"],
    securityDefinitions: {
      bearerAuth: {
        type: swagger.SwaggerDefinitionConstant.Security.Type.API_KEY,
        in: swagger.SwaggerDefinitionConstant.Security.In.HEADER,
        name: "authorization",
      },
    },
  },
};
