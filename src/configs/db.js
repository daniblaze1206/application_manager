const mongoose = require('mongoose');
require('dotenv').config();
const dbURI = process.env.MONGO_URI;

const dbConnect = async () => {
	try {
		await mongoose.connect(dbURI)
			.then(() =>{
			 	console.log('connected to DB successfully');
			})
			.catch((err)=> {
				console.log(err);
			});
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
}

module.exports = dbConnect;