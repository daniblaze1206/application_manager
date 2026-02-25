const express = require('express');
const cors = require('cors');
require('dotenv').config();
const dbConnect = require('./src/configs/db');

dbConnect();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());


app.use('/', (req, res) => {
	res.status(200).json({ message: 'Welcome to the Application Manager'});
});




app.listen(PORT, () => {
	console.log('Server is running on port ' + PORT);
});