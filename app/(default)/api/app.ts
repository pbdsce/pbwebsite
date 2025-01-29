import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const app = express();
const PORT = 3010;

// Middleware to serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Example API route (replace this with your actual routes)
app.get('/api/test', (req, res) => {
  res.send('API is working!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:3000`);
});
