const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./src/configs/db');
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));





app.listen(PORT, () => {
	console.log('Server is running on port ' + PORT);
});