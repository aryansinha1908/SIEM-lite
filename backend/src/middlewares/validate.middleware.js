const AppError = require("../utils/AppError.util");

const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (e) {
        const errorMessage = e.errors.map((err) => err.message).join(',');
        next(new AppError(errorMessage, 400));
    }
};

module.exports = validate;
