import path from "path";

export default {
  route: {
    url: "/api/docs",
    docs: "/api/docs.json",
  },
  swaggerDefinition: {
    info: {
      description: "TodoLIST - API",
      title: "TodoLIST - Swagger",
      version: "1.0.0",
    },
    produces: ["application/json", "application/xml"],
    schemes: ["http", "https"],
    securityDefinitions: {
      JWT: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: "",
      },
    },
  },
  basedir: path.resolve(__dirname, ".."),
  files: ["routes/**/*.js", "routes/**/*.ts", "database/models/*.js", "database/models/*.ts"],
};
