require('dotenv/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const port = process.env.PORT || 4001;

// import router
const router = require('./src/router');

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(router);

app.listen(port, () => console.log(`Server is listening in port ${port}`));
