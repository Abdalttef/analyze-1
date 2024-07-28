
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db');
const userRoutes = require('./db/userRoutes');
const cors = require('cors'); 


const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:5500', 
  methods: ['GET', 'POST'],
  credentials: true
}));
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/users', userRoutes);

// Sync database and start server
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});
