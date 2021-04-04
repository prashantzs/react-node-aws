const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

// Database
mongoose.connect(process.env.DATABASE_CLOUD, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log('Error connecting to DB'))

// Routes
const authRoutes = require('./routes/auth');

// App middlewares
app.use(morgan('dev'));
app.use(express.json());
//app.use(cors());
app.use(cors({origin: process.env.CLIENT_URL}))

// Middlerwares
app.use('/api', authRoutes);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`listening at port ${port}`);
});