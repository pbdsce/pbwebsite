import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert { type: 'json' };

const app = express();
const PORT = 3010;

<<<<<<< HEAD
// Middleware to serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Example API route (replace this with your actual routes)
app.get('/api/test', (req, res) => {
  res.send('API is working!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:3000`);
});
=======
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3010, () => console.log('Server running at http://localhost:3010'));
>>>>>>> 2280bd0d27609200b699cb1e546658f2e80de050
