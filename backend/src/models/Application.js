const mongoose = require('mongoose');

const applicationModel = new mongoose.Schema({
	userId: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true
	},
	universityName: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
	},
	country: {
		type: String,
		required: true,
		lowercase: true,
		trim: true
	},
	programName: {
		type: String,
		required: true,
		lowercase: true,
		trim: true
	},
	contactEmail: {
		type: String,
		lowercase: true,
		trim: true
	},
	applicationMethod: {
		type: String,
		enum: ["EMAIL", "PORTAL"],
		required: true
	},
	applicationDate: {
		type: Date,
		required: true
	},
	status: {
		type: String, 
		enum: ['NOT_APPLIED', 'EMAIL_SENT', 'APPLIED_PORTAL', 'INTERVIEW', 'REJECTED', 'ACCEPTED'],
		required: true
	},
	note: {
		type: String,
	}

}, { timestamps: true });

module.exports = mongoose.model('Application', applicationModel);