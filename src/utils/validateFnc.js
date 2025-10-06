import { AppError } from "./errors.js";
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return next(
        new AppError(error.details.map((d) => d.message).join(", "), 400)
      );
    }
    next();
  };

  export default validate;