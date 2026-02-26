const Validator = require('fastest-validator');

const v = new Validator();

const schema = {
	username :{
		type: 'string',
		minlength: 4,
		required: true
	},
	email: {
		type: 'email',
		required: true
	},
	password: {
		type: 'string',
		minlength: 8,
		required: true
	},
	confirmPassword: {
		type: 'equal',
		field: 'password',
		required: true
	},

	$$strict: true
};

const check = v.compile(schema);

module.exports = check;