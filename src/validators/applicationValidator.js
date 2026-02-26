const Validator = require('fastest-validator');

const v = new Validator();

const schema = {
	universityName: { 
		type: "string",
		 required: true
	 },
	 country: {
		type: "string",
		required: true
	 },
	 programName: {
		type: "string",	
		required: true
	 },
	 contactEmail: {
		type: "email",
	 },
	 applicationMethod: {
		type: "enum",
		values: ["EMAIL", "PORTAL"],
		required: true
	 },
	 applicationDate: {
		type: "date",
		convert: true,
		required: true
	 },
	 status: {
		type: "enum",
		values: ["NOT_APPLIED", "EMAIL_SENT", "APPLIED_PORTAL", "INTERVIEW", "REJECTED", "ACCEPTED"],
		default: "NOT_APPLIED"
	 },
	 notes: {
		type: "string",
	 },

	 $$strict: true

};


const check = v.compile(schema);


module.exports = check;