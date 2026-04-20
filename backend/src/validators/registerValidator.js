const Validator = require('fastest-validator');
const v = new Validator();

const schema = {
	username: {
		type: "string",
		required: true,
		unique: true
	},
	email: {
		type: "email",
		required: true,
		unique: true
	},
	password: {
		type: "string",
		minlength: 8,
		required: true
	},
	confirmPassword: {
		type: "equal",
		field: 'password',
		required: true
	},

	$$strict: true
};

const check = v.compile(schema);

module.exports = check;