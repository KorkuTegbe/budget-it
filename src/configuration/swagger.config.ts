import swaggerJSDoc from 'swagger-jsdoc';

// options for the swagger docs
const options = {
   definition: {
      openapi: '3.0.0',
      info: {
         title: 'Blog API Docs',
         version: '1.0.0',
         description: 'Endpoints documentation for the blog API'
      }
   },
   // swaggerDefinition,
   apis: ['./spec/api.yaml']
};
 
export const swaggerSpec = swaggerJSDoc(options);