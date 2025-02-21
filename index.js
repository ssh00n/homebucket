import express from 'express';
import bucketRoutes from './routes/bucketRoutes.js';
import objectRoutes from './routes/objectRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 8081;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Homebucket API",
      version: "1.0.0",
      description: "API for managing buckets and file uploads",
    },
    servers: [
      {
        url: `http://${process.env.HOST}:${port}`,
      },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js"], 
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());

app.use('/buckets', bucketRoutes);
app.use('/buckets/:bucket_name/objects', objectRoutes);

app.listen(port, () => {
  console.log(`Homebucket service running on port ${port}`);
});
