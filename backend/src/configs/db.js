const mongoose = require('mongoose');
require('dotenv').config();
const dbURL = process.env.MONGO_URI;
mongoose.connect(dbURL).then(() => {
	console.log('server connected to DB successfully');
}).catch((err) => {
	console.log(err)
});