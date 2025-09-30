const validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        // Bad request
        // console.log(error.details[0].message);
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    next();
};

export default validateRequest;
