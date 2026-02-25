const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
	
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		index: true
	},
	universityName: {
		type: String,
		required: true,
		trim: true
	},
	country: {
		type: String, 
		required: true,
		trim: true
	},
	programName: {
		type: String, 
		required: true,
		trim: true
	},
	contactEmail: {
		type: String,
		trim: true,
		lowercase: true
	},
	applicationMethod: {
		type: String,
		enum: ['EMAIL', 'PORTAL'],
		required:true
	},
	applicationDate: {
		type: Date,
		required: true
	},
	status: {
		type: String,
		enum: ['NOT_APPLIED', 'EMAIL_SENT', 'APPLIED_PORTAL', 'INTERVIEW', 'REJECTED', 'ACCEPTED'],
		default: 'NOT_APPLIED',
	},
	notes: {
		type: String,
	},

}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);