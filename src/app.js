const express = require('express');
const cors = require('cors');
const profileRoutes = require('./routes/profileRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: '*' }));

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Profile Intelligence Service is running'
    });
});

app.use('/api', profileRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;