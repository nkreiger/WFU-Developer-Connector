// validation
const Validator = require("validator");
// validates only strings
const isEmpty = require("./is-empty");
// be able to access this function from outside
module.exports = function validatePostInput(data) {
  let errors = {}; // empty obj
  // only required stuff need this
  data.text = !isEmpty(data.text) ? data.text : "";

  if (
    !Validator.isLength(data.text, {
      min: 5,
      max: 300
    })
  ) {
    errors.text = "Post must be between 5 and 300 characters";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
