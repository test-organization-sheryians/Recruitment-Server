class AppError extends Error {
  constructor(message, statusCode, error = null) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
  }
}

export default AppError;
