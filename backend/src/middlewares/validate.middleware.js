const AppError = require("../utils/AppError.util"); 

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        const errorMessage = result.error?.issues?.map((err) => err.message).join(', ') || "Validation failed";
        
        return next(new AppError(errorMessage, 400));
    }

    req.body = result.data;
    next();
};

module.exports = validate;
