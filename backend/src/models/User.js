const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
		minlength: 8
	}
}, {timestamps: true});


module.exports = mongoose.model('User', userModel);


