const Validator = require("fastest-validator");

const v = new Validator();

const schema = {
  // 1. Removed userId because it is not sent in req.body. 
  // It is handled securely in your appController instead!

  universityName: {
    type: "string",
    optional: false,
    empty: false,
    lowercase: true,
    trim: true,
  },
  country: {
    type: "string",
    optional: false,
    empty: false,
    lowercase: true,
    trim: true,
  },
  programName: {
    type: "string",
    optional: false,
    empty: false,
    lowercase: true,
    trim: true,
  },
  contactEmail: {
    type: "string",
    optional: true, // 3. Added optional: true and empty: true
    empty: true,
    lowercase: true,
    trim: true,
  },
  applicationMethod: {
    type: "enum",
    values: ["EMAIL", "PORTAL"], // 2. Fixed "Email" to "EMAIL" to match Mongoose exactly
    optional: false, 
  },
  applicationDate: {
    type: "string",
    optional: false,
    empty: false,
  },
  status: {
    type: "enum",
    values: [
      "NOT_APPLIED",
      "EMAIL_SENT",
      "APPLIED_PORTAL",
      "INTERVIEW",
      "REJECTED",
      "ACCEPTED",
    ],
    optional: false,
  },
  note: {
    type: "string",
    optional: true, // 3. Added optional: true and empty: true
    empty: true,
  },

  $$strict: true,
};

const check = v.compile(schema);

module.exports = check;
