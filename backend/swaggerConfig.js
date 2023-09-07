const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ChatConnect",
      version: "1.0.0",
    },
  },

  apis: ["index.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
