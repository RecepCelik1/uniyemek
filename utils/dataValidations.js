const joi = require('joi');

const schemas = {
    registerSchema: joi.object({
        name: joi.string().trim().required(),
        surname: joi.string().trim().required(),
        email: joi.string().email().required(),
        password: joi.string().min(8)
            .pattern(/[A-Z]/, "uppercase")
            .pattern(/[a-z]/, "lowercase")
            .pattern(/[0-9]/, "digit")
            .pattern(/[\W_]/, "special character")
            .required()
    }),
    credentialSchema: joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(8)
            .pattern(/[A-Z]/, "uppercase")
            .pattern(/[a-z]/, "lowercase")
            .pattern(/[0-9]/, "digit")
            .pattern(/[\W_]/, "special character")
            .required(),
    }),
    commentSchema: joi.string(),
    profileUpdateSchema: joi.object({
        name: joi.string().allow('', null),
        surname: joi.string().allow('', null),
        nickname: joi.string().allow('', null),
        city: joi.string().allow('', null),
        university: joi.string().allow('', null),
        department: joi.string().allow('', null)
    })    
}


const validateWithSchema = (validationSchema, inputData) => {
    const validator = schemas[validationSchema];
    const {error} = validator.validate(inputData);
    return error;
}

module.exports = validateWithSchema