'use strict';

require('dotenv').config();
// import router from './router'
import express from 'express';
import cors from 'cors';
// import './models/database'

const app = express();

app.use(cors());
app.use(express.json());
// app.use(router);

export default app;
