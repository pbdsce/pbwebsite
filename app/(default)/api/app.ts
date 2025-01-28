import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const app = express();

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3010, () => console.log('Server running at http://localhost:3010'));

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

